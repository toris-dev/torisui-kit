import * as React from 'react';
import { cx } from '../utils/cx';
import { VisuallyHidden } from '../primitives/visually-hidden';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label announced to screen readers. */
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      className={cx('tori-spinner', `tori-spinner--${size}`, className)}
      {...props}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
});
