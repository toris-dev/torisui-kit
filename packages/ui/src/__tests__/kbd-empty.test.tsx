import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kbd } from '../components/kbd';
import { EmptyState } from '../components/empty-state';

describe('Kbd', () => {
  it('renders a semantic <kbd>', () => {
    const { container } = render(<Kbd>⌘K</Kbd>);
    const kbd = container.querySelector('kbd');
    expect(kbd).not.toBeNull();
    expect(kbd).toHaveClass('tori-kbd');
    expect(kbd).toHaveTextContent('⌘K');
  });
});

describe('EmptyState', () => {
  it('renders the title as a real heading with description and action', () => {
    render(
      <EmptyState
        title="No results"
        description="Try a different search."
        action={<button>Clear</button>}
      />,
    );
    expect(screen.getByRole('heading', { name: 'No results' })).toBeInTheDocument();
    expect(screen.getByText('Try a different search.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('respects a configurable heading level and hides the icon', () => {
    const { container } = render(
      <EmptyState titleAs="h2" title="Empty" icon={<svg data-testid="icon" />} />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Empty' })).toBeInTheDocument();
    expect(container.querySelector('.tori-empty-state__icon')).toHaveAttribute('aria-hidden', 'true');
  });
});
