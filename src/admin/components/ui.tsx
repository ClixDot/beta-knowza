import React, { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Check, CheckCircle2, ChevronDown, Info, Loader2, X } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'light';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'adm-btn-primary',
  secondary: 'adm-btn-secondary',
  ghost: 'bg-transparent text-adm-ink border border-transparent hover:bg-adm-deep/[0.06]',
  danger: 'bg-white/90 backdrop-blur-md text-[#9F3424] border border-[#E2C2BA] hover:bg-[#FBF0ED]',
  light: 'bg-white text-adm-deep border border-white hover:bg-adm-cream',
};

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  busy?: boolean;
}

export const Btn: React.FC<BtnProps> = ({ variant = 'secondary', size = 'md', icon, busy, children, className = '', disabled, type = 'button', ...rest }) => (
  <button
    type={type}
    disabled={disabled || busy}
    className={`inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap transition-all duration-200 enabled:hover:scale-[1.01] enabled:active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${
      size === 'sm' ? 'min-h-[36px] px-3.5 text-[13px]' : 'min-h-[42px] px-4.5 text-sm'
    } ${VARIANTS[variant]} ${className}`}
    {...rest}
  >
    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
    {children}
  </button>
);

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  tone?: 'default' | 'danger' | 'active';
}

export const IconBtn: React.FC<IconBtnProps> = ({ label, tone = 'default', children, className = '', type = 'button', ...rest }) => (
  <button
    type={type}
    aria-label={label}
    title={label}
    className={`inline-flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all duration-200 enabled:hover:scale-[1.06] enabled:active:scale-[0.94] disabled:opacity-30 disabled:cursor-not-allowed ${
      tone === 'danger'
        ? 'text-[#9F3424] hover:bg-[#FBF0ED]'
        : tone === 'active'
        ? 'text-white bg-adm-deep'
        : 'text-adm-mute hover:text-adm-ink hover:bg-adm-deep/[0.06]'
    } ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const Card: React.FC<{ className?: string; children: React.ReactNode; title?: string; action?: React.ReactNode }> = ({ className = '', children, title, action }) => (
  <section className={`adm-glass ${className}`}>
    {(title || action) && (
      <header className="flex items-center justify-between gap-3 px-5 pt-4">
        {title && <h2 className="text-[19px] leading-tight text-adm-ink">{title}</h2>}
        {action}
      </header>
    )}
    {children}
  </section>
);

export type ChipTone = 'neutral' | 'green' | 'amber' | 'red' | 'dark';

const CHIPS: Record<ChipTone, string> = {
  neutral: 'bg-white text-adm-mute border-adm-deep/10',
  green: 'bg-[#E3EBCB] text-[#3F5124] border-[#CFDBAE]',
  amber: 'bg-[#F5EDC6] text-[#6A5513] border-[#E8DCA6]',
  red: 'bg-[#FBEAE6] text-[#9F3424] border-[#F0CFC8]',
  dark: 'bg-adm-deep text-white border-adm-deep',
};

export const Chip: React.FC<{ tone?: ChipTone; children: React.ReactNode }> = ({ tone = 'neutral', children }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11.5px] whitespace-nowrap ${CHIPS[tone]}`}>{children}</span>
);

export const PageHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode; back?: React.ReactNode }> = ({ title, subtitle, actions, back }) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pt-1">
    <div className="min-w-0 flex-1">
      {back}
      <h1 className="text-[28px] sm:text-[36px] leading-[1.15] text-adm-ink break-words font-medium">{title}</h1>
      {subtitle && <p className="text-sm text-adm-mute mt-1.5 max-w-2xl">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2 sm:justify-end shrink-0">{actions}</div>}
  </div>
);

export const EmptyState: React.FC<{ icon?: React.ReactNode; title: string; text?: string; action?: React.ReactNode }> = ({ icon, title, text, action }) => (
  <div className="flex flex-col items-center justify-center text-center gap-2 py-12 px-6">
    {icon && <div className="adm-tile !rounded-full w-12 h-12 flex items-center justify-center text-adm-deep mb-1.5">{icon}</div>}
    <h4 className="adm-title">{title}</h4>
    {text && <p className="text-[13px] text-adm-mute max-w-sm">{text}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => <div className={`adm-skeleton rounded-lg ${className}`} aria-hidden="true" />;

export const Tabs: React.FC<{ tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void; className?: string }> = ({ tabs, active, onChange, className = '' }) => {
  const instanceId = useId();
  return (
    <div role="tablist" className={`adm-tile !rounded-full flex items-center gap-1 overflow-x-auto adm-scroll p-1.5 mb-5 w-full sm:w-fit max-w-full relative ${className}`}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 min-h-[36px] px-4 rounded-full text-[13px] whitespace-nowrap transition-colors duration-200 outline-none select-none flex items-center gap-1.5 ${
              isActive ? 'text-white font-semibold' : 'text-adm-mute hover:text-adm-ink hover:bg-adm-deep/[0.04]'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={`activeTabPill-${instanceId}`}
                className="absolute inset-0 z-[-1] rounded-full adm-tab-active-pill"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11.5px] px-1.5 py-0.2 rounded-full transition-colors ${
                  isActive ? 'bg-white/20 text-white font-bold' : 'bg-adm-deep/[0.06] text-adm-mute'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const Toggle: React.FC<{ checked: boolean; onChange: (value: boolean) => void; label: string; disabled?: boolean; hideLabel?: boolean }> = ({ checked, onChange, label, disabled, hideLabel }) => (
  <label className={`inline-flex items-center gap-2.5 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-[#5F6C36]' : 'bg-adm-deep/25'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-[0_2px_5px_rgba(24,33,15,0.35)] transition-transform duration-200 ${checked ? 'translate-x-4' : ''}`} />
    </button>
    {!hideLabel && <span className="text-[13px] text-adm-ink">{label}</span>}
  </label>
);

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

interface SelectOption {
  value: string;
  label: string;
}

const readOptions = (children: React.ReactNode): SelectOption[] =>
  React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child)) return [];
    const props = child.props as { value?: string | number; children?: React.ReactNode };
    if (child.type === 'option') return [{ value: String(props.value ?? ''), label: React.Children.toArray(props.children).join('') }];
    return readOptions(props.children);
  });

interface SelectProps {
  id?: string;
  value?: string | number;
  onChange?: (event: { target: { value: string } }) => void;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
  children: React.ReactNode;
}

/** The admin's dropdown. Takes <option> children and the same value and onChange as a native select. */
export const Select: React.FC<SelectProps> = ({ id, value, onChange, className = '', disabled, 'aria-label': ariaLabel, children }) => {
  const options = readOptions(children);
  const selected = options.findIndex((option) => option.value === String(value ?? ''));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<React.CSSProperties | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });
  const listId = useId();

  const show = () => {
    setActive(Math.max(0, selected));
    setPosition(null);
    setOpen(true);
  };

  const choose = (index: number) => {
    setOpen(false);
    if (options[index] && index !== selected) onChange?.({ target: { value: options[index].value } });
  };

  // Opens downward unless only the space above fits, and stays inside the screen sideways.
  const place = () => {
    if (!triggerRef.current || !listRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const list = listRef.current;
    const gap = 6;
    const edge = 8;
    const height = Math.min(list.scrollHeight, 288);
    const below = window.innerHeight - rect.bottom - gap - edge;
    const above = rect.top - gap - edge;
    const upward = below < height && above > below;
    const room = upward ? above : below;
    const shown = Math.min(height, room);
    setPosition({
      top: upward ? rect.top - gap - shown : rect.bottom + gap,
      left: Math.max(edge, Math.min(rect.left, window.innerWidth - list.offsetWidth - edge)),
      minWidth: rect.width,
      maxHeight: shown,
    });
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !listRef.current?.contains(target)) setOpen(false);
    };
    // The list follows its trigger while the page scrolls, and closes once the trigger has left the screen.
    const onScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) setOpen(false);
      else place();
    };
    const onResize = () => setOpen(false);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>('[data-active="true"]');
    if (!open || !list || !item) return;
    // Scrolls the list only, never the page behind it.
    if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
    else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
  }, [open, active, position]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      setOpen(false);
      return;
    }
    if (e.key === 'Escape') {
      if (open) {
        // Closes only this list, not a dialog it sits in.
        e.stopPropagation();
        setOpen(false);
      }
      return;
    }
    const printable = e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (printable) {
      const now = Date.now();
      typed.current = { text: now - typed.current.at > 600 ? e.key : typed.current.text + e.key, at: now };
      const match = options.findIndex((option) => option.label.toLowerCase().startsWith(typed.current.text.toLowerCase()));
      if (!open) show();
      if (match >= 0) setActive(match);
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(e.key)) return;
    e.preventDefault();
    if (!open) {
      show();
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') choose(active);
    if (e.key === 'ArrowDown') setActive(Math.min(options.length - 1, active + 1));
    if (e.key === 'ArrowUp') setActive(Math.max(0, active - 1));
    if (e.key === 'Home') setActive(0);
    if (e.key === 'End') setActive(options.length - 1);
  };

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        className={`adm-input flex items-center justify-between gap-2 text-left disabled:cursor-not-allowed ${className}`}
      >
        <span className="truncate min-w-0">{options[selected]?.label}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-adm-mute transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={ariaLabel}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.12 }}
              style={position ?? { top: 0, left: 0, visibility: 'hidden' }}
              className="admin-root adm-pop fixed z-[95] max-w-[calc(100vw-16px)] overflow-y-auto adm-scroll rounded-[16px] p-1.5"
              // Keeps focus on the trigger, which drives the keyboard.
              onMouseDown={(e) => e.preventDefault()}
            >
              {options.map((option, index) => (
                <li
                  key={`${option.value}-${index}`}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === selected}
                  data-active={index === active}
                  onMouseMove={(e) => {
                    // Only real movement counts, so a pointer resting where the list opens cannot override the keyboard.
                    if (e.movementX || e.movementY) setActive(index);
                  }}
                  onClick={() => choose(index)}
                  className={`flex items-center justify-between gap-4 min-h-[38px] px-3 rounded-[10px] text-[13.5px] whitespace-nowrap cursor-pointer transition-colors ${index === active ? 'bg-adm-deep/[0.06]' : ''} ${index === selected ? 'text-adm-deep font-semibold' : 'text-adm-ink'}`}
                >
                  {option.label}
                  <Check className={`w-4 h-4 shrink-0 text-adm-olive ${index === selected ? '' : 'invisible'}`} />
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

/** Open modals, newest last, so Escape only closes the one on top. */
const modalStack: object[] = [];

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
  children: React.ReactNode;
}> = ({ open, onClose, title, size = 'md', footer, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const entry = {};
    modalStack.push(entry);
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (modalStack[modalStack.length - 1] !== entry) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const current = document.activeElement;
        if (e.shiftKey && (current === first || current === panelRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      modalStack.splice(modalStack.indexOf(entry), 1);
      previous?.focus?.();
    };
  }, [open]);

  const width = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl', full: 'max-w-[calc(100vw-24px)] h-[calc(100dvh-24px)]' }[size];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="admin-root fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="absolute inset-0 bg-adm-deeper/45 backdrop-blur-[3px]" onClick={onClose} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`adm-pop relative w-full ${width} max-h-[94dvh] flex flex-col rounded-t-[28px] sm:rounded-[28px] outline-none`}
          >
            <header className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-adm-line shrink-0">
              <h3 className="text-[21px] leading-tight truncate">{title}</h3>
              <IconBtn label="Close" onClick={onClose}>
                <X className="w-4 h-4" />
              </IconBtn>
            </header>
            <div className="flex-1 overflow-y-auto adm-scroll p-5 min-h-0">{children}</div>
            {footer && <footer className="flex flex-wrap items-center justify-end gap-2 px-5 py-3.5 border-t border-adm-line shrink-0">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// ---------------------------------------------------------------------------
// Toasts and confirmation
// ---------------------------------------------------------------------------

type ToastTone = 'success' | 'error' | 'info';
interface ToastItem {
  id: number;
  tone: ToastTone;
  text: string;
}
interface ConfirmOptions {
  title: string;
  text?: string;
  confirmLabel?: string;
  danger?: boolean;
}
interface FeedbackApi {
  toast: (text: string, tone?: ToastTone) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Runs an action and reports the outcome, so failures are never silent. */
  run: (action: () => Promise<unknown> | unknown, success?: string) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackApi | null>(null);

export const useFeedback = () => {
  const api = useContext(FeedbackContext);
  if (!api) throw new Error('useFeedback must be used inside FeedbackProvider');
  return api;
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [pending, setPending] = useState<(ConfirmOptions & { resolve: (value: boolean) => void }) | null>(null);
  const nextId = useRef(1);

  const toast = useCallback((text: string, tone: ToastTone = 'success') => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, tone, text }]);
    window.setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), tone === 'error' ? 7000 : 3500);
  }, []);

  const api = useMemo<FeedbackApi>(
    () => ({
      toast,
      confirm: (options) => new Promise((resolve) => setPending({ ...options, resolve })),
      run: async (action, success) => {
        try {
          await action();
          if (success) toast(success);
          return true;
        } catch (err) {
          toast((err as Error).message || 'Something went wrong.', 'error');
          return false;
        }
      },
    }),
    [toast]
  );

  const settle = (value: boolean) => {
    pending?.resolve(value);
    setPending(null);
  };

  const Icon = { success: CheckCircle2, error: AlertTriangle, info: Info };

  return (
    <FeedbackContext.Provider value={api}>
      {children}
      <Modal
        open={Boolean(pending)}
        onClose={() => settle(false)}
        title={pending?.title ?? ''}
        size="sm"
        footer={
          <>
            <Btn variant="ghost" onClick={() => settle(false)}>Cancel</Btn>
            <Btn variant={pending?.danger ? 'danger' : 'primary'} onClick={() => settle(true)}>
              {pending?.confirmLabel ?? 'Confirm'}
            </Btn>
          </>
        }
      >
        <p className="text-sm text-adm-mute">{pending?.text}</p>
      </Modal>
      {createPortal(
        <div className="admin-root fixed z-[90] bottom-4 right-4 left-4 sm:left-auto flex flex-col items-end gap-2 pointer-events-none" aria-live="polite">
          <AnimatePresence>
            {toasts.map((item) => {
              const ToastIcon = Icon[item.tone];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.18 }}
                  className={`pointer-events-auto flex items-start gap-2.5 max-w-sm px-4 py-3 rounded-2xl shadow-[0_18px_36px_-16px_rgba(24,33,15,0.7)] border text-[13px] ${
                    item.tone === 'error' ? 'bg-[#FBEAE6] border-[#F0CFC8] text-[#7E2A1C]' : 'bg-adm-deep border-adm-deep text-white'
                  }`}
                >
                  <ToastIcon className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{item.text}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </FeedbackContext.Provider>
  );
};
