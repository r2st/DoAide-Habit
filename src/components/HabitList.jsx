import { useState } from 'react';
import HabitCard from './HabitCard';
import AddHabitModal from './AddHabitModal';
import { todayStr, dayOfWeek } from '../utils/dates';
import { CATEGORIES } from '../utils/presets';

export default function HabitList({ habits, toggleCompletion, addHabit, updateHabit, deleteHabit, archiveHabit }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editHabit, setEditHabit] = useState(null);

  const today = todayStr();
  const dow = dayOfWeek(today);

  const scheduled = habits.filter((h) => {
    if (h.frequency === 'daily') return true;
    if (Array.isArray(h.frequency)) return h.frequency.includes(dow);
    return true;
  });

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = scheduled.filter((h) => h.category === cat.id);
    if (items.length > 0) acc.push({ ...cat, habits: items });
    return acc;
  }, []);

  const uncategorized = scheduled.filter((h) => !CATEGORIES.some((c) => c.id === h.category));
  if (uncategorized.length > 0) {
    grouped.push({ id: 'other', name: 'Other', emoji: '📌', habits: uncategorized });
  }

  const handleSave = (data) => {
    if (data.id) {
      updateHabit(data.id, data);
    } else {
      addHabit(data);
    }
    setModalOpen(false);
    setEditHabit(null);
  };

  const handleEdit = (habit) => {
    setEditHabit(habit);
    setModalOpen(true);
  };

  const handleDelete = (habitId) => {
    deleteHabit(habitId);
    setModalOpen(false);
    setEditHabit(null);
  };

  const handleArchive = (habitId) => {
    archiveHabit(habitId);
    setModalOpen(false);
    setEditHabit(null);
  };

  return (
    <div className="py-4 animate-fade-in">
      {scheduled.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">🌱</p>
          <h2 className="text-xl font-semibold mb-2">Start building habits</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add your first habit and begin your streak!
          </p>
          <button
            onClick={() => { setEditHabit(null); setModalOpen(true); }}
            className="bg-gold hover:bg-gold-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Add Your First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.id}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 px-1">
                {group.emoji} {group.name}
              </h3>
              <div className="space-y-2">
                {group.habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleCompletion}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => { setEditHabit(null); setModalOpen(true); }}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gold hover:bg-gold-dark text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-light transition-all hover:scale-110 active:scale-95 z-30"
      >
        +
      </button>

      <AddHabitModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditHabit(null); }}
        onSave={handleSave}
        onDelete={editHabit ? () => handleDelete(editHabit.id) : undefined}
        onArchive={editHabit ? () => handleArchive(editHabit.id) : undefined}
        editHabit={editHabit}
      />
    </div>
  );
}
