import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {overview,overviewMarkup} from '../public/assets/overview.js';

test('dashboard identifies actionable work and upcoming bookings without treating quotes as payments',()=>{
 const records={enquiries:[{status:'Ny',payload:{}},{status:'Tilbud sendt',quote:4500,payload:{}},{status:'Bekreftet',quote:2500,payload:{date:'2099-06-01',organisation:'Later'}},{status:'Bekreftet',quote:1000,payload:{date:'2099-05-01',organisation:'First'}},{status:'Gjennomført',quote:500,payload:{date:'2020-01-01'}},{status:'Avlyst',quote:9000,payload:{date:'2099-05-01'}}]};
 const data=overview(records,{bookingAvailable:false},'2099-01-01');
 assert.equal(data.fresh,1);assert.equal(data.waiting,1);assert.equal(data.upcoming.length,2);assert.equal(data.upcoming[0].payload.organisation,'First');assert.equal(data.quoteTotal,4000);assert.ok(data.steps.some(s=>s.tab==='settings'));
 assert.match(overviewMarkup(data,s=>String(s||'')),/ikke registrerte innbetalinger/);
 const empty=overview({enquiries:[]},{bookingAvailable:true},'2099-01-01');assert.equal(empty.steps[0].title,'Du er ajour');
});

test('accordion imports retain the correct distinct answers and clean titles',()=>{
 const site=JSON.parse(readFileSync('content/site.json'));
 for(const key of ['home','about','topics']){
  const items=site.pages[key].sections.filter(s=>s.kind==='accordion').flatMap(s=>s.items);
  assert.equal(new Set(items.map(i=>i.text)).size,items.length);
  for(const item of items){assert.doesNotMatch(item.title,/^\d{2}/);assert.ok(item.text.length>50);}
 }
 const autism=site.pages.topics.sections[0].items.find(i=>i.title==='Autisme og nevrodiversitet');
 assert.match(autism.text,/sensoriske utfordringer/i);
});
