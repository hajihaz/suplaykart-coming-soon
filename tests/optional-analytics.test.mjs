import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../optional-analytics.js',import.meta.url),'utf8');
test('tracking must be disabled until explicitly approved by owner',()=>{
 assert.match(html,/name="owner-optional-analytics" content="disabled"/);
 assert.match(html,/src="\/optional-analytics\.js"/);
 assert.doesNotMatch(html,/<script[^>]+src="\/_vercel\/insights\/script\.js"/);
});
test('visitor must affirm opt-in; no guest or invitation labels are sent',()=>{
 assert.match(js,/if\(!config\|\|config\.getAttribute\('content'\)!=='enabled'\)return;/);
 assert.match(js,/if\(location\.pathname!=='\/'\|\|location\.search\|\|location\.hash\)return;/);
 assert.match(js,/navigator\.globalPrivacyControl===true/);
 assert.match(js,/navigator\.doNotTrack==='1'/);
 assert.match(js,/choice!=='yes'/);
 assert.match(js,/if\(next==='no'&&previous==='yes'\)location\.reload\(\);/);
 assert.doesNotMatch(js,/track\(/);
});
