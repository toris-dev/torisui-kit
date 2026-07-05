import * as React from 'react';
import { cx } from '../utils/cx';
import { Slot } from '../primitives/slot';
import { Spinner } from './spinner';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'glow';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables interaction. */
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Renders the child element instead of a `<button>` (e.g. a link). */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    asChild = false,
    className,
    children,
    disabled,
    ...props
  },
  ref,
) {
  const classes = cx(
    'tori-btn',
    `tori-btn--${variant}`,
    `tori-btn--${size}`,
    loading && 'tori-btn--loading',
    className,
  );

  const content = (
    <>
      {loading ? (
        <Spinner size="sm" className="tori-btn__spinner" />
      ) : leftIcon ? (
        <span className="tori-btn__icon" aria-hidden>
          {leftIcon}
        </span>
      ) : null}
      {children != null && <span className="tori-btn__label">{children}</span>}
      {!loading && rightIcon ? (
        <span className="tori-btn__icon" aria-hidden>
          {rightIcon}
        </span>
      ) : null}
    </>
  );

  if (asChild) {
    return (
      <Slot
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        aria-busy={loading || undefined}
        {...props}
      >
        {children as React.ReactElement}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type={props.type ?? 'button'}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
    </button>
  );
});
