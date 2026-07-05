import * as React from 'react';
import { cx } from '../utils/cx';

/** Shared label/message scaffolding for form controls (Input, Textarea, Select). */
export interface FieldOwnProps {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  /** Error message. When set, the field renders in an invalid state. */
  error?: React.ReactNode;
  /** Class applied to the outer field wrapper (label + control + message). */
  wrapperClassName?: string;
}

interface FieldProps extends FieldOwnProps {
  /** id of the control element, used to wire the label. */
  controlId: string;
  /** Renders the control with its computed a11y attributes. */
  children: (a11y: {
    id: string;
    'aria-invalid': true | undefined;
    'aria-describedby': string | undefined;
  }) => React.ReactNode;
}

export function isInvalidError(error: React.ReactNode): boolean {
  return error != null && error !== false && error !== '';
}

/** Internal render-prop wrapper — not exported from the public API. */
export function Field({
  label,
  helperText,
  error,
  wrapperClassName,
  controlId,
  children,
}: FieldProps) {
  const messageId = `${controlId}-message`;
  const invalid = isInvalidError(error);
  const message = invalid ? error : helperText;

  return (
    <div className={cx('tori-field', invalid && 'tori-field--error', wrapperClassName)}>
      {label != null && (
        <label className="tori-field__label" htmlFor={controlId}>
          {label}
        </label>
      )}
      {children({
        id: controlId,
        'aria-invalid': invalid || undefined,
        'aria-describedby': message != null ? messageId : undefined,
      })}
      {message != null && (
        <p id={messageId} className="tori-field__message" role={invalid ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}
