import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Separator } from '../components/separator';

describe('Separator', () => {
  it('is decorative (role=none) by default', () => {
    const { container } = render(<Separator />);
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('tori-separator', 'tori-separator--horizontal');
    expect(el).toHaveAttribute('role', 'none');
    expect(el).not.toHaveAttribute('aria-orientation');
  });

  it('exposes a semantic separator with orientation when not decorative', () => {
    render(<Separator decorative={false} orientation="vertical" />);
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
    expect(sep).toHaveClass('tori-separator--vertical');
  });
});
