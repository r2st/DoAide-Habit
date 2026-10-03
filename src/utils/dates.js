export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function dayOfWeek(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay();
}

export function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function getWeekDates(offset = 0) {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7) + offset * 7);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export function getStreak(completions, frequency) {
  let streak = 0;
  const today = new Date();
  const d = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = d.toISOString().slice(0, 10);
    const dow = d.getDay();

    if (frequency === 'daily' || (Array.isArray(frequency) && frequency.includes(dow))) {
      if (completions[dateStr]) {
        streak++;
      } else if (i > 0) {
        break;
      } else {
        // today not done yet — check from yesterday
      }
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function getLongestStreak(completions, frequency) {
  const dates = Object.keys(completions).filter(d => completions[d]).sort();
  if (dates.length === 0) return 0;

  let longest = 0;
  let current = 0;
  const allDates = [];
  const start = new Date(dates[0] + 'T00:00:00');
  const end = new Date();

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    allDates.push(d.toISOString().slice(0, 10));
  }

  for (const dateStr of allDates) {
    const dow = new Date(dateStr + 'T00:00:00').getDay();
    const isScheduled = frequency === 'daily' || (Array.isArray(frequency) && frequency.includes(dow));

    if (!isScheduled) continue;

    if (completions[dateStr]) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

export function getCompletionRate(completions, frequency, createdAt) {
  const start = new Date(createdAt + 'T00:00:00');
  const end = new Date();
  let scheduled = 0;
  let completed = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    const isScheduled = frequency === 'daily' || (Array.isArray(frequency) && frequency.includes(dow));
    if (isScheduled) {
      scheduled++;
      if (completions[dateStr]) completed++;
    }
  }

  return scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
}

export function getWeeklyData(completions, frequency, weeks = 8) {
  const data = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const weekDates = getWeekDates(-w);
    let done = 0;
    let total = 0;
    for (const dateStr of weekDates) {
      const dow = new Date(dateStr + 'T00:00:00').getDay();
      const isScheduled = frequency === 'daily' || (Array.isArray(frequency) && frequency.includes(dow));
      if (isScheduled) {
        total++;
        if (completions[dateStr]) done++;
      }
    }
    const label = new Date(weekDates[0] + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    data.push({ week: label, rate: total > 0 ? Math.round((done / total) * 100) : 0 });
  }
  return data;
}

export function getHeatmapData(completions, months = 6) {
  const data = [];
  const end = new Date();
  const start = new Date(end);
  start.setMonth(start.getMonth() - months);
  start.setDate(start.getDate() - start.getDay());

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    data.push({ date: dateStr, count: completions[dateStr] ? 1 : 0 });
  }
  return data;
}

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_LABELS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
