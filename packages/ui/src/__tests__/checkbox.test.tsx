import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../components/checkbox';

describe('Checkbox', () => {
  it('toggles when uncontrolled and reports via onCheckedChange', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Terms" onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Terms' });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('stays in sync when controlled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox checked={false} onChange={() => {}} label="News" onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'News' });
    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).not.toBeChecked();
  });

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Sound" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Sound' });

    checkbox.focus();
    await user.keyboard(' ');
    expect(checkbox).toBeChecked();
  });

  it('sets the native indeterminate flag', () => {
    render(<Checkbox label="All" indeterminate />);
    const checkbox = screen.getByRole('checkbox', { name: 'All' }) as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('renders a description', () => {
    render(<Checkbox label="Emails" description="Product updates only" />);
    expect(screen.getByText('Product updates only')).toBeInTheDocument();
  });
});
