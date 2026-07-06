import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../components/pagination';

describe('Pagination', () => {
  it('renders a nav landmark and marks the current page', () => {
    render(<Pagination page={3} count={10} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    const current = screen.getByRole('button', { name: 'Page 3' });
    expect(current).toHaveAttribute('aria-current', 'page');
    // Not color-only: current page also carries the active class.
    expect(current).toHaveClass('tori-pagination__link--active');
  });

  it('changes page on click and via prev/next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} count={10} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Page 4' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);
  });

  it('disables prev at the first page and next at the last', () => {
    const { rerender } = render(<Pagination page={1} count={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();

    rerender(<Pagination page={5} count={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('collapses long ranges with ellipses, always showing first and last', () => {
    render(<Pagination page={50} count={100} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 100' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 50' })).toBeInTheDocument();
    // Ellipses are not interactive.
    expect(screen.queryByRole('button', { name: '…' })).not.toBeInTheDocument();
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });
});
