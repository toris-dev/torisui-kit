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
        <TabsTrigger value="api">API</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="usage">Usage panel</TabsContent>
      <TabsContent value="api">API panel</TabsContent>
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

  it('moves selection with arrow keys, wrapping at both ends', async () => {
    const user = userEvent.setup();
    renderTabs();

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'API' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('supports Home and End keys', async () => {
    const user = userEvent.setup();
    renderTabs();

    screen.getByRole('tab', { name: 'Usage' }).focus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'API' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('skips disabled tabs during keyboard navigation', async () => {
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
        <TabsContent value="a">A panel</TabsContent>
        <TabsContent value="c">C panel</TabsContent>
      </Tabs>,
    );

    screen.getByRole('tab', { name: 'A' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'C' })).toHaveFocus();
  });

  it('keeps the tablist keyboard-reachable when nothing is selected', () => {
    render(
      <Tabs>
        <TabsList aria-label="S">
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
      </Tabs>,
    );
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('tabindex', '0');
  });

  it('produces id-safe aria-controls for values with spaces', () => {
    render(
      <Tabs defaultValue="my tab">
        <TabsList aria-label="S">
          <TabsTrigger value="my tab">My Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="my tab">Panel</TabsContent>
      </Tabs>,
    );
    const trigger = screen.getByRole('tab', { name: 'My Tab' });
    const controls = trigger.getAttribute('aria-controls')!;
    expect(controls).not.toContain(' ');
    expect(document.getElementById(controls)).toHaveTextContent('Panel');
  });
});
