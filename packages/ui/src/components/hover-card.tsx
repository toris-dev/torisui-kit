import * as React from 'react';
import { cx } from '../utils/cx';
import { Portal } from '../primitives/portal';
import { useAnchoredPosition, type Align, type Side } from '../hooks/use-anchored-position';

export interface HoverCardProps {
  children: React.ReactNode;
  /** Rich content shown on hover/focus. */
  content: React.ReactNode;
  side?: Side;
  align?: Align;
  /** Delay before opening, in ms. Defaults to 300. */
  openDelay?: number;
  /** Delay before closing, in ms. Defaults to 150. */
  closeDelay?: number;
  className?: string;
}

/**
 * A non-modal card revealed by hovering (or focusing) a trigger — richer than
 * a Tooltip and pointer-interactive (you can move into the card). Reuses the
 * anchored-positioning primitive so it flips near viewport edges.
 */
export function HoverCard({
  children,
  content,
  side = 'bottom',
  align = 'center',
  openDelay = 300,
  closeDelay = 150,
  className,
}: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const openTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const contentId = React.useId();

  const scheduleOpen = () => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  };
  const scheduleClose = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  React.useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    [],
  );

  const position = useAnchoredPosition({ anchorRef: triggerRef, floatingRef: contentRef, open, side, align });
  const updateRef = React.useRef(position.update);
  updateRef.current = position.update;
  const setContentRef = React.useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    if (node) updateRef.current();
  }, []);

  const trigger = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        ref: (node: HTMLElement | null) => {
          triggerRef.current = node;
        },
        'aria-describedby': open ? contentId : undefined,
        onMouseEnter: scheduleOpen,
        onMouseLeave: scheduleClose,
        onFocus: scheduleOpen,
        onBlur: scheduleClose,
      })
    : children;

  return (
    <>
      {trigger}
      {open && (
        <Portal>
          <div
            ref={setContentRef}
            id={contentId}
            role="dialog"
            data-side={position.side}
            className={cx('tori-hovercard', className)}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              visibility: position.isPositioned ? 'visible' : 'hidden',
            }}
            onMouseEnter={() => clearTimeout(closeTimer.current)}
            onMouseLeave={scheduleClose}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
