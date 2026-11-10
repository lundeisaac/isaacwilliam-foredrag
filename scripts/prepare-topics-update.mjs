// Prepare an owner-reviewed import; never opens or changes the live database.
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
export function mergeTopics(current,seed){
 if(!current?.settings||!current?.pages?.topics)throw new Error('Bruk en innholdseksport fra kontrollpanelet.');
 const result=structuredClone(current);
 result.pages.topics=structuredClone(seed.pages.topics);
 const oldIntro=result.pages.home?.sections?.[1];
 if(oldIntro?.text?.includes('undertemaer'))oldIntro.text=seed.pages.home.sections[1].text;
 return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [input,output]=process.argv.slice(2);
 if(!input||!output||resolve(input)===resolve(output))throw new Error('Bruk: node scripts/prepare-topics-update.mjs nåværende-eksport.json ny-import.json (ulike filer).');
 const seed=JSON.parse(readFileSync(resolve(dirname(fileURLToPath(import.meta.url)),'../content/site.json')));
 const result=mergeTopics(JSON.parse(readFileSync(input)),seed);
 writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
 console.log('Ny import er laget. Andre sider og innstillinger er bevart, bortsett fra standardhenvisningen til undertemaer på forsiden. Kontroller filen før import i kontrollpanelet. Ingen database er endret.');
}
