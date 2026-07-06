import * as React from 'react';

/**
 * While `active`, remembers the element focused when the layer opened and
 * restores focus to it on close/unmount. Shared by Dialog, Popover, and
 * DropdownMenu so focus never gets stranded on a removed overlay.
 */
export function useFocusReturn(active: boolean): void {
  React.useEffect(() => {
    if (!active) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => {
      previouslyFocused?.focus?.();
    };
  }, [active]);
}
