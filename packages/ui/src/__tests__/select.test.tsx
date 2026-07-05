import { describe, expect, it, vi } from 'vitest';
import type * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../components/select';

function renderSelect(props: React.ComponentProps<typeof Select> = {}) {
  return render(
    <Select label="Fruit" placeholder="Pick one" {...props}>
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
    </Select>,
  );
}

describe('Select', () => {
  it('associates the label and selects options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSelect({ onChange });

    const select = screen.getByLabelText('Fruit');
    await user.selectOptions(select, 'banana');
    expect(select).toHaveValue('banana');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('starts on the placeholder option when uncontrolled', () => {
    renderSelect();
    const select = screen.getByLabelText('Fruit') as HTMLSelectElement;
    expect(select).toHaveValue('');
    // The placeholder is a hidden disabled option, invisible to the a11y tree.
    const placeholder = select.options[0]!;
    expect(placeholder).toBeDisabled();
    expect(placeholder).toHaveTextContent('Pick one');
  });

  it('renders the error state with aria-invalid and an alert', () => {
    renderSelect({ error: 'Required' });
    expect(screen.getByLabelText('Fruit')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
});
