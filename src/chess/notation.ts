/* Notación: FEN, nombres de casillas, jugadas en formato UCI (e2e4) y SAN (Cf3). */
import { CK, CQ, inCheck, legal, make, unmake, type Move, type Position } from '../engine/core.ts';

export const FILES = 'abcdefgh';
export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const sqName = (i: number) => FILES[i & 7] + (8 - (i >> 3));
export const sqIndex = (s: string) => FILES.indexOf(s[0]) + (8 - Number(s[1])) * 8;

export interface MoveRef { f: number; t: number; pr: string | null }

export const moveCode = (m: { f: number; t: number; pr?: string | null }) => sqName(m.f) + sqName(m.t) + (m.pr ? m.pr.toLowerCase() : '');
export const parseCode = (c: string): MoveRef => ({ f: sqIndex(c.slice(0, 2)), t: sqIndex(c.slice(2, 4)), pr: c[4] || null });

export function sameMove(m: Move, r: MoveRef): boolean {
  return m.f === r.f && m.t === r.t && (m.pr ? m.pr.toLowerCase() : null) === (r.pr ? r.pr.toLowerCase() : null);
}

export function parseFen(fen: string): Position {
  const [board, turn, castle, ep, half, full] = fen.trim().split(/\s+/);
  const b: (string | null)[] = [];
  for (const ch of board.replace(/\//g, '')) {
    if (/\d/.test(ch)) for (let i = 0; i < Number(ch); i++) b.push(null);
    else b.push(ch);
  }
  let c = 0;
  if (castle?.includes('K')) c |= 1;
  if (castle?.includes('Q')) c |= 2;
  if (castle?.includes('k')) c |= 4;
  if (castle?.includes('q')) c |= 8;
  return { b, t: turn === 'b' ? 'b' : 'w', c, ep: !ep || ep === '-' ? -1 : sqIndex(ep), h: Number(half || 0), f: Number(full || 1) };
}

export function toFen(P: Position): string {
  let s = '';
  for (let r = 0; r < 8; r++) {
    let e = 0;
    for (let f = 0; f < 8; f++) {
      const p = P.b[r * 8 + f];
      if (!p) e++;
      else { if (e) { s += e; e = 0; } s += p; }
    }
    if (e) s += e;
    if (r < 7) s += '/';
  }
  let c = '';
  if (P.c & 1) c += 'K';
  if (P.c & 2) c += 'Q';
  if (P.c & 4) c += 'k';
  if (P.c & 8) c += 'q';
  return `${s} ${P.t} ${c || '-'} ${P.ep < 0 ? '-' : sqName(P.ep)} ${P.h} ${P.f}`;
}

/** SAN en inglés (K Q R B N). La interfaz la muestra con figuras. */
export function toSan(P: Position, m: Move, legalMoves: Move[]): string {
  let s: string;
  if (m.fl & CK) s = 'O-O';
  else if (m.fl & CQ) s = 'O-O-O';
  else {
    const T = m.p.toUpperCase();
    if (T === 'P') s = (m.c ? FILES[m.f & 7] + 'x' : '') + sqName(m.t) + (m.pr ? '=' + m.pr.toUpperCase() : '');
    else {
      const oth = legalMoves.filter(o => o.p === m.p && o.t === m.t && o.f !== m.f);
      let dis = '';
      if (oth.length) {
        const sameFile = oth.some(o => (o.f & 7) === (m.f & 7));
        const sameRank = oth.some(o => o.f >> 3 === m.f >> 3);
        dis = !sameFile ? FILES[m.f & 7] : !sameRank ? String(8 - (m.f >> 3)) : sqName(m.f);
      }
      s = T + dis + (m.c ? 'x' : '') + sqName(m.t);
    }
  }
  const u = make(P, m);
  if (inCheck(P, P.t)) s += legal(P).length ? '+' : '#';
  unmake(P, m, u);
  return s;
}
