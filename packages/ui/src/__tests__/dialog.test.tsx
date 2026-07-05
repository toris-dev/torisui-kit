import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from '../components/dialog';

describe('Dialog', () => {
  it('renders nothing while closed', () => {
    render(<Dialog open={false} title="Hidden" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title and description with aria wiring when open', () => {
    render(<Dialog open title="Delete item" description="This cannot be undone." />);
    const dialog = screen.getByRole('dialog', { name: 'Delete item' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
  });

  it('requests close on Escape and on the close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Dialog open onOpenChange={onOpenChange} title="Settings" />);

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);

    onOpenChange.mockClear();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on overlay click for a plain dialog', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { baseElement } = render(<Dialog open onOpenChange={onOpenChange} title="T" />);

    const overlay = baseElement.querySelector('.tori-dialog-overlay')!;
    await user.click(overlay);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close an alertdialog on overlay click', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { baseElement } = render(
      <Dialog open role="alertdialog" onOpenChange={onOpenChange} title="Delete?" />,
    );

    const overlay = baseElement.querySelector('.tori-dialog-overlay')!;
    await user.click(overlay);
    expect(onOpenChange).not.toHaveBeenCalled();

    // Clicking inside the panel never closes.
    await user.click(screen.getByRole('alertdialog'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('Escape closes only the top-most of stacked dialogs', async () => {
    const user = userEvent.setup();
    const closeOuter = vi.fn();
    const closeInner = vi.fn();
    render(
      <>
        <Dialog open onOpenChange={closeOuter} title="Outer" />
        <Dialog open onOpenChange={closeInner} title="Inner" />
      </>,
    );

    await user.keyboard('{Escape}');
    expect(closeInner).toHaveBeenCalledWith(false);
    expect(closeOuter).not.toHaveBeenCalled();
  });

  it('keeps the body scroll locked until the last dialog closes', () => {
    const { rerender } = render(
      <>
        <Dialog open title="Outer" />
        <Dialog open title="Inner" />
      </>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <>
        <Dialog open title="Outer" />
        <Dialog open={false} title="Inner" />
      </>,
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <>
        <Dialog open={false} title="Outer" />
        <Dialog open={false} title="Inner" />
      </>,
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('focuses a [data-autofocus] element on open', () => {
    render(
      <Dialog
        open
        title="Form"
        footer={
          <button type="button" data-autofocus>
            Confirm
          </button>
        }
      />,
    );
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
  });
});
