import { useState, useMemo } from 'react';

export default function CalendarHeatmap({ habits }) {
  const [selectedId, setSelectedId] = useState('all');
  const [tooltip, setTooltip] = useState(null);

  const data = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setMonth(start.getMonth() - 5);
    start.setDate(start.getDate() - start.getDay());

    const cells = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      let count = 0;
      let total = 0;

      if (selectedId === 'all') {
        habits.forEach((h) => {
          const dow = new Date(dateStr + 'T00:00:00').getDay();
          const isScheduled = h.frequency === 'daily' || (Array.isArray(h.frequency) && h.frequency.includes(dow));
          if (isScheduled) {
            total++;
            if (h.completions[dateStr]) count++;
          }
        });
      } else {
        const habit = habits.find((h) => h.id === selectedId);
        if (habit) {
          const dow = new Date(dateStr + 'T00:00:00').getDay();
          const isScheduled = habit.frequency === 'daily' || (Array.isArray(habit.frequency) && habit.frequency.includes(dow));
          if (isScheduled) {
            total = 1;
            if (habit.completions[dateStr]) count = 1;
          }
        }
      }

      cells.push({ date: dateStr, count, total, dow: new Date(dateStr + 'T00:00:00').getDay() });
    }
    return cells;
  }, [habits, selectedId]);

  const weeks = useMemo(() => {
    const w = [];
    let current = [];
    data.forEach((cell, i) => {
      current.push(cell);
      if (current.length === 7) {
        w.push(current);
        current = [];
      }
    });
    if (current.length > 0) w.push(current);
    return w;
  }, [data]);

  const months = useMemo(() => {
    const m = [];
    let last = '';
    weeks.forEach((week, i) => {
      const first = week[0];
      if (first) {
        const month = new Date(first.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' });
        if (month !== last) {
          m.push({ label: month, col: i });
          last = month;
        }
      }
    });
    return m;
  }, [weeks]);

  const selectedHabit = habits.find((h) => h.id === selectedId);
  const baseColor = selectedHabit?.color || '#F0B429';

  const getCellColor = (cell) => {
    if (cell.total === 0) return 'bg-gray-100 dark:bg-gray-800';
    const ratio = cell.count / cell.total;
    if (ratio === 0) return 'bg-gray-100 dark:bg-gray-800';
    const opacities = ['20', '40', '70', ''];
    const idx = Math.min(Math.floor(ratio * 4), 3);
    return '';
  };

  const getCellStyle = (cell) => {
    if (cell.total === 0) return {};
    const ratio = cell.count / cell.total;
    if (ratio === 0) return {};
    const opacity = ratio <= 0.25 ? 0.25 : ratio <= 0.5 ? 0.5 : ratio <= 0.75 ? 0.75 : 1;
    return { backgroundColor: baseColor, opacity };
  };

  return (
    <div className="py-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Activity</h2>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="text-sm bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All habits</option>
          {habits.map((h) => (
            <option key={h.id} value={h.id}>{h.icon} {h.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="inline-block">
          <div className="flex gap-0.5 mb-1 pl-8">
            {months.map((m, i) => (
              <span
                key={i}
                className="text-[10px] text-gray-400 dark:text-gray-500"
                style={{ position: 'relative', left: `${m.col * 13}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            <div className="flex flex-col gap-0.5 pr-1">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                <div key={i} className="h-[11px] text-[9px] text-gray-400 dark:text-gray-500 leading-[11px]">
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-0.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((cell, ci) => (
                    <div
                      key={ci}
                      className={`w-[11px] h-[11px] rounded-sm heatmap-cell ${cell.total === 0 || cell.count === 0 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                      style={getCellStyle(cell)}
                      onMouseEnter={() => setTooltip({ date: cell.date, count: cell.count, total: cell.total })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {tooltip && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              {' — '}
              {tooltip.total === 0 ? 'No habits scheduled' : `${tooltip.count}/${tooltip.total} completed`}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-[10px] text-gray-400 dark:text-gray-500">
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((opacity, i) => (
          <div
            key={i}
            className={`w-[11px] h-[11px] rounded-sm ${opacity === 0 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            style={opacity > 0 ? { backgroundColor: baseColor, opacity } : {}}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
