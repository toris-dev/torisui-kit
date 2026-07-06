import { describe, expect, it } from 'vitest';
import { resolvePlacement, type Rect } from '../hooks/use-anchored-position';

const viewport = { width: 1000, height: 800 };
const floating = { width: 200, height: 100 };

// Pure placement math — no DOM, unit-testable (jsdom can't lay out).
describe('resolvePlacement', () => {
  it('places below-center by default with room', () => {
    const anchor: Rect = { top: 300, left: 400, width: 100, height: 40 };
    const pos = resolvePlacement(anchor, floating, viewport, 'bottom', 'center');
    expect(pos.side).toBe('bottom');
    expect(pos.y).toBe(300 + 40 + 8); // below + gap
    expect(pos.x).toBe(400 + 50 - 100); // anchor mid − half floating width
  });

  it('flips to top when there is no room below but room above', () => {
    const anchor: Rect = { top: 750, left: 400, width: 100, height: 40 };
    const pos = resolvePlacement(anchor, floating, viewport, 'bottom', 'center');
    expect(pos.side).toBe('top');
    expect(pos.y).toBe(750 - 100 - 8); // above − height − gap
  });

  it('does not flip when the preferred side has room even if tight', () => {
    const anchor: Rect = { top: 200, left: 400, width: 100, height: 40 };
    const pos = resolvePlacement(anchor, floating, viewport, 'bottom', 'center');
    expect(pos.side).toBe('bottom');
  });

  it('aligns start/end along the cross axis', () => {
    const anchor: Rect = { top: 300, left: 400, width: 100, height: 40 };
    expect(resolvePlacement(anchor, floating, viewport, 'bottom', 'start').x).toBe(400);
    expect(resolvePlacement(anchor, floating, viewport, 'bottom', 'end').x).toBe(400 + 100 - 200);
  });

  it('clamps within the viewport padding near edges', () => {
    const anchor: Rect = { top: 300, left: 5, width: 20, height: 40 };
    const pos = resolvePlacement(anchor, floating, viewport, 'bottom', 'center');
    expect(pos.x).toBeGreaterThanOrEqual(8); // padding
  });

  it('flips horizontally for left/right sides', () => {
    const anchor: Rect = { top: 300, left: 20, width: 40, height: 40 };
    const pos = resolvePlacement(anchor, floating, viewport, 'left', 'center');
    expect(pos.side).toBe('right'); // no room left, flip
    expect(pos.x).toBe(20 + 40 + 8);
  });
});
