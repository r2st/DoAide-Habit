export function generateStreakText(habitName, streak) {
  return `${streak} day streak on ${habitName}! 🔥\n\nTracking my habits with DoAide Habit — free, no login required.\nhttps://habit.doaide.com`;
}

export function shareToWhatsApp(text) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

export function shareToTwitter(text) {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export async function shareNative(text, title = 'My Habit Streak') {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function generateShareCard(habit, streak, longestStreak, completionRate) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(0, 0, 600, 340, 20);
  ctx.fill();

  ctx.fillStyle = habit.color || '#F0B429';
  ctx.beginPath();
  ctx.roundRect(0, 0, 600, 6, [20, 20, 0, 0]);
  ctx.fill();

  ctx.font = '40px sans-serif';
  ctx.fillText(habit.icon, 30, 65);

  ctx.fillStyle = '#F9FAFB';
  ctx.font = 'bold 28px Inter, sans-serif';
  ctx.fillText(habit.name, 80, 62);

  ctx.fillStyle = '#F0B429';
  ctx.font = 'bold 72px Inter, sans-serif';
  ctx.fillText(`${streak}`, 30, 170);

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '24px Inter, sans-serif';
  ctx.fillText('day streak 🔥', 30 + ctx.measureText(`${streak}`).width + 12, 170);

  ctx.fillStyle = '#6B7280';
  ctx.font = '18px Inter, sans-serif';
  ctx.fillText(`Best: ${longestStreak} days`, 30, 220);
  ctx.fillText(`Completion: ${completionRate}%`, 30, 250);

  ctx.fillStyle = '#4B5563';
  ctx.font = '16px Inter, sans-serif';
  ctx.fillText('habit.doaide.com', 30, 310);

  ctx.fillStyle = '#F0B429';
  ctx.font = 'italic bold 16px Inter, sans-serif';
  ctx.fillText('DoAide Habit', 440, 310);

  return canvas.toDataURL('image/png');
}
