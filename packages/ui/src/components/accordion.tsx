import * as React from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/use-controllable-state';

type AccordionValue = string | string[];

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  baseId: string;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error(`<${component}> must be used within <Accordion>`);
  return context;
}

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext(component: string): AccordionItemContextValue {
  const context = React.useContext(AccordionItemContext);
  if (!context) throw new Error(`<${component}> must be used within <AccordionItem>`);
  return context;
}

export interface AccordionSingleProps {
  type?: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Allow closing the open item (single mode). Defaults to true. */
  collapsible?: boolean;
}

export interface AccordionMultipleProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) &
  Omit<React.HTMLAttributes<HTMLDivElement>, 'value' | 'defaultValue' | 'onChange'>;

/**
 * Vertically stacked disclosure sections. `type="single"` keeps one item
 * open at a time (set `collapsible={false}` to always keep one open);
 * `type="multiple"` allows any number open.
 */
export function Accordion(props: AccordionProps) {
  const multiple = props.type === 'multiple';
  const {
    type: _type,
    value: valueProp,
    defaultValue,
    onValueChange,
    className,
    children,
    ...rest
  } = props as AccordionProps & { collapsible?: boolean };
  const collapsible = (props as AccordionSingleProps).collapsible ?? true;

  const [value, setValue] = useControllableState<AccordionValue>({
    value: valueProp,
    defaultValue: defaultValue ?? (multiple ? [] : ''),
    onChange: onValueChange as (value: AccordionValue) => void,
  });
  const baseId = React.useId();

  const context = React.useMemo<AccordionContextValue>(() => {
    const isOpen = (itemValue: string) =>
      multiple ? (value as string[]).includes(itemValue) : value === itemValue;
    const toggle = (itemValue: string) => {
      if (multiple) {
        const current = value as string[];
        setValue(
          current.includes(itemValue)
            ? current.filter((v) => v !== itemValue)
            : [...current, itemValue],
        );
      } else {
        const isCurrentlyOpen = value === itemValue;
        setValue(isCurrentlyOpen && collapsible ? '' : itemValue);
      }
    };
    return { isOpen, toggle, baseId };
  }, [multiple, value, setValue, collapsible, baseId]);

  return (
    <AccordionContext.Provider value={context}>
      <div className={cx('tori-accordion', className)} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ value, disabled = false, className, children, ...props }, ref) {
    const { isOpen } = useAccordionContext('AccordionItem');
    const open = isOpen(value);
    const itemContext = React.useMemo(
      () => ({ value, open, disabled }),
      [value, open, disabled],
    );

    return (
      <AccordionItemContext.Provider value={itemContext}>
        <div
          ref={ref}
          className={cx('tori-accordion__item', className)}
          data-state={open ? 'open' : 'closed'}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, onClick, ...props }, ref) {
    const { toggle, baseId } = useAccordionContext('AccordionTrigger');
    const { value, open, disabled } = useAccordionItemContext('AccordionTrigger');

    return (
      <h3 className="tori-accordion__heading">
        <button
          ref={ref}
          type="button"
          id={`${baseId}-trigger-${value}`}
          className={cx('tori-accordion__trigger', className)}
          aria-expanded={open}
          aria-controls={`${baseId}-panel-${value}`}
          disabled={disabled}
          data-state={open ? 'open' : 'closed'}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) toggle(value);
          }}
          {...props}
        >
          <span className="tori-accordion__trigger-label">{children}</span>
          <svg
            className="tori-accordion__chevron"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden
          >
            <path
              d="M3.5 5.25L7 8.75L10.5 5.25"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </h3>
    );
  },
);

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...props }, ref) {
    const { baseId } = useAccordionContext('AccordionContent');
    const { value, open } = useAccordionItemContext('AccordionContent');

    return (
      <div
        ref={ref}
        role="region"
        id={`${baseId}-panel-${value}`}
        aria-labelledby={`${baseId}-trigger-${value}`}
        hidden={!open}
        className={cx('tori-accordion__content', className)}
        {...props}
      >
        <div className="tori-accordion__content-inner">{children}</div>
      </div>
    );
  },
);
