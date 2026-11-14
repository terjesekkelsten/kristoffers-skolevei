/* Røyktest i ekte nettleser: starter spillet, går inn i klasserommet, åpner en modul,
   og sjekker at spillet virker uten nett etter første besøk. Krever Playwright med Chromium.
   Kjøres med «node tests/smoke.mjs». */
import {createRequire} from 'module';import http from 'http';import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const require=createRequire(import.meta.url);const {chromium}=require('playwright');
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webmanifest':'application/manifest+json','.json':'application/json'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(new URL(q.url,'http://x').pathname);if(p.endsWith('/'))p+='index.html';const f=path.join(ROOT,p);
  if(!f.startsWith(ROOT)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
await new Promise(res=>srv.listen(0,'127.0.0.1',res));const URL0='http://127.0.0.1:'+srv.address().port+'/';
const opts={args:['--no-sandbox']};if(process.env.CHROME)opts.executablePath=process.env.CHROME;
const b=await chromium.launch(opts);const ctx=await b.newContext({viewport:{width:1180,height:820}});const pg=await ctx.newPage();
const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
let fails=0;const ok=(c,m)=>{console.log((c?'  ok   ':'  FEIL ')+m);if(!c)fails++;};
const tap=async(x,y)=>{const r=await pg.locator('#cv').boundingBox();await pg.mouse.click(r.x+x*r.width/640,r.y+y*r.height/400);await pg.waitForTimeout(150);};
const sig=async()=>pg.evaluate(()=>{const c=document.getElementById('hc');const x=c.getContext('2d');const k=c.width/640;const d=x.getImageData(158*k,60*k,446*k,180*k).data;let h=0;for(let i=0;i<d.length;i+=997)h=(h*31+d[i])|0;return h;});
const ink=async()=>pg.evaluate(()=>{const c=document.getElementById('hc');const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4000)if(d[i])n++;return n;});
await pg.goto(URL0);await pg.waitForTimeout(800);
ok(await pg.isVisible('#start'),'startskjermen vises');
ok(await pg.evaluate(()=>!!document.querySelector('link[rel=manifest]')),'manifest er lenket');
await pg.click('#bClass');await pg.waitForTimeout(500);
ok(!(await pg.isVisible('#start')),'klasserommet åpnes');
ok(await ink()>50,'tavla er tegnet');
await pg.evaluate(()=>{const d=document.getElementById('dlg');if(d)d.hidden=true;});
for(let i=0;i<4;i++){await pg.waitForTimeout(500);await tap(600,380);}           // lukk Malins velkomst
const s0=await sig();await tap(326,130);await pg.waitForTimeout(300);        // Engelsk-kortet (2. av 4)
const s1=await sig();ok(s1!==s0,'modulvalget for engelsk vises');
await tap(205,100);await pg.waitForTimeout(2500);                                // modul 1A
const s2=await sig();ok(s2!==s1&&await ink()>50,'en modul er startet');
const reg=await pg.evaluate(async()=>{if(!('serviceWorker' in navigator))return 'ingen';const r=await navigator.serviceWorker.ready;return r.active?'aktiv':'ikke aktiv';});
ok(reg==='aktiv','service worker er aktiv ('+reg+')');
await pg.reload();await pg.waitForTimeout(800);
await ctx.setOffline(true);await pg.reload();await pg.waitForTimeout(1200);
ok(await pg.isVisible('#bStart'),'spillet starter uten nett');
await ctx.setOffline(false);
ok(errs.length===0,'ingen feil på siden'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
await b.close();srv.close();console.log(fails?'FEIL i røyktesten':'Røyktesten gikk bra');process.exit(fails?1:0);
