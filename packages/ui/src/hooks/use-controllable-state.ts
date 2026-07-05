import * as React from 'react';

export interface UseControllableStateParams<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Supports both controlled (`value` provided) and uncontrolled
 * (`defaultValue` only) usage with a single state API.
 *
 * The setter accepts a plain value or an updater function
 * (`setValue(prev => !prev)`) and resolves against the latest value,
 * so multiple synchronous calls compose instead of reading a stale
 * render snapshot.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T, (next: React.SetStateAction<T>) => void] {
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  // Mutable mirror of the latest value so the setter never reads stale state.
  const currentRef = React.useRef(current);
  currentRef.current = current;

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (next: React.SetStateAction<T>) => {
      const resolved =
        typeof next === 'function' ? (next as (prev: T) => T)(currentRef.current) : next;
      if (!isControlled) {
        currentRef.current = resolved;
        setInternal(resolved);
      }
      onChangeRef.current?.(resolved);
    },
    [isControlled],
  );

  return [current, setValue];
}
