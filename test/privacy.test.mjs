import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {privacyContent,renderPublicPage} from '../public/assets/app.js';
test('both enquiry forms require an unchecked privacy acknowledgement with a new-tab notice link',()=>{
 const site=JSON.parse(readFileSync('content/site.json'));site.bookingAvailable=true;
 for(const path of ['/booking','/contact']){
  const html=renderPublicPage(site,path,false).main;
  assert.match(html,/<input type="checkbox" name="consent" required>/);
  assert.match(html,/<a href="\/personvern" target="_blank" rel="noopener">/);
  assert.doesNotMatch(html,/<input[^>]*name="consent"[^>]*checked/);
 }
});
test('privacy sections render semantic headings and escape arbitrary markup',()=>{
 const html=privacyContent('## Dine rettigheter\nKontakt oss.\n\n<script>alert(1)</script>');
 assert.match(html,/<h2>Dine rettigheter<\/h2>/);
 assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);
});
