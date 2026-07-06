import * as React from 'react';
import { cx } from '../utils/cx';

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  /** 1-based current page. */
  page: number;
  /** Total number of pages. */
  count: number;
  onPageChange?: (page: number) => void;
  /** Pages shown around the current one before collapsing to an ellipsis. Defaults to 1. */
  siblingCount?: number;
  /** Accessible label for the nav landmark. Defaults to "Pagination". */
  'aria-label'?: string;
}

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/** Builds the visible page list with ellipses, always showing first + last. */
function paginationRange(page: number, count: number, siblingCount: number): PageItem[] {
  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2 ellipses
  if (count <= totalNumbers) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  const left = Math.max(page - siblingCount, 2);
  const right = Math.min(page + siblingCount, count - 1);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < count - 1;

  const items: PageItem[] = [1];
  if (showLeftEllipsis) items.push('ellipsis-start');
  for (let p = left; p <= right; p++) items.push(p);
  if (showRightEllipsis) items.push('ellipsis-end');
  items.push(count);
  return items;
}

const ChevronLeft = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M8.5 3.5L5 7L8.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M5.5 3.5L9 7L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Page navigation. The current page carries both a filled treatment and
 * `aria-current="page"` (not color alone). Ellipses are non-interactive.
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, count, onPageChange, siblingCount = 1, className, 'aria-label': ariaLabel = 'Pagination', ...props },
  ref,
) {
  const items = paginationRange(page, count, siblingCount);
  const go = (next: number) => {
    if (next >= 1 && next <= count && next !== page) onPageChange?.(next);
  };

  return (
    <nav ref={ref} aria-label={ariaLabel} className={cx('tori-pagination', className)} {...props}>
      <ul className="tori-pagination__list">
        <li>
          <button
            type="button"
            className="tori-pagination__link tori-pagination__nav"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => go(page - 1)}
          >
            {ChevronLeft}
          </button>
        </li>
        {items.map((item, index) => (
          <li key={typeof item === 'number' ? `p${item}` : `${item}-${index}`}>
            {typeof item === 'number' ? (
              <button
                type="button"
                className={cx('tori-pagination__link', item === page && 'tori-pagination__link--active')}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Page ${item}`}
                onClick={() => go(item)}
              >
                {item}
              </button>
            ) : (
              <span className="tori-pagination__ellipsis" aria-hidden>
                …
              </span>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            className="tori-pagination__link tori-pagination__nav"
            aria-label="Next page"
            disabled={page >= count}
            onClick={() => go(page + 1)}
          >
            {ChevronRight}
          </button>
        </li>
      </ul>
    </nav>
  );
});
