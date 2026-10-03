import { useState, useEffect } from 'react';
import { getStreak, getLongestStreak, getCompletionRate } from '../utils/dates';
import { generateStreakText, shareToWhatsApp, shareToTwitter, copyToClipboard, shareNative, generateShareCard } from '../utils/share';

export default function ShareModal({ isOpen, onClose, habit }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !habit) return null;

  const streak = getStreak(habit.completions, habit.frequency);
  const longest = getLongestStreak(habit.completions, habit.frequency);
  const rate = getCompletionRate(habit.completions, habit.frequency, habit.createdAt);
  const text = generateStreakText(habit.name, streak);

  const handleNativeShare = async () => {
    const shared = await shareNative(text);
    if (!shared) {
      await handleCopy();
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = () => {
    const dataUrl = generateShareCard(habit, streak, longest, rate);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${habit.name}-streak-${streak}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full sm:max-w-sm bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl animate-slide-up p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Share Your Streak</h3>

        <div className="bg-gray-900 rounded-xl p-4 mb-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{habit.icon}</span>
            <span className="font-semibold">{habit.name}</span>
          </div>
          <p className="text-4xl font-bold">
            {streak} <span className="text-xl animate-fire inline-block">🔥</span>
          </p>
          <p className="text-sm text-gray-400 mt-1">day streak</p>
          <div className="flex gap-4 mt-3 text-xs text-gray-400">
            <span>Best: {longest} days</span>
            <span>Rate: {rate}%</span>
          </div>
          <p className="text-[10px] text-gray-600 mt-3 italic">habit.doaide.com</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="col-span-2 flex items-center justify-center gap-2 py-3 bg-gold hover:bg-gold-dark text-white font-medium rounded-xl transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Share
            </button>
          )}
          <button
            onClick={() => shareToWhatsApp(text)}
            className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition"
          >
            WhatsApp
          </button>
          <button
            onClick={() => shareToTwitter(text)}
            className="flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition"
          >
            X / Twitter
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium rounded-xl transition"
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handleDownloadCard}
            className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium rounded-xl transition"
          >
            Download
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
