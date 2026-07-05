import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToriProvider, useTheme } from '../provider';

function ThemeReader() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme('light')}>current: {resolvedTheme}</button>
  );
}

describe('ToriProvider', () => {
  it('applies data-theme to a custom target element', () => {
    const target = document.createElement('div');
    render(<ToriProvider theme="dark" target={target} />);
    expect(target).toHaveAttribute('data-theme', 'dark');
  });

  it('applies data-theme to documentElement by default', () => {
    render(<ToriProvider theme="dark" />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('resolves system theme to light when matchMedia is unavailable (jsdom)', () => {
    render(
      <ToriProvider theme="system">
        <ThemeReader />
      </ToriProvider>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('current: light');
  });

  it('setTheme switches the applied theme at runtime', async () => {
    const user = userEvent.setup();
    const target = document.createElement('div');
    render(
      <ToriProvider theme="dark" target={target}>
        <ThemeReader />
      </ToriProvider>,
    );
    expect(target).toHaveAttribute('data-theme', 'dark');

    await user.click(screen.getByRole('button'));
    expect(target).toHaveAttribute('data-theme', 'light');
    expect(screen.getByRole('button')).toHaveTextContent('current: light');
  });

  it('useTheme throws outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeReader />)).toThrow('useTheme must be used within <ToriProvider>');
    spy.mockRestore();
  });
});
