/*
 * Entrenador: califica cada jugada en 6 niveles y explica por qué, comparándola con lo que encontró el motor.
 * Funciones puras (sin interfaz): reciben la posición, la jugada y la lista de jugadas evaluadas.
 */
import { attacked, gen, inCheck, legal, make, MATE, other, unmake, CK, CQ, type Color, type Move, type Position, type RootScore } from '../engine/core.ts';
import { sameMove, sqName, toSan } from '../chess/notation.ts';
import { isTheory, openingLine } from './openings.ts';

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export const QUALITY: { label: string; short: string; cls: string; desc: string; say: string }[] = [
  { label: 'Mejor', short: '★', cls: 'q0', desc: 'La jugada que eligió el motor. Solo esa cuenta como la mejor.', say: 'La mejor jugada' },
  { label: 'Excelente', short: '!', cls: 'q1', desc: 'Una de las mejores opciones, casi sin diferencia con la mejor (pierdes 1 punto o menos de probabilidad de ganar).', say: 'Excelente' },
  { label: 'Buena', short: '✓', cls: 'q2', desc: 'Una jugada normal: cumple, pero había algo más preciso (hasta 5 puntos).', say: 'Buena jugada' },
  { label: 'Imprecisión', short: '?!', cls: 'q3', desc: 'No es grave, pero había algo claramente mejor (hasta 10 puntos).', say: 'Imprecisión' },
  { label: 'Error', short: '?', cls: 'q4', desc: 'Empeora bastante tu posición (hasta 18 puntos).', say: 'Error' },
  { label: 'Error grave', short: '??', cls: 'q5', desc: 'Pierde material importante, la partida o un mate.', say: 'Error grave' }
];

/** Calidad guardada de la jugada i. Las partidas nuevas guardan '~' + un dígito 0-5 por jugada;
 *  las antiguas (escala de 5 niveles sin "Mejor") se convierten sumando 1. */
export function qualityAt(qs: string | undefined, i: number): Quality | null {
  if (!qs) return null;
  const v2 = qs.charAt(0) === '~';
  const c = v2 ? qs.charAt(i + 1) : qs.charAt(i);
  if (!c || c === '-') return null;
  return (v2 ? +c : Math.min(5, +c + 1)) as Quality;
}

export interface CoachNote {
  ply: number;
  side: Color;
  san: string;
  q: Quality;
  /** razones de por qué la jugada es buena o mala */
  why: string[];
  /** en qué fijarte la próxima vez */
  tip: string;
  /** mejor jugada (si la tuya no fue la mejor) */
  best?: string;
  /** casillas de la mejor jugada, para marcarla en el tablero */
  bestMove?: { f: number; t: number };
  bestWhy?: string;
  /** pérdida de probabilidad de ganar (0-100) para calcular precisión */
  loss: number;
  /** frase sobre la apertura, cuando cambia de nombre ("Respondiste con la Defensa Francesa.") */
  opening?: string;
}

const NAME: Record<string, string> = { P: 'peón', N: 'caballo', B: 'alfil', R: 'torre', Q: 'dama', K: 'rey' };
const FEM: Record<string, boolean> = { R: true, Q: true };
const VAL: Record<string, number> = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 100 };
const T = (p: string) => p.toUpperCase();
const un = (p: string) => (FEM[T(p)] ? 'una ' : 'un ') + NAME[T(p)];
const tu = (p: string) => 'tu ' + NAME[T(p)];
const su = (p: string) => (FEM[T(p)] ? 'la ' : 'el ') + NAME[T(p)] + ' rival';
const colorOfPiece = (p: string): Color => (p === p.toUpperCase() ? 'w' : 'b');

/** Probabilidad de ganar (0-100) según la evaluación en centipeones. */
export function winPct(cp: number): number {
  const c = Math.max(-1500, Math.min(1500, cp));
  return 100 / (1 + Math.exp(-0.00368208 * c));
}
/** Precisión de una partida a partir de las pérdidas de cada jugada (fórmula tipo Lichess). */
export function accuracy(losses: number[]): number | null {
  if (!losses.length) return null;
  const per = losses.map(l => Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * l) - 3.1669)));
  return Math.round(per.reduce((a, b) => a + b, 0) / per.length);
}

const isMateScore = (s: number) => Math.abs(s) > MATE - 1000;
const mateIn = (s: number) => Math.ceil((MATE - Math.abs(s)) / 2);

/** Atacantes del bando `by` sobre la casilla sq (valores de las piezas). */
function attackers(P: Position, sq: number, by: Color): number[] {
  const copy: Position = { ...P, b: P.b.slice(), t: by };
  // poner una pieza "cebo" del otro color para que aparezcan capturas de peón
  if (!copy.b[sq]) copy.b[sq] = by === 'w' ? 'p' : 'P';
  return gen(copy, true).filter(m => m.t === sq && m.c).map(m => VAL[T(m.p)]);
}

/** Piezas de `c` (sin el rey) que el rival puede ganar: atacadas sin defensa o atacadas por algo más barato. */
export function hanging(P: Position, c: Color): number[] {
  const out: number[] = [];
  for (let i = 0; i < 64; i++) {
    const p = P.b[i];
    if (!p || colorOfPiece(p) !== c || T(p) === 'K') continue;
    const att = attackers(P, i, other(c));
    if (!att.length) continue;
    const defended = attacked(P, i, c);
    if (!defended || Math.min(...att) < VAL[T(p)]) out.push(i);
  }
  return out;
}

/** Piezas valiosas que ataca la pieza de la casilla sq. */
function attackedBy(P: Position, sq: number): { sq: number; p: string }[] {
  const p = P.b[sq]!;
  const copy: Position = { ...P, b: P.b.slice(), t: colorOfPiece(p) };
  return gen(copy, true).filter(m => m.f === sq && m.c).map(m => ({ sq: m.t, p: m.c! }));
}

interface Features { lines: string[]; tags: Set<string> }

/** Describe qué hace una jugada (capturas, jaques, amenazas, piezas colgadas…). */
function describe(P: Position, m: Move, side: Color): Features {
  const lines: string[] = [], tags = new Set<string>();
  const beforeHang = hanging(P, side);
  // qué piezas propias estaban defendidas y cuáles atacadas antes de mover
  const own: number[] = [];
  for (let i = 0; i < 64; i++) { const p = P.b[i]; if (p && colorOfPiece(p) === side && T(p) !== 'K' && i !== m.f) own.push(i); }
  const defBefore = new Map(own.map(i => [i, attacked(P, i, side)]));
  const attBefore = new Map(own.map(i => [i, attackers(P, i, other(side)).length > 0]));
  const fullmove = P.f;
  const piece = m.p;
  const u = make(P, m);
  try {
    const opp = other(side);
    const mate = legal(P).length === 0 && inCheck(P, opp);
    if (mate) { lines.push('¡Es jaque mate!'); tags.add('mate'); return { lines, tags }; }
    if (m.c) {
      const defendedVictim = attackers(P, m.t, opp).length > 0;
      if (!defendedVictim) { lines.push(`Capturas ${un(m.c)} sin que te lo puedan recuperar.`); tags.add('free'); }
      else if (VAL[T(m.c)] > VAL[T(piece)]) { lines.push(`Cambias ${tu(piece)} por ${un(m.c)}: ganas material.`); tags.add('gain'); }
      else lines.push(`Capturas ${un(m.c)}.`);
    }
    if (m.pr) { lines.push(`Coronas el peón en ${NAME[T(m.pr)]}.`); tags.add('promo'); }
    if (inCheck(P, opp)) { lines.push('Das jaque.'); tags.add('check'); }
    if (m.fl & (CK | CQ)) { lines.push('Enrocas: tu rey queda protegido y las torres se conectan.'); tags.add('castle'); }
    const backRank = side === 'w' ? 7 : 0;
    if (fullmove <= 12 && (T(piece) === 'N' || T(piece) === 'B') && m.f >> 3 === backRank) { lines.push(`Desarrollas ${tu(piece)}.`); tags.add('develop'); }
    const center = ['d4', 'e4', 'd5', 'e5'];
    if (fullmove <= 10 && T(piece) === 'P' && center.includes(sqName(m.t))) { lines.push('Ocupas el centro con un peón.'); tags.add('center'); }
    if (fullmove <= 8 && T(piece) === 'Q' && !m.c) { lines.push('Sacar la dama tan temprano la expone: el rival puede desarrollarse atacándola.'); tags.add('earlyQueen'); }
    if (fullmove <= 15 && T(piece) === 'K' && !(m.fl & (CK | CQ))) { lines.push('Mover el rey en la apertura te quita el enroque y lo deja en el centro.'); tags.add('kingWalk'); }

    // ataques que crea la pieza movida
    const targets = attackedBy(P, m.t).filter(x => T(x.p) === 'K' || VAL[T(x.p)] >= 3);
    const realTargets = targets.filter(x => T(x.p) === 'K' || VAL[T(x.p)] > VAL[T(m.pr || piece)] || !attacked(P, x.sq, opp));
    if (realTargets.length >= 2) { lines.push(`${cap(tu(m.pr || piece))} ataca dos cosas a la vez (${realTargets.map(x => T(x.p) === 'K' ? 'el rey' : NAME[T(x.p)]).join(' y ')}): es un ataque doble.`); tags.add('fork'); }
    else if (realTargets.length === 1 && T(realTargets[0].p) !== 'K') { lines.push(`Amenazas ${su(realTargets[0].p)} en ${sqName(realTargets[0].sq)}.`); tags.add('threat'); }

    // piezas propias que quedan colgadas
    const afterHang = hanging(P, side);
    if (afterHang.includes(m.t)) { lines.push(`${cap(tu(P.b[m.t]!))} en ${sqName(m.t)} queda atacad${FEM[T(P.b[m.t]!)] ? 'a' : 'o'} y sin defensa suficiente.`); tags.add('hungMoved'); }
    const fresh = afterHang.filter(s => s !== m.t && !beforeHang.includes(s));
    for (const s of fresh.slice(0, 2)) { lines.push(`Dejas ${tu(P.b[s]!)} de ${sqName(s)} sin protección.`); tags.add('hungOther'); }
    const ignored = afterHang.filter(s => s !== m.t && beforeHang.includes(s) && s !== m.f);
    if (ignored.length && !m.c) { lines.push(`No atiendes la amenaza sobre ${tu(P.b[ignored[0]]!)} en ${sqName(ignored[0])}.`); tags.add('ignored'); }
    else if (beforeHang.includes(m.f) && !afterHang.includes(m.t)) { lines.push(`Salvas ${tu(piece)}, que estaba amenazad${FEM[T(piece)] ? 'a' : 'o'}.`); tags.add('saved'); }
    else if (beforeHang.length && !afterHang.some(s => beforeHang.includes(s)) && !m.c) { lines.push('Defiendes la pieza que estaba amenazada.'); tags.add('saved'); }
    // protección: piezas que ahora cuidas y piezas que dejaste de cuidar
    if (!(m.fl & (CK | CQ))) {
      for (const s of own) {
        const p = P.b[s];
        if (!p || colorOfPiece(p) !== side || s === m.t) continue;
        const dNow = attacked(P, s, side);
        if (!defBefore.get(s) && dNow && attBefore.get(s) && !tags.has('saved')) { lines.push(`Cuidas y proteges ${tu(p)} de ${sqName(s)}, que estaba atacad${FEM[T(p)] ? 'a' : 'o'}.`); tags.add('guard'); break; }
      }
      for (const s of own) {
        const p = P.b[s];
        if (!p || colorOfPiece(p) !== side || s === m.t || afterHang.includes(s)) continue;
        if (defBefore.get(s) && !attacked(P, s, side) && (VAL[T(p)] >= 3 || attackers(P, s, other(side)).length > 0)) { lines.push(`Ojo: ${tu(p)} de ${sqName(s)} quedó sin defensa.`); tags.add('loose'); break; }
      }
    }
  } finally {
    unmake(P, m, u);
  }
  return { lines, tags };
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Califica una jugada. `list` = evaluación de todas las jugadas de la posición anterior (de analyzeRoot). */
export function judgeMove(P: Position, m: Move, list: RootScore[], ply: number, codes?: string[]): CoachNote {
  const side = P.t;
  const legalMoves = legal(P);
  const san = toSan(P, m, legalMoves);
  const best = list[0];
  const mine = list.find(x => sameMove(m, x.move));
  const bestS = best?.score ?? 0, myS = mine?.score ?? bestS;
  const loss = Math.max(0, winPct(bestS) - winPct(myS));
  // criterio exigente: "Mejor" solo si es la jugada del motor (o una que puntúa más); "Excelente" solo si está entre
  // las 3 primeras y casi no pierde nada. Una jugada normal, que no empeora pero tampoco es de las mejores, es "Buena".
  const isBest = !!best && (sameMove(m, best.move) || myS > bestS);
  const rank = list.findIndex(x => sameMove(m, x.move));
  let q: Quality = isBest ? 0 : loss <= 1 && rank >= 0 && rank <= 2 ? 1 : loss <= 5 ? 2 : loss <= 10 ? 3 : loss <= 18 ? 4 : 5;

  const f = describe(P, m, side);
  const why = f.lines.slice();
  let tip = '';

  // mates
  if (isMateScore(bestS) && bestS > 0 && !(isMateScore(myS) && myS > 0)) {
    const n = mateIn(bestS);
    q = Math.max(q, n === 1 ? 4 : 3) as Quality;
    why.push(n === 1 ? 'Tenías jaque mate en una jugada.' : `Tenías una secuencia de mate en ${n}.`);
    tip = 'Antes de mover, revisa todos tus jaques: a veces uno es mate.';
  } else if (isMateScore(bestS) && bestS > 0 && isMateScore(myS) && myS > 0 && mateIn(myS) > mateIn(bestS)) {
    q = Math.max(1, Math.min(q, 2)) as Quality;
    why.push(`Sigues con mate, aunque había uno más rápido (en ${mateIn(bestS)}).`);
  }
  if (isMateScore(myS) && myS < 0 && !(isMateScore(bestS) && bestS < 0)) {
    q = 5;
    why.push(mateIn(myS) <= 1 ? 'Ahora el rival tiene jaque mate en una jugada.' : `Ahora el rival tiene un mate forzado en ${mateIn(myS)}.`);
    tip = 'Después de elegir tu jugada, mira los jaques que puede darte el rival.';
  }
  if (isMateScore(myS) && myS > 0 && !f.tags.has('mate')) why.push(`Tienes mate forzado en ${mateIn(myS)}.`);

  // material perdido según el motor
  const drop = Math.max(-1500, Math.min(1500, bestS)) - Math.max(-1500, Math.min(1500, myS));
  if (q >= 4 && drop >= 150 && !isMateScore(myS) && !isMateScore(bestS)) {
    const pawns = Math.round(drop / 100);
    why.push(`Según el análisis, pierdes unos ${pawns} punto${pawns === 1 ? '' : 's'} de ventaja (1 punto = 1 peón).`);
  }

  // mejor jugada
  let bestSan: string | undefined, bestWhy: string | undefined, bestMove: { f: number; t: number } | undefined;
  if (best && q >= 1 && !sameMove(m, best.move)) {
    const bm = legalMoves.find(x => sameMove(x, best.move));
    if (bm) {
      bestSan = toSan(P, bm, legalMoves);
      bestMove = { f: bm.f, t: bm.t };
      const bf = describe(P, bm, side);
      const good = bf.lines.filter(l => !/sin defensa|sin protección|No atiendes|expone|quita el enroque/.test(l));
      bestWhy = good.slice(0, 2).join(' ') || (isMateScore(bestS) && bestS > 0 ? 'Lleva al mate.' : 'Mantiene mejor tu posición.');
      if (!tip) {
        if (bf.tags.has('free') || bf.tags.has('gain')) tip = 'Mira siempre qué piezas rivales están sin defensa: capturas, jaques y amenazas, en ese orden.';
        else if (bf.tags.has('fork')) tip = 'Busca casillas desde donde una pieza ataque dos cosas a la vez.';
        else if (bf.tags.has('saved')) tip = 'Después de cada jugada del rival, pregúntate: ¿qué me está amenazando?';
      }
    }
  }

  if (!tip) {
    if (f.tags.has('hungMoved') || f.tags.has('hungOther')) tip = 'Antes de soltar la pieza, cuenta quién la ataca y quién la defiende.';
    else if (f.tags.has('ignored')) tip = 'Después de cada jugada del rival, pregúntate: ¿qué me está amenazando?';
    else if (f.tags.has('earlyQueen')) tip = 'En la apertura: primero caballos y alfiles, después la dama.';
    else if (f.tags.has('kingWalk')) tip = 'En la apertura conviene enrocar pronto y no mover el rey.';
    else if (q <= 1 && f.tags.has('mate')) tip = '¡Bien visto! Revisar los jaques primero es lo que encuentra los mates.';
    else if (q <= 1) tip = f.tags.has('develop') || f.tags.has('center') || f.tags.has('castle')
      ? 'Buen principio de apertura: centro, desarrollo y enroque.'
      : 'Así se juega: revisaste las amenazas y elegiste lo mejor.';
    else if (q === 2) tip = 'Buena idea. Compara siempre dos o tres candidatas antes de decidir.';
    else tip = 'Antes de mover, busca jaques, capturas y amenazas, tuyas y del rival.';
  }
  // en las jugadas malas, primero el problema (lo que se ve en la franja y se dice en voz alta)
  if (q >= 3) {
    const bad = /No atiendes|sin defensa|sin protección|queda atacad|rival tiene|pierdes|Tenías|expone|quita el enroque|mate forzado/;
    why.sort((a, b) => Number(bad.test(b)) - Number(bad.test(a)));
  }
  if (!why.length) why.push(q <= 2 ? 'Mejora la ubicación de tus piezas sin crear debilidades.' : 'Es una jugada pasiva: no mejora tu posición.');
  const opening = codes ? openingLine(codes) ?? undefined : undefined;
  // jugada de teoría de una apertura conocida: el motor rápido a veces prefiere otra, pero es correcta
  if (codes && isTheory(codes) && q >= 1 && q <= 3) {
    q = 1;
    const filler = why.indexOf('Mejora la ubicación de tus piezas sin crear debilidades.');
    if (filler >= 0) why.splice(filler, 1);
    why.unshift('Es una jugada de teoría: así se juega esta apertura.');
    bestSan = undefined; bestMove = undefined; bestWhy = undefined;
    if (/Antes de mover|Compara siempre/.test(tip)) tip = 'Buen principio de apertura: centro, desarrollo y enroque.';
  }

  return { ply, side, san, q, why, tip, best: bestSan, bestMove, bestWhy, loss, opening };
}

/** Aviso después de la jugada del rival: qué te amenaza ahora y si dejó algo colgado. */
export function watchOut(P: Position, me: Color): string[] {
  const out: string[] = [];
  if (inCheck(P, me)) out.push('Estás en jaque: tienes que salir de él.');
  const mine = hanging(P, me).filter(s => VAL[T(P.b[s]!)] >= 3).sort((a, b) => VAL[T(P.b[b]!)] - VAL[T(P.b[a]!)]);
  if (mine.length) out.push(`Ojo: ${tu(P.b[mine[0]]!)} en ${sqName(mine[0])} está atacad${FEM[T(P.b[mine[0]]!)] ? 'a' : 'o'}.`);
  const theirs = hanging(P, other(me)).filter(s => VAL[T(P.b[s]!)] >= 3);
  if (theirs.length && !inCheck(P, me)) out.push('Pista: el rival dejó una pieza mal defendida. ¿La ves?');
  return out;
}

/* ---------- jugadas del rival ---------- */

export interface OpponentNote {
  ply: number;
  san: string;
  /** qué hace la jugada del rival y qué te amenaza ahora */
  lines: string[];
  /** el rival se equivocó claramente (hay algo que aprovechar) */
  slip: boolean;
}

/** Explica la jugada del rival: qué capturó, qué amenaza y si dejó algo que aprovechar. `list` es opcional (análisis de la posición previa). */
export function opponentNote(P: Position, m: Move, ply: number, list?: RootScore[]): OpponentNote {
  const side = P.t, me = other(side);
  const legalMoves = legal(P);
  const san = toSan(P, m, legalMoves);
  const lines: string[] = [];
  let slip = false;
  if (list && list.length) {
    const best = list[0], mine = list.find(x => sameMove(m, x.move));
    const loss = Math.max(0, winPct(best.score) - winPct(mine?.score ?? best.score));
    slip = loss > 12;
  }
  const u = make(P, m);
  try {
    if (legal(P).length === 0 && inCheck(P, me)) { lines.push('Te dio jaque mate.'); return { ply, san, lines, slip: false }; }
    if (m.c) lines.push(`Captura ${tu(m.c)}.`);
    if (inCheck(P, me)) lines.push('Te da jaque: tienes que salir de él.');
    const targets = attackedBy(P, m.t).filter(x => T(x.p) !== 'K' && (VAL[T(x.p)] > VAL[T(m.pr || m.p)] || !attacked(P, x.sq, me)));
    if (targets.length >= 2) lines.push(`Su ${NAME[T(m.pr || m.p)]} ataca dos piezas tuyas a la vez: ${targets.map(x => NAME[T(x.p)]).join(' y ')}.`);
    else if (targets.length === 1) lines.push(`Amenaza ${tu(targets[0].p)} en ${sqName(targets[0].sq)}.`);
    else {
      const mine = hanging(P, me).filter(s => VAL[T(P.b[s]!)] >= 3).sort((a, b) => VAL[T(P.b[b]!)] - VAL[T(P.b[a]!)]);
      if (mine.length) lines.push(`Ojo: ${tu(P.b[mine[0]]!)} en ${sqName(mine[0])} está atacad${FEM[T(P.b[mine[0]]!)] ? 'a' : 'o'}.`);
    }
    const theirs = hanging(P, side).filter(s => VAL[T(P.b[s]!)] >= 3);
    if (slip || theirs.length) lines.push(theirs.length ? `Dejó ${su(P.b[theirs[0]]!)} mal defendid${FEM[T(P.b[theirs[0]]!)] ? 'a' : 'o'}. ¿${FEM[T(P.b[theirs[0]]!)] ? 'La' : 'Lo'} puedes ganar?` : 'Se equivocó: hay una jugada fuerte para ti. Búscala.');
    if (!lines.length) {
      if (m.fl & (CK | CQ)) lines.push('Enrocó: su rey queda más seguro.');
      else if (P.f <= 10 && (T(m.p) === 'N' || T(m.p) === 'B')) lines.push(`Desarrolló su ${NAME[T(m.p)]}.`);
      else lines.push('No hay amenazas directas. Piensa en tu plan.');
    }
  } finally {
    unmake(P, m, u);
  }
  return { ply, san, lines, slip };
}

/* ---------- voz ---------- */

const SPOKEN_PIECE: Record<string, string> = { K: 'rey', Q: 'dama', R: 'torre', B: 'alfil', N: 'caballo' };
/** Convierte una jugada en notación (Nxe5+) en texto para leer en voz alta ("caballo toma e5, jaque"). */
export function sanToSpeech(san: string): string {
  if (san.startsWith('O-O-O')) return 'enroque largo';
  if (san.startsWith('O-O')) return 'enroque corto';
  const mate = san.endsWith('#'), check = san.endsWith('+');
  const s = san.replace(/[+#]/g, '');
  const m = /^([KQRBN])?([a-h]?[1-8]?)?(x)?([a-h][1-8])(=([QRBN]))?$/.exec(s);
  if (!m) return san;
  const piece = m[1] ? SPOKEN_PIECE[m[1]] : 'peón';
  let out = `${piece} ${m[3] ? 'toma' : 'a'} ${m[4]}`;
  if (m[6]) out += ` y corona ${SPOKEN_PIECE[m[6]]}`;
  if (mate) out += ', jaque mate'; else if (check) out += ', jaque';
  return out;
}

const VERDICT: string[][] = [
  ['¡Bien ahí! Es la mejor jugada.', '¡Exacto! Es justo lo que había que jugar.'],
  ['Muy bien, excelente jugada.', 'Excelente, casi lo mejor.'],
  ['Jugada normal: cumple, pero había algo más preciso.', 'Correcta, sin más.'],
  ['Imprecisa: pierdes un poco de terreno.', 'No es lo mejor, regalas algo de ventaja.'],
  ['Mal ahí, es un error.', 'Error: esto empeora bastante tu posición.'],
  ['¡Mal ahí! Error grave.', '¡Cuidado! Esto es un error grave.']
];

/** Lo que el entrenador dice en voz alta después de tu jugada: qué jugaste, qué tan buena fue, la apertura, por qué y qué era mejor. */
export function speechForNote(n: CoachNote): string {
  const parts = [`Jugaste ${sanToSpeech(n.san)}.`, VERDICT[n.q][n.ply % 2 ? 1 : 0]];
  if (n.opening) parts.push(n.opening);
  const reasons = n.why.filter(w => !/^Según el análisis|^Das jaque|^¡Es jaque mate/.test(w)).slice(0, 2);
  parts.push(...reasons);
  if (n.q >= 2 && n.best) parts.push(`${n.q === 2 ? 'Lo más preciso era' : 'Lo mejor era'} ${sanToSpeech(n.best)}.`);
  return parts.join(' ').replace(/\s+/g, ' ');
}
