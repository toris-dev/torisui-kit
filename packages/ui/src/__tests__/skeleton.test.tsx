import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../components/skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Skeleton variant="rect" />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies variant classes and size styles', () => {
    const { container } = render(<Skeleton variant="circle" width={64} height={64} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('tori-skeleton', 'tori-skeleton--circle');
    expect(el.style.width).toBe('64px');
    expect(el.style.height).toBe('64px');
  });

  it('renders multiple text lines with a shorter last line', () => {
    const { container } = render(<Skeleton variant="text" lines={3} />);
    const group = container.firstElementChild as HTMLElement;
    expect(group).toHaveClass('tori-skeleton-group');
    const rows = group.querySelectorAll('.tori-skeleton--text');
    expect(rows).toHaveLength(3);
    expect((rows[2] as HTMLElement).style.width).toBe('60%');
  });
});
