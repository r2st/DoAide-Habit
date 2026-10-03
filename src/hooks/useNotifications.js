import { useState, useEffect, useCallback } from 'react';

const NOTIF_KEY = 'doaide-habit-notifications';

export function useNotifications() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem(NOTIF_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [permission, setPermission] = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setEnabled(true);
      try { localStorage.setItem(NOTIF_KEY, 'true'); } catch { /* silent */ }
      return true;
    }
    return false;
  }, []);

  const toggle = useCallback(async () => {
    if (enabled) {
      setEnabled(false);
      try { localStorage.setItem(NOTIF_KEY, 'false'); } catch { /* silent */ }
    } else {
      await requestPermission();
    }
  }, [enabled, requestPermission]);

  useEffect(() => {
    if (!enabled || permission !== 'granted') return;

    const checkTime = () => {
      const now = new Date();
      if (now.getHours() === 9 && now.getMinutes() === 0) {
        new Notification('DoAide Habit', {
          body: 'Time to check in on your habits! 🔥',
          icon: '/favicon.svg',
        });
      }
    };

    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [enabled, permission]);

  return { enabled, permission, toggle, requestPermission };
}
