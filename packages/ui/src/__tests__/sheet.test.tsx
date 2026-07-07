import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sheet } from '../components/sheet';

describe('Sheet', () => {
  it('renders nothing while closed', () => {
    render(<Sheet open={false} title="Filters" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a modal dialog with aria wiring and side class', () => {
    const { baseElement } = render(
      <Sheet open side="left" title="Filters" description="Narrow the results">
        body
      </Sheet>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Filters' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Narrow the results');
    expect(baseElement.querySelector('.tori-sheet--left')).not.toBeNull();
  });

  it('locks body scroll while open and restores it on close', () => {
    const { rerender } = render(<Sheet open title="F" />);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<Sheet open={false} title="F" />);
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape, overlay click, and the close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { baseElement } = render(<Sheet open onOpenChange={onOpenChange} title="F" />);

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    await user.click(baseElement.querySelector('.tori-sheet-overlay')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close on overlay click when disabled', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { baseElement } = render(
      <Sheet open onOpenChange={onOpenChange} closeOnOverlayClick={false} title="F" />,
    );
    await user.click(baseElement.querySelector('.tori-sheet-overlay')!);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
