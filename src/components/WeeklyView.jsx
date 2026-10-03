import { useState, useMemo } from 'react';
import { getWeekDates, todayStr, DAY_LABELS_SHORT } from '../utils/dates';

export default function WeeklyView({ habits, toggleCompletion }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = todayStr();
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  const weekLabel = useMemo(() => {
    const start = new Date(weekDates[0] + 'T00:00:00');
    const end = new Date(weekDates[6] + 'T00:00:00');
    const opts = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', opts)} — ${end.toLocaleDateString('en-US', opts)}`;
  }, [weekDates]);

  return (
    <div className="py-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Weekly</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">{weekLabel}</p>
        </div>
        <button
          onClick={() => setWeekOffset((w) => Math.min(w + 1, 0))}
          disabled={weekOffset >= 0}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[360px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-400 dark:text-gray-500 pb-2 pr-3 w-32" />
              {weekDates.map((date, i) => (
                <th key={date} className="pb-2 text-center w-10">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                    {DAY_LABELS_SHORT[new Date(date + 'T00:00:00').getDay()]}
                  </span>
                  <br />
                  <span className={`text-xs font-semibold ${date === today ? 'text-gold' : 'text-gray-600 dark:text-gray-300'}`}>
                    {new Date(date + 'T00:00:00').getDate()}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">{habit.icon}</span>
                    <span className="text-sm font-medium truncate">{habit.name}</span>
                  </div>
                </td>
                {weekDates.map((date) => {
                  const dow = new Date(date + 'T00:00:00').getDay();
                  const isScheduled = habit.frequency === 'daily' || (Array.isArray(habit.frequency) && habit.frequency.includes(dow));
                  const isDone = !!habit.completions[date];
                  const isToday = date === today;

                  return (
                    <td key={date} className="py-2 text-center">
                      {isScheduled ? (
                        <button
                          onClick={() => toggleCompletion(habit.id, date)}
                          className={`w-8 h-8 rounded-full border-2 mx-auto flex items-center justify-center transition-all ${
                            isToday ? 'ring-2 ring-gold/30' : ''
                          }`}
                          style={{
                            borderColor: isDone ? habit.color : isScheduled ? `${habit.color}40` : '#e5e7eb',
                            backgroundColor: isDone ? habit.color : 'transparent',
                          }}
                        >
                          {isDone && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ) : (
                        <div className="w-8 h-8 rounded-full mx-auto bg-gray-50 dark:bg-gray-900" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-4xl mb-3">📅</p>
          <p>No habits yet. Add some to see them here!</p>
        </div>
      )}
    </div>
  );
}
