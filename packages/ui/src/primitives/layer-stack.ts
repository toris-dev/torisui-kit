/**
 * Shared dismissable-layer stack for overlays (Dialog, Popover, DropdownMenu).
 *
 * Every open overlay pushes an id. Handlers ask `isTopLayer(id)` before
 * reacting to Escape / outside-click, so only the top-most layer responds —
 * independent of document-listener registration order. This is what makes a
 * dropdown-inside-a-dialog close only the dropdown on Escape.
 *
 * Body scroll lock is reference-counted separately so modal layers (Dialog)
 * can lock without a non-modal layer (Popover) unlocking it on close.
 */

const layers: string[] = [];

export function pushLayer(id: string): void {
  layers.push(id);
}

export function removeLayer(id: string): void {
  const index = layers.lastIndexOf(id);
  if (index !== -1) layers.splice(index, 1);
}

export function isTopLayer(id: string): boolean {
  return layers.length > 0 && layers[layers.length - 1] === id;
}

let scrollLockCount = 0;
let previousBodyOverflow = '';

/** Locks body scroll (ref-counted). Returns an unlock function. */
export function lockScroll(): () => void {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLockCount--;
    if (scrollLockCount === 0) document.body.style.overflow = previousBodyOverflow;
  };
}
