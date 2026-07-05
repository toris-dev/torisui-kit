import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/tabs';

function renderTabs() {
  return render(
    <Tabs defaultValue="overview">
      <TabsList aria-label="Sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="usage">Usage panel</TabsContent>
    </Tabs>,
  );
}

describe('Tabs', () => {
  it('shows only the selected panel', () => {
    renderTabs();
    expect(screen.getByText('Overview panel')).toBeVisible();
    expect(screen.getByText('Usage panel')).not.toBeVisible();
  });

  it('switches panels on click', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Usage' }));
    expect(screen.getByRole('tab', { name: 'Usage' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Usage panel')).toBeVisible();
  });

  it('moves selection with arrow keys', async () => {
    const user = userEvent.setup();
    renderTabs();

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{ArrowRight}');

    const usage = screen.getByRole('tab', { name: 'Usage' });
    expect(usage).toHaveFocus();
    expect(usage).toHaveAttribute('aria-selected', 'true');

    // Wraps around from the last tab back to the first.
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });
});
