import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Rating } from '../components/rating';

describe('Rating', () => {
  it('renders a radiogroup of stars and selects on click', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating max={5} label="Quality" onValueChange={onValueChange} />);

    expect(screen.getByRole('radiogroup', { name: 'Quality' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);

    await user.click(screen.getByRole('radio', { name: '4 stars' }));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('radio', { name: '4 stars' })).toHaveAttribute('aria-checked', 'true');
  });

  it('clears when clicking the current value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating defaultValue={3} label="Q" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('radio', { name: '3 stars' }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it('adjusts with arrow keys', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating defaultValue={2} label="Q" onValueChange={onValueChange} />);
    const group = screen.getByRole('radiogroup', { name: 'Q' });
    group.focus();

    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    await user.keyboard('{End}');
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    await user.keyboard('{Home}');
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it('renders read-only as an image without radios', () => {
    render(<Rating value={4} readOnly label="Score" />);
    expect(screen.getByRole('img', { name: 'Score: 4 of 5' })).toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });

  it('does not respond when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating defaultValue={2} disabled label="Q" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('radio', { name: '5 stars' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
