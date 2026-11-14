/* Oppgavegeneratorer for alle fag og moduler. Ingen DOM. Spilltilstand hentes via env, som spillet kobler til. */
export const env={CH:{name:'Kristoffer'},PR:()=>({}),PROG:{matte:{open:1},norsk:{open:1},engelsk:{open:1},tenk:{open:6}},CL:null,DB:null};
import {pick,rnd,shuffle} from './util.js';
import {BYGG_EN1,BYGG_EN2,BYGG_NO1,BYGG_NO2,COLS,DAYS,DIKT1,DIKT2,DIKT3,DOT,DYR,EN,ENW,EN_HI,FIGN,KLASS,LES_EN,LES_NO,M1,M2,MOTS,NO,NOART,NO_HI,NUMEN,PHRASES,PICS,PLACEN,PNAME,PROPER_EN,RIM,SKRIV,SNAPSKIP,SUP,TADJ,TNAMES,X_GR,X_QA,X_SY,X_VB} from './data.js';
import {sjInCheck,sjLegal,sjMake,sjNew,sjUndo} from './chess.js';
/* task builders */
export function mc(o){return Object.assign({kind:'mc',layout:'cards'},o);}
export function numOpts(ans,n,spread){const set=new Set([ans]);for(const d of shuffle(spread.slice())){if(set.size>=n)break;if(ans+d>=0)set.add(ans+d);}let k=1;while(set.size<n){set.add(ans+k);k++;}return shuffle([...set]);}
export function mathTask(a,op,b,n,spread,apples){const ans=op==='+'?a+b:op==='-'?a-b:op==='×'?a*b:a/b;return numTask(a+(op==='×'?DOT:op)+b+'=?',ans,'Hva er '+a+' '+({'+':'pluss','-':'minus','×':'ganger',':':'delt på'}[op])+' '+b+'?',{apples:apples?{a,b,op}:null,fact:op==='×'?{a,b}:op===':'?{a:b,b:a/b}:null});}
export function stavTask(k,extra){const w=NO[k];const pool='AEIOSTLNRMKBDGHPUV'.split('').filter(ch=>!w.includes(ch));const tiles=shuffle([...w.split(''),...shuffle(pool).slice(0,extra)]).map(ch=>({ch,used:false}));
  return {kind:'stav',pic:k,letters:w,tiles,filled:0,errs:0,say:'Malin har tegnet '+NOART[k]+'. Stav ordet '+w.toLowerCase()+'.'};}
export function rowsTask(o,correct,wrongs){const opts=shuffle([correct,...wrongs]);return mc(Object.assign({layout:'rows',opts:opts.map(t=>({t})),ans:opts.indexOf(correct),reveal:correct},o));}
export function gen(subj,L){if(L>=10)return genTop(subj,L).slice(0,5);if(L>=8)return genHi(subj,L);const T=[];
  if(subj==='matte'){
    for(let i=0;i<5;i++){
      if(L===0){const a=rnd(1,3),b=rnd(1,5-a);T.push(mathTask(a,'+',b,3,[1,-1,2],true));}
      if(L===1){if(i<3){const a=rnd(1,6),b=rnd(1,10-a);T.push(mathTask(a,'+',b,3,[1,-1,2,-2],true));}else{const a=rnd(4,10),b=rnd(1,a-1);T.push(mathTask(a,'-',b,3,[1,-1,2],true));}}
      if(L===2){if(i%2===0){const a=rnd(6,14),b=rnd(2,6);T.push(mathTask(a,'+',b,3,[1,-1,2,-2,10],false));}else{const a=rnd(11,20),b=rnd(2,9);T.push(mathTask(a,'-',b,3,[1,-1,2,-2,-10],false));}}
      if(L===3){if(i<2){const a=rnd(1,8)*10,b=rnd(1,9-a/10)*10;T.push(mathTask(a,'+',b,3,[10,-10,1],false));}else{const t=rnd(1,8)*10,u=rnd(0,5),b=rnd(1,9-u);T.push(mathTask(t+u,'+',b,3,[1,-1,10,-10],false));}}
      if(L===4){if(i===0){const a=rnd(25,59),b=rnd(16,39);T.push(mathTask(a,'+',b,3,[10,-10,1,-1],false));}else if(i===1){const a=rnd(52,95),b=rnd(17,48);T.push(mathTask(a,'-',b,3,[10,-10,1,-1],false));}else T.push(oppTaskOf([gAdd2,gSub2,pick([gAdd2,gSub2])][i-2]));}
      if(L===5){if(i<2){const f=[2,5,10][rnd(0,2)],n=rnd(2,10);T.push(mathTask(n,'×',f,3,[f,-f,1,-1],false));}else if(i<4)T.push(oppTaskOf(gMulNoCarry));else T.push(oppTaskOf(gDivNoCarry));}
      if(L===6){const f=pick([3,4,6,7,8,9]),n=rnd(2,10);if(i<2)T.push(mathTask(n,'×',f,4,[f,-f,1,-1,10],false));else if(i===2)T.push(mathTask(n*f,':',f,4,[1,-1,2,-2],false));else if(i===3)T.push(oppTaskOf(gMulCarry));else T.push(oppTaskOf(gDiv2));}
      if(L===7)T.push(oppTaskOf([gAdd3,gSubZero,gMul3,gSub3,gDivZero][i]));}}
  if(subj==='engelsk'){const keys=Object.keys(PICS);const colk=Object.keys(COLS);
    for(let i=0;i<5;i++){
      if(L===0){const k=pick(keys),o=shuffle([k,...shuffle(keys.filter(x=>x!==k)).slice(0,2)]);T.push(mc({q:['WHICH ONE IS',EN[k].toUpperCase()],say:'Hvilket bilde er',en:EN[k],opts:o.map(p=>({pic:p})),ans:o.indexOf(k),reveal:EN[k]}));}
      if(L===1){const k=pick(colk),o=shuffle([k,...shuffle(colk.filter(x=>x!==k)).slice(0,2)]);T.push(mc({q:['WHICH COLOUR?'],say:'Hvilken farge er',en:k,opts:o.map(c=>({color:COLS[c][0]})),ans:o.indexOf(k),reveal:k}));}
      if(L===2){const n=rnd(1,10),o=numOpts(n,3,[1,-1,2,-2,3]).filter(v=>v<=10&&v>=0);while(o.length<3)o.push(n+o.length+3);T.push(mc({q:['WHICH NUMBER?'],say:'Hvilket tall er',en:NUMEN[n],opts:o.map(v=>({n:v})),ans:o.indexOf(n),reveal:NUMEN[n]}));}
      if(L===3){const k=pick(keys);const w=shuffle(keys.filter(x=>x!==k)).slice(0,2).map(x=>EN[x].toUpperCase());T.push(rowsTask({pic:k,say:'Hva heter '+NOART[k]+' på engelsk?',enOk:EN[k]},EN[k].toUpperCase(),w));}
      if(L===4){const k=pick(colk);const w=shuffle(colk.filter(x=>x!==k)).slice(0,2).map(x=>x.toUpperCase());T.push(rowsTask({color:COLS[k][0],say:'Hva heter '+COLS[k][1]+' på engelsk?',enOk:k},k.toUpperCase(),w));}
      if(L===5){const n=rnd(11,20);const w=shuffle([11,12,13,14,15,16,17,18,19,20].filter(x=>x!==n)).slice(0,2).map(x=>NUMEN[x].toUpperCase());T.push(rowsTask({q:[String(n)],say:'Hva heter '+n+' på engelsk?',enOk:NUMEN[n]},NUMEN[n].toUpperCase(),w));}
      if(L===6){const d=pick(DAYS);const w=shuffle(DAYS.filter(x=>x!==d)).slice(0,2).map(x=>x[1]);T.push(rowsTask({q:[d[0]+' = ?'],say:'Hva er '+d[0].toLowerCase()+' på engelsk?',enOk:d[1].toLowerCase()},d[1],w));}
      if(L===7){const PH=PHRASES.map(p=>p.map(x=>x.replace('KRISTOFFER',env.CH.name.toUpperCase()).replace('{AGE}',ageOf().no).replace('{AGEEN}',ageOf().en)));const ph=PH[(i*3+rnd(0,7))%PH.length];const w=shuffle(PH.filter(x=>x[0]!==ph[0]&&!x[0].includes('HETER'))).slice(0,2).map(x=>x[1]);T.push(rowsTask({q:[ph[0]],sent:true,say:'Hvordan sier du '+ph[0].toLowerCase().replace('?','')+', på engelsk?',enOk:ph[1].toLowerCase()},ph[1],w));}}}
  if(subj==='norsk'){
    const short=['sun','car','house','book','tree'],four=['cat','dog','fish','ball','apple','bird'],long=['flower','star','heart'];
    if(L===0){for(const k of shuffle(Object.keys(PICS)).slice(0,5)){const f=NO[k][0];const o=shuffle([f,...shuffle('ABDEFGHIKLMNOPRSTU'.split('').filter(c=>c!==f)).slice(0,2)]);T.push(mc({pic:k,say:'Hvilken bokstav begynner '+NO[k].toLowerCase()+' med?',opts:o.map(t=>({t})),ans:o.indexOf(f),reveal:f}));}}
    if(L===1)for(const k of shuffle(short))T.push(stavTask(k,1));
    if(L===2)for(const k of shuffle(four).slice(0,5))T.push(stavTask(k,2));
    if(L===3)for(const r of shuffle(RIM.slice()).slice(0,5))T.push(rowsTask({q:[r[0]],say:'Hva rimer på '+r[0].toLowerCase()+'?'},r[1][0],r[1].slice(1)));
    if(L===4){for(const k of shuffle(long))T.push(stavTask(k,1));for(const k of shuffle(four).slice(0,2))T.push(stavTask(k,3));}
    if(L===5)for(let i=0;i<5;i++){const K=KLASS[i%3];const set=pick(K[2]);T.push(rowsTask({q:[K[0]],say:K[1]},set[0],set.slice(1)));}
    if(L===6)for(const s of shuffle(SKRIV.slice()).slice(0,5))T.push(rowsTask({q:['HVILKET ORD ER RIKTIG?'],say:'Hvilket ord er skrevet riktig? '+s[0].toLowerCase()+'.'},s[0],s.slice(1)));
    if(L===7)for(const m of shuffle(MOTS.slice()).slice(0,5))T.push(rowsTask({q:[m[0]],say:m[0].includes('+')?m[0].toLowerCase().replace('+','pluss')+'. Hvilket ord blir det?':'Hva er '+m[0].toLowerCase()+'?'},m[1],m[2]));}
  return T.slice(0,5);}
export function nice(s){{const ct0=env.CL&&env.CL.tasks&&env.CL.tasks[env.CL.i];if(ct0&&ct0.raw)return s;}return s.replace(/-/g,'−').replace(/:/g,' : ').replace(/[×·]/g,' · ').replace(/\+/g,' + ').replace(/=/g,' = ').replace(/\s+/g,' ').trim();}
export function numTask(q,ans,say,o){return Object.assign({kind:'num',q:[q],ans:String(ans),say,inp:'',reveal:String(ans)},o||{});}
export function lc(s){s=String(s);{const ct0=env.CL&&env.CL.tasks&&env.CL.tasks[env.CL.i];if(ct0&&ct0.raw)return s;}if(!env.CL||env.CL.subj==='matte'||env.CL.subj==='tenk'||env.CL.lvl<2||!/[A-ZÆØÅ]/.test(s))return s;
  let r=s.toLowerCase();const ct=env.CL.tasks&&env.CL.tasks[env.CL.i];if((ct&&ct.sent)||(/[a-zæøå] [a-zæøå_]/.test(r)&&!/\+/.test(r)))r=r.charAt(0).toUpperCase()+r.slice(1);
  const words=(env.CL.subj==='engelsk'?PROPER_EN:[]).concat([env.CH.name]);
  for(const w of words){const lw=w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');r=r.replace(new RegExp('(^|[^a-zæøåA-ZÆØÅ])'+lw+'(?=$|[^a-zæøåA-ZÆØÅ])','g'),(m,p)=>p+w);}
  return r;}
export function ageOf(){const tr=(env.DB&&env.PR().trinn)||1;return{no:['SEKS','SJU','ÅTTE','NI','TI','ELLEVE','TOLV','TRETTEN','FJORTEN','FEMTEN'][Math.min(9,tr-1)],en:['SIX','SEVEN','EIGHT','NINE','TEN','ELEVEN','TWELVE','THIRTEEN','FOURTEEN','FIFTEEN'][Math.min(9,tr-1)]};}
export const sp=n=>String(n);
export function digs(n){return String(n).split('').map(Number);}
export function oCell(t,r,c,v,kind){t.cells[r+','+c]={v,kind};}
export function oStep(t,r,c,v,ask,how,x){const key=r+','+c;const s=Object.assign({key,v,ask,how},x||{});t.steps.push(s);
  oCell(t,r,c,v,(x&&x.small)?'mente':(x&&x.opt)?'opt':'ans');return s;}
export function oBase(op,W,nRows,small){return{kind:'opp',op,W,rows:Array.from({length:nRows},(_,i)=>({small:!!(small&&small.includes(i))})),cells:{},signs:[],lines:[],steps:[],marks:[],strikes:[],ent:{},si:0,errs:0,tries:0,placed:{}};}
/* tall som tekst med komma */
export function nParts(s){const[i,d]=String(s).split(',');return{i,d:d||''};}
export function toU(n,P){return parseInt(n.i+n.d.padEnd(P,'0'),10);}
export function fmtU(u,P){if(!P)return String(u);const s=String(u).padStart(P+1,'0');return s.slice(0,-P)+','+s.slice(-P);}
export function dStr(x,dp){return x.toFixed(dp).replace('.',',');}
export function nDig(n,k){if(k>=0){const i=n.i.length-1-k;return i>=0?+n.i[i]:null;}const j=-k-1;return j<n.d.length?+n.d[j]:null;}
/* plasseringssteg: spilleren trykker der eneren (eller kommaet) skal stå */
export function oPlace(t,row,n,anchor,first){const lab=n.i+(n.d?','+n.d:'');const dec=!!n.d;const uv=n.i[n.i.length-1];
  t.steps.push({place:true,row,anchor,key:row+','+anchor,label:lab,dec,first,
    ask:first?'Skriv '+lab+' på arket. Trykk i ruta der '+(dec?'kommaet':'eneren '+uv)+' skal stå.':'Nå skal '+lab+' under. Trykk i ruta der '+(dec?'kommaet':'eneren '+uv)+' skal stå.',
    how:first?'Vi skriver '+lab+' først.':(dec?'Kommaet skal stå rett under kommaet over.':'Eneren '+uv+' skal stå rett under eneren over. Enerne står under hverandre.')});}
/* gjør arket bredere så spilleren kan velge hvor stykket står */
export function oWiden(t,target){const ex=Math.max(0,target-t.W);if(!ex)return t;oShift(t,Math.floor(ex/2));t.W+=ex;return t;}
export function oShift(t,dx){if(!dx)return;const sk=k=>{const[r,c]=k.split(',').map(Number);return r+','+(c+dx);};
  const nc={};for(const[k,v]of Object.entries(t.cells))nc[sk(k)]=v;t.cells=nc;
  t.steps.forEach(s=>{s.key=sk(s.key);if(s.from)s.from=sk(s.from);if(s.anchor!=null)s.anchor+=dx;});
  t.signs.forEach(s=>s.c+=dx);t.lines.forEach(l=>{l.c0+=dx;l.c1+=dx;});t.marks.forEach(m=>m.c+=dx);t.strikes.forEach(m=>m.c+=dx);
  if(t.qkeys)t.qkeys=t.qkeys.map(sk);if(t.remKeys)t.remKeys=t.remKeys.map(sk);}
/* ---------- PLUSS ---------- */
export function oppAdd(strs){const N=strs.map(nParts),m=N.length,P=Math.max(...N.map(n=>n.d.length));
  const S=nParts(fmtU(N.reduce((a,n)=>a+toU(n,P),0),P));const intW=Math.max(...N.map(n=>n.i.length),S.i.length);
  const cc=1+intW,W=1+intW+(P?1+P:0),col=k=>P?(k>=0?cc-1-k:cc-k):(W-1-k);
  const t=oBase('add',W,m+2,[0]);t.recipe={f:'add',a:strs.slice()};t.dec=P>0;t.label=strs.join(' + ');t.spoken=strs.map(s=>s.replace(',',' komma ')).join(' pluss ');t.answerText=S.i+(S.d?','+S.d:'');t.dir=-1;t.prodRow=m+1;t.N=N;t.P=P;t.col=col;
  N.forEach((n,j)=>{const r=1+j;for(let k=-n.d.length;k<n.i.length;k++)oCell(t,r,col(k),nDig(n,k),'pre');
    if(P){if(n.d)oCell(t,r,cc,',','pre');else oCell(t,r,cc,',','opt');for(let k=-P;k<-n.d.length;k++)oCell(t,r,col(k),0,'opt');}
    oPlace(t,r,n,n.d?cc:col(0),j===0);});
  t.signs.push({r:m,c:0,ch:'+',ent:true});t.lines.push({r:m,c0:0,c1:W-1,main:true});
  let carry=0;const top=S.i.length-1;
  for(let k=-P;k<=top;k++){const ds=N.map(n=>nDig(n,k)).filter(v=>v!=null);const s=ds.reduce((a,b)=>a+b,0)+carry;
    const parts=ds.slice();if(carry)parts.push(carry);
    const pn=k>=0?PLACEN[k]:(k===-1?'tidelene':'hundredelene');const ask=parts.length>1?'Legg sammen '+pn+': '+parts.join(' pluss ')+'.'+(carry?' Husk mente!':''):(ds.length?'Her er det bare '+s+'. Skriv det ned.':'Skriv '+s+' fra mente.');
    const how=(parts.length>1?parts.join(' pluss ')+' er '+s+'. ':'')+'Skriv '+s%10+(s>=10?' og '+Math.floor(s/10)+' i mente.':'.');
    const plain=ds.reduce((a,b)=>a+b,0)%10;
    oStep(t,m+1,col(k),s%10,ask,how,{plain,carry});
    carry=Math.floor(s/10);
    const nxt=k+1;if(carry&&nxt<=top&&N.some(n=>nDig(n,nxt)!=null))oStep(t,0,col(nxt),carry,'Skriv '+carry+' i mente, lite, øverst over '+PLACEN[Math.max(0,nxt)]+'.','Mente skrives lite over neste kolonne, så du husker å legge den til.',{small:true});
    if(k===-1)oStep(t,m+1,cc,',','Nå er du ved kommaet. Hva skal stå her i svaret?','Kommaet i svaret skal stå rett under kommaene over.');}
  return oWiden(t,Math.min(13,Math.max(W+4,10)));}
/* ---------- MINUS med veksling ---------- */
export function oppSub(sa,sb){const A=nParts(sa),B=nParts(sb),P=Math.max(A.d.length,B.d.length);
  const S=nParts(fmtU(toU(A,P)-toU(B,P),P));const intW=Math.max(A.i.length,B.i.length);
  const cc=1+intW,W=1+intW+(P?1+P:0),col=k=>P?(k>=0?cc-1-k:cc-k):(W-1-k);
  const t=oBase('sub',W,4,[0]);t.recipe={f:'sub',a:[sa,sb]};t.dec=P>0;t.label=sa+' − '+sb;t.spoken=sa.replace(',',' komma ')+' minus '+sb.replace(',',' komma ');t.answerText=S.i+(S.d?','+S.d:'');t.dir=-1;t.prodRow=3;t.A=A;t.B=B;t.P=P;t.col=col;
  for(let k=-A.d.length;k<A.i.length;k++)oCell(t,1,col(k),nDig(A,k),'pre');for(let k=-B.d.length;k<B.i.length;k++)oCell(t,2,col(k),nDig(B,k),'pre');
  if(P){oCell(t,1,cc,',','pre');oCell(t,2,cc,',',B.d?'pre':'opt');for(let k=-P;k<-B.d.length;k++)oCell(t,2,col(k),0,'opt');}
  oPlace(t,1,A,A.d?cc:col(0),true);oPlace(t,2,B,B.d?cc:col(0),false);
  t.signs.push({r:2,c:0,ch:'−',ent:true});t.lines.push({r:2,c0:0,c1:W-1,main:true});
  for(let k=-P;k<-A.d.length;k++)oStep(t,1,col(k),0,'Det er en tom plass etter kommaet i '+sa+'. Skriv 0 der, så blir det like mange desimaler.','En tom plass etter kommaet er det samme som 0.',{opt:true});
  const cur={};for(let k=-P;k<A.i.length;k++)cur[k]=nDig(A,k)||0;
  const ansTop=S.i.length-1;
  for(let k=-P;k<A.i.length;k++){let top=cur[k];const bot=nDig(B,k)||0;const orig=nDig(A,k)||0;
    if(top<bot){let j=k+1;while(cur[j]===0)j++;
      const was=cur[j];cur[j]--;
      const s1=oStep(t,0,col(j),cur[j],'Du kan ikke ta '+bot+' fra '+top+'. Da må du veksle. '+(j===k+1?'Lån én fra '+was+' ved siden av.':'Det står 0 ved siden av, så du må låne fra '+was+'.')+' Hva blir '+was+' minus 1? Skriv det lite over.',was+' minus 1 er '+cur[j]+'. Stryk over '+was+' og skriv '+cur[j]+' lite over.',{small:true,veks:true});
      t.strikes.push({r:1,c:col(j),s:s1});let last=s1;
      for(let i=j-1;i>k;i--){cur[i]=9;last=oStep(t,0,col(i),9,'Nullen får 10, men må låne bort én videre. Hva blir 10 minus 1?','10 minus 1 er 9. Skriv 9 lite over nullen.',{small:true,veks:true});t.strikes.push({r:1,c:col(i),s:last});}
      t.marks.push({r:1,c:col(k),s:last});top+=10;}
    const d=top-bot;
    if(k>ansTop&&k>=0){oCell(t,3,col(k),0,'opt');}
    else oStep(t,3,col(k),d,(top>=10?'Nå har du '+top+'. ':'')+'Hva er '+top+' minus '+bot+'?',top+' minus '+bot+' er '+d+'.',{lms:Math.abs(orig-bot)});
    if(k===-1)oStep(t,3,cc,',','Nå er du ved kommaet. Hva skal stå her i svaret?','Kommaet i svaret skal stå rett under kommaene over.');}
  return oWiden(t,Math.min(13,Math.max(W+4,10)));}
/* ---------- GANGE ---------- */
export function mulDigits(t,A,b,row,shift,allowMente){
  const n=A.length,W=t.W;let carry=0;
  for(let i=0;i<n;i++){const ai=A[n-1-i],c=W-1-i-shift,v=ai*b+carry,last=i===n-1;
    const ask=carry?'Gang '+ai+' med '+b+', og legg til '+carry+' i mente.':'Hva er '+ai+' ganger '+b+'?';
    const how=ai+' ganger '+b+' er '+ai*b+(carry?', pluss '+carry+' i mente blir '+v:'')+'.';
    const x={plain:(ai*b)%10,carry};
    if(last&&v>=10){oStep(t,row,c,v%10,ask+' Skriv enersifferet.',how+' Skriv '+v%10+' her.',x);oStep(t,row,c-1,Math.floor(v/10),'Skriv '+Math.floor(v/10)+' foran.',how+' Da skriver du '+Math.floor(v/10)+' foran.');}
    else{oStep(t,row,c,v%10,ask+(v>=10?' Skriv enersifferet.':''),how+(v>=10?' Skriv '+v%10+(allowMente?', og skriv '+Math.floor(v/10)+' i mente.':', og husk '+Math.floor(v/10)+' i mente.'):' Skriv '+v+'.'),x);
      if(allowMente&&!last&&v>=10)oStep(t,0,c-1,Math.floor(v/10),'Skriv '+Math.floor(v/10)+' i mente, lite, over neste siffer.','Mente skrives lite over sifferet du skal gange etterpå.',{small:true});}
    carry=Math.floor(v/10);}}
export function oppMul1(a,b){const A=digs(a),n=A.length,p=a*b,W=Math.max(n,digs(p).length)+1;
  const t=oBase('mul1',W,4,[0]);t.recipe={f:'mul1',a:[a,b]};t.a=a;t.b=b;t.label=a+' '+DOT+' '+b;t.spoken=a+' ganger '+b;t.answerText=sp(p);t.dir=-1;
  A.forEach((d,i)=>oCell(t,1,W-n+i,d,'pre'));oCell(t,2,W-1,b,'pre');t.signs.push({r:2,c:0,ch:DOT,ent:true});t.lines.push({r:2,c0:0,c1:W-1,main:true});
  oPlace(t,1,{i:String(a),d:''},W-1,true);oPlace(t,2,{i:String(b),d:''},W-1,false);
  mulDigits(t,A,b,3,0,true);t.prodRow=3;return oWiden(t,Math.min(12,Math.max(W+4,9)));}
export function oppMul2(a,b){const A=digs(a),B=digs(b),b0=B[B.length-1],b1=B[0],p1=a*b0,p2=a*b1,p=a*b;
  const W=Math.max(digs(p).length,digs(p2).length+1,A.length,B.length)+1;
  const t=oBase('mul2',W,5);t.recipe={f:'mul2',a:[a,b]};t.a=a;t.b=b;t.label=a+' '+DOT+' '+b;t.spoken=a+' ganger '+b;t.answerText=sp(p);t.dir=-1;
  A.forEach((d,i)=>oCell(t,0,W-A.length+i,d,'pre'));B.forEach((d,i)=>oCell(t,1,W-B.length+i,d,'pre'));
  oPlace(t,0,{i:String(a),d:''},W-1,true);oPlace(t,1,{i:String(b),d:''},W-1,false);
  t.signs.push({r:1,c:0,ch:DOT,ent:true},{r:3,c:0,ch:'+',ent:true,opt:true});t.lines.push({r:1,c0:0,c1:W-1,main:true},{r:3,c0:0,c1:W-1,main:true});
  mulDigits(t,A,b0,2,0,false);
  oStep(t,3,W-1,0,'Nå ganger du med '+b1+' tiere. Hva skriver du på enerplassen?','Du ganger med '+b1*10+', så det blir 0 på enerplassen.',{zero:true});
  mulDigits(t,A,b1,3,1,false);
  const P=digs(p),r1=String(p1),r2=String(p2*10);let carry=0;
  for(let i=0;i<P.length;i++){const c=W-1-i;const d1=i<r1.length?+r1[r1.length-1-i]:null,d2=i<r2.length?+r2[r2.length-1-i]:null;
    const parts=[d1,d2].filter(v=>v!=null);if(carry)parts.push(carry);const s=parts.reduce((q,v)=>q+v,0);
    const ask=parts.length>1?'Legg sammen: '+parts.join(' pluss ')+'.':(d1==null&&d2==null?'Skriv '+s+' fra mente.':'Her er det bare '+s+'. Skriv det ned.');
    oStep(t,4,c,P[P.length-1-i],ask,parts.join(' pluss ')+' er '+s+'. Skriv '+s%10+(s>=10&&i<P.length-1?', og husk 1 i mente.':'.'));carry=Math.floor(s/10);}
  t.prodRow=4;return oWiden(t,Math.min(12,Math.max(W+3,9)));}
/* ---------- DELE: vanlig oppsett (675 : 5 = 135) eller trapp (svaret over) ---------- */
export function divLay(){try{return env.PR().divLay||'std';}catch(e){return 'std';}}
export function oppDiv(D,d,lay){lay=lay||divLay();const trapp=lay==='trapp';
  const Ds=digs(D),n=Ds.length,q=Math.floor(D/d),rem=D%d,Q=digs(q),dd=digs(d),ld=dd.length,R=rem?digs(rem):[];
  const Drow=trapp?1:0,Doff=trapp?ld+1:1,qc=n+3+ld;
  const W=trapp?Doff+n+(rem?2+R.length:0):qc+Q.length+(rem?2+R.length:0);
  const t=oBase('div',W,1);t.recipe={f:'div',a:[D,d]};t.D=D;t.d=d;t.lay=lay;t.label=D+' : '+d;t.spoken=D+' delt på '+d;t.answerText=q+(rem?' rest '+rem:'');t.dir=1;t.q=q;t.rem=rem;t.qkeys=[];t.remKeys=[];
  Ds.forEach((v,i)=>oCell(t,Drow,Doff+i,v,'pre'));
  if(trapp){dd.forEach((v,i)=>oCell(t,1,i,v,'pre'));t.signs.push({r:1,c:ld,ch:')'});t.lines.push({r:0,c0:Doff,c1:Doff+n-1,top:true});if(rem)t.signs.push({r:0,c:Doff+n,ch:'rest',span:2});}
  else{dd.forEach((v,i)=>oCell(t,0,n+2+i,v,'pre'));t.signs.push({r:0,c:n+1,ch:':'},{r:0,c:n+2+ld,ch:'='});if(rem)t.signs.push({r:0,c:qc+Q.length,ch:'rest',span:2});}
  let pos=0,cur=Ds[0];while(cur<d&&pos<n-1){pos++;cur=cur*10+Ds[pos];}
  let row=Drow+1,curRow=Drow,qi=0,maxRow=Drow;
  for(;;){const qd=Math.floor(cur/d);const qcol=trapp?Doff+pos:qc+qi;
    const s=oStep(t,0,qcol,qd,'Hvor mange ganger går '+d+' i '+cur+'?'+(trapp&&qi===0?' Skriv svaret over det siste sifferet i '+cur+'.':''),qd?d+' ganger '+qd+' er '+qd*d+', og '+d+' ganger '+(qd+1)+' er '+(qd+1)*d+', som er for mye. Skriv '+qd+'.':cur+' er mindre enn '+d+', så '+d+' går 0 ganger. Skriv 0.',{qcur:cur,qdiv:d});t.qkeys.push(s.key);qi++;
    if(qd>0){const pr=qd*d,PRd=digs(pr),L=PRd.length,end=Doff+pos;
      PRd.forEach((v,j)=>oStep(t,row,end-L+1+j,v,j===0?'Hva er '+qd+' ganger '+d+'? Skriv svaret under '+cur+'.':'Skriv neste siffer.',qd+' ganger '+d+' er '+pr+'.'));
      t.signs.push({r:row,c:end-L,ch:'−',sub:true});t.lines.push({r:row,c0:end-L,c1:end,sub:true});
      const diff=cur-pr,more=pos<n-1,dr=row+1;
      if(diff>0||!more){const DD=digs(diff);DD.forEach((v,j)=>oStep(t,dr,end-DD.length+1+j,v,j===0?cur+' minus '+pr+' er?':'Skriv neste siffer.',cur+' minus '+pr+' er '+diff+'.'));}
      curRow=dr;cur=diff;row=dr+1;maxRow=Math.max(maxRow,dr);}
    if(pos<n-1){pos++;const v=Ds[pos];oStep(t,curRow,Doff+pos,v,'Flytt ned '+v+'. Trykk på '+v+' oppe i stykket, eller på pila.','Neste siffer i '+D+' er '+v+'. Det flytter du ned.',{down:true,from:Drow+','+(Doff+pos)});
      cur=cur*10+v;maxRow=Math.max(maxRow,curRow);}
    else break;}
  if(rem){const rc=trapp?Doff+n+2:qc+Q.length+2;R.forEach((v,j)=>{const s=oStep(t,0,rc+j,v,j===0?'Hva blir resten?':'Skriv neste siffer i resten.','Det som er igjen nederst, er resten. Skriv '+rem+'.');t.remKeys.push(s.key);});}
  t.rows=Array.from({length:maxRow+1},()=>({small:false}));t.placed[Drow]=true;t.placed[0]=true;return t;}
export function withRegen(mk){const t=mk();t.regen=()=>withRegen(mk);return t;}
/* tallgeneratorer */
export function gMulNoCarry(){const b=pick([2,3,4]),m=Math.floor(9/b);const a=rnd(1,m)*10+rnd(1,m);return oppMul1(a,b);}
export function gDivNoCarry(){const d=pick([2,3,4]),m=Math.floor(9/d);const q=rnd(1,m)*10+rnd(1,m);return oppDiv(q*d,d);}
export function gMulCarry(){let a,b;do{a=rnd(13,98);b=rnd(3,9);}while((a%10)*b<10);return oppMul1(a,b);}
export function gMul3(){let a,b;do{a=rnd(124,489);b=rnd(3,8);}while((a%10)*b<10);return oppMul1(a,b);}
export function gDiv2(){const d=rnd(3,6),q=rnd(12,49);return oppDiv(q*d,d);}
export function gDivZero(){let d,q;do{d=rnd(2,4);q=pick([1,2])*100+rnd(1,9);}while(String(q*d)[0]<d||q*d>999);return oppDiv(q*d,d);}
export function gMul2(){let a,b;do{a=rnd(12,49);b=rnd(12,39);}while(a%10===0||b%10===0);return oppMul2(a,b);}
export function gMul32(){let a,b;do{a=rnd(112,689);b=rnd(13,48);}while(a%10===0||b%10===0);return oppMul2(a,b);}
export function gDivRest(){let D,d;do{d=rnd(3,9);D=rnd(110,999);}while(D%d===0);return oppDiv(D,d);}
export function gDivBig(){const d=rnd(11,25),q=rnd(13,68);return oppDiv(q*d,d);}
export function gAdd2(){let a,b;do{a=rnd(14,68);b=rnd(13,29);}while((a%10)+(b%10)<10);return oppAdd([sp(a),sp(b)]);}
export function gSub2(){let a,b;do{a=rnd(42,95);b=rnd(13,38);}while(a%10>=b%10||a<=b);return oppSub(sp(a),sp(b));}
export function gAdd3(){let a,b;do{a=rnd(256,689);b=rnd(147,398);}while((a%10)+(b%10)<10||((a/10|0)%10)+((b/10|0)%10)<9);return oppAdd([sp(a),sp(b)]);}
export function gSub3(){let a,b;do{a=rnd(412,951);b=rnd(138,389);}while(a%10>=b%10||a<=b);return oppSub(sp(a),sp(b));}
export function gSubZero(){const a=pick([300,400,500,600,700,800,900,1000,1003,2004,3005,4002])+(Math.random()<.5?0:rnd(1,6));const b=rnd(125,a<1000?a-60:899);return oppSub(sp(a),sp(b));}
export function rD(lo,hi){let v;do{v=rnd(lo,hi);}while(v%10===0);return v;}
export function gAddDec(){const a=dStr(rD(15,89)/10+rnd(1,9),1),b=dStr(rD(105,899)/100,2);return oppAdd(Math.random()<.5?[a,b]:[b,a]);}
export function gAddDec1(){let a,b;do{a=rD(12,79);b=rD(13,59);}while((a%10)+(b%10)<10);return oppAdd([dStr(a/10,1),dStr(b/10,1)]);}
export function gSubDec(){const a=dStr(rD(30,95)/10+rnd(1,4)*10,1),b=dStr(rD(115,899)/100,2);return oppSub(a,b);}
export function gAddDec3(){return oppAdd([dStr(rD(105,950)/100,2),dStr(rD(12,95)/10,1),sp(rnd(3,24))]);}
export function oppTaskOf(g){return withRegen(g);}
/* ---------- extra classroom modules (5A, 5B) ---------- */
export function genHi(subj,L){const T=[];
  if(subj==='matte'){const f=v=>String(Math.round(v*100)/100).replace('.',',');
    for(let i=0;i<5;i++){
      if(L===8){T.push(oppTaskOf([gMul2,gDivRest,gMul2,gDivRest,gMul3][i]));}
      if(L===9){const k=i%3;
        if(k===0){const d=pick([2,3,4,5]),n=d*rnd(3,12),ans=n/d;T.push(numTask('1/'+d+' av '+n+' = ?',ans,'Hva er en '+['','','halvdel','tredel','firedel','femdel'][d]+' av '+n+'?'));}
        else if(k===1){const n=4*rnd(2,10),ans=3*n/4;T.push(numTask('3/4 av '+n+' = ?',ans,'Hva er tre firedeler av '+n+'?'));}
        else if(i===2)T.push(oppTaskOf(gAddDec1));
        else{const a=rnd(1,4)+rnd(1,9)/10,b=pick([.5,.25,.75,.2]),ans=Math.round((a+b)*100)/100;const set=new Set([ans]);for(const d of shuffle([.1,-.1,1,.25,-.05,-1])){if(set.size>=4)break;const v=Math.round((ans+d)*100)/100;if(v>0)set.add(v);}
          T.push(numTask(f(a)+' + '+f(b)+' = ?',f(ans),'Hva er '+f(a)+' pluss '+f(b)+'?',{dec:true}));}}}}
  if(subj==='engelsk'){
    if(L===8){const QA=[['WHAT IS YOUR NAME?','MY NAME IS '+env.CH.name.toUpperCase(),['I AM FINE','IT IS RED']],['HOW OLD ARE YOU?','I AM '+ageOf().en,['I AM FINE','IT IS A DOG']],['HOW ARE YOU?','I AM FINE, THANK YOU',['I AM SEVEN','MY NAME IS TOM']],['WHERE DO YOU LIVE?','I LIVE IN NORWAY',['I LIKE PIZZA','IT IS MONDAY']],['WHAT COLOUR IS THE SUN?','IT IS YELLOW',['IT IS A CAT','I AM HAPPY']],['WHAT DO YOU LIKE?','I LIKE FOOTBALL',['I AM FINE','IT IS BLUE']],['WHAT DAY IS IT TODAY?','IT IS FRIDAY',['IT IS GREEN','I LIKE CATS']],['DO YOU HAVE A PET?','YES, I HAVE A DOG',['NO, IT IS RED','I AM TEN']]];
      QA.push(...X_QA);for(const x of shuffle(QA).slice(0,5))T.push(rowsTask({q:[x[0]],say:'Hva er et godt svar?',en:x[0].toLowerCase(),enOk:x[1].toLowerCase()},x[1],x[2]));}
    if(L===9){const GR=[['THE CATS ___ HUNGRY.','ARE',['IS','AM']],['SHE ___ A BIKE.','HAS',['HAVE','HAVING']],['WE ___ TO SCHOOL.','GO',['GOES','GOING']],['HE ___ FOOTBALL.','PLAYS',['PLAY','PLAYING']],['THEY ___ MY FRIENDS.','ARE',['IS','AM']],['MY DOG ___ BROWN.','IS',['ARE','AM']],['I ___ TWO BROTHERS.','HAVE',['HAS','IS']],['ONE MOUSE, TWO ___.','MICE',['MOUSES','MOUSE']],['ONE CHILD, TWO ___.','CHILDREN',['CHILDS','CHILDES']]];
      GR.push(...X_GR);for(const x of shuffle(GR).slice(0,5))T.push(rowsTask({q:[x[0]],say:'Hvilket ord passer?',en:x[0].replace('___','blank').toLowerCase(),enOk:x[0].replace('___',x[1]).toLowerCase()},x[1],x[2]));}}
  if(subj==='norsk'){
    if(L===8){const SY=[['GLAD','FORNØYD',['SINT','TRØTT']],['STOR','DIGER',['LITEN','SMAL']],['RASK','KJAPP',['TREG','STILLE']],['REDD','SKREMT',['MODIG','GLAD']],['PEN','VAKKER',['STYGG','KALD']],['SNILL','GREI',['SLEM','SUR']],['SPRINGE','LØPE',['SITTE','SOVE']],['LITE','BITTELITE',['ENORMT','HØYT']]];
      SY.push(...X_SY);for(const x of shuffle(SY).slice(0,5))T.push(rowsTask({q:['SAMME BETYDNING SOM',x[0]],say:'Hvilket ord betyr det samme som '+x[0].toLowerCase()+'?'},x[1],x[2]));}
    if(L===9){const VB=[['I GÅR ___ JEG TIL SKOLEN.','GIKK',['GÅR','GÅTT']],['I DAG ___ VI FOTBALL.','SPILLER',['SPILTE','SPILT']],['I GÅR ___ HUN EN BOK.','LESTE',['LESER','LEST']],['I MORGEN SKAL JEG ___.','SYKLE',['SYKLET','SYKLER']],['JEG HAR ___ MIDDAG.','SPIST',['SPISER','SPISTE']],['I GÅR ___ KATTEN PÅ TAKET.','SOV',['SOVER','SOVET']],['NÅ ___ DET UTE.','SNØR',['SNØDDE','SNØDD']],['HAN HAR ___ ET BREV.','SKREVET',['SKRIVER','SKREV']],['I GÅR ___ VI IS.','KJØPTE',['KJØPER','KJØPT']]];
      VB.push(...X_VB);for(const x of shuffle(VB).slice(0,5))T.push(rowsTask({q:[x[0]],say:'Hvilket ord passer i setningen? '+x[0].replace('___','blank').toLowerCase()},x[1],x[2]));}}
  return T.slice(0,5);}
/* ---------- 6.–10. trinn (modul 6A–10B) ---------- */
export function rawRows(instr,text,correct,wrongs,o){return rowsTask(Object.assign({raw:true,q:[instr,text],say:instr+' '+text},o||{}),correct,wrongs);}
export function enRows(instr,text,correct,wrongs){const full=text.includes('___')?text.replace('___',correct):correct;
  return rowsTask({raw:true,q:[instr,text],say:'Velg riktig svar.',en:text.replace(/___/g,'blank'),enOk:full},correct,wrongs);}
export function fr(a,b){return a+'/'+b;}
export function gcd(a,b){return b?gcd(b,a%b):a;}
export const sup=n=>String(n).split('').map(c=>SUP[c]).join('');
export const dc=v=>String(Math.round(v*1000)/1000).replace('.',',');
export const neg=v=>(v<0?'−':'')+Math.abs(v);
export function uniqW(ans,c){const o=[];for(const v of c){if(v!==ans&&!o.includes(v)&&!(v===0&&ans===0))o.push(v);if(o.length>=2)break;}return o;}
export function mathHi(L,i){
  if(L===10){if(i===0){const a=rnd(10,99),b=rnd(10,99);const s=a+','+b;const d=[String(a)[0],String(a)[1],String(b)[0],String(b)[1]];const which=pick([0,1]);const names=['tidelsplassen','hundredelsplassen'];const ans=+d[2+which];const st=new Set([ans]);for(const v of shuffle([+d[1],+d[3-which],+d[0],rnd(0,9),rnd(0,9),rnd(0,9)])){if(st.size>=3)break;st.add(v);}const o=shuffle([...st]);
      return mc({q:['Hvilket siffer står på '+names[which]+'?',s],say:'Hvilket siffer står på '+names[which]+' i '+s.replace(',',' komma ')+'?',opts:o.map(n=>({n})),ans:o.indexOf(ans),reveal:ans});}
    if(i===1)return oppTaskOf(gAddDec);if(i===2){const a=rnd(105,989)/100,f=pick([10,100]);return numTask(dc(a)+' '+DOT+' '+f+' = ?',dc(a*f),'Hva er '+dc(a).replace(',',' komma ')+' ganger '+f+'?',{dec:true});}
    if(i===3)return oppTaskOf(gSubDec);return oppTaskOf(gAddDec3);}
  if(L===11){const k=i;
    if(k===0){const b=pick([3,4,5,6,7,8]),a=rnd(1,b-1),g=gcd(a,b),A=a/g,B=b/g,m=rnd(2,4);const ans=fr(A,B);const w=[fr(A*m,B),fr(A,B*m)].filter(x=>x!==ans);return rowsTask({q:['Forkort brøken',fr(A*m,B*m)],say:'Forkort brøken '+A*m+' over '+B*m+' så mye som mulig.'},ans,w);}
    if(k===1){const p=pick([10,20,25,50,75]),n=pick([40,60,80,120,200,400]);return numTask(p+' % av '+n+' = ?',p*n/100,'Hva er '+p+' prosent av '+n+'?');}
    if(k===2){const b=pick([3,4,5,6]),a=rnd(2,b-1),n=b*rnd(3,9);return numTask(fr(a,b)+' av '+n+' = ?',a*n/b,'Hva er '+a+' '+['','','','tredeler','firedeler','femdeler','seksdeler'][b]+' av '+n+'?');}
    if(k===3){const S=shuffle([[3,4],[2,3],[5,8],[3,5],[4,5],[5,6],[7,10],[1,2]]).slice(0,3);let bi=0;S.forEach((f,j)=>{if(f[0]/f[1]>S[bi][0]/S[bi][1])bi=j;});const opts=S.map(f=>fr(f[0],f[1]));return mc({layout:'rows',q:['Hvilken brøk er størst?'],say:'Hvilken brøk er størst?',opts:opts.map(t=>({t})),ans:bi,reveal:opts[bi]});}
    const v=rnd(5,95);return numTask('0,'+String(v).padStart(2,'0')+' = ? %',v,'Hvor mange prosent er 0 komma '+String(v).padStart(2,'0')+'?');}
  if(L===12){if(i===4){const a=rnd(38,62),b=rnd(18,32),ra=Math.round(a/10)*10,rb=Math.round(b/10)*10,e=ra*rb;return rowsTask({q:['Gjør et overslag:',a+' '+DOT+' '+b+' ≈ ?'],say:'Gjør et overslag. Omtrent hvor mye er '+a+' ganger '+b+'?'},String(e),[String(e*10),String(e/10)]);}
    return oppTaskOf([gMul32,gDivBig,gMul32,gDivBig][i]);}
  if(L===13){
    if(i===0){const a=-rnd(2,9),b=rnd(3,12),ans=a+b;return rowsTask({q:['Regn ut',neg(a)+' + '+b+' = ?'],say:'Hva er minus '+(-a)+' pluss '+b+'?'},neg(ans),uniqW(ans,[-a+b,a-b,ans+2,ans-2]).map(neg));}
    if(i===1){const t0=-rnd(2,12),ch=rnd(4,15),ans=t0+ch;return rowsTask({raw:true,q:['Det er '+neg(t0)+' grader.','Det blir '+ch+' grader varmere. Hvor varmt blir det?'],say:'Det er minus '+(-t0)+' grader. Det blir '+ch+' grader varmere. Hvor mange grader blir det?'},neg(ans)+' °C',uniqW(ans,[-t0+ch,t0-ch,ans+2]).map(v=>neg(v)+' °C'));}
    if(i===2){const m=rnd(5,12);let xs;do{xs=[rnd(2,18),rnd(2,18),rnd(2,18)];}while(4*m-xs[0]-xs[1]-xs[2]<1||4*m-xs[0]-xs[1]-xs[2]>20);xs.push(4*m-xs[0]-xs[1]-xs[2]);return numTask('Gjennomsnitt av '+shuffle(xs).join(', '),m,'Hva er gjennomsnittet av '+xs.join(', ')+'?');}
    if(i===3){const xs=shuffle([rnd(1,9),rnd(10,19),rnd(20,29),rnd(30,39),rnd(40,49)]);const med=xs.slice().sort((a,b)=>a-b)[2];return numTask('Median av '+xs.join(', '),med,'Hva er medianen av '+xs.join(', ')+'?');}
    const a=rnd(2,9),b=rnd(2,9),c=rnd(2,9);return pick([0,1])?numTask(a+' + '+b+' '+DOT+' '+c+' = ?',a+b*c,'Hva er '+a+' pluss '+b+' ganger '+c+'? Husk regnerekkefølgen.'):numTask('('+a+' + '+b+') '+DOT+' '+c+' = ?',(a+b)*c,'Hva er parentes '+a+' pluss '+b+' parentes slutt, ganger '+c+'?');}
  if(L===14){
    if(i===0){const p=pick([5,15,30,35,45]),n=pick([20,40,60,80,120,200,240]);return numTask(p+' % av '+n+' = ?',dc(p*n/100),'Hva er '+p+' prosent av '+n+'?',{dec:true});}
    if(i===1){const bp=pick([[20,10],[20,25],[25,20],[40,25],[50,10],[50,40],[80,25],[25,60],[40,75],[80,75]]),b=bp[0],p=bp[1];return numTask(b*p/100+' av '+b+' = ? %',p,b*p/100+' av '+b+'. Hvor mange prosent er det?');}
    if(i===2){const pr=pick([200,400,600,800,1200]),p=pick([10,20,25,30]);return numTask(pr+' kr − '+p+' % = ? kr',pr*(100-p)/100,'En jakke koster '+pr+' kroner. Den er satt ned '+p+' prosent. Hva koster den nå?');}
    if(i===3){const a=rnd(1,3),b=a+rnd(1,3),k=rnd(4,12),n=(a+b)*k;return numTask('Del '+n+' i forholdet '+a+' : '+b+'. Minste del?',a*k,'Del '+n+' i forholdet '+a+' til '+b+'. Hvor stor blir den minste delen?');}
    const S=[[1,4,25],[3,4,75],[1,5,20],[3,20,15],[7,25,28],[2,5,40],[9,10,90],[1,8,'12,5']];const s=pick(S);return numTask(fr(s[0],s[1])+' = ? %',s[2],'Hvor mange prosent er '+s[0]+' over '+s[1]+'?',{dec:true});}
  if(L===15){
    if(i===0){const x=rnd(2,9),a=rnd(2,6),b=rnd(1,12);return numTask(a+'x + '+b+' = '+(a*x+b)+'   x = ?',x,'Løs likningen: '+a+' x pluss '+b+' er lik '+(a*x+b)+'. Hva er x?');}
    if(i===1){const x=rnd(4,11),a=rnd(2,4),b=rnd(1,3);return numTask(a+'(x − '+b+') = '+a*(x-b)+'   x = ?',x,'Løs likningen: '+a+' ganger parentes x minus '+b+', er lik '+a*(x-b)+'. Hva er x?');}
    if(i===2){const d=rnd(3,8),r=rnd(3,9);return numTask('x : '+d+' = '+r+'   x = ?',d*r,'x delt på '+d+' er '+r+'. Hva er x?');}
    if(i===3){const a=rnd(2,6),b=rnd(2,6),p=rnd(2,5),q=rnd(2,5);return numTask(p+'a + '+q+'b = ?  (a = '+a+', b = '+b+')',p*a+q*b,'Hva er '+p+' a pluss '+q+' b, når a er '+a+' og b er '+b+'?');}
    const a=rnd(3,8),b=rnd(2,6),c=rnd(1,4),s=a+b-c;return rowsTask({q:['Trekk sammen',a+'x + '+b+'x − '+c+'x'],say:'Trekk sammen: '+a+' x pluss '+b+' x minus '+c+' x.'},s+'x',[(a+b+c)+'x',String(s)]);}
  if(L===16){
    if(i===0){const b=pick([2,3,5,10]),e=b===10?rnd(2,5):b===2?rnd(3,7):rnd(2,4);return numTask(b+sup(e)+' = ?',Math.pow(b,e),'Hva er '+b+' opphøyd i '+e+'?');}
    if(i===1){const r=rnd(4,15);return numTask('√'+r*r+' = ?',r,'Hva er kvadratroten av '+r*r+'?');}
    if(i===2){const a=rnd(2,4),b=rnd(2,5);return numTask('2'+sup(a)+' '+DOT+' 2'+sup(b)+' = 2 opphøyd i ?',a+b,'2 opphøyd i '+a+', ganger 2 opphøyd i '+b+'. Det er 2 opphøyd i hva?');}
    if(i===3){const m=rnd(11,98)/10,e=rnd(3,5);return numTask(dc(m)+' '+DOT+' 10'+sup(e)+' = ?',Math.round(m*Math.pow(10,e)),'Hva er '+dc(m).replace(',',' komma ')+' ganger 10 opphøyd i '+e+'?');}
    const a=rnd(2,6);return rowsTask({q:['Regn ut','(−'+a+')² og −'+a+'²'],say:'Hva er parentes minus '+a+' parentes slutt i andre, og minus '+a+' i andre?'},(a*a)+' og −'+(a*a),['−'+(a*a)+' og '+(a*a),(a*a)+' og '+(a*a)]);}
  if(L===17){
    if(i===0){const a=rnd(4,15),b=rnd(3,12);return numTask('Rektangel '+a+' cm × '+b+' cm. Areal?',a*b,'Et rektangel er '+a+' centimeter langt og '+b+' centimeter bredt. Hva er arealet i kvadratcentimeter?');}
    if(i===1){const g=2*rnd(3,9),h=rnd(3,10);return numTask('Trekant: g = '+g+', h = '+h+'. Areal?',g*h/2,'En trekant har grunnlinje '+g+' og høyde '+h+'. Hva er arealet?');}
    if(i===2){const T=pick([[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17]]);return numTask('Kateter '+T[0]+' og '+T[1]+'. Hypotenus?',T[2],'En rettvinklet trekant har kateter '+T[0]+' og '+T[1]+'. Hvor lang er hypotenusen?');}
    if(i===3){const r=rnd(2,10);return numTask('Sirkel r = '+r+'. Omkrets? (π ≈ 3,14)',dc(2*3.14*r),'En sirkel har radius '+r+'. Hva er omkretsen? Bruk 3 komma 14 for pi.',{dec:true});}
    const r=pick([1,2,3,10]);return numTask('Sirkel r = '+r+'. Areal? (π ≈ 3,14)',dc(3.14*r*r),'En sirkel har radius '+r+'. Hva er arealet? Bruk 3 komma 14 for pi.',{dec:true});}
  if(L===18){
    if(i===0){const a=rnd(2,5),b=rnd(1,9),x=rnd(2,6);return numTask('y = '+a+'x + '+b+'.  Hva er y når x = '+x+'?',a*x+b,'y er lik '+a+' x pluss '+b+'. Hva er y når x er '+x+'?');}
    if(i===1){const a=rnd(2,5),x1=rnd(0,3),y1=rnd(0,5),x2=x1+rnd(1,3),y2=y1+a*(x2-x1);return numTask('Stigningstall fra ('+x1+', '+y1+') til ('+x2+', '+y2+')?',a,'Hva er stigningstallet til linja gjennom punktene '+x1+' komma '+y1+', og '+x2+' komma '+y2+'?');}
    if(i===2){const a=rnd(2,6),b=rnd(1,9);return numTask('y = −'+a+'x + '+b+'.  Konstantledd?',b,'Hva er konstantleddet i y er lik minus '+a+' x pluss '+b+'?');}
    if(i===3){const p=pick([5,10,15,20,25,3]),up=Math.random()<.6;return numTask('Vekstfaktor for '+p+' % '+(up?'økning':'nedgang')+'?',dc(up?1+p/100:1-p/100),'Hva er vekstfaktoren når noe '+(up?'øker':'synker')+' med '+p+' prosent?',{dec:true});}
    const k=pick([1000,2000,5000]),p=pick([10,20]);return numTask(k+' kr, '+p+' % økning i 2 år = ? kr',Math.round(k*Math.pow(1+p/100,2)),k+' kroner øker med '+p+' prosent hvert år i to år. Hvor mye blir det?');}
  if(L===19){
    if(i===0){const g=pick([['et partall',3,6],['en sekser',1,6],['mer enn 4',2,6],['1 eller 2',2,6]]);const n=g[1]/gcd(g[1],g[2]),d=g[2]/gcd(g[1],g[2]);const ans=fr(n,d);const w=shuffle(['1/6','1/3','1/2','2/3'].filter(x=>x!==ans)).slice(0,2);return rowsTask({q:['Du kaster en terning.','Sannsynlighet for '+g[0]+'?'],say:'Du kaster en terning. Hva er sannsynligheten for å få '+g[0]+'?'},ans,w);}
    if(i===1){const r=rnd(2,5);let b;do{b=rnd(2,6);}while(b===r);const N=r+b;const g=gcd(r,N);const ans=fr(r/g,N/g);return rowsTask({q:['I en pose er det '+r+' røde og '+b+' blå kuler.','Sannsynlighet for rød?'],say:'I en pose er det '+r+' røde og '+b+' blå kuler. Hva er sannsynligheten for å trekke en rød?'},ans,[fr(r,b),fr(b,N)]);}
    if(i===2){const a=rnd(2,9),b=rnd(2,8),c=rnd(2,6);return numTask('Eske '+a+' × '+b+' × '+c+' cm. Volum?',a*b*c,'En eske er '+a+' ganger '+b+' ganger '+c+' centimeter. Hva er volumet i kubikkcentimeter?');}
    if(i===3){const r=pick([1,2,3]),h=pick([5,10,20]);return numTask('Sylinder r = '+r+', h = '+h+'. Volum? (π ≈ 3,14)',dc(3.14*r*r*h),'En sylinder har radius '+r+' og høyde '+h+'. Hva er volumet? Bruk 3 komma 14 for pi.',{dec:true});}
    return oppTaskOf(pick([gDivBig,gMul32,gSubDec,gAddDec3]));}
  return null;}
export function genTop(subj,L){const T=[];
  if(subj==='matte'){for(let i=0;i<5;i++)T.push(mathHi(L,i));return T;}
  if(subj==='norsk'){
    if(L===11){const N=env.CH.name||'Kristoffer';const S=shuffle([[N+' spiller fotball.',N,'spiller','fotball'],['Hunden løper i parken.','Hunden','løper','parken'],['I dag skinner sola.','sola','skinner','dag'],['Mormor baker boller.','Mormor','baker','boller'],['Etter skolen spiste vi pizza.','vi','spiste','pizza'],['Læreren leser en bok.','Læreren','leser','bok'],['Om sommeren bader barna.','barna','bader','sommeren'],['Ola har kjøpt en sykkel.','Ola','har kjøpt','sykkel']]).slice(0,5);
      S.forEach((s,i)=>{if(i%2===0)T.push(rawRows('Hva er subjektet?',s[0],s[1],[s[2],s[3]]));else T.push(rawRows('Hva er verbalet?',s[0],s[2],[s[1],s[3]]));});return T;}
    const B=NO_HI[L];for(const x of shuffle(B.d.slice()).slice(0,5)){if(x.length===4)T.push(rawRows(x[0],x[1],x[2],x[3]));else T.push(rawRows(B.i,x[0],x[1],x[2]));}return T;}
  if(subj==='engelsk'){const B=EN_HI[L];for(const x of shuffle(B.d.slice()).slice(0,5)){
      if(B.no)T.push(rowsTask({raw:true,q:[B.i,x[0]],say:'Hva heter '+x[0]+' på engelsk?',enOk:x[1]},x[1],x[2]));else T.push(enRows(B.i,x[0],x[1],x[2]));}return T;}
  return T;}
export function oppFromRecipe(r){if(r.f==='add')return oppAdd(r.a.slice());if(r.f==='sub')return oppSub(r.a[0],r.a[1]);if(r.f==='mul1')return oppMul1(r.a[0],r.a[1]);if(r.f==='mul2')return oppMul2(r.a[0],r.a[1]);return oppDiv(r.a[0],r.a[1]);}
export function taskKey(t){if(t.kind==='sjakk')return 'sjakk:'+t.fen;if(t.kind==='opp')return 'opp:'+(t.recipe?JSON.stringify(t.recipe):t.label);if(t.kind==='stav')return 'stav:'+t.letters;
  return t.kind+':'+(t.q?t.q.join('|'):'')+'|'+(t.pic||'')+'|'+(t.color||'')+'|'+(t.say||'')+'|'+(t.reveal==null?'':t.reveal);}
export function taskSnap(t){if(t.kind==='opp')return t.recipe?{kind:'opp',recipe:t.recipe}:null;
  if(t.kind==='stav')return{kind:'stav',pic:t.pic,letters:t.letters,tiles:t.tiles.map(x=>x.ch),say:t.say};
  const o={};for(const k of Object.keys(t)){if(SNAPSKIP.includes(k)||typeof t[k]==='function')continue;o[k]=t[k];}
  try{return JSON.parse(JSON.stringify(o));}catch(e){return null;}}
export function taskFromSnap(s){if(s.kind==='opp'){const r=s.recipe;return withRegen(()=>oppFromRecipe(r));}
  if(s.kind==='stav')return{kind:'stav',pic:s.pic,letters:s.letters,tiles:shuffle(s.tiles.map(ch=>({ch,used:false}))),filled:0,errs:0,say:s.say};
  const t=JSON.parse(JSON.stringify(s));if(t.kind==='num'||t.kind==='skriv'||t.kind==='aapen')t.inp='';if(t.kind==='bygg'){t.sel=[];t.tiles=shuffle(t.tiles.slice());}if(t.kind==='linje'){t.pick=null;t.showAns=false;}if(t.kind==='sjakk'){t.sel=-1;t.phase=0;t.last=null;t.done=false;}if(t.kind==='aapen')t.found=[];
  if(t.kind==='mc'&&Array.isArray(t.opts)&&t.opts[t.ans]){const right=t.opts[t.ans];t.opts=shuffle(t.opts.slice());t.ans=t.opts.indexOf(right);}
  return t;}
export function skrivTask(o){return Object.assign({kind:'skriv',inp:'',alts:[]},o);}
/* ---------- bygg setningen ---------- */
export function byggTask(sent,o){const words=sent.split(' ');return Object.assign({kind:'bygg',target:words,tiles:shuffle(words.slice()),sel:[],ans:sent,reveal:sent,q:['Bygg setningen']},o||{});}
/* ---------- les og svar ---------- */
export function lesTask(it,lang){const qq=pick(it.q);const o={raw:true,text:it.t,q:[qq[0]],say:lang==='en'?'Les teksten og svar på spørsmålet.':'Les teksten og svar: '+qq[0]};if(lang==='en'){o.en=qq[0];o.enOk=qq[1];}return rowsTask(o,qq[1],qq[2]);}
/* ---------- tallinje ---------- */
export function fmtL(v,o){if(o.fmt==='frac')return o.fr?o.fr[0]+'/'+o.fr[1]:String(v);if(o.fmt==='dec')return dc(v);return String(Math.round(v));}
export function linjeTask(a,b,target,o){o=Object.assign({fmt:'int',step:1,labels:[a,b],tol:.5},o);const s=fmtL(target,o);
  return Object.assign({kind:'linje',a,b,target,pick:null,showAns:false,q:['Hvor står '+s+'?'],say:'Trykk der '+s.replace('/',' av ').replace(',',' komma ')+' står på tallinja.',reveal:s},o);}
export function fracTask(k,n){const right=k+'/'+n;const set=new Set([right]);for(const w of shuffle([(n-k)+'/'+n,k+'/'+(n+1),(k+1)+'/'+n,n+'/'+k,(k===1?2:k-1)+'/'+n])){if(set.size>=3)break;const p=w.split('/').map(Number);if(p[0]>0&&p[1]>0&&p[0]<p[1]&&!set.has(w))set.add(w);}
  const o=shuffle([...set]);return mc({frac:{k,n,shape:pick(['circle','bar'])},say:'Hvor stor del av figuren er farget?',opts:o.map(t=>({t})),ans:o.indexOf(right),reveal:k+' av '+n});}
export function mathExtras(L,T){const rep=(i,t)=>{let j=i;if(T[j]&&(T[j].kind==='opp'||T[j].xtra))j=T.findIndex(x=>x.kind!=='opp'&&!x.xtra);if(j>=0&&T[j]){t.xtra=1;T[j]=t;}};
  if(L===1)rep(2,linjeTask(0,10,rnd(1,9),{step:1,labels:[0,5,10],tol:.5}));
  if(L===2)rep(2,linjeTask(0,20,rnd(1,19),{step:1,labels:[0,10,20],tol:.5}));
  if(L===3){const tt=rnd(1,9),e=rnd(0,9);rep(1,numTask('Hvilket tall er dette?',tt*10+e,'Hvilket tall er dette? Tell tierne og enerne.',{base10:{t:tt,e}}));rep(3,linjeTask(0,100,rnd(1,9)*10+pick([0,5]),{step:10,labels:[0,50,100],tol:3}));}
  if(L===4)rep(3,linjeTask(0,100,rnd(11,89),{step:10,labels:[0,50,100],tol:4.5}));
  if(L===9){const n=pick([2,3,4,5,6,8]);rep(1,fracTask(rnd(1,n-1),n));const m=pick([2,4,5]),j=rnd(1,m-1);rep(4,linjeTask(0,1,j/m,{step:1/m,labels:[0,1],tol:.45/m,fmt:'frac',fr:[j,m]}));}
  if(L===10)rep(2,linjeTask(0,2,rnd(1,19)/10,{step:.1,labels:[0,1,2],tol:.06,fmt:'dec'}));
  if(L===11){const m=pick([3,4,5,6,8]),j=rnd(1,m-1);rep(3,linjeTask(0,1,j/m,{step:1/m,labels:[0,1],tol:.45/m,fmt:'frac',fr:[j,m]}));}
  return T;}
/* ---------- produksjonsoppgaver i norsk og engelsk ---------- */
export function prodTasks(subj,L){
  if(subj==='norsk'){
    const d1=()=>{const w=pick(DIKT1.filter(x=>x[0].length<=(L<2?4:5)));return skrivTask({q:['Skriv ordet'],say:'Skriv ordet '+w[0].toLowerCase()+'.',ans:w[0],reveal:w[0],pic:w[1],up:L<2});};
    const d2=()=>{const w=pick(DIKT2);return skrivTask({q:['Skriv ordet'],say:'Skriv ordet '+w[0].toLowerCase()+'.',ans:w[0],reveal:w[0],pic:w[1]});};
    const d3=()=>{const w=pick(DIKT3);return skrivTask({q:['Diktat: skriv ordet du hører'],say:'Skriv ordet '+w.toLowerCase()+'.',ans:w,reveal:w});};
    const b1=()=>{const s=pick(BYGG_NO1).replace('{NAME}',env.CH.name);return byggTask(s,{say:'Bygg setningen: '+s,raw:true});};
    const b2=()=>byggTask(pick(BYGG_NO2),{say:'Sett ordene i riktig rekkefølge.',raw:true});
    const ls=()=>lesTask(pick(LES_NO),'no');
    const plan=[[d1],[d1],[d1],[d2,b1],[d2,b1],[b1,ls],[d2,ls],[d2,b1],[ls,d3],[b2,d3]];
    return (L<10?plan[L]:(L%2?[d3,b2]:[d3,ls])).map(f=>f());}
  if(subj==='engelsk'){
    const w3=()=>{const w=pick(ENW.filter(x=>x[0].length<=(L<2?3:5)));return skrivTask({q:['Skriv ordet på engelsk'],say:'Skriv på engelsk:',en:w[0],ans:w[0],reveal:w[0],pic:w[2],enOk:w[0]});};
    const wNo=()=>{const w=pick(ENW);return skrivTask({q:['Hva heter «'+w[1]+'» på engelsk?'],say:'Hva heter '+w[1]+' på engelsk? Skriv ordet.',ans:w[0],reveal:w[0],pic:w[2],enOk:w[0]});};
    const col=()=>{const k=pick(Object.keys(COLS));return skrivTask({q:['Skriv fargen på engelsk'],say:'Hvilken farge er dette? Skriv på engelsk.',ans:k,reveal:k,color:COLS[k][0],enOk:k});};
    const num=(lo,hi)=>()=>{const n=rnd(lo,hi);return skrivTask({q:['Skriv tallet på engelsk'],say:'Skriv tallet '+n+' på engelsk.',ans:NUMEN[n],reveal:NUMEN[n],digit:n,enOk:NUMEN[n]});};
    const day=()=>{const d=pick(DAYS);const no=d[0][0]+d[0].slice(1).toLowerCase(),en=d[1][0]+d[1].slice(1).toLowerCase();return skrivTask({q:[no+' på engelsk'],say:'Hva heter '+no.toLowerCase()+' på engelsk? Skriv ordet.',ans:en,reveal:en,enOk:en});};
    const b1=()=>{const s=pick(BYGG_EN1).replace('{NAME}',env.CH.name);return byggTask(s,{say:'Bygg setningen.',en:s,enOk:s,raw:true});};
    const b2=()=>{const s=pick(BYGG_EN2);return byggTask(s,{say:'Sett ordene i riktig rekkefølge.',enOk:s,raw:true});};
    const ls=()=>lesTask(pick(LES_EN),'en');
    const plan=[[w3],[col],[num(1,10)],[w3],[col],[num(11,20)],[day],[b1],[b1,ls],[ls,wNo]];
    return (L<10?plan[L]:(L%2?[b2,wNo]:[b2,ls])).map(f=>f());}
  return [];}
/* ---------- Tenk: mønstre, logikk, mange måter, sjakk ---------- */
export function pattTask(){const k=rnd(0,6);let s,nx;const tri=n=>n*(n+1)/2;
  if(k===0){const a=rnd(1,20),d=rnd(2,9);s=[0,1,2,3].map(i=>a+i*d);nx=a+4*d;}
  else if(k===1){const d=rnd(2,9),a=d*rnd(6,12);s=[0,1,2,3].map(i=>a-i*d);nx=a-4*d;}
  else if(k===2){const a=rnd(1,5),m=rnd(2,3);s=[0,1,2,3].map(i=>a*m**i);nx=a*m**4;}
  else if(k===3){const i0=rnd(1,4);s=[0,1,2,3].map(i=>tri(i0+i));nx=tri(i0+4);}
  else if(k===4){const i0=rnd(1,5);s=[0,1,2,3].map(i=>(i0+i)**2);nx=(i0+4)**2;}
  else if(k===5){const a=rnd(1,10);let p=rnd(2,5),q=rnd(1,4);if(p===q)q++;s=[a];for(let i=1;i<5;i++)s.push(s[i-1]+(i%2?p:q));nx=s[4]+(5%2?p:q);}
  else{const a=rnd(1,6);s=[a];for(let i=1;i<5;i++)s.push(s[i-1]+i);nx=s[4]+5;}
  return numTask(s.join(', ')+', ?',nx,'Hvilket tall kommer etterpå? '+s.join(', ')+'.');}
export function figTask(){const unit=pick(['AB','ABB','AAB','ABC','ABCB','AABB']);const em=shuffle(Object.keys(FIGN));const m={A:em[0],B:em[1],C:em[2]};
  const seq=[];for(let i=0;i<9;i++)seq.push(m[unit[i%unit.length]]);const right=seq.pop();
  const o=shuffle([right,...shuffle(em.slice(0,4).filter(e=>e!==right)).slice(0,2)]);
  return mc({q:['Hva kommer etterpå?',seq.join(' ')+' ?'],say:'Se på mønsteret. Hva kommer etterpå?',opts:o.map(p=>({pic:p})),ans:o.indexOf(right),reveal:FIGN[right]});}
export function ordTask(){const N=shuffle(TNAMES.slice()).slice(0,3),A=pick(TADJ);const s1=Math.random()<.5?N[0]+' er '+A[0]+' enn '+N[1]+'.':N[1]+' er '+A[2]+' enn '+N[0]+'.';
  const s2=Math.random()<.5?N[1]+' er '+A[0]+' enn '+N[2]+'.':N[2]+' er '+A[2]+' enn '+N[1]+'.';const text=Math.random()<.5?s1+' '+s2:s2+' '+s1;
  const top=Math.random()<.5;const q='Hvem er '+(top?A[1]:A[3])+'?';return rowsTask({raw:true,text,q:[q],say:text+' '+q},top?N[0]:N[2],[N[1],top?N[2]:N[0]]);}
export function clueTask(){for(let tries=0;tries<200;tries++){const n=rnd(11,60);const C=[];const lo=n-rnd(2,9),hi=n+rnd(2,9);C.push(['Jeg er større enn '+lo+' og mindre enn '+hi+'.',v=>v>lo&&v<hi]);
    C.push(n%2?['Jeg er et oddetall.',v=>v%2===1]:['Jeg er et partall.',v=>v%2===0]);
    const ks=[3,4,5,6,7,9].filter(k=>n%k===0);if(ks.length){const k=pick(ks);C.push(['Jeg er i '+k+'-gangen.',v=>v%k===0]);}
    const ds=String(n).split('').reduce((a,b)=>a+ +b,0);C.push(['Sifrene mine blir '+ds+' til sammen.',v=>String(v).split('').reduce((a,b)=>a+ +b,0)===ds]);
    let use=[C[0]];for(const c of shuffle(C.slice(1))){const ok=[...Array(99).keys()].map(i=>i+1).filter(v=>use.every(u=>u[1](v)));if(ok.length===1)break;use.push(c);}
    const left=[...Array(99).keys()].map(i=>i+1).filter(v=>use.every(u=>u[1](v)));if(left.length!==1||left[0]!==n)continue;
    const text=use.map(u=>u[0]).join(' ');return numTask('Hvilket tall er jeg?',n,text+' Hvilket tall er jeg?',{text});}
  return pattTask();}
export function legsTask(){const [a,b]=shuffle(DYR.slice()).slice(0,2),na=rnd(2,5),nb=rnd(2,4);const text='På gården er det '+na+' '+a[0]+' og '+nb+' '+b[0]+'.';
  return numTask('Hvor mange bein er det til sammen?',na*a[1]+nb*b[1],text+' Hvor mange bein er det til sammen?',{text});}
export function logicTask(){return pick([ordTask,ordTask,clueTask,legsTask])();}
export function aapenTask(){const N=pick([10,12,15,16,18,20,24,30,36]);return{kind:'aapen',target:N,need:3,found:[],inp:'',q:['Finn tre måter å lage '+N],say:'Finn tre forskjellige regnestykker som blir '+N+'. Du kan bruke pluss, minus og ganger.',reveal:N-1+' + 1, '+(N+1)+' − 1 og '+(N/2)+' + '+(N/2)};}
/* sjakk */
export const SQN=sq=>'abcdefgh'[sq&7]+(8-(sq>>3));
export function isMate(s){return sjLegal(s,false).length===0&&sjInCheck(s,s.t==='w');}
export function mateMoves(s){return sjLegal(s,false).filter(m=>{sjMake(s,m);const r=isMate(s);sjUndo(s,m);return r;});}
export function mvText(m){return PNAME[m.p.toUpperCase()]+' til '+SQN(m.t);}
export let TUSED=new Set();
export function sjakkTask(n){if(n===2&&M2.length){const left=M2.filter(x=>!TUSED.has(x[0]));const e=pick(left.length?left:M2);TUSED.add(e[0]);
    const s=sjNew(e[0]);const m=sjLegal(s,false).find(q=>q.f===e[1][0]&&q.t===e[1][1]);
    return{kind:'sjakk',n:2,fen:e[0],sol:e.slice(1),q:['Matt i to trekk'],say:'Hvit trekker. Sett matt i to trekk.',reveal:m?mvText(m)+' først':'',sel:-1,phase:0,last:null};}
  const pool=shuffle(M1.filter(f=>!TUSED.has(f)));for(const fen of pool.concat(shuffle(M1.slice()))){const s=sjNew(fen);const mm=mateMoves(s);if(!mm.length)continue;TUSED.add(fen);
    return{kind:'sjakk',n:1,fen,q:['Matt i ett trekk'],say:'Hvit trekker. Sett matt i ett trekk.',reveal:mvText(mm[0]),sel:-1,phase:0,last:null};}
  return pattTask();}
export function genTenk(L){TUSED=new Set();const P=pattTask,G=logicTask,A=aapenTask,S1=()=>sjakkTask(1),S2=()=>sjakkTask(2);
  const plan=[[P,P,P,P,figTask],[G,G,G,G,G],[A,A,A,G,G],[S1,S1,S1,S1,S1],[S2,S2,S2,S1,S1],[P,G,A,S1,S2]][L];return plan.map(f=>f());}
export function gen2(subj,L){if(subj==='tenk')return genTenk(L);let T=gen(subj,L);
  if(subj==='matte')return mathExtras(L,T);
  const P=prodTasks(subj,L);return T.slice(0,5-P.length).concat(P);}
