import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert } from '../components/alert';

describe('Alert', () => {
  it('renders title and body with an assertive role for danger', () => {
    render(
      <Alert tone="danger" title="Failed">
        Something went wrong.
      </Alert>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Failed');
    expect(alert).toHaveTextContent('Something went wrong.');
    expect(alert).toHaveClass('tori-alert--danger');
  });

  it('uses a polite status role for info/success', () => {
    render(<Alert tone="success" title="Saved" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('hides the icon when icon={false}', () => {
    const { container } = render(<Alert tone="info" icon={false} title="No icon" />);
    expect(container.querySelector('.tori-alert__icon')).toBeNull();
  });

  it('renders a dismiss button that fires onDismiss', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Alert tone="warning" title="Heads up" onDismiss={onDismiss} />);

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
