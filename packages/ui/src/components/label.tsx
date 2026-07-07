import * as React from 'react';
import { cx } from '../utils/cx';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Appends a required marker (`*`) after the label text. */
  required?: boolean;
}

/** Accessible form label. Associate it with a control via `htmlFor`. */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required = false, className, children, ...props },
  ref,
) {
  return (
    <label ref={ref} className={cx('tori-label', className)} {...props}>
      {children}
      {required && (
        <span className="tori-label__required" aria-hidden>
          *
        </span>
      )}
    </label>
  );
});
