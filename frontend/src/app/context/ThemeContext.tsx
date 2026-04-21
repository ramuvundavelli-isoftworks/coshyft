import React, { createContext, useContext } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type ThemeValue = 'light' | 'dark' | 'system';

interface ThemeContextType {
  /** The stored preference ('light' | 'dark' | 'system'). */
  theme: ThemeValue;
  /** Set the theme preference. */
  setTheme: (theme: ThemeValue) => void;
  /** The actually rendered theme ('light' | 'dark') — never 'system'. */
  resolvedTheme: 'light' | 'dark' | undefined;
  /** Convenience: true when the active theme is dark. */
  isDark: boolean;
  /** Toggle between light and dark. */
  toggleTheme: () => void;
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

const ThemeContext = createContext<ThemeContextType | null>(null);

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

/** Wraps next-themes and exposes a typed context with a toggleTheme helper. */
function ThemeContextBridge({ children }: { children: React.ReactNode }) {
  const { theme = 'system', setTheme, resolvedTheme } = useNextTheme();
  const isDark = resolvedTheme === 'dark';

  const value: ThemeContextType = {
    theme: theme as ThemeValue,
    setTheme: setTheme as (t: ThemeValue) => void,
    resolvedTheme: resolvedTheme as 'light' | 'dark' | undefined,
    isDark,
    toggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Wrap your app root with this provider.
 * Uses next-themes under the hood — applies `class="dark"` to <html>.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeContextBridge>{children}</ThemeContextBridge>
    </NextThemesProvider>
  );
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

/**
 * Access theme state and controls from any child component.
 *
 * @example
 * const { isDark, toggleTheme } = useTheme();
 */
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
