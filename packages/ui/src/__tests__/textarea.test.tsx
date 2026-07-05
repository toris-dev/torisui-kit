import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../components/textarea';

describe('Textarea', () => {
  it('associates the label and accepts typing', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Bio" placeholder="About you" />);
    const textarea = screen.getByLabelText('Bio');

    await user.type(textarea, 'hello');
    expect(textarea).toHaveValue('hello');
  });

  it('renders the error state with aria-invalid and an alert', () => {
    render(<Textarea label="Bio" error="Too long" helperText="Max 200 chars" />);
    const textarea = screen.getByLabelText('Bio');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Too long');
    expect(screen.queryByText('Max 200 chars')).not.toBeInTheDocument();
  });

  it('passes rows through', () => {
    render(<Textarea label="Bio" rows={6} />);
    expect(screen.getByLabelText('Bio')).toHaveAttribute('rows', '6');
  });
});
