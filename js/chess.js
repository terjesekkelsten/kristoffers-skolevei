/* Sjakkmotor: regler, trekkgenerering og datamotstander. Ingen DOM. */

/* ---------- sjakkmotor (regler + datamotstander) ---------- */
export const SJV={p:100,n:320,b:330,r:500,q:900,k:0};
export const SJPST={
p:[0,0,0,0,0,0,0,0,50,50,50,50,50,50,50,50,10,10,20,30,30,20,10,10,5,5,10,25,25,10,5,5,0,0,0,20,20,0,0,0,5,-5,-10,0,0,-10,-5,5,5,10,10,-20,-20,10,10,5,0,0,0,0,0,0,0,0],
n:[-50,-40,-30,-30,-30,-30,-40,-50,-40,-20,0,0,0,0,-20,-40,-30,0,10,15,15,10,0,-30,-30,5,15,20,20,15,5,-30,-30,0,15,20,20,15,0,-30,-30,5,10,15,15,10,5,-30,-40,-20,0,5,5,0,-20,-40,-50,-40,-30,-30,-30,-30,-40,-50],
b:[-20,-10,-10,-10,-10,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,10,10,5,0,-10,-10,5,5,10,10,5,5,-10,-10,0,10,10,10,10,0,-10,-10,10,10,10,10,10,10,-10,-10,5,0,0,0,0,5,-10,-20,-10,-10,-10,-10,-10,-10,-20],
r:[0,0,0,0,0,0,0,0,5,10,10,10,10,10,10,5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,-5,0,0,0,0,0,0,-5,0,0,0,5,5,0,0,0],
q:[-20,-10,-10,-5,-5,-10,-10,-20,-10,0,0,0,0,0,0,-10,-10,0,5,5,5,5,0,-10,-5,0,5,5,5,5,0,-5,0,0,5,5,5,5,0,-5,-10,5,5,5,5,5,0,-10,-10,0,5,0,0,0,0,-10,-20,-10,-10,-5,-5,-10,-10,-20],
k:[-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-30,-40,-40,-50,-50,-40,-40,-30,-20,-30,-30,-40,-40,-30,-30,-20,-10,-20,-20,-20,-20,-20,-20,-10,20,20,0,0,0,0,20,20,20,30,10,0,0,10,30,20],
ke:[-50,-40,-30,-20,-20,-30,-40,-50,-30,-20,-10,0,0,-10,-20,-30,-30,-10,20,30,30,20,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,30,40,40,30,-10,-30,-30,-10,20,30,30,20,-10,-30,-30,-30,0,0,0,0,-30,-30,-50,-30,-30,-30,-30,-30,-30,-50]};
export const SJN=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]],SJK=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],SJD=[[-1,-1],[-1,1],[1,-1],[1,1]],SJR=[[-1,0],[1,0],[0,-1],[0,1]];
export const sjW=p=>p!==''&&p===p.toUpperCase();
/* brettet: indeks = rad*8+kolonne, rad 0 er rad 8 (svart side), rad 7 er rad 1 (hvit side) */
export function sjNew(fen){fen=fen||'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';const f=fen.split(' '),b=[];
  for(const ch of f[0].replace(/\//g,''))if(/\d/.test(ch)){for(let i=0;i<+ch;i++)b.push('');}else b.push(ch);
  return{b,t:f[1]||'w',cr:!f[2]||f[2]==='-'?'':f[2],ep:!f[3]||f[3]==='-'?-1:'abcdefgh'.indexOf(f[3][0])+(8-+f[3][1])*8,hm:+f[4]||0};}
export function sjKing(s,w){return s.b.indexOf(w?'K':'k');}
export function sjAtt(s,sq,byW){const b=s.b,r=sq>>3,c=sq&7,pr=byW?r+1:r-1,P=byW?'P':'p';
  if(pr>=0&&pr<8){if(c>0&&b[pr*8+c-1]===P)return true;if(c<7&&b[pr*8+c+1]===P)return true;}
  const N=byW?'N':'n',K=byW?'K':'k',B=byW?'B':'b',R=byW?'R':'r',Q=byW?'Q':'q';
  for(const[d,e]of SJN){const rr=r+d,cc=c+e;if(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===N)return true;}
  for(const[d,e]of SJK){const rr=r+d,cc=c+e;if(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===K)return true;}
  for(const[d,e]of SJD){let rr=r+d,cc=c+e;while(rr>=0&&rr<8&&cc>=0&&cc<8){const p=b[rr*8+cc];if(p){if(p===B||p===Q)return true;break;}rr+=d;cc+=e;}}
  for(const[d,e]of SJR){let rr=r+d,cc=c+e;while(rr>=0&&rr<8&&cc>=0&&cc<8){const p=b[rr*8+cc];if(p){if(p===R||p===Q)return true;break;}rr+=d;cc+=e;}}
  return false;}
export function sjPseudo(s,caps){const b=s.b,w=s.t==='w',M=[];
  for(let sq=0;sq<64;sq++){const p=b[sq];if(!p||sjW(p)!==w)continue;const r=sq>>3,c=sq&7,l=p.toLowerCase();
    if(l==='p'){const dir=w?-1:1,r1=r+dir,last=w?0:7,promo=t=>{for(const q of 'qrbn')M.push({f:sq,t,p,c:b[t],pr:w?q.toUpperCase():q});};
      if(r1<0||r1>7)continue;const t=r1*8+c;
      if(!b[t]){if(r1===last)promo(t);else if(!caps){M.push({f:sq,t,p,c:''});if(r===(w?6:1)&&!b[t+dir*8])M.push({f:sq,t:t+dir*8,p,c:'',dbl:1});}}
      for(const e of[-1,1]){const cc=c+e;if(cc<0||cc>7)continue;const t2=r1*8+cc,q=b[t2];
        if(q&&sjW(q)!==w){if(r1===last)promo(t2);else M.push({f:sq,t:t2,p,c:q});}
        else if(!q&&t2===s.ep)M.push({f:sq,t:t2,p,c:w?'p':'P',ep:1});}
      continue;}
    if(l==='n'||l==='k'){for(const[d,e]of l==='n'?SJN:SJK){const rr=r+d,cc=c+e;if(rr<0||rr>7||cc<0||cc>7)continue;const t=rr*8+cc,q=b[t];
        if(q?sjW(q)!==w:!caps)M.push({f:sq,t,p,c:q});}
      if(l==='k'&&!caps){
        if(w&&sq===60){if(s.cr.includes('K')&&!b[61]&&!b[62]&&b[63]==='R'&&!sjAtt(s,60,false)&&!sjAtt(s,61,false)&&!sjAtt(s,62,false))M.push({f:60,t:62,p,c:'',cs:1});
          if(s.cr.includes('Q')&&!b[59]&&!b[58]&&!b[57]&&b[56]==='R'&&!sjAtt(s,60,false)&&!sjAtt(s,59,false)&&!sjAtt(s,58,false))M.push({f:60,t:58,p,c:'',cs:2});}
        if(!w&&sq===4){if(s.cr.includes('k')&&!b[5]&&!b[6]&&b[7]==='r'&&!sjAtt(s,4,true)&&!sjAtt(s,5,true)&&!sjAtt(s,6,true))M.push({f:4,t:6,p,c:'',cs:1});
          if(s.cr.includes('q')&&!b[3]&&!b[2]&&!b[1]&&b[0]==='r'&&!sjAtt(s,4,true)&&!sjAtt(s,3,true)&&!sjAtt(s,2,true))M.push({f:4,t:2,p,c:'',cs:2});}}
      continue;}
    for(const[d,e]of l==='b'?SJD:l==='r'?SJR:SJD.concat(SJR)){let rr=r+d,cc=c+e;
      while(rr>=0&&rr<8&&cc>=0&&cc<8){const t=rr*8+cc,q=b[t];if(q){if(sjW(q)!==w)M.push({f:sq,t,p,c:q});break;}if(!caps)M.push({f:sq,t,p,c:''});rr+=d;cc+=e;}}}
  return M;}
export const SJROOK={62:[63,61],58:[56,59],6:[7,5],2:[0,3]};
export function sjMake(s,m){m.u=[s.cr,s.ep,s.hm];const b=s.b;b[m.f]='';b[m.t]=m.pr||m.p;
  if(m.ep)b[m.t+(sjW(m.p)?8:-8)]='';
  if(m.cs){const k=SJROOK[m.t];b[k[1]]=b[k[0]];b[k[0]]='';}
  let cr=s.cr;if(cr){if(m.p==='K')cr=cr.replace(/[KQ]/g,'');else if(m.p==='k')cr=cr.replace(/[kq]/g,'');
    if(m.f===63||m.t===63)cr=cr.replace('K','');if(m.f===56||m.t===56)cr=cr.replace('Q','');if(m.f===7||m.t===7)cr=cr.replace('k','');if(m.f===0||m.t===0)cr=cr.replace('q','');}
  s.cr=cr;s.ep=m.dbl?(m.f+m.t)>>1:-1;s.hm=(m.c||m.p==='p'||m.p==='P')?0:s.hm+1;s.t=s.t==='w'?'b':'w';}
export function sjUndo(s,m){const b=s.b;b[m.f]=m.p;
  if(m.ep){b[m.t]='';b[m.t+(sjW(m.p)?8:-8)]=m.c;}else b[m.t]=m.c;
  if(m.cs){const k=SJROOK[m.t];b[k[0]]=b[k[1]];b[k[1]]='';}
  s.cr=m.u[0];s.ep=m.u[1];s.hm=m.u[2];s.t=s.t==='w'?'b':'w';}
export function sjInCheck(s,w){return sjAtt(s,sjKing(s,w),!w);}
export function sjLegal(s,caps){const w=s.t==='w',out=[];for(const m of sjPseudo(s,caps)){sjMake(s,m);if(!sjInCheck(s,w))out.push(m);sjUndo(s,m);}return out;}
export function sjEval(s){const b=s.b;let sc=0,mat=0;
  for(let i=0;i<64;i++){const p=b[i];if(p&&p!=='k'&&p!=='K'&&p!=='p'&&p!=='P')mat+=SJV[p.toLowerCase()];}
  const end=mat<=1400;
  for(let i=0;i<64;i++){const p=b[i];if(!p)continue;const l=p.toLowerCase(),w=sjW(p),idx=w?i:((7-(i>>3))*8+(i&7));
    const v=SJV[l]+(l==='k'&&end?SJPST.ke:SJPST[l])[idx];sc+=w?v:-v;}
  return s.t==='w'?sc:-sc;}
export function sjOrder(M){for(const m of M)m.o=(m.c?10*SJV[m.c.toLowerCase()]-SJV[m.p.toLowerCase()]/10+1000:0)+(m.pr?SJV[m.pr.toLowerCase()]:0);return M.sort((a,c)=>c.o-a.o);}
export let SJNODES=0,SJDL=0;
export function sjQ(s,a,be,d){if((++SJNODES&1023)===0&&SJDL&&Date.now()>SJDL)throw 'tid';const st=sjEval(s);if(st>=be)return be;if(st>a)a=st;if(d>5)return a;
  for(const m of sjOrder(sjLegal(s,true))){sjMake(s,m);const v=-sjQ(s,-be,-a,d+1);sjUndo(s,m);if(v>=be)return be;if(v>a)a=v;}
  return a;}
export function sjNeg(s,d,a,be,ply,q){if(d<=0)return q?sjQ(s,a,be,0):sjEval(s);
  if((++SJNODES&1023)===0&&SJDL&&Date.now()>SJDL)throw 'tid';const M=sjLegal(s,false);
  if(!M.length)return sjInCheck(s,s.t==='w')?-99999+ply:0;if(s.hm>=100)return 0;
  for(const m of sjOrder(M)){sjMake(s,m);const v=-sjNeg(s,d-1,-be,-a,ply+1,q);sjUndo(s,m);if(v>=be)return be;if(v>a)a=v;}
  return a;}
/* o: d=dybde, q=slagsjekk på slutten, noise=tilfeldighet i poeng, rnd=sjanse for helt tilfeldig trekk */
export function sjBest(s,o){const M=sjOrder(sjLegal(s,false));if(!M.length)return null;
  if(o.rnd&&Math.random()<o.rnd)return M[Math.random()*M.length|0];
  const nz=o.noise||0;
  const run=(d,st)=>{let best=null,bs=-1e9,raw=-1e9;for(const m of M){sjMake(st,m);const lo=raw>-1e8?raw-2*nz-1:-1e9;const v=-sjNeg(st,d-1,-1e9,-lo,1,o.q);sjUndo(st,m);
    m.sc=v;if(v>raw)raw=v;const n=v+(Math.random()*2-1)*nz;if(n>bs){bs=n;best=m;}}return best;};
  if(!o.time)return run(o.d,s);
  /* tidsstyrt: regner dypere og dypere til tida er ute, beste trekk fra forrige runde sjekkes først */
  let pick=M[0];SJDL=Date.now()+o.time;
  try{for(let d=1;d<=o.d;d++){const b=run(d,{b:s.b.slice(),t:s.t,cr:s.cr,ep:s.ep,hm:s.hm});pick=b;M.sort((x,y)=>y.sc-x.sc);if(Math.abs(b.sc)>90000)break;}}
  catch(e){if(e!=='tid')throw e;}finally{SJDL=0;}
  return pick;}
export function sjKey(s){return s.b.map(p=>p||'.').join('')+s.t+s.cr+s.ep;}
export function sjLowMat(s){const P=s.b.filter(p=>p&&p!=='k'&&p!=='K');if(!P.length)return true;if(P.length===1&&/[nbNB]/.test(P[0]))return true;return false;}
