import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { todayStr, getStreak, getLongestStreak, getCompletionRate, getWeeklyData } from '../utils/dates';
import StreakCard from './StreakCard';

export default function StatsView({ habits }) {
  const today = todayStr();

  const stats = useMemo(() => {
    const scheduled = habits.filter((h) => {
      const dow = new Date(today + 'T00:00:00').getDay();
      return h.frequency === 'daily' || (Array.isArray(h.frequency) && h.frequency.includes(dow));
    });
    const doneToday = scheduled.filter((h) => h.completions[today]).length;

    let bestStreak = 0;
    let bestHabit = '';
    habits.forEach((h) => {
      const s = getStreak(h.completions, h.frequency);
      if (s > bestStreak) {
        bestStreak = s;
        bestHabit = h.icon;
      }
    });

    const avgRate = habits.length > 0
      ? Math.round(habits.reduce((sum, h) => sum + getCompletionRate(h.completions, h.frequency, h.createdAt), 0) / habits.length)
      : 0;

    return { total: habits.length, doneToday, scheduledToday: scheduled.length, bestStreak, bestHabit, avgRate };
  }, [habits, today]);

  const chartData = useMemo(() => {
    if (habits.length === 0) return [];
    const perHabit = habits.map((h) => getWeeklyData(h.completions, h.frequency));
    return perHabit[0].map((_, weekIdx) => {
      const avg = Math.round(perHabit.reduce((sum, hd) => sum + hd[weekIdx].rate, 0) / perHabit.length);
      return { week: perHabit[0][weekIdx].week, rate: avg };
    });
  }, [habits]);

  const sortedHabits = useMemo(() =>
    [...habits].sort((a, b) => getStreak(b.completions, b.frequency) - getStreak(a.completions, a.frequency)),
    [habits]
  );

  if (habits.length === 0) {
    return (
      <div className="py-16 text-center animate-fade-in">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-gray-400 dark:text-gray-500">Add habits to see your stats!</p>
      </div>
    );
  }

  const cards = [
    { label: 'Total Habits', value: stats.total, icon: '🎯' },
    { label: 'Done Today', value: `${stats.doneToday}/${stats.scheduledToday}`, icon: '✅' },
    { label: 'Best Streak', value: `${stats.bestStreak} ${stats.bestHabit}`, icon: '🔥' },
    { label: 'Avg Rate', value: `${stats.avgRate}%`, icon: '📈' },
  ];

  return (
    <div className="py-4 space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{card.icon} {card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Weekly Trend</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F0B429" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F0B429" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="#9CA3AF" axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#9CA3AF" axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17,24,39,0.9)',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`, 'Completion']}
            />
            <Area type="monotone" dataKey="rate" stroke="#F0B429" strokeWidth={2} fill="url(#goldGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Per Habit</h3>
        <div className="space-y-3">
          {sortedHabits.map((habit) => (
            <StreakCard key={habit.id} habit={habit} />
          ))}
        </div>
      </div>
    </div>
  );
}
