import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {mkdtempSync,readFileSync,rmSync,renameSync,statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {initMailSettings} from '../server/mail-settings.mjs';
import {emailConfig,initEmailOutbox,createEmailService} from '../server/email.mjs';

const sender='post@isaacwilliam.no';
test('owner SMTP credentials are encrypted, private, reusable after restart and never returned to the UI',()=>{
 const dir=mkdtempSync(join(tmpdir(),'iw-mail-config-'));
 const db=new DatabaseSync(':memory:');
 try{
  const mail=initMailSettings(db,dir);
  assert.equal(mail.overview().configured,false);
  assert.throws(()=>mail.save({from:sender,owner:sender,enabled:false,appPassword:''}),/app-passord/i);
  assert.throws(()=>mail.save({from:'bad,b@example.no',owner:sender,enabled:false,appPassword:'1234567890123456'}),/gyldig/);
  const secret='test-app-secret-123456';
  const saved=mail.save({from:sender,owner:sender,enabled:false,appPassword:secret});
  assert.equal(saved.configured,true);
  assert.equal(saved.enabled,false);
  assert.equal(saved.source,'admin');
  assert.equal(saved.hasAppPassword,true);
  assert.equal(JSON.stringify(saved).includes(secret),false);
  const encrypted=db.prepare('SELECT * FROM mail_settings').get();
  assert.equal(JSON.stringify(encrypted).includes(secret),false);
  assert.equal(statSync(join(dir,'.mail-settings.key')).mode&0o077,0);
  const reopened=initMailSettings(db,dir);
  assert.equal(reopened.load().appPassword,secret);
  reopened.save({from:sender,owner:'another@example.no',enabled:true,appPassword:''});
  assert.equal(reopened.load().appPassword,secret);
  assert.equal(reopened.overview().enabled,true);
  renameSync(join(dir,'.mail-settings.key'),join(dir,'.mail-settings.key.missing'));
  assert.throws(()=>reopened.load(),/Gjenopprett|nøkkelen/i);
 }finally{db.close();rmSync(dir,{recursive:true,force:true});}
});

test('SMTP test is separate from the booking outbox, works before enabling and protects recipient validation',async()=>{
 const db=new DatabaseSync(':memory:');
 try{
  db.exec("PRAGMA foreign_keys=ON;CREATE TABLE enquiries(id TEXT PRIMARY KEY);INSERT INTO enquiries VALUES('existing');");
  initEmailOutbox(db);
  const messages=[];
  const cfg=emailConfig({EMAIL_ENABLED:'false',SMTP_USER:sender,SMTP_APP_PASSWORD:'fake-secret-for-tests'});
  assert.equal(cfg.enabled,false);
  assert.equal(cfg.configured,true);
  const email=createEmailService(db,cfg,{transport:{
   verify:async()=>true,
   sendMail:async mail=>{messages.push(mail);return {rejected:[]};}
  }});
  assert.equal((await email.verify()).ok,true);
  assert.equal((await email.sendTest('owner@example.no')).ok,true);
  assert.equal(messages.length,1);
  assert.equal(messages[0].to,'owner@example.no');
  assert.equal(messages[0].replyTo,sender);
  assert.match(messages[0].subject,/Test av Google Workspace/);
  assert.equal(email.status().counts.pending,0);
  assert.equal(email.status().counts.sent,0);
  await assert.rejects(email.sendTest('a@example.no,b@example.no'),/én gyldig testadresse/);
  assert.equal(messages.length,1);
  const failed=createEmailService(db,cfg,{transport:{
   sendMail:async()=>{throw Object.assign(Error('fake-secret-for-tests'),{code:'EAUTH'});}
  }});
  await assert.rejects(failed.sendTest('owner@example.no'),e=>e.status===502&&/EAUTH/.test(e.message)&&!e.message.includes('fake-secret-for-tests'));
 }finally{db.close();}
});
