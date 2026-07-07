import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Badge } from '../components/badge';
import { Button } from '../components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/card';
import { IconButton } from '../components/icon-button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '../components/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/tabs';
import { Progress } from '../components/progress';
import { Switch } from '../components/switch';

// Supplementary edge cases for already-shipped components.

describe('Badge (edge cases)', () => {
  it('renders every tone with the matching class', () => {
    const tones = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const;
    for (const tone of tones) {
      const { unmount } = render(<Badge tone={tone}>{tone}</Badge>);
      expect(screen.getByText(tone)).toHaveClass(`tori-badge--${tone}`);
      unmount();
    }
  });

  it('forwards a ref to the span', () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Badge ref={ref}>x</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

describe('Card (edge cases)', () => {
  it('renders all section subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('a non-interactive card is not a button and has no tabindex', () => {
    render(<Card data-testid="c">plain</Card>);
    const card = screen.getByTestId('c');
    expect(card).not.toHaveAttribute('role', 'button');
    expect(card).not.toHaveAttribute('tabindex');
  });
});

describe('IconButton (edge cases)', () => {
  it('requires and exposes an accessible name and stays icon-sized', () => {
    render(<IconButton aria-label="Close">×</IconButton>);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toHaveClass('tori-btn--icon');
  });

  it('forwards loading state (disabled + aria-busy)', () => {
    render(
      <IconButton aria-label="Save" loading>
        ×
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: /Save/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });
});

describe('Button (edge cases)', () => {
  it('defaults to type=button (not submit)', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button', { name: 'Go' })).toHaveAttribute('type', 'button');
  });

  it('honors an explicit type=submit', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });

  it('renders left and right icons', () => {
    render(
      <Button leftIcon={<svg data-testid="l" />} rightIcon={<svg data-testid="r" />}>
        Both
      </Button>,
    );
    expect(screen.getByTestId('l')).toBeInTheDocument();
    expect(screen.getByTestId('r')).toBeInTheDocument();
  });
});

describe('Breadcrumb (edge cases)', () => {
  it('renders a router-style link via asChild', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button type="button">Home</button>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole('button', { name: 'Home' })).toHaveClass('tori-breadcrumb__link');
  });
});

describe('Tabs (edge cases)', () => {
  it('skips a disabled trigger during arrow navigation', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="S">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b" disabled>
            B
          </TabsTrigger>
          <TabsTrigger value="c">C</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
        <TabsContent value="c">C</TabsContent>
      </Tabs>,
    );
    screen.getByRole('tab', { name: 'A' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus();
  });
});

describe('Progress (edge cases)', () => {
  it('clamps negative values to zero', () => {
    render(<Progress value={-20} label="p" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
});

describe('Switch (edge cases)', () => {
  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch disabled label="X" onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: 'X' });
    await user.click(control).catch(() => undefined);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
