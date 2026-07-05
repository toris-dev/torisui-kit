import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../components/button';

describe('Button', () => {
  it('renders its label and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Deploy</Button>);

    await user.click(screen.getByRole('button', { name: 'Deploy' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="glow" size="lg">
        Glow
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Glow' });
    expect(button).toHaveClass('tori-btn', 'tori-btn--glow', 'tori-btn--lg');
  });

  it('disables interaction and exposes aria-busy while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: /Save/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();

    await user.click(button).catch(() => undefined);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders as its child element with asChild', () => {
    render(
      <Button asChild variant="outline">
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveClass('tori-btn', 'tori-btn--outline');
  });

  it('renders spinner and icons with asChild', () => {
    const { rerender } = render(
      <Button asChild leftIcon={<svg data-testid="icon" />}>
        <a href="/x">Go</a>
      </Button>,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go' })).toBeInTheDocument();

    rerender(
      <Button asChild loading>
        <a href="/x">Go</a>
      </Button>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('blocks activation with asChild while loading', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    render(
      <Button asChild loading onClick={onClick}>
        <a href="/x">Go</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: /Go/ });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('aria-busy', 'true');

    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('composes its onClick with the child element handler via asChild', async () => {
    const user = userEvent.setup();
    const buttonHandler = vi.fn();
    const childHandler = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Button asChild onClick={buttonHandler}>
        <a href="/x" onClick={childHandler}>
          Go
        </a>
      </Button>,
    );

    await user.click(screen.getByRole('link', { name: 'Go' }));
    expect(childHandler).toHaveBeenCalledTimes(1);
    expect(buttonHandler).toHaveBeenCalledTimes(1);
  });
});
