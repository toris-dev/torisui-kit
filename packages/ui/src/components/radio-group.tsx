import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  setValue: (value: string) => void;
  disabled: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext(component: string): RadioGroupContextValue {
  const context = React.useContext(RadioGroupContext);
  if (!context) throw new Error(`<${component}> must be used within <RadioGroup>`);
  return context;
}

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shared form `name` for the underlying radios. Auto-generated if omitted. */
  name?: string;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Single-select group built on native `<input type="radio">` — arrow-key
 * navigation, form submission, and screen-reader semantics come from the
 * platform. Wraps its radios in `role="radiogroup"`.
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    value: valueProp,
    defaultValue,
    onValueChange,
    name,
    disabled = false,
    orientation = 'vertical',
    className,
    children,
    ...props
  },
  ref,
) {
  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as (value: string | undefined) => void,
  });
  const autoName = React.useId();

  const context = React.useMemo<RadioGroupContextValue>(
    () => ({
      name: name ?? `tori-radio-${autoName}`,
      value,
      setValue: (next: string) => setValue(next),
      disabled,
    }),
    [name, autoName, value, setValue, disabled],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <div
        ref={ref}
        role="radiogroup"
        aria-orientation={orientation}
        className={cx('tori-radio-group', `tori-radio-group--${orientation}`, className)}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'value'> {
  value: string;
  /** Visible label rendered next to the control. */
  label?: React.ReactNode;
  /** Secondary line below the label. */
  description?: React.ReactNode;
  /** Class applied to the outer `<label>` wrapper. */
  wrapperClassName?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, className, wrapperClassName, disabled, ...props },
  ref,
) {
  const group = useRadioGroupContext('Radio');
  const isDisabled = disabled || group.disabled;

  const control = (
    <span className={cx('tori-radio', className)}>
      <input
        ref={ref}
        type="radio"
        className="tori-radio__input"
        name={group.name}
        value={value}
        checked={group.value === value}
        disabled={isDisabled}
        onChange={(event) => {
          if (event.target.checked) group.setValue(value);
        }}
        {...props}
      />
      <span className="tori-radio__circle" aria-hidden>
        <span className="tori-radio__dot" />
      </span>
    </span>
  );

  if (label == null && description == null) return control;

  return (
    <label
      className={cx('tori-radio-field', isDisabled && 'tori-radio-field--disabled', wrapperClassName)}
    >
      {control}
      <span className="tori-radio-field__text">
        {label != null && <span className="tori-radio-field__label">{label}</span>}
        {description != null && <span className="tori-radio-field__description">{description}</span>}
      </span>
    </label>
  );
});
