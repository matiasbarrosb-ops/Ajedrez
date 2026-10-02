// Genera problemas jugando partidas motor-contra-motor con errores y buscando posiciones con una sola solución.
// Uso: node tools/gen-puzzles.ts <cantidad> <archivo.json>
// @ts-nocheck
import * as fs from 'node:fs';
import { E, parseFen as fen2pos, toFen as pos2fen, rootScores } from './lib.ts';
const START='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const target=+process.argv[2]||200, out=process.argv[3]||'puzzles-raw.json';
const found=[],seen=new Set();let games=0;const t0=Date.now();
function insufficientOrOver(P){return E.legal(P).length===0||P.h>=100;}
while(found.length<target&&Date.now()-t0<540000){
  games++;const P=fen2pos(START);let prev=null;
  for(let ply=0;ply<140;ply++){
    if(insufficientOrOver(P))break;
    if(ply>=10){
      const rs=rootScores(P,3);const best=rs[0],second=rs[1];
      const key=pos2fen(P).split(' ').slice(0,2).join(' ');
      if(best&&!seen.has(key)){
        let pz=null;
        if(best.s>90000){
          const plies=100000-best.s,n=(plies+1)/2;
          const acc=rs.filter(x=>x.s===best.s);
          if((n===1&&acc.length<=2)||(n===2&&acc.length===1)||(n===3&&acc.length===1&&plies===5))
            pz={type:'mate',n,acc:acc.map(x=>x.c)};
        } else if(second&&best.s>=250&&best.s<2000&&second.s<=Math.min(100,best.s-280)){
          const recapture=!!(prev&&prev.c&&prev.t===best.m.t);
          if(!recapture){
            // confirma a más profundidad
            const rs5=rootScores(P,4);
            if(rs5[0].c===best.c&&rs5[0].s>=250&&rs5[1].s<=rs5[0].s-250){
              pz={type:'win',acc:rs5.filter(x=>x.s>=rs5[0].s-40&&x.s>=200).map(x=>x.c),gain:rs5[0].s-Math.max(rs5[1].s,-300)};
            }
          }
        }
        if(pz){seen.add(key);pz.fen=pos2fen(P);pz.best=best.c;found.push(pz);}
      }
    }
    // jugada de la partida: a veces fuerte, a veces con errores para crear oportunidades
    const noise=ply<6?220:(Math.random()<0.25?260:40);
    const r=E.search(P,{d:2,ms:300,n:noise});if(!r)break;
    const m=E.legal(P).find(x=>x.f===r.move.f&&x.t===r.move.t&&(x.pr||null)===(r.move.pr||null));
    prev=m;E.make(P,m);
  }
  if(games%5===0)process.stderr.write(`games ${games} found ${found.length} (${found.filter(x=>x.type==='mate').length} mates)\n`);
}
fs.writeFileSync(out,JSON.stringify(found));
console.log('total',found.length,'mate1',found.filter(x=>x.type==='mate'&&x.n===1).length,'mate2',found.filter(x=>x.type==='mate'&&x.n===2).length,'mate3',found.filter(x=>x.n===3).length,'win',found.filter(x=>x.type==='win').length);
