// Read-only checks of the deployed application. Does not log in, write data or send mail.
import {pathToFileURL} from 'node:url';
const pages=['/','/about','/topics','/booking','/contact','/pricing-and-services','/faq','/testimonials','/personvern'];
export async function auditServer(address,{live=false,allowLocalHttp=false,log=console.log}={}){
 const origin=new URL(address).origin,url=new URL(address);
 if(url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname))throw Error('Use only the public origin, without credentials, path, query or fragment.');
 if(url.protocol!=='https:'&&!(allowLocalHttp&&url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname)))throw Error('The staging/server address must use HTTPS. Local HTTP is permitted only with --allow-local-http.');
 const checks=[],assets=new Set();
 const get=path=>fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(15000)});
 const check=(ok,label)=>{checks.push({ok,label});log(`${ok?'PASS':'FAIL'} ${label}`);};
 for(const page of pages){const response=await get(page),html=await response.text();check(response.status===200,`Page ${page}`);check((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length===1,`One main heading ${page}`);check(html.includes(`rel="canonical" href="${origin+page}"`),`Canonical address ${page}`);check(live?!response.headers.get('x-robots-tag')?.includes('noindex'):response.headers.get('x-robots-tag')?.includes('noindex'),`Search indexing matches ${live?'live':'staging'} ${page}`);check(!/https?:\/\/[^\s"'<>]*(?:durable\.site|durable\.com|durable\.co)(?:[\/"'<>\s]|$)/i.test(html),`No Durable dependency ${page}`);for(const [,path]of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g))assets.add(path);}
 for(const path of assets)check((await get(path)).status===200,`Local asset ${path}`);
 for(const path of ['/api/admin/enquiries','/api/admin/export','/api/admin/email'])check((await get(path)).status===401,`Owner data protected ${path}`);
 for(const path of ['/.env','/runtime/site.sqlite','/__qa/dashboard'])check((await get(path)).status===404,`Private/test file absent ${path}`);
 const login=await get('/min-side');check(login.headers.get('cache-control')==='no-store'&&login.headers.get('x-robots-tag')?.includes('noindex'),'Owner login is not cached or indexed');
 const sitemap=await get('/sitemap.xml'),xml=await sitemap.text();check(sitemap.status===200&&pages.every(page=>xml.includes(`<loc>${origin+page}</loc>`))&&!xml.includes('/min-side'),'Sitemap contains public pages only');
 const robots=await(await get('/robots.txt')).text();check(live?robots.includes('Sitemap: '+origin+'/sitemap.xml')&&!robots.includes('Disallow: /\n'):robots.includes('Disallow: /\n'),'robots.txt matches deployment stage');
 const content=await get('/api/content');check(content.status===200,'Public content endpoint');const site=await content.json();if(live)check(site.bookingAvailable===true,'Live enquiry forms enabled');else log('INFO Staging forms are '+(site.bookingAvailable?'enabled for controlled testing':'closed'));
 log('MANUAL CHECK REQUIRED: actual booking receipt, Google Workspace delivery and replies, owner login/editing, backups, privacy/invoice details and owner launch approval.');
 const failed=checks.filter(x=>!x.ok).length;log(JSON.stringify({passed:checks.length-failed,failed,mode:live?'live':'staging',httpsTransport:url.protocol==='https:',emailDeliveryTested:false,dataWritten:false}));return failed===0;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){try{if(!process.argv[2])throw Error('Usage: npm run audit:server -- https://staging.example.no [--live]');if(!await auditServer(process.argv[2],{live:process.argv.includes('--live'),allowLocalHttp:process.argv.includes('--allow-local-http')}))process.exitCode=1;}catch(error){console.error('Server audit failed: '+error.message);process.exitCode=1;}}
