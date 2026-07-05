import * as React from 'react';
import { cx } from '../utils/cx';

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

type AnyProps = Record<string, unknown>;

/** Chains multiple refs (callback or object) into a single callback ref. */
export function composeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined | null>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref != null) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/**
 * Merges slot props onto child props. Event handlers are composed
 * (child handler first, then the slot's), className and style are
 * merged; for everything else the child's value wins.
 */
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (/^on[A-Z]/.test(key) && typeof slotValue === 'function') {
      merged[key] =
        typeof childValue === 'function'
          ? (...args: unknown[]) => {
              (childValue as (...a: unknown[]) => void)(...args);
              (slotValue as (...a: unknown[]) => void)(...args);
            }
          : slotValue;
    } else if (key === 'style') {
      merged.style = {
        ...(slotValue as React.CSSProperties | undefined),
        ...(childValue as React.CSSProperties | undefined),
      };
    } else if (key === 'className') {
      merged.className = cx(slotValue as string | undefined, childValue as string | undefined);
    }
  }

  return merged;
}

/**
 * Merges its props onto its single child element. Powers the `asChild`
 * pattern so components can render as arbitrary elements (e.g. links).
 * Event handlers from both sides are composed; refs are chained so the
 * child's own ref keeps working.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  ref,
) {
  if (!React.isValidElement(children)) return null;

  const childProps = children.props as AnyProps;
  const merged = mergeProps(slotProps as AnyProps, childProps);

  // React 19 exposes ref as a regular prop; React 18 keeps it on the element.
  const childRef = (childProps.ref ??
    (children as unknown as { ref?: React.Ref<HTMLElement> }).ref) as
    | React.Ref<HTMLElement>
    | undefined;
  merged.ref = composeRefs(ref, childRef);

  return React.cloneElement(children, merged);
});
