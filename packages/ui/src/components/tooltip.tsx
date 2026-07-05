import * as React from 'react';
import { cx } from '../utils/cx';
import { useEscapeKey } from '../hooks/use-escape-key';

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
 * hides on Escape. The bubble is only mounted while open, and the trigger
 * gets `aria-describedby` (composed with any existing value) while visible.
 *
 * Positioning is pure CSS — there is no viewport collision handling. For
 * tooltips near screen edges choose an appropriate `placement`.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipId = React.useId();

  const show = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = React.useCallback(() => {
    clearTimeout(timerRef.current);
    setOpen(false);
  }, []);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);
  useEscapeKey(open, hide);

  const childDescribedBy = (children.props as { 'aria-describedby'?: string })[
    'aria-describedby'
  ];
  const trigger = React.cloneElement(children, {
    'aria-describedby': open ? cx(childDescribedBy, tooltipId) : childDescribedBy,
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
      {open && (
        <span id={tooltipId} role="tooltip" data-placement={placement} className="tori-tooltip">
          {content}
        </span>
      )}
    </span>
  );
}
