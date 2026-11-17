import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {randomBytes} from 'node:crypto';

const temp=mkdtempSync(join(tmpdir(),'iw-mail-api-'));
const password=randomBytes(32).toString('hex'),origin='http://owner.example.invalid',secret='example-app-password-123456';
let child,base,cookie='',csrf='';
async function start(){
 child=spawn(process.execPath,['server/index.mjs'],{cwd:resolve('.'),env:{...process.env,HOST:'127.0.0.1',PORT:'0',NODE_ENV:'test',
  DATA_DIR:temp,ADMIN_PASSWORD:password,PUBLIC_ORIGIN:origin,BOOKING_ENABLED:'false',EMAIL_ENABLED:'false',
  SMTP_APP_PASSWORD:'',GOOGLE_CLIENT_ID:'',GOOGLE_CLIENT_SECRET:'',GOOGLE_REFRESH_TOKEN:''},stdio:['ignore','pipe','pipe']});
 base=await new Promise((yes,no)=>{
  const timer=setTimeout(()=>no(Error('Server start timeout')),10000);
  child.stdout.on('data',chunk=>{const m=String(chunk).match(/port (\d+)/);if(m){clearTimeout(timer);yes('http://127.0.0.1:'+m[1]);}});
  child.once('error',error=>{clearTimeout(timer);no(error);});
  child.once('exit',code=>{clearTimeout(timer);no(Error('Server exited '+code));});
 });
}
async function stop(){
 if(child&&child.exitCode===null)await new Promise(done=>{child.once('exit',done);child.kill('SIGTERM');});
 child=null;
}
async function request(path,method='GET',payload,authenticated=false,csrfOverride){
 const response=await fetch(base+path,{method,headers:{Origin:origin,'Content-Type':'application/json',
  ...(authenticated?{Cookie:cookie,'X-CSRF-Token':csrfOverride??csrf}:{})},
  ...(payload===undefined?{}:{body:JSON.stringify(payload)})});
 return {status:response.status,body:await response.json()};
}
async function login(){
 const response=await fetch(base+'/api/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({password})});
 assert.equal(response.status,200);cookie=(response.headers.get('set-cookie')||'').split(';')[0];csrf=(await response.json()).csrf;
}
before(start);
after(async()=>{await stop();rmSync(temp,{recursive:true,force:true});});

test('admin mail setup has auth/CSRF, encrypted storage, no secret echoes and survives restart',async()=>{
 assert.equal((await request('/api/admin/email')).status,401);
 assert.equal((await request('/api/admin/email/settings','PUT',{from:'post@isaacwilliam.no',owner:'post@isaacwilliam.no',appPassword:secret,enabled:false})).status,401);
 await login();
 let r=await request('/api/admin/email','GET',undefined,true);
 assert.equal(r.status,200);assert.equal(r.body.settings.configured,false);
 const settings={from:'post@isaacwilliam.no',owner:'post@isaacwilliam.no',appPassword:secret,enabled:false};
 assert.equal((await request('/api/admin/email/settings','PUT',settings,true,'wrong-csrf')).status,403);
 assert.equal((await request('/api/admin/email/settings','PUT',{...settings,from:'a,b@example.no'},true)).status,400);
 r=await request('/api/admin/email/settings','PUT',settings,true);
 assert.equal(r.status,200);assert.equal(r.body.settings.configured,true);
 assert.equal(r.body.settings.hasAppPassword,true);assert.equal(r.body.enabled,false);
 assert.equal(JSON.stringify(r.body).includes(secret),false);
 const publicData=await request('/api/content');assert.equal(JSON.stringify(publicData.body).includes(secret),false);
 r=await request('/api/admin/export','GET',undefined,true);
 assert.equal(JSON.stringify(r.body).includes(secret),false);
 r=await request('/api/admin/email/test','POST',{to:'one@example.no,two@example.no'},true);
 assert.equal(r.status,400,'no SMTP request for invalid multi-recipient address');
 r=await request('/api/admin/email/settings','PUT',{from:settings.from,owner:'other@example.no',appPassword:'',enabled:true},true);
 assert.equal(r.status,200);assert.equal(r.body.settings.enabled,true);
 assert.equal(JSON.stringify(r.body).includes(secret),false);
 await stop();await start();await login();
 r=await request('/api/admin/email','GET',undefined,true);
 assert.equal(r.status,200);assert.equal(r.body.enabled,true);
 assert.equal(r.body.settings.owner,'other@example.no');
 assert.equal(r.body.settings.hasAppPassword,true);
 assert.equal(JSON.stringify(r.body).includes(secret),false);
});
