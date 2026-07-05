import * as React from 'react';

/**
 * Invokes `handler` on document-level Escape keydown while `active` is true.
 * Shared by overlay components (Dialog, Tooltip, future Popover/Dropdown).
 */
export function useEscapeKey(active: boolean, handler: (event: KeyboardEvent) => void): void {
  const handlerRef = React.useRef(handler);
  React.useEffect(() => {
    handlerRef.current = handler;
  });

  React.useEffect(() => {
    if (!active) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handlerRef.current(event);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active]);
}
