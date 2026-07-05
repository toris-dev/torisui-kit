import * as React from 'react';
import { cx } from '../utils/cx';
import { Slot } from '../primitives/slot';
import { Spinner } from './spinner';

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'glow';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and disables interaction (also with `asChild`). */
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
    onClick,
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

  const renderInner = (label: React.ReactNode) => (
    <>
      {loading ? (
        <Spinner size="sm" className="tori-btn__spinner" />
      ) : leftIcon ? (
        <span className="tori-btn__icon" aria-hidden>
          {leftIcon}
        </span>
      ) : null}
      {label != null && <span className="tori-btn__label">{label}</span>}
      {!loading && rightIcon ? (
        <span className="tori-btn__icon" aria-hidden>
          {rightIcon}
        </span>
      ) : null}
    </>
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ children?: React.ReactNode }>;
    const blocked = Boolean(disabled || loading);
    return (
      <Slot
        ref={ref as React.Ref<HTMLElement>}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={blocked || undefined}
        data-disabled={blocked || undefined}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          // Non-button elements have no native disabled semantics —
          // block activation (incl. keyboard Enter on links) here.
          if (blocked) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onClick?.(event as React.MouseEvent<HTMLButtonElement>);
        }}
        {...props}
      >
        {React.cloneElement(child, undefined, renderInner(child.props.children))}
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
      onClick={onClick}
      {...props}
    >
      {renderInner(children)}
    </button>
  );
});
