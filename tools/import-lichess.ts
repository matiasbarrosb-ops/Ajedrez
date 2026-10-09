/*
 * Importa una selección de la base de problemas de Lichess (licencia CC0, database.lichess.org).
 * Entrada: JSON con filas [id, fen, moves, rating, themes, opening, plays] (ver la página "Problemas de Lichess").
 * Comprueba cada jugada con nuestro motor y arma src/problems/lichess.json en formato compacto.
 *
 * Uso: node tools/import-lichess.ts ruta/seleccion.json
 *
 * Formato de salida (una fila por problema):
 *   [id, fen, pre, sol, rating, tema, etiquetas, apertura]
 *   fen   posición ANTES de la jugada del rival (pre), como en Lichess
 *   pre   jugada del rival que abre el problema (UCI)
 *   sol   jugadas de la solución separadas por espacio (tuyas y respuestas del rival, alternadas)
 *   tema  tema principal (clave de THEMES en bank.ts) · etiquetas: otros temas separados por espacio
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inCheck, legal, make } from '../src/engine/core.ts';
import { moveCode, parseFen } from '../src/chess/notation.ts';

// tema de Lichess → clave propia, en orden de prioridad para elegir el tema principal
const MAP: [string, string][] = [
  ['smotheredMate', 'ahogado'], ['backRankMate', 'pasillo'], ['doubleCheck', 'jaquedoble'], ['discoveredAttack', 'descubierta'],
  ['skewer', 'ensartada'], ['pin', 'clavada'], ['fork', 'doble'], ['xRayAttack', 'rayosx'], ['interference', 'interferencia'],
  ['clearance', 'despeje'], ['deflection', 'desviacion'], ['attraction', 'atraccion'], ['capturingDefender', 'defensor'],
  ['intermezzo', 'intermedia'], ['trappedPiece', 'atrapada'], ['quietMove', 'tranquila'], ['defensiveMove', 'defensa'],
  ['sacrifice', 'sacrificio'], ['promotion', 'coronacion'], ['advancedPawn', 'peonavanzado'], ['hangingPiece', 'colgada'],
  ['exposedKing', 'reyexpuesto'], ['kingsideAttack', 'ataquerey'], ['queensideAttack', 'ataquerey'], ['attackingF2F7', 'f7'],
  ['zugzwang', 'zugzwang'], ['mateIn1', 'mate1'], ['mateIn2', 'mate2'], ['mateIn3', 'mate3'], ['mate', 'mate3'],
  ['rookEndgame', 'finaltorre'], ['pawnEndgame', 'finalpeon'], ['queenEndgame', 'final'], ['bishopEndgame', 'final'], ['knightEndgame', 'final'],
  ['endgame', 'final'], ['crushing', 'material'], ['advantage', 'material'], ['equality', 'igualar']
];
const TACTIC = new Set(MAP.map(x => x[1]));
const MATES = new Set(['mate1', 'mate2', 'mate3', 'pasillo', 'ahogado']);
const BAND = (r: number) => Math.min(10, Math.max(0, Math.floor((r - 400) / 200)));
/** máximo por tema principal y tramo de rating de 200 puntos: los mates quedan como minoría */
const CAP: Record<string, number> = { mate1: 8, mate2: 8, mate3: 5, pasillo: 6, ahogado: 6, material: 25, final: 15, igualar: 10 };
const DEF = 45, OPEN_CAP = 70;

const src = process.argv[2];
if (!src) { console.error('Uso: node tools/import-lichess.ts seleccion.json'); process.exit(1); }
const data = JSON.parse(readFileSync(src, 'utf8')) as { rows: [string, string, string, number, string, string, number][] };

const count = new Map<string, number>(), opCount = new Map<string, number>();
const out: (string | number)[][] = [];
let bad = 0;
// los más jugados primero: mejores problemas
const rows = data.rows.slice().sort((a, b) => b[6] - a[6]);
for (const [id, fen, moves, rating, themesStr, opening] of rows) {
  const themes = themesStr.split(' ');
  const keys = [...new Set(MAP.filter(([l]) => themes.includes(l)).map(([, k]) => k))];
  if (!keys.length) continue;
  let primary = keys[0];
  // si además de mate hay una táctica, el tema principal es la táctica
  if (MATES.has(primary)) { const t = keys.find(k => !MATES.has(k) && !['material', 'final', 'ataquerey', 'reyexpuesto'].includes(k)); if (t) primary = t; }
  const op = (opening || '').split(' ')[0];
  const inOpening = themes.includes('opening') && !!op;
  const k = `${primary}|${BAND(rating)}`;
  const capOk = (count.get(k) ?? 0) < (CAP[primary] ?? DEF);
  const opOk = inOpening && (opCount.get(op) ?? 0) < OPEN_CAP;
  if (!capOk && !opOk) continue;

  // verificar con el motor: todas las jugadas legales y, si es mate, que termine en mate
  const P = parseFen(fen);
  const seq = moves.split(' ');
  let ok = true;
  for (const c of seq) {
    const m = legal(P).find(x => moveCode(x) === c);
    if (!m) { ok = false; break; }
    make(P, m);
  }
  if (ok && themes.includes('mate') && !(legal(P).length === 0 && inCheck(P, P.t))) ok = false;
  if (!ok) { bad++; continue; }

  if (capOk) count.set(k, (count.get(k) ?? 0) + 1);
  if (opOk) opCount.set(op, (opCount.get(op) ?? 0) + 1);
  const tags = keys.filter(x => x !== primary && TACTIC.has(x)).join(' ');
  out.push([id, fen, seq[0], seq.slice(1).join(' '), rating, primary, tags, inOpening ? op : '']);
}
out.sort((a, b) => (a[4] as number) - (b[4] as number));
writeFileSync('src/problems/lichess.json', JSON.stringify(out));
const by = new Map<string, number>();
for (const r of out) by.set(r[5] as string, (by.get(r[5] as string) ?? 0) + 1);
console.log(`${out.length} problemas (${bad} descartados por no verificar)`);
console.log([...by.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · '));
console.log(`con apertura: ${out.filter(r => r[7]).length} en ${new Set(out.map(r => r[7]).filter(Boolean)).size} aperturas`);
