import {createCipheriv,createDecipheriv,randomBytes} from 'node:crypto';
import {lstatSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const validAddress=value=>typeof value==='string'&&value.length<=254&&/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
const bad=(message,status=400)=>Object.assign(new Error(message),{status});

/**
 * Store Google app-password credentials separately from public site content.
 * The AES-GCM key is a separate 0600 file in the persistent DATA_DIR. Back up
 * both files securely; anyone with host/volume access can recover the secret.
 */
export function initMailSettings(db,dataDir){
 db.exec("CREATE TABLE IF NOT EXISTS mail_settings(id INTEGER PRIMARY KEY CHECK(id=1),iv TEXT NOT NULL,tag TEXT NOT NULL,ciphertext TEXT NOT NULL,updated TEXT NOT NULL);");
 const keyPath=join(dataDir,'.mail-settings.key');
 function key(create){
  let bytes;
  try{bytes=readFileSync(keyPath);}catch(error){
   if(error.code!=='ENOENT')throw error;
   if(!create)throw bad('E-postnøkkelen mangler. Gjenopprett nøkkelfilen fra sikkerhetskopi.',503);
   try{writeFileSync(keyPath,randomBytes(32),{flag:'wx',mode:0o600});}
   catch(err){if(err.code!=='EEXIST')throw err;}
   bytes=readFileSync(keyPath);
  }
  const stat=lstatSync(keyPath);
  if(!stat.isFile()||stat.isSymbolicLink()||(stat.mode&0o077)||bytes.length!==32)
   throw bad('E-postnøkkelen må være en privat fil med rettigheter 0600.',503);
  return bytes;
 }
 function load(){
  const row=db.prepare('SELECT iv,tag,ciphertext FROM mail_settings WHERE id=1').get();
  if(!row)return null;
  try{
   const decipher=createDecipheriv('aes-256-gcm',key(false),Buffer.from(row.iv,'base64'));
   decipher.setAuthTag(Buffer.from(row.tag,'base64'));
   const plain=Buffer.concat([decipher.update(Buffer.from(row.ciphertext,'base64')),decipher.final()]);
   const cfg=JSON.parse(plain.toString('utf8'));
   if(typeof cfg.enabled!=='boolean'||!validAddress(cfg.from)||!validAddress(cfg.owner)||typeof cfg.appPassword!=='string'||!cfg.appPassword)throw Error('Invalid encrypted email config');
   return cfg;
  }catch{
   throw bad('Lagret e-postoppsett kunne ikke åpnes. Gjenopprett e-postnøkkelen eller kontakt drift.',503);
  }
 }
 function save(input){
  if(!input||typeof input.enabled!=='boolean'||!validAddress(input.from)||!validAddress(input.owner))
   throw bad('Oppgi gyldig avsender, mottaker og aktiveringsvalg.');
  const prior=load();
  if(input.appPassword!==undefined&&typeof input.appPassword!=='string')throw bad('Ugyldig app-passord.');
  const supplied=(input.appPassword||'').replace(/ /g,'').trim();
  if(supplied&&(supplied.length<12||supplied.length>128||/[\r\n]/.test(supplied)))
   throw bad('Kontroller Google-app-passordet.');
  const appPassword=supplied||prior?.appPassword;
  if(!appPassword)throw bad('Legg inn Google-app-passord før du lagrer første gang.');
  const cfg={enabled:input.enabled,from:input.from.trim(),owner:input.owner.trim(),appPassword};
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(true),iv);
  const encrypted=Buffer.concat([cipher.update(JSON.stringify(cfg),'utf8'),cipher.final()]);
  db.prepare("INSERT INTO mail_settings(id,iv,tag,ciphertext,updated) VALUES(1,?,?,?,?) ON CONFLICT(id) DO UPDATE SET iv=excluded.iv,tag=excluded.tag,ciphertext=excluded.ciphertext,updated=excluded.updated")
   .run(iv.toString('base64'),cipher.getAuthTag().toString('base64'),encrypted.toString('base64'),new Date().toISOString());
  return overview();
 }
 function overview(fallback={}){
  const stored=load();
  return {source:stored?'admin':'server',enabled:stored?.enabled??Boolean(fallback.enabled),
   configured:stored?Boolean(stored.appPassword):Boolean(fallback.configured),
   from:stored?.from??fallback.from??'',owner:stored?.owner??fallback.owner??'',
   hasAppPassword:stored?Boolean(stored.appPassword):Boolean(fallback.options?.auth?.pass),
   host:'smtp.gmail.com',port:465};
 }
 return {load,save,overview};
}
