import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md';
  /** Visible label rendered next to the control. */
  label?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    size = 'md',
    label,
    className,
    disabled,
    onClick,
    ...props
  },
  ref,
) {
  const [isChecked, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const control = (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isChecked}
      data-state={isChecked ? 'checked' : 'unchecked'}
      className={cx('tori-switch', `tori-switch--${size}`, label == null ? className : undefined)}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setChecked(!isChecked);
      }}
      {...props}
    >
      <span className="tori-switch__thumb" aria-hidden />
    </button>
  );

  if (label == null) return control;

  return (
    <label className={cx('tori-switch-field', disabled && 'tori-switch-field--disabled', className)}>
      {control}
      <span className="tori-switch-field__label">{label}</span>
    </label>
  );
});
