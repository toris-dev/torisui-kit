import * as React from 'react';
import { isTopLayer, pushLayer, removeLayer } from '../primitives/layer-stack';

export interface UseDismissableLayerParams {
  open: boolean;
  onDismiss: () => void;
  /** Elements that count as "inside" — a pointerdown on any of them won't dismiss. */
  refs: Array<React.RefObject<HTMLElement | null>>;
  /** Dismiss on outside pointerdown. Defaults to true. */
  dismissOnOutsidePointer?: boolean;
  /** Dismiss on Escape. Defaults to true. */
  dismissOnEscape?: boolean;
}

let layerSeq = 0;

/**
 * Registers a non-modal layer on the shared stack and dismisses it on
 * Escape / outside pointerdown — but only while it is the top-most layer,
 * so a dropdown opened inside a dialog closes the dropdown first, and Escape
 * gets `preventDefault()` so the parent layer doesn't also close.
 */
export function useDismissableLayer({
  open,
  onDismiss,
  refs,
  dismissOnOutsidePointer = true,
  dismissOnEscape = true,
}: UseDismissableLayerParams): void {
  const idRef = React.useRef<string | null>(null);
  if (idRef.current === null) idRef.current = `tori-layer-${++layerSeq}`;
  const id = idRef.current;

  const onDismissRef = React.useRef(onDismiss);
  React.useEffect(() => {
    onDismissRef.current = onDismiss;
  });
  const refsRef = React.useRef(refs);
  refsRef.current = refs;

  React.useEffect(() => {
    if (!open) return;
    pushLayer(id);

    const isInside = (target: Node | null) =>
      refsRef.current.some((ref) => ref.current && target && ref.current.contains(target));

    const onPointerDown = (event: PointerEvent) => {
      if (!dismissOnOutsidePointer || !isTopLayer(id)) return;
      if (isInside(event.target as Node | null)) return;
      onDismissRef.current();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!dismissOnEscape || event.key !== 'Escape') return;
      if (event.defaultPrevented || !isTopLayer(id)) return;
      // Stop the parent layer's Escape handler from also firing.
      event.preventDefault();
      onDismissRef.current();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      removeLayer(id);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, id, dismissOnOutsidePointer, dismissOnEscape]);
}
