import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Avatar } from '../components/avatar';

describe('Avatar', () => {
  it('renders the image when src is provided', () => {
    render(<Avatar src="/me.png" name="Toris Dev" />);
    expect(screen.getByRole('img', { name: 'Toris Dev' })).toHaveAttribute('src', '/me.png');
  });

  it('falls back to initials when the image fails to load', () => {
    render(<Avatar src="/broken.png" name="Toris Dev" />);
    fireEvent.error(screen.getByRole('img'));

    expect(screen.getByText('TD')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Toris Dev' })).not.toHaveAttribute('src');
  });

  it('shows initials directly without src', () => {
    render(<Avatar name="ada lovelace" size="lg" />);
    const avatar = screen.getByRole('img', { name: 'ada lovelace' });
    expect(avatar).toHaveClass('tori-avatar--lg');
    expect(screen.getByText('AL')).toBeInTheDocument();
  });

  it('renders a status dot with a screen-reader label', () => {
    render(<Avatar name="T" status="online" />);
    expect(screen.getByText('online')).toHaveClass('tori-sr-only');
  });
});
