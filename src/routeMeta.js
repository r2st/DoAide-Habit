/**
 * SEO metadata for the app's single indexable page. The tabs (today, week,
 * stats, calendar, settings) show the visitor's own local data, so they are
 * not separate URLs. Read by scripts/prerender-routes.mjs; plain JS only.
 */

export const SITE = {
  name: 'DoAide Habit',
  baseUrl: 'https://habit.doaide.com',
  ogImage: 'https://habit.doaide.com/og-habit.png',
}

export const routes = [
  {
    path: '/',
    h1: 'DoAide | Habit',
    title: 'DoAide Habit — Free Habit Tracker with Streaks & Reminders',
    description:
      'Track daily habits, build streaks and see your progress on a calendar heatmap. Free habit tracker with reminders — no login, data stays on your device.',
  },
]

export const canonicalFor = (path) => `${SITE.baseUrl}${path}`

export const metaForPath = (path) => routes.find((r) => r.path === path)

export function jsonLdFor(route) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE.name,
    url: canonicalFor(route.path),
    description: route.description,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    author: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
  }
}
