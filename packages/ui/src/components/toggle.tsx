import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: ToggleSize;
}

/**
 * Two-state button (`aria-pressed`). The pressed state is conveyed with a
 * filled treatment (not a faint tint) so it stays distinct from hover and
 * survives forced-colors mode.
 */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { pressed, defaultPressed = false, onPressedChange, size = 'md', className, onClick, ...props },
  ref,
) {
  const [isPressed, setPressed] = useControllableState({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  });

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isPressed}
      data-state={isPressed ? 'on' : 'off'}
      className={cx('tori-toggle', `tori-toggle--${size}`, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setPressed((prev) => !prev);
      }}
      {...props}
    />
  );
});
