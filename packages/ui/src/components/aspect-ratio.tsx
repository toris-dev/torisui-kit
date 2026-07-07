import * as React from 'react';
import { cx } from '../utils/cx';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width / height, e.g. 16 / 9 (default) or 1 for a square. */
  ratio?: number;
}

/** Constrains its content to a fixed width-to-height ratio. */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 16 / 9, className, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('tori-aspect-ratio', className)}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    />
  );
});
