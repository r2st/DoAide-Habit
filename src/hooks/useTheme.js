import { useState, useEffect, useCallback } from 'react';
import { loadTheme, saveTheme } from '../utils/storage';

export function useTheme() {
  const [theme, setThemeState] = useState(() => loadTheme());

  const applyTheme = useCallback((t) => {
    const root = document.documentElement;
    if (t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme, applyTheme]);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    saveTheme(t);
  }, []);

  return { theme, setTheme };
}
