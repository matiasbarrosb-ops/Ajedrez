/* Estado de una partida: historial, posiciones repetidas y fin de partida. No dibuja nada. */
import { inCheck, legal, make, other, type Color, type Move, type Position } from '../engine/core.ts';
import { moveCode, parseCode, parseFen, sameMove, START_FEN, toSan, type MoveRef } from './notation.ts';

export interface HistoryEntry { m: Move; san: string; code: string }

export type EndReason =
  | 'jaque mate' | 'rey ahogado' | 'regla de 50 jugadas' | 'triple repetición'
  | 'material insuficiente' | 'tiempo' | 'abandono' | 'acuerdo';

export interface GameResult { winner: Color | null; reason: EndReason }

export const REASON_TEXT: Record<EndReason, string> = {
  'jaque mate': 'por jaque mate', 'rey ahogado': 'por rey ahogado', 'regla de 50 jugadas': 'por la regla de 50 jugadas',
  'triple repetición': 'por triple repetición', 'material insuficiente': 'por material insuficiente',
  tiempo: 'por tiempo', abandono: 'por abandono', acuerdo: 'por acuerdo'
};

const posKey = (P: Position) => P.b.map(p => p || '.').join('') + P.t + P.c + P.ep;

export function insufficientMaterial(P: Position): boolean {
  const pcs: [string, number][] = [];
  P.b.forEach((p, i) => { if (p && p.toUpperCase() !== 'K') pcs.push([p.toUpperCase(), i]); });
  if (!pcs.length) return true;
  if (pcs.length === 1 && (pcs[0][0] === 'N' || pcs[0][0] === 'B')) return true;
  if (pcs.every(x => x[0] === 'B') && new Set(pcs.map(x => ((x[1] >> 3) + (x[1] & 7)) % 2)).size === 1) return true;
  return false;
}

export class ChessGame {
  readonly startFen: string;
  P: Position;
  hist: HistoryEntry[] = [];
  keys: string[] = [];
  legal: Move[] = [];

  constructor(fen: string = START_FEN, moves: string[] = []) {
    this.startFen = fen;
    this.P = parseFen(fen);
    this.reset();
    for (const c of moves) if (!this.playRef(parseCode(c))) break;
  }

  private reset() {
    this.P = parseFen(this.startFen);
    this.hist = [];
    this.keys = [posKey(this.P)];
    this.legal = legal(this.P);
  }

  get turn(): Color { return this.P.t; }
  get lastMove(): Move | null { return this.hist.length ? this.hist[this.hist.length - 1].m : null; }
  get codes(): string[] { return this.hist.map(h => h.code); }
  get inCheck(): boolean { return inCheck(this.P, this.P.t); }

  find(ref: MoveRef): Move | undefined { return this.legal.find(m => sameMove(m, ref)); }

  /** Juega una jugada legal. Devuelve la entrada del historial. */
  play(m: Move): HistoryEntry {
    const san = toSan(this.P, m, this.legal);
    make(this.P, m);
    const e = { m, san, code: moveCode(m) };
    this.hist.push(e);
    this.keys.push(posKey(this.P));
    this.legal = legal(this.P);
    return e;
  }
  playRef(ref: MoveRef): HistoryEntry | null {
    const m = this.find(ref);
    return m ? this.play(m) : null;
  }

  /** Retrocede n jugadas rehaciendo la partida desde el inicio (simple y seguro). */
  undo(n: number): void {
    const codes = this.codes.slice(0, Math.max(0, this.hist.length - n));
    this.reset();
    for (const c of codes) this.playRef(parseCode(c));
  }

  /** Fin de partida por las reglas del tablero (no incluye tiempo, abandono ni acuerdo). */
  boardResult(): GameResult | null {
    const P = this.P;
    if (!this.legal.length) return inCheck(P, P.t) ? { winner: other(P.t), reason: 'jaque mate' } : { winner: null, reason: 'rey ahogado' };
    if (P.h >= 100) return { winner: null, reason: 'regla de 50 jugadas' };
    const k = this.keys[this.keys.length - 1];
    if (this.keys.filter(x => x === k).length >= 3) return { winner: null, reason: 'triple repetición' };
    if (insufficientMaterial(P)) return { winner: null, reason: 'material insuficiente' };
    return null;
  }
}

export const PIECE_VALUE: Record<string, number> = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };

/** Piezas capturadas por `c` y su ventaja de material. */
export function capturedBy(P: Position, c: Color): { pieces: string[]; advantage: number } {
  const start: Record<string, number> = { P: 8, N: 2, B: 2, R: 2, Q: 1 };
  const cnt: Record<string, number> = { P: 0, N: 0, B: 0, R: 0, Q: 0, K: 0 };
  let mat = 0;
  for (const p of P.b) {
    if (!p) continue;
    const T = p.toUpperCase(), white = p === T;
    if ((white ? 'w' : 'b') !== c) cnt[T]++;
    mat += (white ? 1 : -1) * PIECE_VALUE[T];
  }
  const pieces: string[] = [];
  for (const T of ['P', 'N', 'B', 'R', 'Q']) for (let i = 0; i < Math.max(0, start[T] - cnt[T]); i++) pieces.push(T);
  return { pieces, advantage: c === 'w' ? mat : -mat };
}
