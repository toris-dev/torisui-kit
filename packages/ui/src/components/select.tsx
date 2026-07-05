import * as React from 'react';
import { cx } from '../utils/cx';
import type { FieldOwnProps } from './field';
import { Field } from './field';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    FieldOwnProps {
  size?: SelectSize;
  /** Placeholder shown while no option is selected (rendered as a hidden disabled option). */
  placeholder?: string;
}

/**
 * Styled native `<select>` — full keyboard/screen-reader/mobile behavior
 * for free. For searchable option lists, a Combobox is planned as a
 * separate component.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    helperText,
    error,
    size = 'md',
    className,
    wrapperClassName,
    id,
    placeholder,
    children,
    ...props
  },
  ref,
) {
  const autoId = React.useId();
  const selectId = id ?? `tori-select-${autoId}`;
  // A placeholder needs an initially-selected empty option in uncontrolled mode.
  const defaultValue =
    placeholder != null && props.value === undefined && props.defaultValue === undefined
      ? ''
      : props.defaultValue;

  return (
    <Field
      controlId={selectId}
      label={label}
      helperText={helperText}
      error={error}
      wrapperClassName={wrapperClassName}
    >
      {(a11y) => (
        <span className={cx('tori-select', `tori-select--${size}`)}>
          <select
            ref={ref}
            className={cx('tori-select__native', 'tori-input', `tori-input--${size}`, className)}
            {...a11y}
            {...props}
            defaultValue={defaultValue}
          >
            {placeholder != null && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <span className="tori-select__chevron" aria-hidden>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      )}
    </Field>
  );
});
