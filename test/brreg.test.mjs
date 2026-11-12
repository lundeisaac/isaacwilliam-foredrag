import {test,after,before} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {randomBytes} from 'node:crypto';
const dir=mkdtempSync(join(tmpdir(),'iw-brreg-')),password=randomBytes(32).toString('hex');let child,base,stub,stubBase,hits=0;
const fixture={organisasjonsnummer:'974760673',navn:'REGISTERENHETEN I BRØNNØYSUND',organisasjonsform:{kode:'ORGL',beskrivelse:'Organisasjonsledd'},forretningsadresse:{land:'Norge',landkode:'NO',postnummer:'8900',poststed:'BRØNNØYSUND',adresse:['Havnegata 48'],kommune:'BRØNNØY',kommunenummer:'1813'}};
async function start(){stub=createServer((req,res)=>{hits++;if(req.url==='/974760673'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(fixture));}res.writeHead(404,{'Content-Type':'application/json'});res.end('{"error":"not found"}');});await new Promise(yes=>stub.listen(0,'127.0.0.1',yes));stubBase=`http://127.0.0.1:${stub.address().port}`;
 child=spawn(process.execPath,['server/index.mjs'],{cwd:resolve('.'),env:{...process.env,PORT:'0',HOST:'127.0.0.1',DATA_DIR:dir,ADMIN_PASSWORD:password,PUBLIC_ORIGIN:'',BOOKING_ENABLED:'false',NODE_ENV:'test',EMAIL_ENABLED:'false',BRREG_BASE_URL:stubBase},stdio:['ignore','pipe','pipe']});
 base=await new Promise((yes,no)=>{child.stdout.on('data',c=>{let m=String(c).match(/port (\d+)/);if(m)yes('http://127.0.0.1:'+m[1]);});child.on('exit',c=>no(Error('Server exited '+c)));child.on('error',no);});}
async function stop(){await new Promise(resolve=>{child.once('exit',resolve);child.kill();});stub.closeAllConnections?.();await new Promise(resolve=>stub.close(resolve));}
async function get(path){const r=await fetch(base+path);return {status:r.status,body:await r.json().catch(()=>null)};}
before(start);after(async()=>{await stop();rmSync(dir,{recursive:true,force:true});});
test('brreg lookup validates, normalizes, maps errors and caches',async()=>{
 for(const p of ['/api/brreg/abc','/api/brreg/123','/api/brreg/12345678','/api/brreg/1234567890']){let r=await get(p);assert.equal(r.status,400,p);}
 assert.equal(hits,0,'ugyldige numre skal ikke nå upstream');
 let r=await get('/api/brreg/974760673');assert.equal(r.status,200);
 assert.equal(r.body.navn,'REGISTERENHETEN I BRØNNØYSUND');
 assert.deepEqual(r.body.organisasjonsform,{kode:'ORGL',beskrivelse:'Organisasjonsledd'});
 assert.equal(r.body.forretningsadresse.poststed,'BRØNNØYSUND');
 assert.equal(hits,1);
 r=await get('/api/brreg/974 760 673');assert.equal(r.status,200);assert.equal(r.body.navn,fixture.navn);
 assert.equal(hits,1,'mellomrom normaliseres og svaret caches');
 r=await get('/api/brreg/974760673');assert.equal(hits,1,'treff i cachen når ikke upstream igjen');
 r=await get('/api/brreg/000000000');assert.equal(r.status,404);assert.match(r.body.error,/Brønnøysund/);
 r=await get('/api/brreg/');assert.equal(r.status,400,'tomt nummer valideres bort');});
