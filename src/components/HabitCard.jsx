import { useState, useRef } from 'react';
import { todayStr, getStreak } from '../utils/dates';

export default function HabitCard({ habit, onToggle, onEdit }) {
  const [confetti, setConfetti] = useState([]);
  const checkRef = useRef(null);

  const today = todayStr();
  const isDone = !!habit.completions[today];
  const streak = getStreak(habit.completions, habit.frequency);

  const handleToggle = () => {
    if (!isDone) {
      const pieces = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 40 - 20,
        y: -(Math.random() * 30 + 20),
        color: ['#F0B429', '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#EC4899'][i % 6],
        delay: Math.random() * 0.2,
      }));
      setConfetti(pieces);
      setTimeout(() => setConfetti([]), 900);
    }
    onToggle(habit.id);
  };

  return (
    <div
      className={`relative flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
        isDone
          ? 'bg-gray-100 dark:bg-gray-800/50'
          : 'bg-white dark:bg-gray-900 shadow-sm'
      }`}
      style={{ borderLeft: `4px solid ${habit.color}` }}
    >
      <button
        ref={checkRef}
        onClick={handleToggle}
        className="relative flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200"
        style={{
          borderColor: habit.color,
          backgroundColor: isDone ? habit.color : 'transparent',
        }}
      >
        {isDone && (
          <svg className="w-5 h-5 text-white animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
        {!isDone && (
          <div className="absolute inset-0 rounded-full" style={{ borderColor: habit.color }} />
        )}
        {confetti.map((p) => (
          <span
            key={p.id}
            className="confetti-piece animate-confetti"
            style={{
              backgroundColor: p.color,
              left: `calc(50% + ${p.x}px)`,
              top: `calc(50% + ${p.y}px)`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </button>

      <div className="flex-1 min-w-0" onClick={handleToggle}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{habit.icon}</span>
          <span className={`font-medium truncate ${isDone ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
            {habit.name}
          </span>
        </div>
        {streak > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            <span className={streak >= 7 ? 'animate-fire inline-block' : ''}>{streak} 🔥</span>
          </p>
        )}
      </div>

      <button
        onClick={() => onEdit(habit)}
        className="flex-shrink-0 p-2 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
        </svg>
      </button>
    </div>
  );
}
