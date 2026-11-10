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
 assert.match(autism.text,/sanseinntrykk/i);
});

test('individual talks stay collapsed and carry the chosen title into booking',async()=>{
 const {renderPublicPage,talkCatalogue,requestedTalk}=await import('../public/assets/app.js');
 const site=JSON.parse(readFileSync('content/site.json')),talks=talkCatalogue(site);
 const html=renderPublicPage(site,'/topics').main,booking=renderPublicPage(site,'/booking').main;
 assert.equal(talks.length,14);assert.equal(new Set(talks.map(t=>t.id)).size,14);
 assert.equal(new Set(talks.map(t=>t.title)).size,14);
 assert.equal((html.match(/class="talk"/g)||[]).length,14);
 assert.doesNotMatch(html,/<details[^>]*\sopen/);assert.doesNotMatch(html,/undertemaer/);
 for(let n=1;n<=6;n++)assert.ok(html.includes(`id="tema-${n}"`));
 for(const talk of talks){
  assert.ok(talk.text.split(/\s+/).length<=65);
  assert.ok(html.includes(`/booking/?foredrag=${talk.id}`));
  assert.ok(booking.includes(`<option value="${talk.title}">`));
  assert.equal(requestedTalk(site,`?foredrag=${talk.id}`),talk.title);
 }
 assert.equal(requestedTalk(site,'?foredrag=missing'),'');
 assert.equal(requestedTalk(site,'?foredrag=%3Cscript%3E'),'');
 assert.equal(requestedTalk(site,'?tema=2'),'Eget tema / tilpasset foredrag');
 assert.equal(requestedTalk(site,'?foredrag=veiledning'),'Hjelp til å velge foredrag');
 assert.equal(requestedTalk(site,'?tema=99'),'');
 assert.equal(requestedTalk(site,'?tema=6'),'Eget tema / tilpasset foredrag');
 assert.equal(requestedTalk(site,'?foredrag=tilpasset'),'Eget tema / tilpasset foredrag');
 assert.match(html,/Utvalgte foredrag og vinklinger/);assert.match(html,/barn, ungdom og voksne/);
 assert.ok(html.includes('/booking/?foredrag=tilpasset'));
 assert.match(booking,/Eget tema \/ tilpasset foredrag/);assert.match(booking,/Ønsket innhold og arrangement/);
 assert.ok(talks.some(t=>t.summary.includes('Spiseforstyrrelser')));
 assert.ok(talks.some(t=>t.summary.includes('Kjønnsidentitet')));
 const title=talks[0].title;site.pages.topics.sections[1].items[0].title='Endret tittel';
 assert.equal(requestedTalk(site,'?foredrag='+talks[0].id),'Endret tittel');
 assert.ok(!renderPublicPage(site,'/booking').main.includes(`<option value="${title}">`));
});

test('owner sees unread client replies while read replies and owner messages do not count',()=>{
 const records={enquiries:[{status:'Under behandling',payload:{},messages:[{author:'arrangor',seen:0},{author:'arrangor',seen:1},{author:'isaac',seen:1}]}]};
 const data=overview(records,{bookingAvailable:true,clientPortalAvailable:true},'2099-01-01');assert.equal(data.unread,1);assert.equal(data.steps[0].tab,'enquiries');assert.match(data.steps[0].title,/1 ny klientmelding/);
 records.enquiries[0].messages[0].seen=1;assert.equal(overview(records,{bookingAvailable:true}).unread,0);
});

test('speaker introduction uses third person and explains experience alongside research',()=>{
 const site=JSON.parse(readFileSync('content/site.json'));const about=site.pages.about.sections.map(s=>s.text+' '+s.items.map(i=>i.text).join(' ')).join(' ');
 assert.match(about,/Han er autist/);assert.match(about,/relevant forskning og statistikk/);assert.match(about,/14 år/);assert.match(about,/sertifisert i førstehjelp ved selvmordsfare/);assert.doesNotMatch(about,/\b[Jj]eg\b|\bmeg\b/);assert.ok(!JSON.stringify(site).includes('blikk.no'));assert.ok(!JSON.stringify(site).includes('friosloviken.no'));
});
