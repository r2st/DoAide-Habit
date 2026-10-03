import { useState, useEffect } from 'react';
import { useHabits } from './hooks/useHabits';
import { useTheme } from './hooks/useTheme';
import { useNotifications } from './hooks/useNotifications';
import Header from './components/Header';
import HabitList from './components/HabitList';
import WeeklyView from './components/WeeklyView';
import StatsView from './components/StatsView';
import CalendarHeatmap from './components/CalendarHeatmap';
import Settings from './components/Settings';
import { todayStr } from './utils/dates';

const TABS = [
  { id: 'today', label: 'Today', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'week', label: 'Week', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'stats', label: 'Stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'calendar', label: 'Calendar', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const habitStore = useHabits();
  const { theme, setTheme } = useTheme();
  const notifications = useNotifications();

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const idx = parseInt(e.key);
      if (idx >= 1 && idx <= 5) {
        setActiveTab(TABS[idx - 1].id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const renderView = () => {
    switch (activeTab) {
      case 'today':
        return (
          <HabitList
            habits={habitStore.activeHabits}
            toggleCompletion={habitStore.toggleCompletion}
            addHabit={habitStore.addHabit}
            updateHabit={habitStore.updateHabit}
            deleteHabit={habitStore.deleteHabit}
            archiveHabit={habitStore.archiveHabit}
          />
        );
      case 'week':
        return (
          <WeeklyView
            habits={habitStore.activeHabits}
            toggleCompletion={habitStore.toggleCompletion}
          />
        );
      case 'stats':
        return <StatsView habits={habitStore.activeHabits} />;
      case 'calendar':
        return <CalendarHeatmap habits={habitStore.activeHabits} />;
      case 'settings':
        return (
          <Settings
            theme={theme}
            setTheme={setTheme}
            habits={habitStore.habits}
            replaceAll={habitStore.replaceAll}
            notifications={notifications}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header habits={habitStore.activeHabits} today={todayStr()} />

      <main className="flex-1 overflow-y-auto pb-20 px-4 max-w-lg mx-auto w-full">
        {renderView()}
      </main>

      <nav className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-pb z-40">
        <div className="flex justify-around items-center max-w-lg mx-auto h-16">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-gold'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
