import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';
import type { ToggleSize } from './toggle';

type ToggleGroupValue = string | string[];

interface ToggleGroupContextValue {
  isPressed: (value: string) => boolean;
  toggle: (value: string) => void;
  size: ToggleSize;
  disabled: boolean;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext(component: string): ToggleGroupContextValue {
  const context = React.useContext(ToggleGroupContext);
  if (!context) throw new Error(`<${component}> must be used within <ToggleGroup>`);
  return context;
}

export interface ToggleGroupSingleProps {
  type?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface ToggleGroupMultipleProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ToggleGroupProps = (ToggleGroupSingleProps | ToggleGroupMultipleProps) & {
  size?: ToggleSize;
  disabled?: boolean;
  'aria-label'?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue' | 'onChange'>;

/**
 * Segmented control: a toolbar of Toggles with arrow-key roving focus.
 * `type="single"` behaves like a radio group; `type="multiple"` toggles
 * each independently.
 */
export function ToggleGroup(props: ToggleGroupProps) {
  const multiple = props.type === 'multiple';
  const {
    type: _type,
    value: valueProp,
    defaultValue,
    onValueChange,
    size = 'md',
    disabled = false,
    className,
    children,
    ...rest
  } = props as ToggleGroupProps & { size?: ToggleSize };

  const [value, setValue] = useControllableState<ToggleGroupValue>({
    value: valueProp,
    defaultValue: defaultValue ?? (multiple ? [] : ''),
    onChange: onValueChange as (value: ToggleGroupValue) => void,
  });

  const context = React.useMemo<ToggleGroupContextValue>(() => {
    const isPressed = (v: string) =>
      multiple ? (value as string[]).includes(v) : value === v;
    const toggle = (v: string) => {
      if (multiple) {
        const current = value as string[];
        setValue(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
      } else {
        setValue(value === v ? '' : v);
      }
    };
    return { isPressed, toggle, size, disabled };
  }, [multiple, value, setValue, size, disabled]);

  const listRef = React.useRef<HTMLDivElement>(null);

  // Roving tabindex: exactly one item is in the tab order (the first
  // pressed, else the first item). Arrow keys move focus between the rest.
  const ownItems = React.useCallback(
    () =>
      Array.from(
        listRef.current?.querySelectorAll<HTMLButtonElement>(
          '.tori-toggle-group__item:not(:disabled)',
        ) ?? [],
      ),
    [],
  );
  React.useEffect(() => {
    const items = ownItems();
    if (items.length === 0) return;
    const tabstop = items.find((item) => item.getAttribute('aria-pressed') === 'true') ?? items[0]!;
    for (const item of items) item.tabIndex = item === tabstop ? 0 : -1;
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const items = ownItems();
    if (items.length === 0) return;
    const currentIndex = items.findIndex((item) => item === document.activeElement);
    let next: number;
    switch (event.key) {
      case 'ArrowLeft':
        next = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        break;
      case 'ArrowRight':
        next = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
        break;
      case 'Home':
        next = 0;
        break;
      default:
        next = items.length - 1;
    }
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <ToggleGroupContext.Provider value={context}>
      <div
        ref={listRef}
        role="group"
        className={cx('tori-toggle-group', className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export interface ToggleGroupItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
}

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  function ToggleGroupItem({ value, className, disabled, onClick, ...props }, ref) {
    const group = useToggleGroupContext('ToggleGroupItem');
    const pressed = group.isPressed(value);
    const isDisabled = disabled || group.disabled;
    // Roving tabindex: only the first pressed item (or the first item) is tabbable.
    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        disabled={isDisabled}
        className={cx('tori-toggle', `tori-toggle--${group.size}`, 'tori-toggle-group__item', className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) group.toggle(value);
        }}
        {...props}
      />
    );
  },
);
