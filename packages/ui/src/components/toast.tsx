import * as React from 'react';
import { cx } from '../utils/cx';
import { Portal } from '../primitives/portal';

export type ToastTone = 'default' | 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  /** Auto-dismiss delay in ms. 0 keeps the toast until dismissed. Defaults to 4000. */
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

export interface ToastProviderProps {
  children?: React.ReactNode;
  /** Max toasts shown at once. Older toasts are dropped. Defaults to 5. */
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
      setToasts((current) => [...current, { id, ...options }].slice(-limit));
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
            <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const { duration = 4000, tone = 'default' } = toast;

  React.useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('tori-toast', `tori-toast--${tone}`)}
    >
      <div className="tori-toast__content">
        {toast.title != null && <div className="tori-toast__title">{toast.title}</div>}
        {toast.description != null && (
          <div className="tori-toast__description">{toast.description}</div>
        )}
      </div>
      <button type="button" className="tori-toast__close" aria-label="Dismiss" onClick={onDismiss}>
        ×
      </button>
    </div>
  );
}

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
          title: typeof messages.success === 'function' ? messages.success(value) : messages.success,
          tone: 'success',
          duration: 4000,
        });
        return value;
      } catch (error) {
        update(id, {
          title: typeof messages.error === 'function' ? messages.error(error) : messages.error,
          tone: 'error',
          duration: 6000,
        });
        throw error;
      }
    };
    return base;
  }, [publish, update]);

  return { toast, dismiss };
}
