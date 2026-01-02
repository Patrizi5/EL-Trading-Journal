import { useEffect, useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.theme as 'light' | 'dark') || 'dark'
  );

  useEffect(() => {
    localStorage.theme = theme;
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return { theme, toggle };
}
