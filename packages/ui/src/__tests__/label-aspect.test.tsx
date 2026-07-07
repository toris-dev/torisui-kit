import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '../components/label';
import { AspectRatio } from '../components/aspect-ratio';

describe('Label', () => {
  it('associates with a control via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(screen.getByText('Email').tagName).toBe('LABEL');
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders a decorative required marker', () => {
    render(<Label required>Name</Label>);
    const marker = screen.getByText('*');
    expect(marker).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('AspectRatio', () => {
  it('applies the aspect-ratio style', () => {
    const { container } = render(
      <AspectRatio ratio={1}>
        <img alt="" src="/x.png" />
      </AspectRatio>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass('tori-aspect-ratio');
    expect(el.style.aspectRatio).toBe('1');
  });

  it('defaults to 16:9', () => {
    const { container } = render(<AspectRatio />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.aspectRatio).toBe(String(16 / 9));
  });
});
