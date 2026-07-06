import * as React from 'react';

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface ResolvedPosition {
  side: Side;
  x: number;
  y: number;
}

const OPPOSITE: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

/** Space available on each side of the anchor within the viewport. */
function spaceFor(side: Side, anchor: Rect, viewport: ViewportSize): number {
  switch (side) {
    case 'top':
      return anchor.top;
    case 'bottom':
      return viewport.height - (anchor.top + anchor.height);
    case 'left':
      return anchor.left;
    case 'right':
      return viewport.width - (anchor.left + anchor.width);
  }
}

/** Clamps a value into [min, max]. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Pure placement math — no DOM. Given the anchor/floating rects and the
 * viewport, returns the resolved side (flipped if the preferred side lacks
 * room and the opposite has more) and the top-left x/y in viewport space.
 * Kept pure so it is unit-testable without layout (jsdom can't lay out).
 */
export function resolvePlacement(
  anchor: Rect,
  floating: { width: number; height: number },
  viewport: ViewportSize,
  side: Side,
  align: Align,
  gap = 8,
  padding = 8,
): ResolvedPosition {
  const needed = side === 'top' || side === 'bottom' ? floating.height : floating.width;
  let resolvedSide = side;
  // Flip to the opposite side when the preferred side can't fit but the
  // opposite one has more room.
  if (
    spaceFor(side, anchor, viewport) < needed + gap &&
    spaceFor(OPPOSITE[side], anchor, viewport) > spaceFor(side, anchor, viewport)
  ) {
    resolvedSide = OPPOSITE[side];
  }

  let x: number;
  let y: number;

  if (resolvedSide === 'top' || resolvedSide === 'bottom') {
    y = resolvedSide === 'top' ? anchor.top - floating.height - gap : anchor.top + anchor.height + gap;
    const anchorMid = anchor.left + anchor.width / 2;
    if (align === 'start') x = anchor.left;
    else if (align === 'end') x = anchor.left + anchor.width - floating.width;
    else x = anchorMid - floating.width / 2;
    x = clamp(x, padding, Math.max(padding, viewport.width - floating.width - padding));
  } else {
    x = resolvedSide === 'left' ? anchor.left - floating.width - gap : anchor.left + anchor.width + gap;
    const anchorMid = anchor.top + anchor.height / 2;
    if (align === 'start') y = anchor.top;
    else if (align === 'end') y = anchor.top + anchor.height - floating.height;
    else y = anchorMid - floating.height / 2;
    y = clamp(y, padding, Math.max(padding, viewport.height - floating.height - padding));
  }

  return { side: resolvedSide, x, y };
}

export interface UseAnchoredPositionParams {
  anchorRef: React.RefObject<HTMLElement | null>;
  floatingRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  side?: Side;
  align?: Align;
  gap?: number;
}

export interface AnchoredPosition {
  x: number;
  y: number;
  side: Side;
  /** False until the first measurement — render hidden until true to avoid a corner flash. */
  isPositioned: boolean;
  /** Force a re-measure — call from the floating element's ref callback so
   *  positioning runs once it actually mounts (Portal defers mounting a tick). */
  update: () => void;
}

/**
 * Positions a portaled floating element (fixed, viewport space) next to an
 * anchor, flipping near edges. Measures after mount (`useLayoutEffect`) so
 * the panel is laid out before the first paint, then repositions on scroll
 * (capture phase, to catch nested scroll containers), resize, and content
 * size changes (ResizeObserver on both anchor and floating).
 */
export function useAnchoredPosition({
  anchorRef,
  floatingRef,
  open,
  side = 'bottom',
  align = 'center',
  gap = 8,
}: UseAnchoredPositionParams): AnchoredPosition {
  const [state, setState] = React.useState<Omit<AnchoredPosition, 'update'>>({
    x: 0,
    y: 0,
    side,
    isPositioned: false,
  });

  const update = React.useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;
    const a = anchor.getBoundingClientRect();
    const f = floating.getBoundingClientRect();
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    const resolved = resolvePlacement(
      { top: a.top, left: a.left, width: a.width, height: a.height },
      { width: f.width, height: f.height },
      viewport,
      side,
      align,
      gap,
    );
    setState({ ...resolved, isPositioned: true });
  }, [anchorRef, floatingRef, side, align, gap]);

  React.useLayoutEffect(() => {
    if (!open) {
      setState((prev) => (prev.isPositioned ? { ...prev, isPositioned: false } : prev));
      return;
    }
    update();

    // Capture phase so scrolls in ANY ancestor scroll container reach us.
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);

    const observers: ResizeObserver[] = [];
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(update);
      if (anchorRef.current) ro.observe(anchorRef.current);
      if (floatingRef.current) ro.observe(floatingRef.current);
      observers.push(ro);
    }

    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      for (const ro of observers) ro.disconnect();
    };
  }, [open, update, anchorRef, floatingRef]);

  return React.useMemo(() => ({ ...state, update }), [state, update]);
}
