/* Conecta el entrenador con una partida: analiza en segundo plano y arma los mensajes del chat. */
import { useEffect, useRef, useState } from 'react';
import type { Color } from '../engine/core.ts';
import { coachEngine } from '../engine/client.ts';
import { ChessGame } from '../chess/game.ts';
import { judgeMove, watchOut, accuracy, type CoachNote } from './coach.ts';

export type CoachMsg =
  | { kind: 'move'; ply: number; note: CoachNote }
  | { kind: 'info'; ply: number; lines: string[] };

const DEPTH = 4, MS = 900;

/**
 * game: partida en curso · version: cambia en cada jugada · sides: bandos que el entrenador comenta.
 */
export function useCoach(game: ChessGame, version: number, sides: Color[], active: boolean) {
  const [msgs, setMsgs] = useState<CoachMsg[]>([]);
  const [busy, setBusy] = useState(false);
  const cache = useRef(new Map<string, Promise<{ list: import('../engine/core.ts').RootScore[] }>>());
  const pending = useRef(new Set<string>());
  const inFlight = useRef(0);

  const analysisFor = (codes: string[]) => {
    const key = codes.join(',');
    let pr = cache.current.get(key);
    if (!pr) {
      const g = new ChessGame(game.startFen, codes);
      pr = coachEngine().analyze(g.P, DEPTH, MS);
      cache.current.set(key, pr);
    }
    return pr;
  };

  useEffect(() => {
    if (!active) return;
    const codes = game.codes;
    const n = codes.length;
    // deshacer: borra mensajes de jugadas que ya no existen
    setMsgs(ms => ms.filter(m => (m.kind === 'move' ? m.ply < n : m.ply <= n)));
    for (const k of [...pending.current]) if (k.split(',').length > n) pending.current.delete(k);
    const startTurn = new ChessGame(game.startFen).turn;

    for (let i = 0; i < n; i++) {
      const side: Color = i % 2 === 0 ? startTurn : startTurn === 'w' ? 'b' : 'w';
      if (!sides.includes(side)) continue;
      const key = codes.slice(0, i + 1).join(',');
      if (pending.current.has(key)) continue;
      pending.current.add(key);
      inFlight.current++;
      setBusy(true);
      const prefix = codes.slice(0, i);
      analysisFor(prefix).then(a => {
        const g = new ChessGame(game.startFen, prefix);
        const m = g.find({ f: game.hist[i]?.m.f ?? -1, t: game.hist[i]?.m.t ?? -1, pr: game.hist[i]?.m.pr ?? null });
        if (!m || game.codes.slice(0, i + 1).join(',') !== key) { pending.current.delete(key); return; }
        const note = judgeMove(g.P, m, a.list, i);
        setMsgs(ms => ms.some(x => x.kind === 'move' && x.ply === i) ? ms : [...ms, { kind: 'move' as const, ply: i, note }].sort(order));
      }).finally(() => { inFlight.current--; setBusy(inFlight.current > 0); });
    }
    // jugada del rival → aviso de qué mirar
    if (n > 0) {
      const lastSide: Color = game.turn === 'w' ? 'b' : 'w';
      if (!sides.includes(lastSide) && sides.includes(game.turn)) {
        const lines = watchOut(game.P, game.turn);
        if (lines.length) setMsgs(ms => ms.some(x => x.kind === 'info' && x.ply === n) ? ms : [...ms, { kind: 'info' as const, ply: n, lines }].sort(order));
      }
    }
    // adelanta el análisis de la posición actual si te toca
    if (sides.includes(game.turn) && game.legal.length) void analysisFor(codes);
  }, [version, active]); // eslint-disable-line react-hooks/exhaustive-deps

  const notes = msgs.filter((m): m is Extract<CoachMsg, { kind: 'move' }> => m.kind === 'move').map(m => m.note);
  return { msgs, notes, busy, accuracy: accuracy(notes.map(n => n.loss)) };
}

const order = (a: CoachMsg, b: CoachMsg) => a.ply - b.ply || (a.kind === 'info' ? -1 : 1);

/** Calidades por medio-movimiento para guardar con la partida ('-' = sin analizar). */
export function qualityString(notes: CoachNote[], plies: number): string {
  const arr = Array.from({ length: plies }, () => '-');
  for (const n of notes) if (n.ply < plies) arr[n.ply] = String(n.q);
  return arr.join('');
}
