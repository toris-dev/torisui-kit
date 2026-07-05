import * as React from 'react';
import { cx } from '../utils/cx';
import type { FieldOwnProps } from './field';
import { Field } from './field';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldOwnProps {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, helperText, error, className, wrapperClassName, id, rows = 3, ...props },
  ref,
) {
  const autoId = React.useId();
  const textareaId = id ?? `tori-textarea-${autoId}`;

  return (
    <Field
      controlId={textareaId}
      label={label}
      helperText={helperText}
      error={error}
      wrapperClassName={wrapperClassName}
    >
      {(a11y) => (
        <textarea
          ref={ref}
          rows={rows}
          className={cx('tori-input', 'tori-textarea', className)}
          {...a11y}
          {...props}
        />
      )}
    </Field>
  );
});
