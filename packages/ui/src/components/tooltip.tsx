import * as React from 'react';
import { cx } from '../utils/cx';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: TooltipPlacement;
  /** Delay before showing, in ms. Defaults to 300. */
  delay?: number;
  className?: string;
}

/**
 * Lightweight CSS-positioned tooltip. Shows on hover and keyboard focus,
 * hides on Escape. The trigger gets `aria-describedby` while visible.
 */
export function Tooltip({ content, children, placement = 'top', delay = 300, className }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipId = React.useId();

  const show = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timerRef.current);
    setOpen(false);
  };

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const trigger = React.cloneElement(children, {
    'aria-describedby': open ? tooltipId : undefined,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <span
      className={cx('tori-tooltip-anchor', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {trigger}
      <span
        id={tooltipId}
        role="tooltip"
        data-placement={placement}
        data-open={open || undefined}
        className="tori-tooltip"
      >
        {content}
      </span>
    </span>
  );
}
