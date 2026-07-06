import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Slider } from '../components/slider';

// jsdom does not implement native range keyboard stepping or the AT-computed
// aria-valuenow, so value changes are driven with fireEvent.change (the DOM
// event a browser dispatches on drag/keyboard). Real keyboard/drag behavior
// is dogfooded in apps/docs.
describe('Slider', () => {
  it('exposes a native range slider with the value', () => {
    render(<Slider defaultValue={30} min={0} max={100} label="Volume" />);
    const slider = screen.getByRole('slider', { name: 'Volume' }) as HTMLInputElement;
    expect(slider.type).toBe('range');
    expect(slider).toHaveValue('30');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
  });

  it('reports changes via onValueChange (uncontrolled)', () => {
    const onValueChange = vi.fn();
    render(<Slider defaultValue={50} label="Level" onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider', { name: 'Level' });
    fireEvent.change(slider, { target: { value: '55' } });
    expect(onValueChange).toHaveBeenLastCalledWith(55);
    expect(slider).toHaveValue('55');
  });

  it('reflects fill percentage on the wrapper for a custom max', () => {
    const { container } = render(<Slider value={1} max={4} label="Step" onValueChange={() => {}} />);
    const wrapper = container.querySelector('.tori-slider') as HTMLElement;
    expect(wrapper.style.getPropertyValue('--tori-slider-fill')).toBe('25%');
  });

  it('stays fixed when controlled and parent ignores the change', () => {
    const onValueChange = vi.fn();
    render(<Slider value={20} label="Fixed" onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider', { name: 'Fixed' });
    fireEvent.change(slider, { target: { value: '80' } });
    expect(onValueChange).toHaveBeenCalledWith(80);
    // Controlled: DOM reflects the pinned prop, not the attempted change.
    expect(slider).toHaveValue('20');
  });
});
