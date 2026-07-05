import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../components/input';

describe('Input', () => {
  it('associates the label with the input', () => {
    render(<Input label="Email" placeholder="you@example.com" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows helper text and wires aria-describedby', () => {
    render(<Input label="Name" helperText="Shown on your profile" />);
    const input = screen.getByLabelText('Name');
    const message = screen.getByText('Shown on your profile');
    expect(input).toHaveAttribute('aria-describedby', message.id);
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('renders the error state with aria-invalid and an alert', () => {
    render(<Input label="Email" error="Invalid email address" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address');
  });
});
