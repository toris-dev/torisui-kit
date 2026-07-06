import * as React from 'react';
import { cx } from '../utils/cx';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Decorative icon or illustration (marked aria-hidden). */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Action slot, e.g. a Button. */
  action?: React.ReactNode;
  /** Heading level for the title. Defaults to 'h3'. */
  titleAs?: 'h2' | 'h3' | 'h4';
}

/**
 * Placeholder for empty lists, search misses, or first-run screens.
 * Presentational only — the title is a real heading; the consumer owns any
 * live-region announcement of the empty state.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, titleAs = 'h3', className, ...props },
  ref,
) {
  const Title = titleAs;
  return (
    <div ref={ref} className={cx('tori-empty-state', className)} {...props}>
      {icon != null && (
        <div className="tori-empty-state__icon" aria-hidden>
          {icon}
        </div>
      )}
      <Title className="tori-empty-state__title">{title}</Title>
      {description != null && <p className="tori-empty-state__description">{description}</p>}
      {action != null && <div className="tori-empty-state__action">{action}</div>}
    </div>
  );
});
