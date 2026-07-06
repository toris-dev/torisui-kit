import * as React from 'react';
import { cx } from '../utils/cx';
import { Slot } from '../primitives/slot';

export type BreadcrumbProps = React.ComponentPropsWithoutRef<'nav'>;

/** Navigation landmark for a breadcrumb trail. */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { className, 'aria-label': ariaLabel = 'Breadcrumb', ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cx('tori-breadcrumb', className)}
      {...props}
    />
  );
});

export const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
  function BreadcrumbList({ className, ...props }, ref) {
    return <ol ref={ref} className={cx('tori-breadcrumb__list', className)} {...props} />;
  },
);

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  function BreadcrumbItem({ className, ...props }, ref) {
    return <li ref={ref} className={cx('tori-breadcrumb__item', className)} {...props} />;
  },
);

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  /** Render the child element instead of an `<a>` (e.g. a router Link). */
  asChild?: boolean;
}

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ asChild = false, className, children, ...props }, ref) {
    const classes = cx('tori-breadcrumb__link', className);
    if (asChild) {
      return (
        <Slot ref={ref as React.Ref<HTMLElement>} className={classes} {...props}>
          {children as React.ReactElement}
        </Slot>
      );
    }
    return (
      <a ref={ref} className={classes} {...props}>
        {children}
      </a>
    );
  },
);

/** The current page — non-interactive, marked `aria-current="page"`. */
export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  function BreadcrumbPage({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cx('tori-breadcrumb__page', className)}
        {...props}
      />
    );
  },
);

export const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(function BreadcrumbSeparator({ className, children, ...props }, ref) {
  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden
      className={cx('tori-breadcrumb__separator', className)}
      {...props}
    >
      {children ?? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path
            d="M4.5 2.5L8 6L4.5 9.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </li>
  );
});
