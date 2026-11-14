/* Små hjelpefunksjoner for tilfeldighet. Brukes av oppgavene og spillet. */

export const pick=a=>a[Math.random()*a.length|0];
export const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
export const rnd=(a,b)=>a+(Math.random()*(b-a+1)|0);
