import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../components/switch';

describe('Switch', () => {
  it('toggles when uncontrolled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch label="Dark mode" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole('switch', { name: 'Dark mode' });
    expect(control).toHaveAttribute('aria-checked', 'false');

    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('stays in sync when controlled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} label="Alerts" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole('switch', { name: 'Alerts' });
    await user.click(control);

    // Controlled: parent owns the state, so the DOM does not change by itself.
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('activates with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Switch label="Sound" />);
    const control = screen.getByRole('switch', { name: 'Sound' });

    control.focus();
    await user.keyboard(' ');
    expect(control).toHaveAttribute('aria-checked', 'true');
  });
});
