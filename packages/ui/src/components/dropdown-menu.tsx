import * as React from 'react';
import { cx } from '../utils/cx';
import { Portal } from '../primitives/portal';
import { Slot } from '../primitives/slot';
import { useControllableState } from '../hooks/use-controllable-state';
import { useDismissableLayer } from '../hooks/use-dismissable-layer';
import { useFocusReturn } from '../hooks/use-focus-return';
import { useAnchoredPosition, type Align, type Side } from '../hooks/use-anchored-position';

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useMenuContext(component: string): DropdownMenuContextValue {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error(`<${component}> must be used within <DropdownMenu>`);
  return context;
}

export interface DropdownMenuProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropdownMenu({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: DropdownMenuProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentId = React.useId();
  const context = React.useMemo<DropdownMenuContextValue>(
    () => ({ open, setOpen, triggerRef, contentId }),
    [open, setOpen, contentId],
  );
  return <DropdownMenuContext.Provider value={context}>{children}</DropdownMenuContext.Provider>;
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ asChild = false, className, onClick, children, ...props }, ref) {
    const { open, setOpen, triggerRef, contentId } = useMenuContext('DropdownMenuTrigger');
    const setRefs = (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    };
    const triggerProps = {
      ref: setRefs,
      'aria-haspopup': 'menu' as const,
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
      <button type="button" className={cx('tori-menu-trigger', className)} {...triggerProps}>
        {children}
      </button>
    );
  },
);

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side;
  align?: Align;
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    { side = 'bottom', align = 'start', className, style, children, onKeyDown, ...props },
    ref,
  ) {
    const { open, setOpen, triggerRef, contentId } = useMenuContext('DropdownMenuContent');
    const contentRef = React.useRef<HTMLDivElement>(null);
    const typeahead = React.useRef({ buffer: '', timer: undefined as ReturnType<typeof setTimeout> | undefined });

    const close = React.useCallback(() => setOpen(false), [setOpen]);
    useFocusReturn(open);
    useDismissableLayer({ open, onDismiss: close, refs: [contentRef, triggerRef] });
    const position = useAnchoredPosition({ anchorRef: triggerRef, floatingRef: contentRef, open, side, align });

    // Stable ref callback (see Popover) so measuring on attach doesn't loop.
    const updateRef = React.useRef(position.update);
    updateRef.current = position.update;
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (node) updateRef.current();
      },
      [ref],
    );

    const items = React.useCallback(
      () =>
        Array.from(
          contentRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ??
            [],
        ),
      [],
    );

    // Focus the first item once positioned.
    React.useEffect(() => {
      if (open && position.isPositioned) items()[0]?.focus();
    }, [open, position.isPositioned, items]);

    const focusAt = (list: HTMLElement[], index: number) => {
      if (list.length === 0) return;
      const wrapped = (index + list.length) % list.length;
      list[wrapped]?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const list = items();
      const current = list.indexOf(document.activeElement as HTMLElement);
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          focusAt(list, current + 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusAt(list, current - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusAt(list, 0);
          break;
        case 'End':
          event.preventDefault();
          focusAt(list, list.length - 1);
          break;
        case 'Tab':
          // Menus don't trap Tab — closing keeps focus flow predictable.
          close();
          break;
        default:
          // Type-ahead: jump to the next item whose text starts with the buffer.
          if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
            clearTimeout(typeahead.current.timer);
            typeahead.current.buffer += event.key.toLowerCase();
            typeahead.current.timer = setTimeout(() => {
              typeahead.current.buffer = '';
            }, 500);
            const match = list.find((item) =>
              (item.textContent ?? '').trim().toLowerCase().startsWith(typeahead.current.buffer),
            );
            if (match) match.focus();
          }
      }
    };

    if (!open) return null;

    return (
      <Portal>
        <div
          ref={setRefs}
          id={contentId}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
          data-side={position.side}
          className={cx('tori-menu', className)}
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
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

export interface DropdownMenuItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  disabled?: boolean;
  /** Called on activation (click / Enter / Space). Close the menu unless prevented. */
  onSelect?: () => void;
}

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ disabled = false, onSelect, className, onClick, onKeyDown, ...props }, ref) {
    const { setOpen } = useMenuContext('DropdownMenuItem');
    const activate = () => {
      if (disabled) return;
      onSelect?.();
      setOpen(false);
    };
    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        className={cx('tori-menu__item', className)}
        // Highlight follows the pointer: hovering focuses the item so mouse and
        // keyboard share the single :focus highlight state.
        onMouseEnter={(event) => {
          if (!disabled) event.currentTarget.focus();
        }}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) activate();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            activate();
          }
        }}
        {...props}
      />
    );
  },
);

export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DropdownMenuSeparator({ className, ...props }, ref) {
    return (
      <div ref={ref} role="separator" className={cx('tori-menu__separator', className)} {...props} />
    );
  },
);

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DropdownMenuLabel({ className, ...props }, ref) {
    return <div ref={ref} className={cx('tori-menu__label', className)} {...props} />;
  },
);
