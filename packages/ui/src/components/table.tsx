import * as React from 'react';
import { cx } from '../utils/cx';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Class applied to the scroll wrapper around the table. */
  wrapperClassName?: string;
}

/** Semantic `<table>` wrapped in a horizontal scroll container. */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, wrapperClassName, ...props },
  ref,
) {
  return (
    <div className={cx('tori-table-wrapper', wrapperClassName)}>
      <table ref={ref} className={cx('tori-table', className)} {...props} />
    </div>
  );
});

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableHeader({ className, ...props }, ref) {
  return <thead ref={ref} className={cx('tori-table__header', className)} {...props} />;
});

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={cx('tori-table__body', className)} {...props} />;
});

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableFooter({ className, ...props }, ref) {
  return <tfoot ref={ref} className={cx('tori-table__footer', className)} {...props} />;
});

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(function TableRow({ className, ...props }, ref) {
  return <tr ref={ref} className={cx('tori-table__row', className)} {...props} />;
});

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Column sort state, exposed as `aria-sort`. */
  sort?: 'ascending' | 'descending' | 'none';
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  function TableHead({ className, sort, ...props }, ref) {
    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={sort}
        className={cx('tori-table__head', className)}
        {...props}
      />
    );
  },
);

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(function TableCell({ className, ...props }, ref) {
  return <td ref={ref} className={cx('tori-table__cell', className)} {...props} />;
});

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(function TableCaption({ className, ...props }, ref) {
  return <caption ref={ref} className={cx('tori-table__caption', className)} {...props} />;
});
