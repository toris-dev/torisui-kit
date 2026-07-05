import * as React from 'react';
import { cx } from '../utils/cx';

export type VisuallyHiddenProps = React.HTMLAttributes<HTMLSpanElement>;

/** Hides content visually while keeping it available to screen readers. */
export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, ...props }, ref) {
    return <span ref={ref} className={cx('tori-sr-only', className)} {...props} />;
  },
);
