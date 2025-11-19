'use client'

import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const current = theme === 'system' ? resolvedTheme : theme;

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded text-white"
    >
      {current === 'dark' ? 'Dark🌙' : 'Light☀️'}
    </button>
  );
}