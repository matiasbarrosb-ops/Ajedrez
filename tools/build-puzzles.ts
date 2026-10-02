// Toma los problemas generados (tools/data/raw*.json), los vuelve a verificar con el motor,
// les asigna tema, rating y línea de solución, y escribe src/problems/puzzles.json.
// Uso: node tools/build-puzzles.ts
import * as fs from 'node:fs';
import { E, parseFen, rootScores, moveCode } from './lib.ts';

interface Raw { type: 'mate' | 'win'; n?: number; acc: string[]; fen: string; best: string; gain?: number }
interface Step { accept: string[]; reply?: string }
interface Puzzle { id: string; fen: string; theme: string; rating: number; steps: Step[]; target: number; from: number }

const raws: Raw[] = fs.readdirSync('tools/data').filter(f => f.startsWith('raw')).flatMap(f => JSON.parse(fs.readFileSync('tools/data/' + f, 'utf8')));
const VAL: Record<string, number> = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 100 };
const out: Puzzle[] = [];
const seen = new Set<string>();
let rejected = 0;

function play(P: E.Position, code: string) { const m = E.legal(P).find(x => moveCode(x) === code)!; E.make(P, m); return m; }

/** ¿Ataca la pieza movida a 2 o más piezas valiosas (o rey + otra)? */
function isFork(P: E.Position, to: number): boolean {
  const me = P.t === 'w' ? 'b' : 'w'; // P ya tiene el turno del rival
  const copy: E.Position = { ...P, b: P.b.slice(), t: me };
  const targets = E.gen(copy, true).filter(m => m.f === to && m.c).map(m => VAL[m.c!.toUpperCase()]);
  const piece = VAL[P.b[to]!.toUpperCase()];
  return targets.filter(v => v >= 3 && (v > piece || v === 100)).length >= 2 || (targets.includes(100) && targets.filter(v => v >= 3).length >= 2);
}

let done = 0;
for (const r of raws) {
  if (++done % 10 === 0) console.error('procesados', done, 'de', raws.length);
  const key = r.fen.split(' ').slice(0, 2).join(' ');
  if (seen.has(key)) continue;
  seen.add(key);
  const P = parseFen(r.fen);
  const legalCount = E.legal(P).length;
  const steps: Step[] = [];
  let theme = '', base = 1200;
  if (r.type === 'mate') {
    const n = r.n!;
    // recorre la línea principal: en cada turno propio, todas las jugadas que mantienen el mate más corto
    let ok = true;
    for (let k = n; k >= 1; k--) {
      const rs = rootScores(P, 2 * k - 1);
      const want = E.MATE - (2 * k - 1);
      const acc = rs.filter(x => x.s >= want).map(x => x.c);
      if (!acc.length || (k === n && k > 1 && acc.length > 1)) { ok = false; break; }
      const mine = k === n ? (acc.includes(r.best) ? r.best : acc[0]) : acc[0];
      play(P, mine);
      if (k === 1) { steps.push({ accept: acc }); if (!(E.legal(P).length === 0 && E.inCheck(P, P.t))) ok = false; break; }
      const def = rootScores(P, 2 * k - 2)[0];
      steps.push({ accept: acc, reply: def.c });
      play(P, def.c);
    }
    if (!ok) { rejected++; continue; }
    theme = `mate${n}`; base = n === 1 ? 750 : n === 2 ? 1450 : 1800;
  } else {
    const rs = rootScores(P, 3);
    if (rs[0].c !== r.best || rs[0].s < 250 || (rs[1] && rs[1].s > rs[0].s - 250)) { rejected++; continue; }
    const acc = rs.filter(x => x.s >= rs[0].s - 40 && x.s >= 200).map(x => x.c);
    const m = rs[0].m;
    const Q = parseFen(r.fen); E.make(Q, E.legal(Q).find(x => moveCode(x) === r.best)!);
    // captura de una pieza que nadie defiende
    const undefended = m.c && !E.attacked(Q, m.t, Q.t) ? true : false;
    theme = isFork(Q, m.t) ? 'doble' : undefended ? 'colgada' : 'material';
    base = theme === 'colgada' ? 950 : theme === 'doble' ? 1250 : 1350;
    steps.push({ accept: acc });
  }
  const first = parseFen(r.fen), fm = E.legal(first).find(x => moveCode(x) === steps[0].accept[0])!;
  const rating = Math.round((base + (legalCount - 28) * 6 + (Math.random() * 80 - 40)) / 10) * 10;
  out.push({ id: 'p' + (out.length + 1), fen: r.fen, theme, rating: Math.max(500, Math.min(2300, rating)), steps, target: fm.t, from: fm.f });
}
out.sort((a, b) => a.rating - b.rating);
out.forEach((p, i) => { p.id = 'p' + (i + 1); });
fs.writeFileSync('src/problems/puzzles.json', JSON.stringify(out));
const by: Record<string, number> = {};
out.forEach(p => { by[p.theme] = (by[p.theme] || 0) + 1; });
console.log('total', out.length, 'rechazados', rejected, by, 'ratings', out[0]?.rating, '-', out[out.length - 1]?.rating);
