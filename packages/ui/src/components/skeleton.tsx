import * as React from 'react';
import { cx } from '../utils/cx';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  /** For `variant="text"`: number of stacked lines (the last one is shorter). */
  lines?: number;
}

/**
 * Loading placeholder with a soft shimmer. Purely decorative — hidden
 * from assistive technology (announce loading via `Spinner` or a live
 * region instead).
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, lines = 1, className, style, ...props },
  ref,
) {
  const sizeStyle: React.CSSProperties = { width, height, ...style };

  if (variant === 'text' && lines > 1) {
    return (
      <div
        ref={ref}
        className={cx('tori-skeleton-group', className)}
        style={sizeStyle}
        aria-hidden
        {...props}
      >
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className="tori-skeleton tori-skeleton--text"
            style={index === lines - 1 ? { width: '60%' } : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cx('tori-skeleton', `tori-skeleton--${variant}`, className)}
      style={sizeStyle}
      aria-hidden
      {...props}
    />
  );
});
