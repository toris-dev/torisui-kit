import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Number of stars. Defaults to 5. */
  max?: number;
  size?: RatingSize;
  /** Read-only display (no input). */
  readOnly?: boolean;
  disabled?: boolean;
  /** Accessible label for the group. */
  label?: string;
}

const Star = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 20 20" width="1em" height="1em" aria-hidden fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <path
      d="M10 1.8l2.5 5 5.6.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.6-.8z"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Star rating. Interactive mode is a `radiogroup` of stars with arrow-key
 * navigation; `readOnly` renders a labelled `img`. Hovering previews a value
 * without committing it.
 */
export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(function Rating(
  {
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    max = 5,
    size = 'md',
    readOnly = false,
    disabled = false,
    label = 'Rating',
    className,
    ...props
  },
  ref,
) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const [hover, setHover] = React.useState<number | null>(null);
  const display = hover ?? value;

  if (readOnly) {
    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${label}: ${value} of ${max}`}
        className={cx('tori-rating', `tori-rating--${size}`, 'tori-rating--readonly', className)}
        {...props}
      >
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className="tori-rating__star" data-filled={i < value || undefined}>
            <Star filled={i < value} />
          </span>
        ))}
      </div>
    );
  }

  const commit = (next: number) => {
    if (disabled) return;
    // Clicking the current value clears it (common rating affordance).
    setValue(next === value ? 0 : next);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    let next = value;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = Math.min(max, value + 1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(0, value - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = max;
    else return;
    event.preventDefault();
    setValue(next);
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      className={cx(
        'tori-rating',
        `tori-rating--${size}`,
        disabled && 'tori-rating--disabled',
        className,
      )}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setHover(null)}
      {...props}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} ${starValue === 1 ? 'star' : 'stars'}`}
            tabIndex={-1}
            disabled={disabled}
            className="tori-rating__star"
            data-filled={starValue <= display || undefined}
            onClick={() => commit(starValue)}
            onMouseEnter={() => !disabled && setHover(starValue)}
          >
            <Star filled={starValue <= display} />
          </button>
        );
      })}
    </div>
  );
});
