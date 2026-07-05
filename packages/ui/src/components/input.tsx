import * as React from 'react';
import { cx } from '../utils/cx';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  /** Error message. When set, the field renders in an invalid state. */
  error?: React.ReactNode;
  size?: InputSize;
  /** Class applied to the outer field wrapper (label + input + message). */
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error, size = 'md', className, wrapperClassName, id, ...props },
  ref,
) {
  const autoId = React.useId();
  const inputId = id ?? `tori-input-${autoId}`;
  const messageId = `${inputId}-message`;
  const invalid = error != null && error !== false && error !== '';
  const message = invalid ? error : helperText;

  return (
    <div className={cx('tori-field', invalid && 'tori-field--error', wrapperClassName)}>
      {label != null && (
        <label className="tori-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cx('tori-input', `tori-input--${size}`, className)}
        aria-invalid={invalid || undefined}
        aria-describedby={message != null ? messageId : undefined}
        {...props}
      />
      {message != null && (
        <p id={messageId} className="tori-field__message" role={invalid ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
});
