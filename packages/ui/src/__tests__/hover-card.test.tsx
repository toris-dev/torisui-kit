import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { HoverCard } from '../components/hover-card';

// Timer-driven; fake timers + fireEvent (user-event deadlocks against fake timers).
describe('HoverCard', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function setup(props = {}) {
    render(
      <HoverCard content={<p>Profile details</p>} openDelay={300} closeDelay={150} {...props}>
        <button>Hover me</button>
      </HoverCard>,
    );
    return screen.getByRole('button', { name: 'Hover me' });
  }

  it('opens after the open delay and closes after the close delay', () => {
    const trigger = setup();

    fireEvent.mouseEnter(trigger);
    expect(screen.queryByText('Profile details')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByText('Profile details')).toBeInTheDocument();

    fireEvent.mouseLeave(trigger);
    act(() => vi.advanceTimersByTime(150));
    expect(screen.queryByText('Profile details')).not.toBeInTheDocument();
  });

  it('opens on keyboard focus and wires aria-describedby', () => {
    const trigger = setup();
    fireEvent.focus(trigger);
    act(() => vi.advanceTimersByTime(300));
    const card = screen.getByRole('dialog');
    expect(trigger).toHaveAttribute('aria-describedby', card.id);
  });

  it('stays open when the pointer moves into the card', () => {
    const trigger = setup();
    fireEvent.mouseEnter(trigger);
    act(() => vi.advanceTimersByTime(300));
    const card = screen.getByRole('dialog');

    fireEvent.mouseLeave(trigger);
    fireEvent.mouseEnter(card); // cancels the pending close
    act(() => vi.advanceTimersByTime(150));
    expect(screen.getByText('Profile details')).toBeInTheDocument();
  });
});
