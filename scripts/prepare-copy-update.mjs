// Applies reviewed text changes to an exported public-content file, never to a live database.
import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
export function mergePublicCopy(current,changes){
 if(!current?.settings||!current?.pages)throw new Error('Bruk en fersk innholdseksport fra kontrollpanelet.');
 const next=structuredClone(current),conflicts=[];
 for(const change of changes){
  if(change.path[0]!=='pages'||change.path.some(p=>['__proto__','constructor','prototype'].includes(p)))throw new Error('Ugyldig tekstoppdatering.');
  let parent=next;
  for(const key of change.path.slice(0,-1))parent=parent?.[key];
  const key=change.path.at(-1),value=parent?.[key];
  if(!parent||typeof parent!=='object'){conflicts.push(change.path.join('.'));continue;}
  if(isDeepStrictEqual(value,change.after))continue;
  if(!isDeepStrictEqual(value,change.before)){conflicts.push(change.path.join('.'));continue;}
  parent[key]=structuredClone(change.after);
 }
 if(conflicts.length)throw new Error('Egne endringer må gjennomgås før import. Ingen fil er skrevet. Felt: '+conflicts.join(', '));
 return next;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [input,output,mode]=process.argv.slice(2);
 if(mode!==undefined&&!['featured','from-main','prices-formats'].includes(mode))throw new Error('Ukjent oppdatering. Bruk from-main fra den eldre main-versjonen, featured fra mellomversjonen, eller utelat valget for språkoppdateringen.');
 if(!input||!output||resolve(input)===resolve(output))throw new Error('Bruk: node scripts/prepare-copy-update.mjs nåværende-eksport.json ny-import.json (ulike filer).');
 const updateFile=mode==='prices-formats'?'prices-formats-update.json':mode==='from-main'?'from-main-copy-update.json':mode==='featured'?'featured-selection-update.json':'professional-copy-update.json';
 const changes=JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)),'../content/'+updateFile)));
 const result=mergePublicCopy(JSON.parse(readFileSync(input)),changes);
 writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log('Importforslag laget. Bare avtalte offentlige tekstfelt er endret. Innstillinger, bilder og øvrig innhold beholdes. Kontroller filen før import. Ingen database er endret.');
}
