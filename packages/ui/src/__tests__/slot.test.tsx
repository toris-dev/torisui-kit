import { describe, expect, it, vi } from 'vitest';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slot, composeRefs } from '../primitives/slot';

describe('Slot', () => {
  it('merges className and style from both sides', () => {
    render(
      <Slot className="from-slot" style={{ color: 'red' }}>
        <span className="from-child" style={{ background: 'blue' }}>
          x
        </span>
      </Slot>,
    );
    const el = screen.getByText('x');
    expect(el).toHaveClass('from-slot', 'from-child');
    expect(el).toHaveStyle({ color: 'rgb(255, 0, 0)', background: 'blue' });
  });

  it('composes event handlers instead of overriding (child first)', async () => {
    const user = userEvent.setup();
    const order: string[] = [];
    render(
      <Slot onClick={() => order.push('slot')}>
        <button onClick={() => order.push('child')}>go</button>
      </Slot>,
    );

    await user.click(screen.getByRole('button', { name: 'go' }));
    expect(order).toEqual(['child', 'slot']);
  });

  it('chains slot ref and child ref', () => {
    const slotRef = React.createRef<HTMLElement>();
    const childRef = React.createRef<HTMLButtonElement>();
    render(
      <Slot ref={slotRef}>
        <button ref={childRef}>go</button>
      </Slot>,
    );
    expect(slotRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(childRef.current).toBe(slotRef.current);
  });

  it('renders null for non-element children', () => {
    const { container } = render(<Slot>plain text</Slot>);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('composeRefs', () => {
  it('assigns to callback and object refs', () => {
    const objectRef = React.createRef<HTMLDivElement>();
    const callbackRef = vi.fn();
    const composed = composeRefs<HTMLDivElement>(objectRef, callbackRef, null, undefined);
    const node = document.createElement('div');
    composed(node);
    expect(objectRef.current).toBe(node);
    expect(callbackRef).toHaveBeenCalledWith(node);
  });
});
