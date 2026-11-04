import type { ButtonValue, ImageValue, VideoValue } from '../types';
import type React from 'react';

export const MEDIA_PREFIX = 'media:';
export const BLANK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export const uid = (prefix = 'id') =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const isMediaRef = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith(MEDIA_PREFIX);

export const mediaIdFromRef = (ref: string) => ref.slice(MEDIA_PREFIX.length);

/** Rewrites every string in a JSON value. Returns the same object when nothing changed. */
export function mapStrings<T>(value: T, fn: (text: string) => string): T {
  if (typeof value === 'string') return fn(value) as unknown as T;
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((v) => {
      const mapped = mapStrings(v, fn);
      if (mapped !== v) changed = true;
      return mapped;
    });
    return (changed ? next : value) as T;
  }
  if (value && typeof value === 'object') {
    let changed = false;
    const next: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      const mapped = mapStrings(v, fn);
      if (mapped !== v) changed = true;
      next[key] = mapped;
    }
    return (changed ? next : value) as T;
  }
  return value;
}

export function collectStrings(value: unknown, visit: (text: string, keyPath: string[]) => void, keyPath: string[] = []) {
  if (typeof value === 'string') visit(value, keyPath);
  else if (Array.isArray(value)) value.forEach((v, i) => collectStrings(v, visit, [...keyPath, String(i)]));
  else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, v]) => collectStrings(v, visit, [...keyPath, key]));
  }
}

/** Blocks script-capable URLs from reaching the public site. */
export function safeUrl(url: string | undefined): string {
  const value = (url ?? '').trim();
  if (!value) return '#';
  const lowered = value.replace(/[\u0000-\u001f\s]/g, '').toLowerCase();
  if (/^(javascript|data|vbscript):/.test(lowered)) return '#';
  return value;
}

export const isExternalUrl = (url: string) => /^(https?:)?\/\//i.test(url);
export const isSchemeUrl = (url: string) => /^[a-z][a-z0-9+.-]*:/i.test(url);

export function isValidLink(url: string): boolean {
  const value = url.trim();
  if (!value) return false;
  if (safeUrl(value) === '#') return false;
  if (value.startsWith('/') || value.startsWith('#') || value.startsWith('?')) return true;
  if (/^(mailto|tel):/i.test(value)) return value.length > 7;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export const imageStyle = (image?: Partial<ImageValue>): React.CSSProperties | undefined => {
  if (!image) return undefined;
  const style: React.CSSProperties = {};
  if (image.objectPosition) style.objectPosition = image.objectPosition;
  if (image.objectFit) style.objectFit = image.objectFit;
  return Object.keys(style).length ? style : undefined;
};

export const hasVideo = (video?: Partial<VideoValue>): video is VideoValue => Boolean(video?.src);

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

export const makeButton = (label: string, url: string, style: ButtonValue['style'], arrow: ButtonValue['arrow'] = 'none'): ButtonValue => ({
  id: uid('btn'),
  label,
  url,
  style,
  arrow,
});

export const formatBytes = (bytes: number) => {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const timeAgo = (iso: string | undefined) => {
  if (!iso) return 'Never';
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 86400 * 30) return `${Math.floor(seconds / 86400)} d ago`;
  return new Date(iso).toLocaleDateString();
};
