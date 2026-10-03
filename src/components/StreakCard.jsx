import { useState } from 'react';
import { getStreak, getLongestStreak, getCompletionRate } from '../utils/dates';
import ShareModal from './ShareModal';

export default function StreakCard({ habit }) {
  const [shareOpen, setShareOpen] = useState(false);

  const streak = getStreak(habit.completions, habit.frequency);
  const longest = getLongestStreak(habit.completions, habit.frequency);
  const rate = getCompletionRate(habit.completions, habit.frequency, habit.createdAt);

  return (
    <>
      <div
        className="p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm"
        style={{ borderLeft: `4px solid ${habit.color}` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{habit.icon}</span>
            <span className="font-medium">{habit.name}</span>
          </div>
          <button
            onClick={() => setShareOpen(true)}
            className="text-xs px-3 py-1 bg-gold/10 text-gold hover:bg-gold/20 rounded-full font-medium transition"
          >
            Share
          </button>
        </div>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-bold">{streak}</span>
          {streak > 0 && <span className="text-xl animate-fire inline-block">🔥</span>}
          <span className="text-sm text-gray-400 dark:text-gray-500 ml-1">current</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-3">
          <span>Best: {longest}</span>
          <span>Rate: {rate}%</span>
        </div>

        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${rate}%`, backgroundColor: habit.color }}
          />
        </div>
      </div>

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} habit={habit} />
    </>
  );
}
