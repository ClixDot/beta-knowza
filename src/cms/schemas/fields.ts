// A small schema language. Each section type declares its fields once and the
// admin's FormRenderer turns that declaration into a working editor.

export type Field =
  | { kind: 'text' | 'textarea' | 'url' | 'color' | 'icon' | 'socialIcon'; key: string; label: string; help?: string; half?: boolean; placeholder?: string; limit?: number }
  | { kind: 'number'; key: string; label: string; help?: string; half?: boolean; min?: number; max?: number; step?: number }
  | { kind: 'toggle'; key: string; label: string; help?: string; half?: boolean }
  | { kind: 'select'; key: string; label: string; help?: string; half?: boolean; options: { value: string; label: string }[] }
  | { kind: 'image'; key: string; label: string; help?: string; ratio?: boolean; noAlt?: boolean }
  | { kind: 'imageUrl'; key: string; label: string; help?: string }
  | { kind: 'video'; key: string; label: string; help?: string }
  | { kind: 'button'; key: string; label: string }
  | { kind: 'buttons'; key: string; label: string; help?: string }
  | { kind: 'group'; key?: string; label: string; help?: string; fields: Field[]; open?: boolean }
  | {
      kind: 'list';
      key: string;
      label: string;
      help?: string;
      itemLabel: string;
      itemTitle: (item: any, index: number) => string;
      fields: Field[];
      newItem?: () => any;
      /** Fixed lists keep their designed slots: items can be edited but not added or removed. */
      fixed?: boolean;
    };

const base = (kind: any) => (key: string, label: string, opts: Record<string, unknown> = {}) => ({ kind, key, label, ...opts }) as Field;

export const f = {
  text: base('text'),
  area: base('textarea'),
  url: base('url'),
  color: base('color'),
  icon: base('icon'),
  socialIcon: base('socialIcon'),
  toggle: base('toggle'),
  image: base('image'),
  imageUrl: base('imageUrl'),
  video: base('video'),
  button: base('button'),
  buttons: base('buttons'),
  number: (key: string, label: string, opts: { min?: number; max?: number; step?: number; help?: string; half?: boolean } = {}) =>
    ({ kind: 'number', key, label, ...opts }) as Field,
  select: (key: string, label: string, options: [string, string][], opts: Record<string, unknown> = {}) =>
    ({ kind: 'select', key, label, options: options.map(([value, text]) => ({ value, label: text })), ...opts }) as Field,
  group: (label: string, fields: Field[], opts: { key?: string; help?: string; open?: boolean } = {}) =>
    ({ kind: 'group', label, fields, ...opts }) as Field,
  list: (
    key: string,
    label: string,
    itemLabel: string,
    itemTitle: (item: any, index: number) => string,
    fields: Field[],
    opts: { newItem?: () => any; fixed?: boolean; help?: string } = {}
  ) => ({ kind: 'list', key, label, itemLabel, itemTitle, fields, ...opts }) as Field,
};
