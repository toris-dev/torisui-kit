import * as React from 'react';
import { cx } from '../utils/cx';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /**
   * Purely visual (default): hidden from assistive tech. Set `false` when
   * the rule conveys a meaningful grouping boundary.
   */
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative = true, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      className={cx('tori-separator', `tori-separator--${orientation}`, className)}
      {...props}
    />
  );
});
