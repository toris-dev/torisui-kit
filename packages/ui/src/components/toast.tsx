import * as React from 'react';
import { cx } from '../utils/cx';
import { Portal } from '../primitives/portal';

export type ToastTone = 'default' | 'success' | 'error' | 'info' | 'warning';

/** Default auto-dismiss delay in ms. */
export const DEFAULT_TOAST_DURATION = 4000;
/** Auto-dismiss delay for error toasts created by `toast.promise`. */
export const ERROR_TOAST_DURATION = 6000;

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  /**
   * Auto-dismiss delay in ms. `0` keeps the toast until dismissed.
   * Defaults to {@link DEFAULT_TOAST_DURATION}.
   */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  publish: (options: ToastOptions) => string;
  update: (id: string, options: ToastOptions) => void;
  dismiss: (id?: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

let toastCounter = 0;

function isPersistent(toast: ToastItem): boolean {
  return (toast.duration ?? DEFAULT_TOAST_DURATION) <= 0;
}

/**
 * Drops the oldest dismissible toasts first when over the limit;
 * persistent toasts (duration 0, e.g. pending `toast.promise`) are only
 * evicted if the entire list is persistent.
 */
function applyLimit(list: ToastItem[], limit: number): ToastItem[] {
  if (list.length <= limit) return list;
  let excess = list.length - limit;
  const kept = list.filter((toast) => {
    if (excess > 0 && !isPersistent(toast)) {
      excess--;
      return false;
    }
    return true;
  });
  return excess > 0 ? kept.slice(excess) : kept;
}

export interface ToastProviderProps {
  children?: React.ReactNode;
  /** Max toasts shown at once. Oldest dismissible toasts are dropped first. Defaults to 5. */
  limit?: number;
}

/** Owns toast state and renders the viewport. Mounted automatically by `ToriProvider`. */
export function ToastProvider({ children, limit = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id?: string) => {
    setToasts((current) => (id == null ? [] : current.filter((toast) => toast.id !== id)));
  }, []);

  const publish = React.useCallback(
    (options: ToastOptions) => {
      const id = `tori-toast-${++toastCounter}`;
      setToasts((current) => applyLimit([...current, { id, ...options }], limit));
      return id;
    },
    [limit],
  );

  const update = React.useCallback((id: string, options: ToastOptions) => {
    setToasts((current) =>
      current.map((toast) => (toast.id === id ? { ...toast, ...options } : toast)),
    );
  }, []);

  const value = React.useMemo(() => ({ publish, update, dismiss }), [publish, update, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <div className="tori-toast-viewport" role="region" aria-label="Notifications">
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} dismiss={dismiss} />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

interface ToastCardProps {
  toast: ToastItem;
  dismiss: (id: string) => void;
}

/**
 * Memoized: `dismiss` is stable and `toast` identity only changes via
 * `update()`, so unrelated toast churn doesn't re-render (or restart the
 * timer of) existing cards. Hover/focus pauses the timer; leaving restarts
 * the full duration.
 */
const ToastCard = React.memo(function ToastCard({ toast, dismiss }: ToastCardProps) {
  const { id, duration = DEFAULT_TOAST_DURATION, tone = 'default' } = toast;
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (duration <= 0 || paused) return;
    const timer = setTimeout(() => dismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, paused, dismiss]);

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('tori-toast', `tori-toast--${tone}`)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="tori-toast__content">
        {toast.title != null && <div className="tori-toast__title">{toast.title}</div>}
        {toast.description != null && (
          <div className="tori-toast__description">{toast.description}</div>
        )}
      </div>
      <button
        type="button"
        className="tori-toast__close"
        aria-label="Dismiss"
        onClick={() => dismiss(id)}
      >
        ×
      </button>
    </div>
  );
});

export interface PromiseToastMessages<T> {
  loading: React.ReactNode;
  success: React.ReactNode | ((value: T) => React.ReactNode);
  error: React.ReactNode | ((error: unknown) => React.ReactNode);
}

export interface ToastApi {
  (options: ToastOptions): string;
  success: (title: React.ReactNode, options?: ToastOptions) => string;
  error: (title: React.ReactNode, options?: ToastOptions) => string;
  info: (title: React.ReactNode, options?: ToastOptions) => string;
  warning: (title: React.ReactNode, options?: ToastOptions) => string;
  /** Shows a loading toast that resolves into success/error with the promise. */
  promise: <T>(promise: Promise<T>, messages: PromiseToastMessages<T>) => Promise<T>;
}

export interface UseToastReturn {
  toast: ToastApi;
  dismiss: (id?: string) => void;
}

/** Imperative toast API. Must be used inside `ToriProvider` (or `ToastProvider`). */
export function useToast(): UseToastReturn {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within <ToriProvider>');
  const { publish, update, dismiss } = context;

  const toast = React.useMemo<ToastApi>(() => {
    const base = ((options: ToastOptions) => publish(options)) as ToastApi;
    const withTone =
      (tone: ToastTone) =>
      (title: React.ReactNode, options?: ToastOptions): string =>
        publish({ ...options, title, tone });
    base.success = withTone('success');
    base.error = withTone('error');
    base.info = withTone('info');
    base.warning = withTone('warning');
    base.promise = async <T,>(promise: Promise<T>, messages: PromiseToastMessages<T>) => {
      const id = publish({ title: messages.loading, tone: 'default', duration: 0 });
      try {
        const value = await promise;
        update(id, {
          title:
            typeof messages.success === 'function' ? messages.success(value) : messages.success,
          tone: 'success',
          duration: DEFAULT_TOAST_DURATION,
        });
        return value;
      } catch (error) {
        update(id, {
          title: typeof messages.error === 'function' ? messages.error(error) : messages.error,
          tone: 'error',
          duration: ERROR_TOAST_DURATION,
        });
        throw error;
      }
    };
    return base;
  }, [publish, update]);

  return { toast, dismiss };
}
