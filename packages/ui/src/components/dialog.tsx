import * as React from 'react';
import { cx } from '../utils/cx';
import { Portal } from '../primitives/portal';
import { useEscapeKey } from '../hooks/use-escape-key';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Stacked-dialog bookkeeping: only the top-most dialog reacts to Escape,
// and the body scroll lock is reference-counted so closing an inner
// dialog doesn't unlock scrolling behind an outer one.
const dialogStack: symbol[] = [];
let scrollLockCount = 0;
let previousBodyOverflow = '';

function getFocusable(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest('[hidden]') && el.getAttribute('aria-hidden') !== 'true',
  );
}

export interface DialogProps {
  open: boolean;
  /** Called with `false` when the dialog requests to close (Escape, overlay, close button). */
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Use 'alertdialog' for destructive confirmations. */
  role?: 'dialog' | 'alertdialog';
  /** Close when the overlay is clicked. Defaults to true ('dialog') / false ('alertdialog'). */
  closeOnOverlayClick?: boolean;
  /** Show the top-right close button. Defaults to true. */
  showClose?: boolean;
  className?: string;
}

export function Dialog(props: DialogProps) {
  if (!props.open) return null;
  return (
    <Portal>
      <DialogContent {...props} />
    </Portal>
  );
}

/**
 * Rendered inside the portal so its mount effects run only once the
 * dialog is actually in the DOM (Portal renders nothing on first pass).
 */
function DialogContent({
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  role = 'dialog',
  closeOnOverlayClick,
  showClose = true,
  className,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const stackIdRef = React.useRef<symbol | null>(null);
  if (stackIdRef.current === null) stackIdRef.current = Symbol('tori-dialog');
  const stackId = stackIdRef.current;
  const titleId = React.useId();
  const descriptionId = React.useId();
  const dismissOnOverlay = closeOnOverlayClick ?? role !== 'alertdialog';

  const close = React.useCallback(() => onOpenChange?.(false), [onOpenChange]);

  // Focus management + ref-counted scroll lock for the dialog's lifetime.
  React.useEffect(() => {
    dialogStack.push(stackId);
    if (scrollLockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    scrollLockCount++;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const autofocus = panel?.querySelector<HTMLElement>('[data-autofocus]');
    (autofocus ?? panel)?.focus();

    return () => {
      const index = dialogStack.indexOf(stackId);
      if (index !== -1) dialogStack.splice(index, 1);
      scrollLockCount--;
      if (scrollLockCount === 0) document.body.style.overflow = previousBodyOverflow;
      previouslyFocused?.focus?.();
    };
  }, [stackId]);

  // Escape closes only the top-most dialog and respects defaultPrevented
  // (e.g. an open combobox inside the dialog handles Escape first).
  useEscapeKey(true, (event) => {
    if (event.defaultPrevented) return;
    if (dialogStack[dialogStack.length - 1] !== stackId) return;
    close();
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    // Minimal focus trap: cycle within the panel.
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = getFocusable(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="tori-dialog-overlay"
      onMouseDown={(event) => {
        if (dismissOnOverlay && event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-describedby={description != null ? descriptionId : undefined}
        tabIndex={-1}
        className={cx('tori-dialog', `tori-dialog--${size}`, className)}
        onKeyDown={handleKeyDown}
      >
        {showClose && (
          <button type="button" className="tori-dialog__close" aria-label="Close" onClick={close}>
            ×
          </button>
        )}
        {title != null && (
          <h2 id={titleId} className="tori-dialog__title">
            {title}
          </h2>
        )}
        {description != null && (
          <p id={descriptionId} className="tori-dialog__description">
            {description}
          </p>
        )}
        {children != null && <div className="tori-dialog__body">{children}</div>}
        {footer != null && <div className="tori-dialog__footer">{footer}</div>}
      </div>
    </div>
  );
}
