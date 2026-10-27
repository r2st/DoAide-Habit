import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { routes, jsonLdFor } from '../src/routeMeta.js'

test('home route fits search snippets', () => {
  assert.equal(routes.length, 1)
  const [home] = routes
  assert.equal(home.path, '/')
  assert.ok(home.title.length <= 70 && home.description.length <= 160)
  assert.equal(jsonLdFor(home).url, 'https://habit.doaide.com/')
})

test('index.html head matches routeMeta', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf-8')
  assert.ok(html.includes(`<title>${routes[0].title.replace(/&/g, '&amp;')}</title>`))
  assert.match(html, /<script type="application\/ld\+json" data-seo-jsonld>/)
  assert.match(html, /og:image" content="https:\/\/habit\.doaide\.com\/og-habit\.png"/)
})
