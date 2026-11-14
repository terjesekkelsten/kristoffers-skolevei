/* Automatiske tester av alle oppgavegeneratorer. Kjøres med «node tests/run.mjs» (ingen avhengigheter).
   Vercel kjører dem før hver publisering: feiler en test, blir ikke den nye versjonen publisert. */
import {env,gen2,taskKey,taskSnap,taskFromSnap,mateMoves,isMate} from '../js/tasks.js';
import * as D from '../js/data.js';
import {sjNew,sjLegal,sjMake,sjUndo,sjBest} from '../js/chess.js';

let fails=0,checks=0;const errs=[];
function ok(c,msg){checks++;if(!c){fails++;if(errs.length<40)errs.push(msg);}}
const SUBJ={norsk:20,engelsk:20,matte:20,tenk:6};
const KEYS=new Set('qwertyuiopåasdfghjkløæzxcvbnm');
const norm=s=>String(s).toLowerCase().replace(/[’']/g,"'").replace(/\s+/g,' ').trim();
const numOk=v=>/^-?\d+(,\d+)?$/.test(String(v).trim());
const bad=s=>/undefined|NaN|\[object/.test(String(s));

function setEnv(trinn){env.CH={name:'Kristoffer'};env.PR=()=>({trinn,opp:{},divLay:'std'});env.DB={};env.CL=null;
  env.PROG={matte:{open:20,stars:[]},norsk:{open:20,stars:[]},engelsk:{open:20,stars:[]},tenk:{open:6,stars:[]}};}

function checkTask(t,where){
  ok(t&&typeof t==='object',where+': ingen oppgave');if(!t)return;
  const k=t.kind;ok(['mc','num','stav','opp','skriv','bygg','linje','aapen','sjakk'].includes(k),where+': ukjent type '+k);
  const txt=JSON.stringify(Object.assign({},t,{regen:undefined}));ok(!bad(txt),where+': undefined/NaN i oppgaven '+txt.slice(0,160));
  if(k==='mc'){ok(Array.isArray(t.opts)&&t.opts.length>=2,where+': for få svaralternativer');
    ok(Number.isInteger(t.ans)&&t.ans>=0&&t.ans<t.opts.length,where+': fasit utenfor alternativene');
    const keys=t.opts.map(o=>JSON.stringify(o));ok(new Set(keys).size===keys.length,where+': like svaralternativer '+keys.join(' '));
    ok(t.say||t.q||t.frac,where+': mangler spørsmål');}
  if(k==='num'){ok(numOk(t.ans),where+': tallsvar er ikke et tall: '+t.ans);ok(t.q&&t.q[0],where+': mangler spørsmål');}
  if(k==='skriv'){ok(t.ans&&[...norm(t.ans)].every(c=>KEYS.has(c)),where+': skrivesvar har tegn som ikke finnes på tastaturet: '+t.ans);}
  if(k==='bygg'){ok(t.target.join(' ')===t.ans,where+': setningen stemmer ikke med ordene');ok([...t.tiles].sort().join('|')===[...t.target].sort().join('|'),where+': brikkene stemmer ikke med setningen');
    ok(!t.ans.includes('{NAME}'),where+': navnet er ikke satt inn');}
  if(k==='linje'){ok(t.a<t.target&&t.target<t.b&&t.tol>0,where+': tallinja har mål utenfor linja');}
  if(k==='aapen'){ok(Number.isInteger(t.target)&&t.target>2,where+': ugyldig mål');}
  if(k==='stav'){ok(typeof t.letters==='string'&&t.letters.length>0,where+': mangler ord');
    const pool=t.tiles.map(x=>x.ch).join('');ok([...t.letters].every(c=>pool.includes(c)),where+': mangler bokstavbrikker for '+t.letters);}
  if(k==='opp'){ok(Array.isArray(t.steps)&&t.steps.length>0,where+': oppstilling uten steg');}
  if(k==='sjakk'){const s=sjNew(t.fen);
    if(t.n===1)ok(mateMoves(s).length>0,where+': matt i 1 uten matt: '+t.fen);
    else{const m=sjLegal(s,false).find(q=>q.f===t.sol[0][0]&&q.t===t.sol[0][1]);ok(!!m,where+': løsningstrekket er ikke lovlig: '+t.fen);}}
  // repetisjon: oppgaven kan lagres og hentes tilbake
  if(k!=='opp'||t.recipe){const sn=taskSnap(t);ok(sn,where+': kan ikke lagres for repetisjon');
    if(sn){const back=taskFromSnap(JSON.parse(JSON.stringify(sn)));ok(back&&back.kind===k,where+': repetisjon gir feil type');
      if(back&&k!=='opp'&&k!=='stav')ok(taskKey(back)===taskKey(t),where+': repetisjon gir annen nøkkel');}}}

// 1. alle moduler, mange ganger, for 1. og 4. trinn
const distinct={};
for(const trinn of [1,4]){setEnv(trinn);
  for(const [subj,n] of Object.entries(SUBJ))for(let L=0;L<n;L++){const id=subj+' '+L;distinct[id]=distinct[id]||new Set();
    for(let r=0;r<(trinn===1?60:20);r++){let T;try{T=gen2(subj,L);}catch(e){ok(false,id+': krasjet: '+e.message);continue;}
      ok(Array.isArray(T)&&T.length===5,id+': skal ha 5 oppgaver, har '+(T&&T.length));
      for(const t of T||[]){try{checkTask(t,id);distinct[id].add(taskKey(t));}catch(e){ok(false,id+': sjekk krasjet: '+e.message);}}}}}
// 2. modulene skal ikke kunne pugges: minst 30 ulike oppgaver fra 6A (P6) og i Tenk.
//    1A–5B i engelsk øver på små, faste mengder (farger, tall, ukedager), så der kreves minst 12.
for(const [id,s] of Object.entries(distinct)){const [subj,L]=id.split(' ');if(subj==='matte')continue;
  const min=(subj==='tenk'||+L>=10)?30:12;ok(s.size>=min,id+': bare '+s.size+' ulike oppgaver (krav '+min+')');}
// 3. oppgavebanker med minst 30 oppgaver
const banks={RIM:D.RIM,SKRIV:D.SKRIV,MOTS:D.MOTS,PHRASES:D.PHRASES,DIKT1:D.DIKT1,DIKT2:D.DIKT2,DIKT3:D.DIKT3,ENW:D.ENW,BYGG_NO1:D.BYGG_NO1,BYGG_NO2:D.BYGG_NO2,BYGG_EN1:D.BYGG_EN1,BYGG_EN2:D.BYGG_EN2,M1:D.M1,M2:D.M2};
for(const [n,b] of Object.entries(banks))ok(b.length>=30,'bank '+n+' har bare '+b.length);
ok(D.LES_NO.length*3>=30&&D.LES_EN.length*3>=30,'for få lesespørsmål');
for(const H of [D.NO_HI,D.EN_HI])for(const [k,v] of Object.entries(H))ok(v.d.length>=30,'bank for modul '+k+' har bare '+v.d.length);
ok(D.KLASS.reduce((s,k)=>s+k[2].length,0)>=30,'ordklasser har under 30');
// 4. sjakkoppgaver: alle matt i 1 har matt, alle matt i 2 tvinger matt
for(const f of D.M1)ok(mateMoves(sjNew(f)).length>0,'M1 uten matt: '+f);
for(const e of D.M2){const s=sjNew(e[0]);ok(mateMoves(s).length===0,'M2 har matt i 1: '+e[0]);
  for(const [f,t] of e.slice(1)){const m=sjLegal(s,false).find(q=>q.f===f&&q.t===t);ok(!!m,'M2 ulovlig trekk: '+e[0]);if(!m)continue;sjMake(s,m);const R=sjLegal(s,false);ok(R.length>0,'M2 patt: '+e[0]);
    for(const r of R){sjMake(s,r);ok(mateMoves(s).length>0,'M2 svar uten matt: '+e[0]);sjUndo(s,r);}sjUndo(s,m);}}
// 5. sjakkmotoren finner et lovlig trekk fra startstillingen
{const s=sjNew();const m=sjBest(s,{d:2,q:true,noise:0});ok(m&&sjLegal(s,false).some(q=>q.f===m.f&&q.t===m.t),'sjakkmotoren fant ikke et lovlig trekk');}

console.log((fails?'FEIL':'OK')+': '+(checks-fails)+' av '+checks+' sjekker gikk bra.');
if(fails){errs.forEach(e=>console.log(' - '+e));process.exit(1);}
