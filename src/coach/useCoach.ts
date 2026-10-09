/* Conecta el entrenador con una partida: analiza en segundo plano y arma los mensajes del chat. */
import { useEffect, useRef, useState } from 'react';
import type { Color, RootScore } from '../engine/core.ts';
import { coachEngine } from '../engine/client.ts';
import { ChessGame } from '../chess/game.ts';
import { START_FEN } from '../chess/notation.ts';
import { judgeMove, opponentNote, accuracy, type CoachNote, type OpponentNote } from './coach.ts';

export type CoachMsg =
  | { kind: 'move'; ply: number; note: CoachNote }
  | { kind: 'opp'; ply: number; note: OpponentNote };

/** Profundidad y tiempo del análisis: más profundo = calificación más exigente. */
const DEPTH = 5, MS = 1200;

/**
 * game: partida en curso · version: cambia en cada jugada · sides: bandos que el entrenador califica
 * (las jugadas del otro bando se explican: qué amenazan y si dejaron algo que aprovechar).
 */
export function useCoach(game: ChessGame, version: number, sides: Color[], active: boolean) {
  const [msgs, setMsgs] = useState<CoachMsg[]>([]);
  const [busy, setBusy] = useState(false);
  const cache = useRef(new Map<string, Promise<{ list: RootScore[] }>>());
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
    setMsgs(ms => ms.filter(m => m.ply < n));
    for (const k of [...pending.current]) if (k.split(',').length > n) pending.current.delete(k);
    const startTurn = new ChessGame(game.startFen).turn;

    for (let i = 0; i < n; i++) {
      const side: Color = i % 2 === 0 ? startTurn : startTurn === 'w' ? 'b' : 'w';
      const mine = sides.includes(side);
      const key = codes.slice(0, i + 1).join(',');
      if (pending.current.has(key)) continue;
      pending.current.add(key);
      inFlight.current++;
      if (mine) setBusy(true);
      const prefix = codes.slice(0, i);
      analysisFor(prefix).then(a => {
        const g = new ChessGame(game.startFen, prefix);
        const m = g.find({ f: game.hist[i]?.m.f ?? -1, t: game.hist[i]?.m.t ?? -1, pr: game.hist[i]?.m.pr ?? null });
        if (!m || game.codes.slice(0, i + 1).join(',') !== key) { pending.current.delete(key); return; }
        const msg: CoachMsg = mine
          ? { kind: 'move', ply: i, note: judgeMove(g.P, m, a.list, i, game.startFen === START_FEN ? codes.slice(0, i + 1) : undefined) }
          : { kind: 'opp', ply: i, note: opponentNote(g.P, m, i, a.list) };
        setMsgs(ms => ms.some(x => x.ply === i) ? ms : [...ms, msg].sort((x, y) => x.ply - y.ply));
      }).finally(() => { inFlight.current--; setBusy(inFlight.current > 0); });
    }
    // adelanta el análisis de la posición actual
    if (game.legal.length) void analysisFor(codes);
  }, [version, active]); // eslint-disable-line react-hooks/exhaustive-deps

  const notes = msgs.filter((m): m is Extract<CoachMsg, { kind: 'move' }> => m.kind === 'move').map(m => m.note);
  const latest = msgs.length ? msgs[msgs.length - 1] : null;
  return { msgs, notes, latest, busy, accuracy: accuracy(notes.map(n => n.loss)) };
}

/** Calidades por medio-movimiento para guardar con la partida ('~' = escala de 6 niveles, '-' = sin analizar). */
export function qualityString(notes: CoachNote[], plies: number): string {
  const arr = Array.from({ length: plies }, () => '-');
  for (const n of notes) if (n.ply < plies) arr[n.ply] = String(n.q);
  return '~' + arr.join('');
}
