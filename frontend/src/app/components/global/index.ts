/**
 * Global component barrel
 *
 * Import anything app-wide from this single entry point:
 *
 *   import { PageHeader, Section, ThemeToggle, useTheme } from '@/app/components/global';
 *
 * What lives here
 * ───────────────
 *  ThemeToggle    — dark / light toggle button
 *  PageHeader     — consistent top-of-page heading + actions
 *  Section        — labelled content block within a page
 *  AppShell       — full authenticated-page layout shell
 *  useTheme       — hook: { isDark, toggleTheme, theme, setTheme }
 *  ThemeProvider  — wrap the app root to enable theme switching
 */

export { ThemeToggle } from './ThemeToggle';
export { PageHeader, Section } from './PageHeader';

// Re-export from the components layer for convenience
export { AppShell } from '../AppShell';

// Re-export theme context
export { useTheme, ThemeProvider } from '../../context/ThemeContext';
