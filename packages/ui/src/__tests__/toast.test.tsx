import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ToastApi } from '../components/toast';
import { ToastProvider, useToast } from '../components/toast';

function Demo() {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast.success('Saved!')}>
      Trigger
    </button>
  );
}

let api: ToastApi;
function GrabApi() {
  api = useToast().toast;
  return null;
}

describe('Toast', () => {
  it('publishes a toast via useToast and dismisses it', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Trigger' }));
    expect(screen.getByText('Saved!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
  });

  it('throws when useToast is used without a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Demo />)).toThrow('useToast must be used within <ToriProvider>');
    spy.mockRestore();
  });

  describe('timers', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('auto-dismisses after the default duration', () => {
      render(
        <ToastProvider>
          <GrabApi />
        </ToastProvider>,
      );
      act(() => {
        api.success('Done');
      });
      expect(screen.getByText('Done')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.queryByText('Done')).not.toBeInTheDocument();
    });

    it('keeps duration 0 toasts until dismissed manually', () => {
      render(
        <ToastProvider>
          <GrabApi />
        </ToastProvider>,
      );
      act(() => {
        api({ title: 'Pinned', duration: 0 });
      });
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      expect(screen.getByText('Pinned')).toBeInTheDocument();
    });

    it('does not restart existing timers when other toasts are published', () => {
      render(
        <ToastProvider>
          <GrabApi />
        </ToastProvider>,
      );
      act(() => {
        api.success('First');
      });
      act(() => {
        vi.advanceTimersByTime(3500);
      });
      // A new toast must not reset First's remaining 500ms.
      act(() => {
        api.success('Second');
      });
      act(() => {
        vi.advanceTimersByTime(600);
      });
      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('evicts oldest dismissible toasts first, keeping persistent ones', () => {
      render(
        <ToastProvider limit={2}>
          <GrabApi />
        </ToastProvider>,
      );
      act(() => {
        api({ title: 'Pending', duration: 0 });
        api.success('A');
        api.success('B');
      });
      // Limit 2: 'A' (oldest dismissible) is evicted, persistent stays.
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });

  describe('promise', () => {
    it('updates the loading toast on success', async () => {
      render(
        <ToastProvider>
          <GrabApi />
        </ToastProvider>,
      );
      let resolve!: (v: string) => void;
      const pending = new Promise<string>((r) => {
        resolve = r;
      });

      let result: Promise<string>;
      act(() => {
        result = api.promise(pending, {
          loading: 'Deploying…',
          success: (v) => `Deployed ${v}`,
          error: 'Failed',
        });
      });
      expect(screen.getByText('Deploying…')).toBeInTheDocument();

      await act(async () => {
        resolve('v1');
        await result;
      });
      expect(screen.getByText('Deployed v1')).toBeInTheDocument();
      expect(screen.queryByText('Deploying…')).not.toBeInTheDocument();
    });

    it('shows the error toast and rethrows on rejection', async () => {
      render(
        <ToastProvider>
          <GrabApi />
        </ToastProvider>,
      );
      const failure = new Error('boom');

      let result: Promise<never> | undefined;
      act(() => {
        result = api.promise(Promise.reject(failure), {
          loading: 'Working…',
          success: 'Done',
          error: (e) => `Failed: ${(e as Error).message}`,
        }) as Promise<never>;
        result.catch(() => undefined);
      });

      await expect(result).rejects.toBe(failure);
      expect(await screen.findByText('Failed: boom')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
