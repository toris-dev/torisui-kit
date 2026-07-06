import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from '../components/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/dropdown-menu';

// The layer-stack contract the eng review demanded: a dropdown opened inside
// a dialog must close ONLY the dropdown on Escape, and must not disturb the
// dialog's ref-counted body scroll lock.
describe('layer interop (Dialog + DropdownMenu)', () => {
  it('Escape closes the top-most layer (dropdown) only', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} title="Settings">
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>One</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>,
    );

    // Open the dropdown after the dialog is already open (real usage order).
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    // Dropdown closed, dialog stayed open.
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // A second Escape now closes the dialog.
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('the dropdown does not release the dialog body scroll lock', async () => {
    const user = userEvent.setup();
    render(
      <Dialog open title="Settings">
        <DropdownMenu>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>One</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    await screen.findByRole('menu');
    expect(document.body.style.overflow).toBe('hidden');

    // Close only the dropdown; the dialog is still modal → scroll stays locked.
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe('hidden');
  });
});
