import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface ThemeToggleProps {
  /** Visual variant — defaults to ghost icon button */
  variant?: 'icon' | 'pill';
  className?: string;
}

/**
 * ThemeToggle — switches between light and dark themes.
 *
 * Usage
 * ─────
 *   import { ThemeToggle } from '@/app/components/global';
 *   <ThemeToggle />
 */
export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
          'border border-border bg-background-subtle',
          'hover:bg-muted transition-colors duration-200',
          'text-foreground-subtle',
          className
        )}
      >
        {isDark ? (
          <>
            <Sun className="h-3.5 w-3.5" />
            Light
          </>
        ) : (
          <>
            <Moon className="h-3.5 w-3.5" />
            Dark
          </>
        )}
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={className}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
