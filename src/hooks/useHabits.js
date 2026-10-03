import { useState, useCallback, useEffect } from 'react';
import { loadHabits, saveHabits } from '../utils/storage';
import { todayStr } from '../utils/dates';

export function useHabits() {
  const [habits, setHabits] = useState(() => loadHabits());

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addHabit = useCallback((habit) => {
    const newHabit = {
      id: crypto.randomUUID(),
      name: habit.name,
      icon: habit.icon || '🎯',
      color: habit.color || '#3B82F6',
      category: habit.category || 'custom',
      frequency: habit.frequency || 'daily',
      createdAt: todayStr(),
      completions: {},
      archived: false,
    };
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  }, []);

  const toggleCompletion = useCallback((habitId, dateStr) => {
    const date = dateStr || todayStr();
    setHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? { ...h, completions: { ...h.completions, [date]: !h.completions[date] } }
          : h
      )
    );
  }, []);

  const updateHabit = useCallback((habitId, updates) => {
    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, ...updates } : h))
    );
  }, []);

  const deleteHabit = useCallback((habitId) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
  }, []);

  const archiveHabit = useCallback((habitId) => {
    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, archived: !h.archived } : h))
    );
  }, []);

  const replaceAll = useCallback((newHabits) => {
    setHabits(newHabits);
  }, []);

  const activeHabits = habits.filter(h => !h.archived);
  const archivedHabits = habits.filter(h => h.archived);

  return {
    habits,
    activeHabits,
    archivedHabits,
    addHabit,
    toggleCompletion,
    updateHabit,
    deleteHabit,
    archiveHabit,
    replaceAll,
  };
}
