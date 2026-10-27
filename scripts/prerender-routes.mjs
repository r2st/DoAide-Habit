#!/usr/bin/env node
/**
 * prerender-routes.mjs
 *
 * Run after `vite build`. For every route in src/routeMeta.js, copies
 * dist/index.html into dist/<route>/index.html with that route's <title>,
 * description, canonical, og:*, twitter:*, JSON-LD and a crawler <h1>, so
 * crawlers and link unfurlers see per-page SEO without running JavaScript.
 *
 * Also writes dist/sitemap.xml (from the same routes) and dist/serve.json.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE, routes, canonicalFor, jsonLdFor } from '../src/routeMeta.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const SHELL = readFileSync(join(DIST, 'index.html'), 'utf-8')

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`)
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function render(route) {
  const url = canonicalFor(route.path)
  const jsonLd = JSON.stringify(jsonLdFor(route)).replace(/</g, '\\u003c')
  let html = SHELL.replace(/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`)
    .replace(
      /<script type="application\/ld\+json" data-seo-jsonld>[\s\S]*?<\/script>/,
      `<script type="application/ld+json" data-seo-jsonld>${jsonLd}</script>`
    )
    .replace('<div id="root"></div>', `<div id="root"><h1>${esc(route.h1)}</h1></div>`)
  const tags = [
    ['name', 'description', route.description],
    ['property', 'og:title', route.title],
    ['property', 'og:description', route.description],
    ['property', 'og:url', url],
    ['property', 'og:image', SITE.ogImage],
    ['property', 'og:image:width', '1200'],
    ['property', 'og:image:height', '630'],
    ['name', 'twitter:title', route.title],
    ['name', 'twitter:description', route.description],
    ['name', 'twitter:image', SITE.ogImage],
  ]
  for (const [attr, key, value] of tags) html = setMeta(html, attr, key, value)
  return html
}

for (const route of routes) {
  const file = route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path.slice(1), 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, render(route))
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url>\n    <loc>${canonicalFor(r.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap)

// Route each prerendered URL to its own index.html, with the SPA fallback
// last. `serve -s` would put its own catch-all first and shadow these, so the
// web unit runs plain `serve dist`. serve-handler re-applies the remaining
// rewrites to a rewritten path, so the fallback only matches dot-free paths.
const serveConfig = {
  rewrites: [
    ...routes
      .filter((r) => r.path !== '/')
      .map((r) => ({ source: r.path, destination: `${r.path}/index.html` })),
    { source: '/:path([^.]+)', destination: '/index.html' },
  ],
  headers: [
    { source: '/assets/**', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
}
writeFileSync(join(DIST, 'serve.json'), JSON.stringify(serveConfig, null, 2) + '\n')

console.log(`Prerendered ${routes.length} routes into dist/ (+ sitemap.xml, serve.json)`)
