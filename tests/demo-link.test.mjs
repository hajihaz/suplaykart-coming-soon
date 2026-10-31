import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('countdown remains the primary public homepage', () => {
  assert.match(page, /id="days"/);
  assert.match(page, /id="hours"/);
  assert.match(page, /id="minutes"/);
  assert.match(page, /id="seconds"/);
  assert.match(page, /Relaunching January 1, 2027/);
  assert.match(page, /Current Status/);
  assert.match(page, /Upcoming Improvements/);
});

test('one accessible demo CTA links directly to the existing isolated preview', () => {
  assert.equal((page.match(/class="demo-invite__link"/g) ?? []).length, 1);
  assert.match(page, /class="demo-invite__link" href="https:\/\/suplaykart-staging\.vercel\.app\/demo"/);
  assert.match(page, /Explore Our Demo Store/);
  assert.match(page, /Browsing only .* ordering and delivery are not available yet/);
  assert.ok(page.indexOf('class="countdown reveal d3"') < page.indexOf('class="demo-invite reveal d4"'));
  assert.ok(page.indexOf('class="demo-invite reveal d4"') < page.indexOf('Current Status'));
});
