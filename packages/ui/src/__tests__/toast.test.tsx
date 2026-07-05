import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from '../components/toast';

function Demo() {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast.success('Saved!')}>
      Trigger
    </button>
  );
}

describe('Toast', () => {
  it('publishes a toast via useToast and dismisses it', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(screen.getByText('Saved!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
  });
});
