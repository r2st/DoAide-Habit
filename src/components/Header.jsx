import { todayStr } from '../utils/dates';

export default function Header({ habits, today }) {
  const date = new Date(today + 'T00:00:00');
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const scheduledToday = habits.filter((h) => {
    if (h.frequency === 'daily') return true;
    if (Array.isArray(h.frequency)) return h.frequency.includes(date.getDay());
    return true;
  });

  const doneToday = scheduledToday.filter((h) => h.completions[today]).length;

  return (
    <header className="px-4 pt-4 pb-2 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            DoAide <span className="italic text-gold font-bold">Habit</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{formatted}</p>
        </div>
        {scheduledToday.length > 0 && (
          <div className="text-right">
            <p className="text-2xl font-bold">
              {doneToday}<span className="text-gray-400 dark:text-gray-500 text-lg">/{scheduledToday.length}</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">done today</p>
          </div>
        )}
      </div>
      {scheduledToday.length > 0 && (
        <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(doneToday / scheduledToday.length) * 100}%` }}
          />
        </div>
      )}
    </header>
  );
}
