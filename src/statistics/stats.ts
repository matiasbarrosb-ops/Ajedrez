/* Estadísticas de todas tus partidas y jugadas, calculadas a partir del historial guardado. */
import { CK, CQ } from '../engine/core.ts';
import { ChessGame } from '../chess/game.ts';
import { START_FEN } from '../chess/notation.ts';
import type { GameRecord } from '../profile/progress.ts';

export interface Wld { w: number; l: number; d: number; n: number }
const wld = (): Wld => ({ w: 0, l: 0, d: 0, n: 0 });
const add = (x: Wld, r: GameRecord['result']) => { x.n++; if (r === 'win') x.w++; else if (r === 'loss') x.l++; else x.d++; };
export const scorePct = (x: Wld) => (x.n ? Math.round((100 * (x.w + x.d / 2)) / x.n) : 0);

export interface Stats {
  total: Wld;
  byColor: { w: Wld; b: Wld };
  byOpponent: { name: string; rating?: number; r: Wld }[];
  byReason: { reason: string; win: number; loss: number; draw: number }[];
  /** movimientos tuyos */
  myMoves: number;
  pieces: Record<'P' | 'N' | 'B' | 'R' | 'Q' | 'K', number>;
  captures: number;
  checks: number;
  promotions: number;
  castled: { short: number; long: number; never: number };
  avgLength: number;
  avgDurationMin: number;
  longest: number;
  quality: number[];
  analyzedMoves: number;
  accuracyAvg: number | null;
  accuracySeries: { id: string; date: number; acc: number; result: GameRecord['result'] }[];
  openingsWhite: { san: string; r: Wld }[];
  openingsBlack: { san: string; r: Wld }[];
  /** últimas partidas, de la más antigua a la más nueva */
  form: GameRecord['result'][];
  bestStreak: number;
  perGame: { g: GameRecord; myMoves: number; q: number[] }[];
}

export function computeStats(games: GameRecord[]): Stats {
  const s: Stats = {
    total: wld(), byColor: { w: wld(), b: wld() }, byOpponent: [], byReason: [], myMoves: 0,
    pieces: { P: 0, N: 0, B: 0, R: 0, Q: 0, K: 0 }, captures: 0, checks: 0, promotions: 0, castled: { short: 0, long: 0, never: 0 },
    avgLength: 0, avgDurationMin: 0, longest: 0, quality: [0, 0, 0, 0, 0], analyzedMoves: 0, accuracyAvg: null, accuracySeries: [],
    openingsWhite: [], openingsBlack: [], form: [], bestStreak: 0, perGame: []
  };
  const opp = new Map<string, { name: string; rating?: number; r: Wld }>();
  const reasons = new Map<string, { reason: string; win: number; loss: number; draw: number }>();
  const opW = new Map<string, Wld>(), opB = new Map<string, Wld>();
  let len = 0, dur = 0, accSum = 0, accN = 0;
  // en partidas de dos jugadores en el mismo teléfono se cuentan las jugadas de ambos lados
  for (const g of games) {
    add(s.total, g.result);
    add(s.byColor[g.color], g.result);
    const o = opp.get(g.opponent) ?? { name: g.opponent, rating: g.opponentRating, r: wld() };
    add(o.r, g.result); opp.set(g.opponent, o);
    const rs = reasons.get(g.reason) ?? { reason: g.reason, win: 0, loss: 0, draw: 0 };
    rs[g.result]++; reasons.set(g.reason, rs);
    len += Math.ceil(g.moves.length / 2); dur += g.durationMs;
    s.longest = Math.max(s.longest, Math.ceil(g.moves.length / 2));
    if (g.acc != null) { accSum += g.acc; accN++; }

    const cg = new ChessGame(START_FEN, g.moves);
    const myParity = g.color === 'w' ? 0 : 1;
    let castle: 'short' | 'long' | null = null, mine = 0;
    const q = [0, 0, 0, 0, 0];
    cg.hist.forEach((h, i) => {
      if (g.mode !== 'local' && i % 2 !== myParity) return;
      mine++;
      s.pieces[h.m.p.toUpperCase() as keyof Stats['pieces']]++;
      if (h.m.c) s.captures++;
      if (/[+#]$/.test(h.san)) s.checks++;
      if (h.m.pr) s.promotions++;
      if (h.m.fl & CK) castle = 'short';
      if (h.m.fl & CQ) castle = 'long';
      const c = g.qs?.[i];
      if (c && c !== '-') { q[+c]++; s.quality[+c]++; s.analyzedMoves++; }
    });
    s.myMoves += mine;
    if (cg.hist.length >= 20) { if (castle) s.castled[castle as 'short' | 'long']++; else s.castled.never++; }
    s.perGame.push({ g, myMoves: mine, q });

    // apertura: tu primera jugada con blancas, o tu respuesta a la primera jugada con negras
    if (g.color === 'w' && cg.hist[0]) { const k = cg.hist[0].san; const x = opW.get(k) ?? wld(); add(x, g.result); opW.set(k, x); }
    if (g.color === 'b' && cg.hist[1]) { const k = `${cg.hist[0].san} ${cg.hist[1].san}`; const x = opB.get(k) ?? wld(); add(x, g.result); opB.set(k, x); }
  }
  const n = games.length || 1;
  s.avgLength = Math.round(len / n);
  s.avgDurationMin = Math.round(dur / n / 60000);
  s.accuracyAvg = accN ? Math.round(accSum / accN) : null;
  s.byOpponent = [...opp.values()].sort((a, b) => b.r.n - a.r.n);
  s.byReason = [...reasons.values()].sort((a, b) => b.win + b.loss + b.draw - (a.win + a.loss + a.draw));
  s.openingsWhite = [...opW.entries()].map(([san, r]) => ({ san, r })).sort((a, b) => b.r.n - a.r.n).slice(0, 6);
  s.openingsBlack = [...opB.entries()].map(([san, r]) => ({ san, r })).sort((a, b) => b.r.n - a.r.n).slice(0, 6);
  const chrono = games.slice().reverse();
  s.accuracySeries = chrono.filter(g => g.acc != null).slice(-30).map(g => ({ id: g.id, date: g.date, acc: g.acc!, result: g.result }));
  s.form = chrono.slice(-20).map(g => g.result);
  let run = 0;
  for (const g of chrono) { run = g.result === 'win' ? run + 1 : 0; s.bestStreak = Math.max(s.bestStreak, run); }
  return s;
}
