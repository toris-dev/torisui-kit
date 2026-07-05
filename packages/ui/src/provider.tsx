import * as React from 'react';
import { ToastProvider } from './components/toast';

export type ToriTheme = 'light' | 'dark' | 'system';

export interface ToriThemeContextValue {
  /** Theme as configured ('system' included). */
  theme: ToriTheme;
  /** Theme actually applied to the document ('light' | 'dark'). */
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ToriTheme) => void;
}

const ToriThemeContext = React.createContext<ToriThemeContextValue | null>(null);

export interface ToriProviderProps {
  children?: React.ReactNode;
  /** Initial theme. Defaults to 'system'. */
  theme?: ToriTheme;
  /**
   * Element that receives the `data-theme` attribute.
   * Defaults to `document.documentElement`.
   */
  target?: HTMLElement | null;
}

function resolveSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Root provider for TorisUI. Applies the theme via `data-theme` and
 * mounts the toast system so `useToast()` works anywhere below it.
 */
export function ToriProvider({ children, theme: themeProp = 'system', target }: ToriProviderProps) {
  const [theme, setTheme] = React.useState<ToriTheme>(themeProp);
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>(resolveSystemTheme);

  React.useEffect(() => {
    setTheme(themeProp);
  }, [themeProp]);

  // Track OS color-scheme changes while in 'system' mode.
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => setSystemTheme(event.matches ? 'dark' : 'light');
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  React.useEffect(() => {
    const element = target ?? (typeof document !== 'undefined' ? document.documentElement : null);
    if (!element) return;
    element.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme, target]);

  const value = React.useMemo<ToriThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme],
  );

  return (
    <ToriThemeContext.Provider value={value}>
      <ToastProvider>{children}</ToastProvider>
    </ToriThemeContext.Provider>
  );
}

/** Reads the current theme. Must be used inside `ToriProvider`. */
export function useTheme(): ToriThemeContextValue {
  const context = React.useContext(ToriThemeContext);
  if (!context) throw new Error('useTheme must be used within <ToriProvider>');
  return context;
}
