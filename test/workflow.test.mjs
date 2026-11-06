import {test,after,before} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync,readFileSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {randomBytes} from 'node:crypto';
const dir=mkdtempSync(join(tmpdir(),'iw-tests-')),password=randomBytes(32).toString('hex');let child,base,cookie,csrf,content;
async function start(){child=spawn(process.execPath,['server/index.mjs'],{cwd:resolve('.'),env:{...process.env,PORT:'0',HOST:'127.0.0.1',DATA_DIR:dir,ADMIN_PASSWORD:password,PUBLIC_ORIGIN:'',BOOKING_ENABLED:'true',NODE_ENV:'test'},stdio:['ignore','pipe','pipe']});base=await new Promise((yes,no)=>{child.stdout.on('data',c=>{let m=String(c).match(/port (\d+)/);if(m)yes('http://127.0.0.1:'+m[1]);});child.on('exit',c=>no(Error('Server exited '+c)));child.on('error',no);});}
async function stop(){await new Promise(resolve=>{child.once('exit',resolve);child.kill();});}
async function request(path,method='GET',b,authenticated=true,extra={}){return fetch(base+path,{method,headers:{'Content-Type':'application/json',Origin:base,...(authenticated?{Cookie:cookie||'','X-CSRF-Token':csrf||''}:{}),...extra},body:b===undefined?undefined:JSON.stringify(b),redirect:'manual'});}
async function login(){let r=await request('/api/login','POST',{password},false);assert.equal(r.status,200);cookie=r.headers.get('set-cookie').split(';')[0];csrf=(await r.json()).csrf;}
before(start);after(async()=>{await stop();rmSync(dir,{recursive:true,force:true});});
test('complete private booking and content workflow',async()=>{
 let r=await request('/api/admin/enquiries','GET',undefined,false);assert.equal(r.status,401);
 r=await request('/api/login','POST',{password:'incorrect'},false);assert.equal(r.status,401);
 r=await request('/api/enquiries','POST',{},false);assert.equal(r.status,503);
 await login();
 content=await(await request('/api/content')).json();assert.equal(Object.keys(content.pages).length,8);assert.equal(content.bookingAvailable,false);
 let invalid=structuredClone(content);invalid.pages.home.sections[0].links[0].href='javascript:alert(1)';
 r=await request('/api/admin/content','PUT',{revision:content.revision,content:invalid});assert.equal(r.status,400);
 content.settings.bookingEnabled=true;
 r=await request('/api/admin/content','PUT',{revision:content.revision,content},true, {'X-CSRF-Token':'wrong'});assert.equal(r.status,403);
 r=await request('/api/admin/content','PUT',{revision:content.revision,content});assert.equal(r.status,200);content.revision=(await r.json()).revision;
 r=await request('/api/admin/content','PUT',{revision:1,content});assert.equal(r.status,409);
 const sample={type:'booking',name:'Testperson',email:'test@example.invalid',organisation:'Testarrangør',organisationType:'Skole',topic:'Autisme',format:'Foredrag',audience:'Ansatte',location:'Digitalt',date:'2099-05-20',time:'12:30',participants:'50',message:'Dette er en automatisert test.',consent:true};
 r=await request('/api/enquiries','POST',sample,false,{Origin:'https://untrusted.invalid'});assert.equal(r.status,403);
 r=await request('/api/enquiries','POST',{...sample,email:'invalid'},false);assert.equal(r.status,400);
 r=await request('/api/enquiries','POST',{...sample,date:'2099-99-99'},false);assert.equal(r.status,400);
 r=await request('/api/enquiries','POST',{...sample,date:'2099-02-30'},false);assert.equal(r.status,400);
 r=await request('/api/enquiries','POST',{...sample,date:'2000-01-01'},false);assert.equal(r.status,400);
 r=await request('/api/enquiries','POST',sample,false);assert.equal(r.status,201);let id=(await r.json()).id;
 r=await request('/api/enquiries','POST',sample,false);assert.equal(r.status,201);let duplicateId=(await r.json()).id;
 let overview=await(await request('/api/admin/enquiries')).json();assert.equal(overview.enquiries.length,2);assert.equal(overview.enquiries[0].payload.name,'Testperson');
 r=await request('/api/availability?from=2099-05-20&to=2099-05-20', 'GET',undefined,false);assert.deepEqual((await r.json()).unavailable,[]);
 r=await request('/api/admin/enquiries/'+id,'PATCH',{version:1,status:'Bekreftet',quote:2500,notes:'Testnotat'});assert.equal(r.status,200);
 r=await request('/api/availability?from=2099-05-20&to=2099-05-20','GET',undefined,false);let avail=await r.json();assert.equal(avail.unavailable.length,1);assert.equal(JSON.stringify(avail).includes('Testperson'),false);
 r=await request('/api/admin/enquiries/'+duplicateId,'PATCH',{version:1,status:'Bekreftet',quote:2500,notes:''});assert.equal(r.status,409);
 r=await request('/api/enquiries','POST',sample,false);assert.equal(r.status,409);
 r=await request('/api/admin/blocks','POST',{start:'2099-05-20',end:'2099-05-21',label:'Test'});assert.equal(r.status,409);
 r=await request('/api/admin/blocks','POST',{start:'2099-06-01',end:'2099-06-03',label:'Privat'});assert.equal(r.status,201);let block=(await r.json()).id;
 r=await request('/api/admin/blocks/'+block,'DELETE',{});assert.equal(r.status,200);
 // Make another unconfirmed request, then confirm atomically against the occupied date.
 { r=await request('/api/enquiries','POST',{...sample,date:'2099-05-21'},false);assert.equal(r.status,201); }
 r=await request('/api/admin/enquiries/'+id,'PATCH',{version:1,status:'Gjennomført',quote:2500,notes:''});assert.equal(r.status,409);
 r=await request('/api/admin/uploads','POST',{data:Buffer.from('<svg onload="alert(1)"></svg>').toString('base64')});assert.equal(r.status,400);
 r=await request('/api/admin/export');assert.equal(r.status,200);assert.equal((await r.json()).settings.email,'post@isaacwilliam.no');
 await stop();await start();await login();overview=await(await request('/api/admin/enquiries')).json();assert.equal(overview.enquiries.length,3);assert.equal(overview.enquiries.find(e=>e.id===id).status,'Bekreftet');
 r=await request('/api/admin/enquiries/'+id,'DELETE',{});assert.equal(r.status,200);
 r=await request('/api/availability?from=2099-05-20&to=2099-05-20');assert.equal((await r.json()).unavailable.length,0);
 r=await request('/api/logout','POST',{});assert.equal(r.status,200);r=await request('/api/admin/enquiries');assert.equal(r.status,401);
});
test('all pages and local assets are served securely; reviews are anonymous and unique',async()=>{
 for(let path of ['/','/about','/topics','/booking','/contact','/pricing-and-services','/faq','/testimonials','/personvern','/admin']){
  let r=await request(path,'GET',undefined,false);assert.equal(r.status,200,path);assert.match(r.headers.get('content-type'),/text\/html/);assert.equal(r.headers.get('x-robots-tag'),'noindex, nofollow');assert.match(r.headers.get('content-security-policy'),/frame-ancestors 'none'/);
 }
 for(let path of ['/content/site.json','/runtime/site.sqlite','/.env','/server/index.mjs','/missing-page'])assert.equal((await request(path)).status,404,path);
 const c=JSON.parse(readFileSync('content/site.json'));
 const texts=[];for(let s of c.pages.testimonials.sections)for(let i of s.items){texts.push(i.text);assert.equal(i.title,'Anonym tilbakemelding');assert.equal(i.caption,'');}
 assert.equal(texts.length,13);assert.equal(new Set(texts).size,texts.length);
 for(let p of Object.values(c.pages))for(let s of p.sections){for(let im of s.images){assert.ok(existsSync('public'+im.src),im.src);assert.equal((await request(im.src)).status,200);}for(let item of s.items)assert.ok(item.text.trim());}
});
