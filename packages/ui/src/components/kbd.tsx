import * as React from 'react';
import { cx } from '../utils/cx';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md';
}

/** Renders a semantic `<kbd>` keycap in the monospace token font. */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size = 'md', className, ...props },
  ref,
) {
  return <kbd ref={ref} className={cx('tori-kbd', `tori-kbd--${size}`, className)} {...props} />;
});
