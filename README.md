# DoAide Habit

Free habit tracker at [habit.doaide.com](https://habit.doaide.com). No login required — all data stays in your browser.

## Features

- **Daily Check-in** — Toggle habits as done with satisfying animations
- **Streak Tracking** — Current streak, longest streak, fire emoji
- **Calendar Heatmap** — GitHub-style contribution graph
- **Weekly View** — See all habits for the week at a glance
- **Stats Dashboard** — Completion rate, trends, per-habit analytics
- **Categories** — Health, Fitness, Learning, Productivity, Mindfulness, Custom
- **Themes** — Light, Dark, System
- **Import/Export** — JSON backup and restore
- **Share** — Share streaks to WhatsApp, Twitter/X, or download streak cards
- **Pre-set Habits** — Quick-add: Drink water, Exercise, Read, Meditate, Journal, etc.
- **Browser Notifications** — Optional daily reminders at 9 AM
- **Keyboard Shortcuts** — 1-5 to switch tabs, Esc to close modals

## Tech Stack

- React 18 + Vite
- Tailwind CSS 3.4
- Recharts
- localStorage for persistence

## Development

```bash
npm install
npm run dev
```

Dev server runs at `http://172.18.0.1:3064`.

## Production

```bash
npm run build
```

### Deploy with systemd

```bash
sudo cp doaide-habit.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now doaide-habit
```

## Server

- **Host**: 89.167.8.178
- **Port**: 3064 (bound to 172.18.0.1)
- **Domain**: habit.doaide.com
