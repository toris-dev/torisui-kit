import * as React from 'react';
import { cx } from '../utils/cx';
import { Portal } from '../primitives/portal';
import { useEscapeKey } from '../hooks/use-escape-key';
import { isTopLayer, lockScroll, pushLayer, removeLayer } from '../primitives/layer-stack';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let sheetSeq = 0;

function getFocusable(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest('[hidden]') && el.getAttribute('aria-hidden') !== 'true',
  );
}

export type SheetSide = 'top' | 'right' | 'bottom' | 'left';

export interface SheetProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Edge the sheet slides in from. Defaults to 'right'. */
  side?: SheetSide;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  showClose?: boolean;
  className?: string;
}

/**
 * Modal panel that slides in from a screen edge (drawer). Shares the modal
 * behavior of Dialog — focus trap, ref-counted scroll lock, top-most-layer
 * Escape — via the shared layer stack.
 */
export function Sheet(props: SheetProps) {
  if (!props.open) return null;
  return (
    <Portal>
      <SheetContent {...props} />
    </Portal>
  );
}

function SheetContent({
  onOpenChange,
  side = 'right',
  title,
  description,
  children,
  footer,
  closeOnOverlayClick = true,
  showClose = true,
  className,
}: SheetProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const stackIdRef = React.useRef<string | null>(null);
  if (stackIdRef.current === null) stackIdRef.current = `tori-sheet-${++sheetSeq}`;
  const stackId = stackIdRef.current;
  const titleId = React.useId();
  const descriptionId = React.useId();

  const close = React.useCallback(() => onOpenChange?.(false), [onOpenChange]);

  React.useEffect(() => {
    pushLayer(stackId);
    const releaseScroll = lockScroll();
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const autofocus = panel?.querySelector<HTMLElement>('[data-autofocus]');
    (autofocus ?? panel)?.focus();
    return () => {
      removeLayer(stackId);
      releaseScroll();
      previouslyFocused?.focus?.();
    };
  }, [stackId]);

  useEscapeKey(true, (event) => {
    if (event.defaultPrevented || !isTopLayer(stackId)) return;
    close();
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Tab') return;
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
      className="tori-sheet-overlay"
      onMouseDown={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-describedby={description != null ? descriptionId : undefined}
        tabIndex={-1}
        className={cx('tori-sheet', `tori-sheet--${side}`, className)}
        onKeyDown={handleKeyDown}
      >
        {showClose && (
          <button type="button" className="tori-sheet__close" aria-label="Close" onClick={close}>
            ×
          </button>
        )}
        {title != null && (
          <h2 id={titleId} className="tori-sheet__title">
            {title}
          </h2>
        )}
        {description != null && (
          <p id={descriptionId} className="tori-sheet__description">
            {description}
          </p>
        )}
        {children != null && <div className="tori-sheet__body">{children}</div>}
        {footer != null && <div className="tori-sheet__footer">{footer}</div>}
      </div>
    </div>
  );
}
