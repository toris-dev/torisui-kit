import * as React from 'react';
import { cx } from '../utils/cx';
import { Portal } from '../primitives/portal';
import { Slot } from '../primitives/slot';
import { useControllableState } from '../hooks/use-controllable-state';
import { useDismissableLayer } from '../hooks/use-dismissable-layer';
import { useFocusReturn } from '../hooks/use-focus-return';
import { useAnchoredPosition, type Align, type Side } from '../hooks/use-anchored-position';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string): PopoverContextValue {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error(`<${component}> must be used within <Popover>`);
  return context;
}

export interface PopoverProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Non-modal floating panel anchored to a trigger. Unlike Dialog it does not
 * trap focus or lock scroll — Tab flows out through the DOM and the page
 * stays interactive. Dismisses on Escape / outside click; focus returns to
 * the trigger on close.
 */
export function Popover({ children, open: openProp, defaultOpen = false, onOpenChange }: PopoverProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentId = React.useId();

  const context = React.useMemo<PopoverContextValue>(
    () => ({ open, setOpen, triggerRef, contentId }),
    [open, setOpen, contentId],
  );

  return <PopoverContext.Provider value={context}>{children}</PopoverContext.Provider>;
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ asChild = false, className, onClick, children, ...props }, ref) {
    const { open, setOpen, triggerRef, contentId } = usePopoverContext('PopoverTrigger');
    const setRefs = (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    };
    const triggerProps = {
      ref: setRefs,
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': open,
      'aria-controls': open ? contentId : undefined,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(!open);
      },
      ...props,
    };
    if (asChild && React.isValidElement(children)) {
      return (
        <Slot {...triggerProps} className={className}>
          {children as React.ReactElement}
        </Slot>
      );
    }
    return (
      <button type="button" className={cx('tori-popover-trigger', className)} {...triggerProps}>
        {children}
      </button>
    );
  },
);

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side;
  align?: Align;
  /** Move focus into the panel on open. Defaults to true. */
  autoFocus?: boolean;
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    { side = 'bottom', align = 'center', autoFocus = true, className, style, children, ...props },
    ref,
  ) {
    const { open, setOpen, triggerRef, contentId } = usePopoverContext('PopoverContent');
    const contentRef = React.useRef<HTMLDivElement>(null);

    const close = React.useCallback(() => setOpen(false), [setOpen]);
    useFocusReturn(open);
    useDismissableLayer({ open, onDismiss: close, refs: [contentRef, triggerRef] });

    const position = useAnchoredPosition({
      anchorRef: triggerRef,
      floatingRef: contentRef,
      open,
      side,
      align,
    });

    // Stable ref callback: React runs it only on mount/unmount, so measuring
    // on attach doesn't loop. `update` is read through a ref to stay stable.
    const updateRef = React.useRef(position.update);
    updateRef.current = position.update;
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        // Portal mounts the panel a tick after open — measure once it attaches.
        if (node) updateRef.current();
      },
      [ref],
    );

    React.useEffect(() => {
      if (open && autoFocus && position.isPositioned) contentRef.current?.focus();
    }, [open, autoFocus, position.isPositioned]);

    if (!open) return null;

    return (
      <Portal>
        <div
          ref={setRefs}
          id={contentId}
          role="dialog"
          tabIndex={-1}
          data-side={position.side}
          className={cx('tori-popover', className)}
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            // Measure-then-reveal: hidden until the first layout to avoid a corner flash.
            visibility: position.isPositioned ? 'visible' : 'hidden',
            ...style,
          }}
          {...props}
        >
          {children}
        </div>
      </Portal>
    );
  },
);
