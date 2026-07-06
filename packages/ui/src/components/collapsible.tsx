import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  disabled: boolean;
  contentId: string;
  triggerId: string;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext(component: string): CollapsibleContextValue {
  const context = React.useContext(CollapsibleContext);
  if (!context) throw new Error(`<${component}> must be used within <Collapsible>`);
  return context;
}

export interface CollapsibleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

/**
 * Single show/hide disclosure — the standalone sibling of Accordion.
 * Matches Accordion's fade-in (no height animation) for consistency.
 */
export function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...props
}: CollapsibleProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = React.useId();

  const context = React.useMemo<CollapsibleContextValue>(
    () => ({
      open,
      toggle: () => setOpen((prev) => !prev),
      disabled,
      contentId: `${baseId}-content`,
      triggerId: `${baseId}-trigger`,
    }),
    [open, setOpen, disabled, baseId],
  );

  return (
    <CollapsibleContext.Provider value={context}>
      <div
        className={cx('tori-collapsible', className)}
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

export type CollapsibleTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ className, onClick, ...props }, ref) {
    const { open, toggle, disabled, contentId, triggerId } = useCollapsibleContext(
      'CollapsibleTrigger',
    );
    return (
      <button
        ref={ref}
        type="button"
        id={triggerId}
        className={cx('tori-collapsible__trigger', className)}
        aria-expanded={open}
        aria-controls={contentId}
        disabled={disabled}
        data-state={open ? 'open' : 'closed'}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggle();
        }}
        {...props}
      />
    );
  },
);

export type CollapsibleContentProps = React.HTMLAttributes<HTMLDivElement>;

export const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ className, children, ...props }, ref) {
    const { open, contentId, triggerId } = useCollapsibleContext('CollapsibleContent');
    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className={cx('tori-collapsible__content', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
