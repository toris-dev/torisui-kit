import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Badge } from '../components/badge';
import { Card, CardTitle } from '../components/card';
import { IconButton } from '../components/icon-button';
import { Spinner } from '../components/spinner';
import { Portal } from '../primitives/portal';

describe('Card', () => {
  it('renders variant and interactive classes', () => {
    render(
      <Card variant="glass" interactive data-testid="card">
        <CardTitle>Title</CardTitle>
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('tori-card', 'tori-card--glass', 'tori-card--interactive');
  });

  it('gives interactive cards button semantics and keyboard activation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Card interactive onClick={onClick}>
        Open
      </Card>,
    );

    const card = screen.getByRole('button', { name: 'Open' });
    expect(card).toHaveAttribute('tabindex', '0');

    card.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders as its child with asChild', () => {
    render(
      <Card asChild interactive>
        <a href="/detail">Detail</a>
      </Card>,
    );
    const link = screen.getByRole('link', { name: 'Detail' });
    expect(link).toHaveClass('tori-card', 'tori-card--interactive');
  });
});

describe('Badge', () => {
  it('renders variant, tone, and dot', () => {
    render(
      <Badge variant="solid" tone="success" dot>
        Online
      </Badge>,
    );
    const badge = screen.getByText('Online');
    expect(badge).toHaveClass('tori-badge', 'tori-badge--solid', 'tori-badge--success');
    expect(badge.querySelector('.tori-badge__dot')).not.toBeNull();
  });
});

describe('IconButton', () => {
  it('renders an icon-sized button with an accessible name', () => {
    render(<IconButton aria-label="Settings">⚙</IconButton>);
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveClass('tori-btn--icon');
  });
});

describe('Spinner', () => {
  it('exposes role=status with a screen-reader label', () => {
    render(<Spinner label="Loading data" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading data');
  });
});

describe('Portal', () => {
  it('renders children into document.body', () => {
    render(
      <div data-testid="host">
        <Portal>
          <span data-testid="ported">x</span>
        </Portal>
      </div>,
    );
    const ported = screen.getByTestId('ported');
    expect(ported.parentElement).toBe(document.body);
  });
});
