// Verifica que cada ejercicio de las lecciones se pueda resolver. Uso: node tools/check-lessons.ts
import { E, parseFen, moveCode } from './lib.ts';
import { UNITS, type MoveStep } from '../src/lessons/data.ts';
import * as fs from 'node:fs';
const PUZ = JSON.parse(fs.readFileSync('src/problems/puzzles.json', 'utf8')) as { id: string; theme: string }[];
let errors = 0, count = 0;
const fail = (where: string, msg: string) => { errors++; console.log('FALLA', where, '-', msg); };
const find = (P: E.Position, c: string) => E.legal(P).find(m => moveCode(m) === c);
const mates = (P: E.Position) => E.legal(P).filter(m => { const u = E.make(P, m); const r = E.legal(P).length === 0 && E.inCheck(P, P.t); E.unmake(P, m, u); return r; });

for (const unit of UNITS) for (const lesson of unit.lessons) lesson.steps.forEach((st, i) => {
  const where = `${lesson.id}#${i + 1}`;
  count++;
  if (st.t === 'puzzle') {
    const m = /^([a-z0-9]+)-(\d+)$/.exec(st.id);
    const ok = PUZ.some(p => p.id === st.id) || (m && PUZ.filter(p => p.theme === m[1]).length >= Number(m[2]));
    if (!ok) fail(where, `no existe el problema ${st.id}`);
    return;
  }
  if (st.t === 'quiz') { if (st.answer < 0 || st.answer >= st.options.length) fail(where, 'respuesta fuera de rango'); return; }
  if (st.t === 'info') {
    const P = parseFen(st.fen);
    if (st.showMoves) { const sq = 'abcdefgh'.indexOf(st.showMoves[0]) + (8 - +st.showMoves[1]) * 8; const has = E.gen(P, false).some(m => m.f === sq); if (!has) fail(where, 'showMoves sin jugadas'); }
    return;
  }
  const s = st as MoveStep, P = parseFen(s.fen), g = s.goal as Record<string, unknown>;
  if ('anyOf' in g) { for (const c of g.anyOf as string[]) if (!find(P, c)) fail(where, `jugada ilegal ${c}`); }
  else if ('check' in g) { if (!E.legal(P).some(m => { const u = E.make(P, m); const r = E.inCheck(P, P.t); E.unmake(P, m, u); return r; })) fail(where, 'no hay jaque posible'); }
  else if ('mate' in g) { if (!mates(P).length) fail(where, 'no hay mate en 1'); }
  else if ('captureAll' in g) {
    // búsqueda en anchura: mínimo de jugadas blancas (las negras no mueven) para capturar todo
    const key = (Q: E.Position) => Q.b.map(x => x || '.').join('');
    let frontier = [parseFen(s.fen)], seen = new Set([key(frontier[0])]), depth = 0, best = -1;
    while (frontier.length && depth < 8 && best < 0) {
      depth++;
      const next: E.Position[] = [];
      for (const Q of frontier) for (const m of E.legal(Q)) {
        const R = { ...Q, b: Q.b.slice() }; E.make(R, m); R.t = 'w'; R.ep = -1;
        if (!R.b.some(x => x && x !== x.toUpperCase())) { best = depth; break; }
        const k = key(R); if (!seen.has(k)) { seen.add(k); next.push(R); }
      }
      frontier = next;
    }
    if (best !== (g.par as number)) fail(where, `el mínimo es ${best} jugadas, el par dice ${g.par as number}`);
  }
  else if ('line' in g) {
    for (const c of g.line as string[]) {
      if (c === '*') { const r = E.search(P, { d: 3, ms: 60000, n: 0 }); if (!r) { fail(where, 'sin respuesta'); break; } E.make(P, E.legal(P).find(m => m.f === r.move.f && m.t === r.move.t)!); continue; }
      const alt = c.split('|').map(x => find(P, x)).find(Boolean);
      if (!alt) { fail(where, `jugada ilegal en la línea ${c}`); break; }
      E.make(P, alt);
    }
  } else if ('play' in g) { if (!E.legal(P).length) fail(where, 'sin jugadas'); }
  // las tácticas: la solución debe ser la mejor jugada según el motor
  if (['colgada', 'doble', 'clavada', 'descubierto'].includes(lesson.topic) && ('anyOf' in g || 'line' in g)) {
    const Q = parseFen(s.fen), first = 'anyOf' in g ? (g.anyOf as string[]) : [(g.line as string[])[0]];
    const r = E.search(Q, { d: 4, ms: 60000, n: 0 })!;
    const best = 'abcdefgh'[r.move.f & 7] + (8 - (r.move.f >> 3)) + 'abcdefgh'[r.move.t & 7] + (8 - (r.move.t >> 3));
    if (!first.includes(best)) fail(where, `el motor prefiere ${best}`);
  }
});
console.log(`${count} pasos revisados, ${errors} fallas`);
process.exit(errors ? 1 : 0);
