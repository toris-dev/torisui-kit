import * as React from 'react';
import { cx } from '../utils/cx';

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Merges its props onto its single child element. Powers the `asChild`
 * pattern so components can render as arbitrary elements (e.g. links).
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  ref,
) {
  if (!React.isValidElement(children)) return null;

  const childProps = children.props as Record<string, unknown>;
  const merged: Record<string, unknown> = { ...slotProps, ...childProps };

  merged.className = cx(
    slotProps.className,
    typeof childProps.className === 'string' ? childProps.className : undefined,
  );
  if (slotProps.style || childProps.style) {
    merged.style = {
      ...(slotProps.style as React.CSSProperties | undefined),
      ...(childProps.style as React.CSSProperties | undefined),
    };
  }
  merged.ref = ref;

  return React.cloneElement(children, merged);
});
