import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from '../components/progress';

describe('Progress', () => {
  it('exposes determinate value via ARIA', () => {
    render(<Progress value={40} label="Upload" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar.querySelector('.tori-progress__fill')).toHaveStyle({ width: '40%' });
  });

  it('clamps out-of-range values', () => {
    render(<Progress value={150} max={100} label="X" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('respects a custom max', () => {
    render(<Progress value={1} max={4} label="Step" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '1');
    expect(bar).toHaveAttribute('aria-valuemax', '4');
    expect(bar.querySelector('.tori-progress__fill')).toHaveStyle({ width: '25%' });
  });

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress label="Loading" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveClass('tori-progress--indeterminate');
  });
});
