import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {mergeTopics} from '../scripts/prepare-topics-update.mjs';
import {mergePublicCopy} from '../scripts/prepare-copy-update.mjs';

test('professional copy update preserves settings and edited reviews, and refuses conflicting owner copy',()=>{
 const seed=JSON.parse(readFileSync('content/site.json'));
 const changes=JSON.parse(readFileSync('content/professional-copy-update.json'));
 const current=structuredClone(seed);
 const featured=JSON.parse(readFileSync('content/featured-selection-update.json'));
 for(const change of featured){let parent=current;for(const key of change.path.slice(0,-1))parent=parent[key];parent[change.path.at(-1)]=structuredClone(change.before);}
 for(const change of changes){let parent=current;for(const key of change.path.slice(0,-1))parent=parent[key];parent[change.path.at(-1)]=change.before;}
 current.settings.email='owner@example.invalid';current.settings.bookingEnabled=true;
 current.pages.testimonials.sections[1].items[0].text='Eierens godkjente tilbakemelding';
 const updated=mergePublicCopy(mergePublicCopy(current,changes),featured);
 assert.deepEqual(updated.settings,current.settings);
 assert.deepEqual(updated.pages.testimonials.sections[1],current.pages.testimonials.sections[1]);
 assert.deepEqual(updated.pages.about,seed.pages.about);
 assert.deepEqual(updated.pages.topics,seed.pages.topics);
 assert.deepEqual(mergePublicCopy(updated,featured),updated);
 current.pages.home.sections[0].text='Eierens nye forsidetekst';
 assert.throws(()=>mergePublicCopy(current,changes),/Egne endringer må gjennomgås/);
 assert.equal(current.pages.home.sections[0].text,'Eierens nye forsidetekst');
 assert.throws(()=>mergePublicCopy(current,[{path:['settings','email'],before:'owner@example.invalid',after:'bad'}]),/Ugyldig tekstoppdatering/);
});
test('catalogue import preserves owner settings, other pages and customised homepage copy',()=>{
 const seed=JSON.parse(readFileSync('content/site.json'));
 const original=structuredClone(seed);original.settings.email='owner@example.invalid';original.settings.bookingEnabled=true;
 original.pages.about.title='Min egen oppdatering';original.pages.home.sections[1].text='Min egen introduksjon';
 original.pages.topics.sections[1].items=[];
 const merged=mergeTopics(original,seed);
 assert.deepEqual(merged.settings,original.settings);assert.deepEqual(merged.pages.about,original.pages.about);
 assert.deepEqual(merged.pages.home,original.pages.home);assert.deepEqual(merged.pages.topics,seed.pages.topics);
 assert.equal(original.pages.topics.sections[1].items.length,0);
 original.pages.home.sections[1].text='Se undertemaer';
 assert.equal(mergeTopics(original,seed).pages.home.sections[1].text,seed.pages.home.sections[1].text);
 assert.throws(()=>mergeTopics({},seed),/innholdseksport/);
});

test('direct old-main upgrade preserves owner data, is repeatable and stops on edited copy',()=>{
 const seed=JSON.parse(readFileSync('content/site.json'));
 const changes=JSON.parse(readFileSync('content/from-main-copy-update.json'));
 const old=structuredClone(seed);
 for(const change of changes){let parent=old;for(const key of change.path.slice(0,-1))parent=parent[key];parent[change.path.at(-1)]=structuredClone(change.before);}
 old.settings.email='owner@example.invalid';old.settings.bookingEnabled=true;
 old.pages.testimonials.sections[1].items[0].text='Eierens godkjente tilbakemelding';
 old.pages.home.sections[3].items[0].text='Eierens godkjente forsidetilbakemelding';
 const updated=mergePublicCopy(old,changes);
 assert.deepEqual(updated.settings,old.settings);
 assert.deepEqual(updated.pages.testimonials.sections[1].items,old.pages.testimonials.sections[1].items);
 assert.deepEqual(updated.pages.home.sections[3].items,old.pages.home.sections[3].items);
 assert.deepEqual(updated.pages.topics,seed.pages.topics);
 assert.deepEqual(updated.pages.about,seed.pages.about);
 assert.deepEqual(mergePublicCopy(updated,changes),updated);
 old.pages.topics.sections[1].text='Eierens tilpassede innhold';
 assert.throws(()=>mergePublicCopy(old,changes),/Egne endringer må gjennomgås/);
 assert.equal(old.pages.topics.sections[1].text,'Eierens tilpassede innhold');
 const malformed=structuredClone(old);delete malformed.pages.about;
 assert.throws(()=>mergePublicCopy(malformed,changes),/Egne endringer må gjennomgås/);
});
