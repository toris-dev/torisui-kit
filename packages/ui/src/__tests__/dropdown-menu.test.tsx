import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/dropdown-menu';

function renderMenu(onSelect = vi.fn()) {
  render(
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => onSelect('edit')}>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled onSelect={() => onSelect('archive')}>
          Archive
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect('duplicate')}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onSelect('delete')}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  );
  return onSelect;
}

describe('DropdownMenu', () => {
  it('opens as a menu with menuitems and haspopup', async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

    await user.click(trigger);
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
  });

  it('focuses the first item on open and roves with arrows, skipping disabled', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menu');

    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());
    await user.keyboard('{ArrowDown}');
    // Archive is disabled → skipped → Duplicate.
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    // Wraps to the first.
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  });

  it('activates an item on Enter, runs onSelect, and closes', async () => {
    const user = userEvent.setup();
    const onSelect = renderMenu();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menu');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('edit');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('type-ahead jumps to a matching item', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menu');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus());

    await user.keyboard('du');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await screen.findByRole('menu');

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('does not activate a disabled item on click', async () => {
    const user = userEvent.setup();
    const onSelect = renderMenu();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menu');

    await user.click(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
