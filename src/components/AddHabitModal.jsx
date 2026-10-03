import { useState, useEffect } from 'react';
import { CATEGORIES, PRESET_HABITS, HABIT_COLORS, EMOJI_OPTIONS } from '../utils/presets';
import { DAY_LABELS } from '../utils/dates';

export default function AddHabitModal({ isOpen, onClose, onSave, onDelete, onArchive, editHabit }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [color, setColor] = useState('#3B82F6');
  const [category, setCategory] = useState('custom');
  const [freqType, setFreqType] = useState('daily');
  const [customDays, setCustomDays] = useState([1, 2, 3, 4, 5]);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (editHabit) {
      setName(editHabit.name);
      setIcon(editHabit.icon);
      setColor(editHabit.color);
      setCategory(editHabit.category);
      if (editHabit.frequency === 'daily') {
        setFreqType('daily');
      } else if (Array.isArray(editHabit.frequency)) {
        const isWeekdays = editHabit.frequency.length === 5 && [1,2,3,4,5].every(d => editHabit.frequency.includes(d));
        setFreqType(isWeekdays ? 'weekdays' : 'custom');
        setCustomDays(editHabit.frequency);
      }
    } else {
      setName('');
      setIcon('🎯');
      setColor('#3B82F6');
      setCategory('custom');
      setFreqType('daily');
      setCustomDays([1, 2, 3, 4, 5]);
    }
    setShowDelete(false);
  }, [editHabit, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const frequency = freqType === 'daily' ? 'daily' : freqType === 'weekdays' ? [1,2,3,4,5] : customDays;
    onSave({
      ...(editHabit ? { id: editHabit.id } : {}),
      name: name.trim(),
      icon,
      color,
      category,
      frequency,
    });
  };

  const applyPreset = (preset) => {
    setName(preset.name);
    setIcon(preset.icon);
    setColor(preset.color);
    setCategory(preset.category);
  };

  const toggleDay = (day) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editHabit ? 'Edit Habit' : 'New Habit'}</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink water"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-gold outline-none transition"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Icon</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`w-10 h-10 text-xl rounded-lg flex items-center justify-center transition ${
                    icon === emoji ? 'bg-gold/20 ring-2 ring-gold' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Color</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c, ringColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    category === cat.id
                      ? 'bg-gold text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Frequency</label>
            <div className="mt-2 flex gap-2">
              {['daily', 'weekdays', 'custom'].map((ft) => (
                <button
                  key={ft}
                  type="button"
                  onClick={() => setFreqType(ft)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition ${
                    freqType === ft
                      ? 'bg-gold text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {ft}
                </button>
              ))}
            </div>
            {freqType === 'custom' && (
              <div className="mt-3 flex gap-1.5">
                {DAY_LABELS.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`w-9 h-9 rounded-full text-xs font-medium transition ${
                      customDays.includes(i)
                        ? 'bg-gold text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}
                  >
                    {label.charAt(0)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!editHabit && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Quick Add</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {PRESET_HABITS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    {preset.icon} {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-gold hover:bg-gold-dark disabled:opacity-40 text-white font-semibold rounded-xl transition-colors"
          >
            {editHabit ? 'Save Changes' : 'Add Habit'}
          </button>

          {editHabit && (
            <div className="flex gap-3">
              {onArchive && (
                <button type="button" onClick={onArchive} className="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl transition">
                  {editHabit.archived ? 'Unarchive' : 'Archive'}
                </button>
              )}
              {onDelete && !showDelete && (
                <button type="button" onClick={() => setShowDelete(true)} className="flex-1 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl transition">
                  Delete
                </button>
              )}
              {onDelete && showDelete && (
                <button type="button" onClick={onDelete} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition">
                  Confirm Delete
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
