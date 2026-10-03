import { useState, useRef } from 'react';
import { exportData, importData } from '../utils/storage';

export default function Settings({ theme, setTheme, habits, replaceAll, notifications }) {
  const [toast, setToast] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const fileRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    exportData(habits);
    showToast('Backup downloaded!');
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importData(file);
      replaceAll(imported);
      showToast(`Imported ${imported.length} habits!`);
    } catch (err) {
      showToast(err.message, 'error');
    }
    e.target.value = '';
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000);
      return;
    }
    replaceAll([]);
    setConfirmClear(false);
    showToast('All data cleared');
  };

  const themes = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className="py-4 space-y-6 animate-fade-in">
      <section>
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Theme</h3>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex-1 py-3 rounded-xl font-medium text-sm transition ${
                theme === t.id
                  ? 'bg-gold text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 shadow-sm'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Notifications</h3>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Daily Reminder</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Get reminded at 9:00 AM</p>
            </div>
            <button
              onClick={notifications.toggle}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                notifications.enabled ? 'bg-gold' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  notifications.enabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
          {notifications.permission === 'denied' && (
            <p className="text-xs text-red-400 mt-2">Notifications blocked. Enable in browser settings.</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Data</h3>
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <span className="text-lg">📤</span>
            <div>
              <p className="font-medium text-sm">Export Backup</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Download your habits as JSON</p>
            </div>
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <span className="text-lg">📥</span>
            <div>
              <p className="font-medium text-sm">Import Backup</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Restore from a JSON file</p>
            </div>
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Keyboard Shortcuts</h3>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm text-sm space-y-2">
          {[
            ['1–5', 'Switch tabs'],
            ['Esc', 'Close modals'],
          ].map(([key, desc]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">{desc}</span>
              <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">{key}</kbd>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">Danger Zone</h3>
        <button
          onClick={handleClear}
          className={`w-full py-3 rounded-xl font-medium text-sm transition ${
            confirmClear
              ? 'bg-red-500 text-white'
              : 'bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30'
          }`}
        >
          {confirmClear ? 'Tap again to confirm' : 'Clear All Data'}
        </button>
      </section>

      <section className="text-center pb-8">
        <h1 className="text-lg font-bold">
          DoAide <span className="italic text-gold">Habit</span>
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Free habit tracker. No login required.
          <br />Your data stays on your device.
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">v1.0.0</p>
      </section>

      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium z-50 animate-fade-in ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
