import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Tooltip } from '../components/tooltip';

// Timer-driven behavior is tested with fake timers + fireEvent — user-event's
// internal awaits deadlock against fake timers for hover interactions.
describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  function setup() {
    render(
      <Tooltip content="More info" delay={300}>
        <button>Trigger</button>
      </Tooltip>,
    );
    return screen.getByRole('button', { name: 'Trigger' });
  }

  it('mounts the bubble only after the delay and wires aria-describedby', () => {
    const trigger = setup();

    fireEvent.mouseEnter(trigger.parentElement!);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-describedby');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('More info');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('unmounts on mouse leave and on Escape', () => {
    const trigger = setup();
    const anchor = trigger.parentElement!;

    fireEvent.mouseEnter(anchor);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(anchor);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseEnter(anchor);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on keyboard focus and hides on blur', () => {
    const trigger = setup();

    act(() => {
      trigger.focus();
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    act(() => {
      trigger.blur();
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('preserves an existing aria-describedby on the trigger', () => {
    render(
      <>
        <p id="hint">hint</p>
        <Tooltip content="More" delay={0}>
          <button aria-describedby="hint">T</button>
        </Tooltip>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'T' });

    fireEvent.mouseEnter(trigger.parentElement!);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    const tooltip = screen.getByRole('tooltip');
    expect(trigger.getAttribute('aria-describedby')).toBe(`hint ${tooltip.id}`);

    fireEvent.mouseLeave(trigger.parentElement!);
    expect(trigger.getAttribute('aria-describedby')).toBe('hint');
  });
});
