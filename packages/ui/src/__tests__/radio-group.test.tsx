import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioGroup } from '../components/radio-group';

function renderGroup(props: React.ComponentProps<typeof RadioGroup> = {}) {
  return render(
    <RadioGroup aria-label="Plan" {...props}>
      <Radio value="free" label="Free" />
      <Radio value="pro" label="Pro" description="Best value" />
      <Radio value="team" label="Team" />
    </RadioGroup>,
  );
}

describe('RadioGroup', () => {
  it('exposes a radiogroup with selectable radios', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderGroup({ onValueChange });

    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    const pro = screen.getByRole('radio', { name: /Pro/ });
    await user.click(pro);
    expect(pro).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('pro');
  });

  it('moves selection with arrow keys (native radio behavior)', async () => {
    const user = userEvent.setup();
    renderGroup({ defaultValue: 'free' });

    screen.getByRole('radio', { name: 'Free' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: /Pro/ })).toBeChecked();
  });

  it('shares a single name across radios', () => {
    renderGroup();
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    const names = new Set(radios.map((r) => r.name));
    expect(names.size).toBe(1);
  });

  it('disables all radios when the group is disabled', () => {
    renderGroup({ disabled: true });
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled();
    }
  });

  it('throws when Radio is used outside RadioGroup', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Radio value="x" label="X" />)).toThrow(
      '<Radio> must be used within <RadioGroup>',
    );
    spy.mockRestore();
  });
});
