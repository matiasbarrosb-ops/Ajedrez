/*
 * Enfrenta niveles de bot entre sí para comprobar que cada uno es claramente más fuerte que el anterior.
 * Uso: node tools/bot-match.ts [partidas por pareja]
 * Las partidas largas se cortan en 120 jugadas y se juzgan por material.
 */
import { legal, make, inCheck, search, PV, type Position, type SearchOptions } from '../src/engine/core.ts';
import { BOTS } from '../src/engine/bots.ts';
import { parseFen, START_FEN } from '../src/chess/notation.ts';

function material(P: Position): number {
  let s = 0;
  for (const p of P.b) if (p) s += (p === p.toUpperCase() ? 1 : -1) * PV[p.toUpperCase()];
  return s;
}

function play(w: SearchOptions, b: SearchOptions): 1 | 0 | 0.5 {
  const P = parseFen(START_FEN);
  for (let ply = 0; ply < 240; ply++) {
    const ms = legal(P);
    if (!ms.length) return inCheck(P, P.t) ? (P.t === 'w' ? 0 : 1) : 0.5;
    if (P.h >= 100) return 0.5;
    const o = { ...(P.t === 'w' ? w : b) };
    o.ms = Math.min(o.ms, 250);
    if (ply < 8 && o.n < 20) o.n += 14;
    const r = search(P, o);
    const m = ms.find(x => x.f === r!.move.f && x.t === r!.move.t && (x.pr || null) === r!.move.pr)!;
    make(P, m);
  }
  const mat = material(P);
  return mat > 250 ? 1 : mat < -250 ? 0 : 0.5;
}

const N = Number(process.argv[2] || 10);
for (let i = 0; i + 1 < BOTS.length; i++) {
  const lo = BOTS[i], hi = BOTS[i + 1];
  let score = 0;
  for (let g = 0; g < N; g++) {
    score += g % 2 ? 1 - play(lo.opts, hi.opts) : play(hi.opts, lo.opts);
  }
  console.log(`${hi.name} vs ${lo.name}: ${score}/${N} (${Math.round((100 * score) / N)}%)`);
}
