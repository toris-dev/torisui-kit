import * as React from 'react';
import { cx } from '../utils/cx';
import { composeRefs } from '../primitives/slot';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Convenience callback with the next checked state (native `onChange` also works). */
  onCheckedChange?: (checked: boolean) => void;
  /** Renders the mixed state (also sets the native `indeterminate` flag). */
  indeterminate?: boolean;
  /** Visible label rendered next to the box. */
  label?: React.ReactNode;
  /** Secondary line below the label. */
  description?: React.ReactNode;
  /** Class applied to the outer `<label>` wrapper. */
  wrapperClassName?: string;
}

/**
 * Styled native checkbox — controlled/uncontrolled, keyboard, and form
 * semantics come from the real `<input type="checkbox">` underneath.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    onCheckedChange,
    indeterminate = false,
    label,
    description,
    className,
    wrapperClassName,
    onChange,
    disabled,
    ...props
  },
  ref,
) {
  const innerRef = React.useRef<HTMLInputElement>(null);

  // `indeterminate` is a DOM property, not an attribute.
  React.useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const control = (
    <span className={cx('tori-checkbox', className)}>
      <input
        ref={composeRefs(ref, innerRef)}
        type="checkbox"
        className="tori-checkbox__input"
        disabled={disabled}
        onChange={(event) => {
          onChange?.(event);
          onCheckedChange?.(event.target.checked);
        }}
        {...props}
      />
      <span className="tori-checkbox__box" aria-hidden>
        <svg className="tori-checkbox__check" width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M1.5 5.5L4 8L8.5 2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="tori-checkbox__dash" />
      </span>
    </span>
  );

  if (label == null && description == null) return control;

  return (
    <label
      className={cx(
        'tori-checkbox-field',
        disabled && 'tori-checkbox-field--disabled',
        wrapperClassName,
      )}
    >
      {control}
      <span className="tori-checkbox-field__text">
        {label != null && <span className="tori-checkbox-field__label">{label}</span>}
        {description != null && (
          <span className="tori-checkbox-field__description">{description}</span>
        )}
      </span>
    </label>
  );
});
