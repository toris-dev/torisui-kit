import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from '../components/toggle';
import { ToggleGroup, ToggleGroupItem } from '../components/toggle-group';

describe('Toggle', () => {
  it('toggles aria-pressed when uncontrolled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);
    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('stays in sync when controlled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle pressed={false} onPressedChange={onPressedChange}>
        Italic
      </Toggle>,
    );
    const toggle = screen.getByRole('button', { name: 'Italic' });
    await user.click(toggle);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('ToggleGroup', () => {
  it('single mode keeps one pressed and reports value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup aria-label="Align" onValueChange={onValueChange}>
        <ToggleGroupItem value="left">L</ToggleGroupItem>
        <ToggleGroupItem value="center">C</ToggleGroupItem>
        <ToggleGroupItem value="right">R</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole('button', { name: 'C' }));
    expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith('center');

    await user.click(screen.getByRole('button', { name: 'R' }));
    expect(screen.getByRole('button', { name: 'C' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'R' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('multiple mode allows several pressed', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="multiple" aria-label="Format">
        <ToggleGroupItem value="b">B</ToggleGroupItem>
        <ToggleGroupItem value="i">I</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole('button', { name: 'B' }));
    await user.click(screen.getByRole('button', { name: 'I' }));
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'I' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('roving focus: one tabstop, arrow keys move focus', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup aria-label="Align" defaultValue="left">
        <ToggleGroupItem value="left">L</ToggleGroupItem>
        <ToggleGroupItem value="center">C</ToggleGroupItem>
        <ToggleGroupItem value="right">R</ToggleGroupItem>
      </ToggleGroup>,
    );
    const left = screen.getByRole('button', { name: 'L' });
    const center = screen.getByRole('button', { name: 'C' });
    expect(left).toHaveAttribute('tabindex', '0');
    expect(center).toHaveAttribute('tabindex', '-1');

    left.focus();
    await user.keyboard('{ArrowRight}');
    expect(center).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(left).toHaveFocus();
  });
});
