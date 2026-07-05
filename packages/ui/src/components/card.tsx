import * as React from 'react';
import { cx } from '../utils/cx';
import { Slot } from '../primitives/slot';

export type CardVariant = 'surface' | 'glass' | 'elevated';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Adds hover/press affordances for clickable cards. */
  interactive?: boolean;
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'surface', interactive = false, asChild = false, className, children, ...props },
  ref,
) {
  const classes = cx(
    'tori-card',
    `tori-card--${variant}`,
    interactive && 'tori-card--interactive',
    className,
  );

  if (asChild) {
    return (
      <Slot ref={ref as React.Ref<HTMLElement>} className={classes} {...props}>
        {children as React.ReactElement}
      </Slot>
    );
  }

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

export type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;

export const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cx('tori-card__header', className)} {...props} />;
  },
);

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, ...props }, ref) {
    return <h3 ref={ref} className={cx('tori-card__title', className)} {...props} />;
  },
);

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cx('tori-card__description', className)} {...props} />;
});

export const CardContent = React.forwardRef<HTMLDivElement, CardSectionProps>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cx('tori-card__content', className)} {...props} />;
  },
);

export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(
  function CardFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cx('tori-card__footer', className)} {...props} />;
  },
);
