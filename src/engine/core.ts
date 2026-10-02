/*
 * Motor de ajedrez: generación de jugadas legales, evaluación y búsqueda alfa-beta.
 * No conoce la interfaz. Se usa desde un Web Worker (engine.worker.ts) o desde scripts de Node.
 *
 * Tablero: arreglo de 64 casillas, índice 0 = a8, 63 = h1. Piezas en mayúscula = blancas.
 */

export type Color = 'w' | 'b';
export type Piece = string; // 'P','N','B','R','Q','K' blancas; minúsculas negras

export interface Position {
  b: (Piece | null)[];
  t: Color;
  /** enroques disponibles: 1=K, 2=Q, 4=k, 8=q */
  c: number;
  /** casilla de captura al paso o -1 */
  ep: number;
  /** medio-movimientos desde la última captura o movimiento de peón */
  h: number;
  /** número de jugada */
  f: number;
}

export interface Move {
  f: number;
  t: number;
  p: Piece;
  c: Piece | null;
  fl: number;
  pr?: Piece;
  o?: number;
}

export interface Undo { c: number; ep: number; h: number }

export interface SearchOptions {
  /** profundidad máxima */
  d: number;
  /** tiempo máximo en ms */
  ms: number;
  /** ruido en centipeones para jugar peor a propósito (0 = mejor jugada) */
  n: number;
}

export interface SearchResult {
  move: { f: number; t: number; pr: Piece | null };
  /** evaluación desde el punto de vista del bando que mueve, en centipeones (±100000 = mate) */
  score: number;
  depth: number;
}

export const DBL = 1, EP = 2, CK = 4, CQ = 8;
export const MATE = 100000;
export const PV: Record<string, number> = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };

const PST: Record<string, number[]> = {
  P: [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  N: [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50],
  B: [-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10, -10, -10, -10, -10, -10, -20],
  R: [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0],
  Q: [-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20],
  K: [-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20],
  KE: [-50, -40, -30, -20, -20, -30, -40, -50, -30, -20, -10, 0, 0, -10, -20, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -30, 0, 0, 0, 0, -30, -30, -50, -30, -30, -30, -30, -30, -30, -50]
};
const KN = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const KD = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const BD = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const RD = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const QD = BD.concat(RD);

export const isWhite = (p: Piece) => p === p.toUpperCase();
export const colorOf = (p: Piece): Color => (isWhite(p) ? 'w' : 'b');
export const other = (c: Color): Color => (c === 'w' ? 'b' : 'w');

function at(P: Position, r: number, f: number): Piece | null | undefined {
  if (r < 0 || r > 7 || f < 0 || f > 7) return undefined;
  return P.b[r * 8 + f];
}
function slide(P: Position, r: number, f: number, dirs: number[][], a: Piece, b: Piece): boolean {
  for (const [dr, df] of dirs) {
    let rr = r + dr, ff = f + df;
    while (rr >= 0 && rr < 8 && ff >= 0 && ff < 8) {
      const p = P.b[rr * 8 + ff];
      if (p) { if (p === a || p === b) return true; break; }
      rr += dr; ff += df;
    }
  }
  return false;
}

/** ¿La casilla sq está atacada por el bando `by`? */
export function attacked(P: Position, sq: number, by: Color): boolean {
  const r = sq >> 3, f = sq & 7, w = by === 'w';
  const pr = w ? r + 1 : r - 1, pc = w ? 'P' : 'p';
  if (at(P, pr, f - 1) === pc || at(P, pr, f + 1) === pc) return true;
  const n = w ? 'N' : 'n', k = w ? 'K' : 'k';
  for (const [dr, df] of KN) if (at(P, r + dr, f + df) === n) return true;
  for (const [dr, df] of KD) if (at(P, r + dr, f + df) === k) return true;
  if (slide(P, r, f, BD, w ? 'B' : 'b', w ? 'Q' : 'q')) return true;
  if (slide(P, r, f, RD, w ? 'R' : 'r', w ? 'Q' : 'q')) return true;
  return false;
}
export function kingSq(P: Position, c: Color): number {
  const k = c === 'w' ? 'K' : 'k';
  return P.b.indexOf(k);
}
export function inCheck(P: Position, c: Color): boolean {
  const k = kingSq(P, c);
  return k >= 0 && attacked(P, k, other(c));
}

/** Jugadas pseudo-legales (pueden dejar al rey en jaque). capsOnly = solo capturas y coronaciones. */
export function gen(P: Position, capsOnly = false): Move[] {
  const ms: Move[] = [], w = P.t === 'w', them = other(P.t), b = P.b;
  const enemy = (q: Piece | null) => !!q && isWhite(q) !== w;
  for (let s = 0; s < 64; s++) {
    const p = b[s];
    if (!p || isWhite(p) !== w) continue;
    const r = s >> 3, f = s & 7, T = p.toUpperCase();
    if (T === 'P') {
      const d = w ? -1 : 1, start = w ? 6 : 1, last = w ? 0 : 7, r1 = r + d;
      const pushP = (to: number, cap: Piece | null, fl = 0) => {
        if (to >> 3 === last) {
          for (const pr of ['Q', 'N', 'R', 'B']) ms.push({ f: s, t: to, p, c: cap, fl, pr: w ? pr : pr.toLowerCase() });
        } else ms.push({ f: s, t: to, p, c: cap, fl });
      };
      if (r1 >= 0 && r1 < 8) {
        if (!b[r1 * 8 + f]) {
          if (!capsOnly || r1 === last) pushP(r1 * 8 + f, null);
          if (!capsOnly && r === start && !b[(r + 2 * d) * 8 + f]) ms.push({ f: s, t: (r + 2 * d) * 8 + f, p, c: null, fl: DBL });
        }
        for (const k of [-1, 1]) {
          const ff = f + k; if (ff < 0 || ff > 7) continue;
          const to = r1 * 8 + ff;
          if (enemy(b[to])) pushP(to, b[to]);
          else if (to === P.ep && !b[to]) ms.push({ f: s, t: to, p, c: w ? 'p' : 'P', fl: EP });
        }
      }
    } else if (T === 'N' || T === 'K') {
      for (const [dr, df] of T === 'N' ? KN : KD) {
        const rr = r + dr, fc = f + df;
        if (rr < 0 || rr > 7 || fc < 0 || fc > 7) continue;
        const to = rr * 8 + fc, q = b[to];
        if (!q) { if (!capsOnly) ms.push({ f: s, t: to, p, c: null, fl: 0 }); }
        else if (enemy(q)) ms.push({ f: s, t: to, p, c: q, fl: 0 });
      }
      if (T === 'K' && !capsOnly) {
        if (w && s === 60) {
          if ((P.c & 1) && !b[61] && !b[62] && b[63] === 'R' && !attacked(P, 60, them) && !attacked(P, 61, them) && !attacked(P, 62, them)) ms.push({ f: 60, t: 62, p, c: null, fl: CK });
          if ((P.c & 2) && !b[59] && !b[58] && !b[57] && b[56] === 'R' && !attacked(P, 60, them) && !attacked(P, 59, them) && !attacked(P, 58, them)) ms.push({ f: 60, t: 58, p, c: null, fl: CQ });
        }
        if (!w && s === 4) {
          if ((P.c & 4) && !b[5] && !b[6] && b[7] === 'r' && !attacked(P, 4, them) && !attacked(P, 5, them) && !attacked(P, 6, them)) ms.push({ f: 4, t: 6, p, c: null, fl: CK });
          if ((P.c & 8) && !b[3] && !b[2] && !b[1] && b[0] === 'r' && !attacked(P, 4, them) && !attacked(P, 3, them) && !attacked(P, 2, them)) ms.push({ f: 4, t: 2, p, c: null, fl: CQ });
        }
      }
    } else {
      const dirs = T === 'B' ? BD : T === 'R' ? RD : QD;
      for (const [dr, df] of dirs) {
        let r2 = r + dr, f2 = f + df;
        while (r2 >= 0 && r2 < 8 && f2 >= 0 && f2 < 8) {
          const to = r2 * 8 + f2, q = b[to];
          if (!q) { if (!capsOnly) ms.push({ f: s, t: to, p, c: null, fl: 0 }); }
          else { if (enemy(q)) ms.push({ f: s, t: to, p, c: q, fl: 0 }); break; }
          r2 += dr; f2 += df;
        }
      }
    }
  }
  return ms;
}

export function make(P: Position, m: Move): Undo {
  const u: Undo = { c: P.c, ep: P.ep, h: P.h }, b = P.b;
  b[m.t] = m.pr || m.p; b[m.f] = null;
  if (m.fl & EP) b[m.t + (m.p === 'P' ? 8 : -8)] = null;
  if (m.fl & CK) { b[m.t - 1] = b[m.t + 1]; b[m.t + 1] = null; }
  if (m.fl & CQ) { b[m.t + 1] = b[m.t - 2]; b[m.t - 2] = null; }
  if (m.p === 'K') P.c &= ~3;
  if (m.p === 'k') P.c &= ~12;
  if (m.f === 63 || m.t === 63) P.c &= ~1;
  if (m.f === 56 || m.t === 56) P.c &= ~2;
  if (m.f === 7 || m.t === 7) P.c &= ~4;
  if (m.f === 0 || m.t === 0) P.c &= ~8;
  P.ep = m.fl & DBL ? (m.f + m.t) >> 1 : -1;
  P.h = m.p === 'P' || m.p === 'p' || m.c ? 0 : P.h + 1;
  if (P.t === 'b') P.f++;
  P.t = other(P.t);
  return u;
}
export function unmake(P: Position, m: Move, u: Undo): void {
  P.t = other(P.t);
  if (P.t === 'b') P.f--;
  const b = P.b;
  b[m.f] = m.p;
  if (m.fl & EP) { b[m.t] = null; b[m.t + (m.p === 'P' ? 8 : -8)] = m.c; } else b[m.t] = m.c;
  if (m.fl & CK) { b[m.t + 1] = b[m.t - 1]; b[m.t - 1] = null; }
  if (m.fl & CQ) { b[m.t - 2] = b[m.t + 1]; b[m.t + 1] = null; }
  P.c = u.c; P.ep = u.ep; P.h = u.h;
}
export function legal(P: Position): Move[] {
  const out: Move[] = [], me = P.t;
  for (const m of gen(P, false)) {
    const u = make(P, m);
    if (!inCheck(P, me)) out.push(m);
    unmake(P, m, u);
  }
  return out;
}

/** Evaluación estática desde el punto de vista del bando que mueve. */
export function evaluate(P: Position): number {
  let s = 0, np = 0, q = 0, bw = 0, bb = 0;
  for (let i = 0; i < 64; i++) {
    const p = P.b[i]; if (!p) continue;
    const T = p.toUpperCase();
    if (T !== 'P' && T !== 'K') np += PV[T];
    if (T === 'Q') q++;
  }
  const end = q === 0 || np <= 2600;
  for (let i = 0; i < 64; i++) {
    const p = P.b[i]; if (!p) continue;
    const T = p.toUpperCase(), w = isWhite(p);
    const tb = T === 'K' ? (end ? PST.KE : PST.K) : PST[T];
    const v = PV[T] + tb[w ? i : i ^ 56];
    if (T === 'B') { if (w) bw++; else bb++; }
    s += w ? v : -v;
  }
  if (bw >= 2) s += 30;
  if (bb >= 2) s -= 30;
  return P.t === 'w' ? s : -s;
}

function order(ms: Move[]): void {
  for (const m of ms) m.o = (m.c ? 10000 + 10 * PV[m.c.toUpperCase()] - PV[m.p.toUpperCase()] : 0) + (m.pr ? PV[m.pr.toUpperCase()] : 0);
  ms.sort((a, b) => (b.o || 0) - (a.o || 0));
}

let nodes = 0, stopAt = 0, aborted = false;
export function setDeadline(t: number): void { stopAt = t; aborted = false; nodes = 0; }

function qs(P: Position, a: number, b: number, qd: number): number {
  const sp = evaluate(P);
  if (sp >= b) return b;
  if (sp > a) a = sp;
  if (qd > 8) return a;
  const ms = gen(P, true), me = P.t; order(ms);
  for (const m of ms) {
    const u = make(P, m);
    if (inCheck(P, me)) { unmake(P, m, u); continue; }
    const s = -qs(P, -b, -a, qd + 1);
    unmake(P, m, u);
    if (s >= b) return b;
    if (s > a) a = s;
  }
  return a;
}

/** Alfa-beta con extensión de jaques. Devuelve la evaluación desde el bando que mueve. */
export function ab(P: Position, d: number, a: number, b: number, ply: number): number {
  if (((++nodes) & 2047) === 0 && Date.now() > stopAt) aborted = true;
  if (aborted) return 0;
  if (ply >= 40) return evaluate(P);
  const me = P.t, chk = inCheck(P, me);
  if (chk) d++;
  if (d <= 0) return qs(P, a, b, 0);
  if (P.h >= 100) return 0;
  const ms = gen(P, false); order(ms);
  let n = 0;
  for (const m of ms) {
    const u = make(P, m);
    if (inCheck(P, me)) { unmake(P, m, u); continue; }
    n++;
    const s = -ab(P, d - 1, -b, -a, ply + 1);
    unmake(P, m, u);
    if (aborted) return 0;
    if (s >= b) return b;
    if (s > a) a = s;
  }
  if (n === 0) return chk ? -MATE + ply : 0;
  return a;
}

/** Busca la mejor jugada con profundización iterativa. */
export function search(P: Position, o: SearchOptions): SearchResult | null {
  const root = legal(P);
  if (!root.length) return null;
  setDeadline(Date.now() + (o.ms || 1000));
  order(root);
  let list = root.map(m => ({ m, s: 0 }));
  let done: { m: Move; s: number }[] | null = null, depth = 0;
  for (let d = 1; d <= o.d; d++) {
    let a = -1e9;
    const res: { m: Move; s: number }[] = [];
    for (const it of list) {
      const u = make(P, it.m);
      const s = -ab(P, d - 1, -1e9, o.n > 0 ? 1e9 : -a, 1);
      unmake(P, it.m, u);
      if (aborted) break;
      res.push({ m: it.m, s });
      if (s > a) a = s;
    }
    if (aborted) {
      if (!done) done = res.length ? res.sort((x, y) => y.s - x.s) : list;
      break;
    }
    res.sort((x, y) => y.s - x.s);
    list = res; done = res; depth = d;
    if (res[0].s > MATE - 1000) break;
  }
  const fin = done as { m: Move; s: number }[];
  let pick = fin[0];
  if (o.n > 0) {
    let bv = -1e18;
    for (const x of fin) {
      const v = x.s + Math.random() * o.n;
      if (v > bv) { bv = v; pick = x; }
    }
  }
  return { move: { f: pick.m.f, t: pick.m.t, pr: pick.m.pr || null }, score: pick.s, depth };
}
