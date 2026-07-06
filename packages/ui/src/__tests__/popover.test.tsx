import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';

function renderPopover(props = {}) {
  return render(
    <Popover {...props}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>
        <button>Inside</button>
      </PopoverContent>
    </Popover>,
  );
}

describe('Popover', () => {
  it('opens on trigger click and wires aria', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = await screen.findByRole('dialog');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderPopover();
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes on outside pointerdown but not on inside click', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');

    await user.click(screen.getByRole('button', { name: 'Inside' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(document.body);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('supports controlled open', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = renderPopover({ open: false, onOpenChange });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(
      <Popover open onOpenChange={onOpenChange}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <button>Inside</button>
        </PopoverContent>
      </Popover>,
    );
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('is non-modal — body scroll is never locked', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await screen.findByRole('dialog');
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
