import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/accordion';

function items() {
  return (
    <>
      <AccordionItem value="a">
        <AccordionTrigger>Section A</AccordionTrigger>
        <AccordionContent>Panel A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Section B</AccordionTrigger>
        <AccordionContent>Panel B</AccordionContent>
      </AccordionItem>
    </>
  );
}

describe('Accordion', () => {
  it('wires aria-expanded/controls and toggles a panel', async () => {
    const user = userEvent.setup();
    render(<Accordion>{items()}</Accordion>);

    const triggerA = screen.getByRole('button', { name: 'Section A' });
    expect(triggerA).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Panel A').closest('[role="region"]')).not.toBeVisible();

    await user.click(triggerA);
    expect(triggerA).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Panel A')).toBeVisible();
    expect(triggerA).toHaveAttribute('aria-controls', screen.getByText('Panel A').closest('[role="region"]')!.id);
  });

  it('single mode keeps only one open', async () => {
    const user = userEvent.setup();
    render(<Accordion defaultValue="a">{items()}</Accordion>);

    expect(screen.getByText('Panel A')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Section B' }));
    expect(screen.getByText('Panel B')).toBeVisible();
    expect(screen.getByText('Panel A').closest('[role="region"]')).not.toBeVisible();
  });

  it('single collapsible closes on re-click; non-collapsible stays open', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Accordion defaultValue="a">{items()}</Accordion>);
    await user.click(screen.getByRole('button', { name: 'Section A' }));
    expect(screen.getByText('Panel A').closest('[role="region"]')).not.toBeVisible();

    rerender(
      <Accordion defaultValue="a" collapsible={false}>
        {items()}
      </Accordion>,
    );
    await user.click(screen.getByRole('button', { name: 'Section A' }));
    expect(screen.getByText('Panel A')).toBeVisible();
  });

  it('multiple mode allows several open at once', async () => {
    const user = userEvent.setup();
    render(<Accordion type="multiple">{items()}</Accordion>);

    await user.click(screen.getByRole('button', { name: 'Section A' }));
    await user.click(screen.getByRole('button', { name: 'Section B' }));
    expect(screen.getByText('Panel A')).toBeVisible();
    expect(screen.getByText('Panel B')).toBeVisible();
  });
});
