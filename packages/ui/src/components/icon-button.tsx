import * as React from 'react';
import type { ButtonProps } from './button';
import { Button } from './button';

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'size'> {
  /** Required accessible name — icon-only buttons have no visible label. */
  'aria-label': string;
}

/** Square icon-only button. Requires `aria-label`. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    return <Button ref={ref} size="icon" {...props} />;
  },
);
