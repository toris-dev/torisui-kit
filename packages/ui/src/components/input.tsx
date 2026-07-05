import * as React from 'react';
import { cx } from '../utils/cx';
import type { FieldOwnProps } from './field';
import { Field } from './field';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    FieldOwnProps {
  size?: InputSize;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error, size = 'md', className, wrapperClassName, id, ...props },
  ref,
) {
  const autoId = React.useId();
  const inputId = id ?? `tori-input-${autoId}`;

  return (
    <Field
      controlId={inputId}
      label={label}
      helperText={helperText}
      error={error}
      wrapperClassName={wrapperClassName}
    >
      {(a11y) => (
        <input
          ref={ref}
          className={cx('tori-input', `tori-input--${size}`, className)}
          {...a11y}
          {...props}
        />
      )}
    </Field>
  );
});
