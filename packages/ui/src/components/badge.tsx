import * as React from 'react';
import { cx } from '../utils/cx';

export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'gradient';
export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  tone?: BadgeTone;
  /** Renders a small status dot before the label. */
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'soft', tone = 'neutral', dot = false, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx('tori-badge', `tori-badge--${variant}`, `tori-badge--${tone}`, className)}
      {...props}
    >
      {dot && <span className="tori-badge__dot" aria-hidden />}
      {children}
    </span>
  );
});
