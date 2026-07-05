import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error(`<${component}> must be used within <Tabs>`);
  return context;
}

/** Tab values are interpolated into DOM ids — keep them id-safe. */
function toIdSlug(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = React.useId();
  const context = React.useMemo(() => ({ value, setValue, baseId }), [value, setValue, baseId]);

  return (
    <TabsContext.Provider value={context}>
      <div className={cx('tori-tabs', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

/** Tabs directly owned by this list — excludes tabs of nested Tabs instances. */
function getOwnTabs(list: HTMLDivElement | null): HTMLButtonElement[] {
  if (!list) return [];
  return Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')).filter(
    (tab) => tab.closest('[role="tablist"]') === list,
  );
}

export function TabsList({ className, onKeyDown, ...props }: TabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  // Keyboard reachability net: when no tab is selected (e.g. no
  // defaultValue), every trigger renders tabIndex=-1 — promote the first
  // one so the tablist stays in the tab order.
  React.useEffect(() => {
    const tabs = getOwnTabs(listRef.current);
    if (tabs.length > 0 && !tabs.some((tab) => tab.tabIndex === 0)) {
      tabs[0]!.tabIndex = 0;
    }
  });

  // Roving focus with automatic activation (selection follows focus).
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;

    const tabs = getOwnTabs(listRef.current);
    if (tabs.length === 0) return;
    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

    let nextIndex: number;
    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      default:
        nextIndex = tabs.length - 1;
    }

    event.preventDefault();
    const next = tabs[nextIndex];
    next?.focus();
    next?.click();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cx('tori-tabs__list', className)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ value, className, onClick, ...props }, ref) {
    const context = useTabsContext('TabsTrigger');
    const selected = context.value === value;
    const slug = toIdSlug(value);

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`${context.baseId}-tab-${slug}`}
        aria-selected={selected}
        aria-controls={`${context.baseId}-panel-${slug}`}
        tabIndex={selected ? 0 : -1}
        data-state={selected ? 'active' : 'inactive'}
        className={cx('tori-tabs__trigger', className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.setValue(value);
        }}
        {...props}
      />
    );
  },
);

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ value, className, ...props }, ref) {
    const context = useTabsContext('TabsContent');
    const selected = context.value === value;
    const slug = toIdSlug(value);

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${context.baseId}-panel-${slug}`}
        aria-labelledby={`${context.baseId}-tab-${slug}`}
        hidden={!selected}
        tabIndex={0}
        className={cx('tori-tabs__content', className)}
        {...props}
      />
    );
  },
);
