import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: SliderSize;
  /** Accessible label for the slider. */
  label?: string;
}

/**
 * Single-thumb slider built on a native `<input type="range">`, so
 * keyboard control, `aria-valuenow`, and touch come from the platform.
 * The filled track uses the brand gradient; the drag thumb keeps a small
 * visual size but a ≥44px pointer target. (Range/dual-thumb is a separate
 * future component.)
 */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    label,
    className,
    style,
    disabled,
    ...props
  },
  ref,
) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });

  const range = max - min;
  const percent = range > 0 ? ((value - min) / range) * 100 : 0;

  return (
    <span
      className={cx('tori-slider', `tori-slider--${size}`, disabled && 'tori-slider--disabled', className)}
      // Expose the fill percentage to CSS for the gradient track.
      style={{ ['--tori-slider-fill' as string]: `${percent}%`, ...style }}
    >
      <input
        ref={ref}
        type="range"
        className="tori-slider__input"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => setValue(event.target.valueAsNumber)}
        {...props}
      />
    </span>
  );
});
