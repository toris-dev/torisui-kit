import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../components/collapsible';

function renderCollapsible(props = {}) {
  return render(
    <Collapsible {...props}>
      <CollapsibleTrigger>Details</CollapsibleTrigger>
      <CollapsibleContent>Hidden body</CollapsibleContent>
    </Collapsible>,
  );
}

describe('Collapsible', () => {
  it('wires aria-expanded/controls and toggles', async () => {
    const user = userEvent.setup();
    renderCollapsible();
    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Hidden body')).not.toBeVisible();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Hidden body')).toBeVisible();
    expect(trigger).toHaveAttribute('aria-controls', screen.getByText('Hidden body').id);
  });

  it('respects defaultOpen and controlled open', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = renderCollapsible({ open: true, onOpenChange });
    expect(screen.getByText('Hidden body')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Details' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    // Controlled: stays open until parent updates.
    expect(screen.getByText('Hidden body')).toBeVisible();

    rerender(
      <Collapsible open={false} onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Details</CollapsibleTrigger>
        <CollapsibleContent>Hidden body</CollapsibleContent>
      </Collapsible>,
    );
    expect(screen.getByText('Hidden body')).not.toBeVisible();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    renderCollapsible({ disabled: true });
    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toBeDisabled();
    await user.click(trigger).catch(() => undefined);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('throws outside a Collapsible', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<CollapsibleTrigger>x</CollapsibleTrigger>)).toThrow(
      '<CollapsibleTrigger> must be used within <Collapsible>',
    );
    spy.mockRestore();
  });
});
