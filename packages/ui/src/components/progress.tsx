import * as React from 'react';
import { cx } from '../utils/cx';

export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
  /** Current value. Omit (or pass null) for an indeterminate bar. */
  value?: number | null;
  /** Maximum value. Defaults to 100. */
  max?: number;
  size?: ProgressSize;
  /** Accessible label for the progress bar. */
  label?: string;
}

/**
 * Determinate or indeterminate progress bar. Pass `value` for determinate
 * (0–`max`); omit it for a looping indeterminate animation.
 * Exposes `role="progressbar"` with `aria-valuenow/min/max`.
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, size = 'md', label, className, ...props },
  ref,
) {
  const indeterminate = value == null;
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), max);
  const percent = indeterminate ? 0 : (clamped / max) * 100;

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-label={label}
      className={cx(
        'tori-progress',
        `tori-progress--${size}`,
        indeterminate && 'tori-progress--indeterminate',
        className,
      )}
      {...props}
    >
      <div
        className="tori-progress__fill"
        style={indeterminate ? undefined : { width: `${percent}%` }}
      />
    </div>
  );
});
