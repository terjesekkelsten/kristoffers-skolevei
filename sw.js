/* Service worker: spillet virker uten nett.
   Nett først (så nye versjoner kommer med en gang), og lagret kopi når nettet er borte eller tregt. */
const CACHE='skolevei-v1';
const CORE=['./','index.html','css/style.css','js/game.js','js/tasks.js','js/data.js','js/chess.js','js/util.js','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function timeout(ms){return new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms));}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  const same=u.origin===location.origin,font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);if(!same&&!font)return;
  e.respondWith((async()=>{const c=await caches.open(CACHE);
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res;});
    try{return await Promise.race([net,timeout(4000)]);}
    catch(err){const hit=await c.match(r,{ignoreSearch:true})||(r.mode==='navigate'?await c.match('index.html'):null);if(hit)return hit;return net;}})());});
