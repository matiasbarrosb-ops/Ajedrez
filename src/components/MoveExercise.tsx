/*
 * MoveExercise: un ejercicio sobre el tablero (paso de lección o problema).
 * Principio educativo: ante un error no se muestra la respuesta. Primero una pista conceptual,
 * después la zona del tablero, después la pieza, y recién al final la solución.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { inCheck, legal, make, unmake, type Move } from '../engine/core.ts';
import { botEngine } from '../engine/client.ts';
import { ChessGame } from '../chess/game.ts';
import { moveCode, parseCode } from '../chess/notation.ts';
import type { MoveGoal } from '../lessons/data.ts';
import type { PuzzleStepData } from '../problems/bank.ts';
import { sfx } from '../lib/sound.ts';
import { moveSound } from '../hooks/useLocalGame.ts';
import { ChessBoard } from './ChessBoard.tsx';
import { Icon } from './Icon.tsx';

export type ExerciseGoal = MoveGoal | { puzzle: PuzzleStepData[] };
export interface ExerciseResult { solved: boolean; hints: number; mistakes: number; usedSolution: boolean }

interface Props {
  fen: string;
  goal: ExerciseGoal;
  prompt: string;
  /** pista 1: pregunta conceptual */
  concept?: string;
  ok?: string;
  wrong?: string;
  notes?: string[];
  onDone: (r: ExerciseResult) => void;
  /** texto del botón al terminar */
  continueLabel?: string;
}

const PRAISE = ['¡Muy bien!', '¡Exacto!', '¡Correcto!', '¡Eso es!', '¡Bien visto!'];
const EMPTY: Move[] = [];
const matches = (m: Move, spec: string) => spec.split('|').some(c => moveCode(m) === c);
const zoneAround = (sq: number) => {
  const r = sq >> 3, f = sq & 7, out: number[] = [];
  const r0 = Math.min(6, Math.max(0, r - 1)), f0 = Math.min(6, Math.max(0, f - 1));
  for (let i = r0; i < r0 + 2; i++) for (let j = f0; j < f0 + 2; j++) out.push(i * 8 + j);
  return out;
};

export function MoveExercise({ fen, goal, prompt, concept, ok, wrong, notes, onDone, continueLabel = 'Continuar' }: Props) {
  const game = useRef(new ChessGame(fen)).current;
  const [version, setVersion] = useState(0);
  const [phase, setPhase] = useState<'play' | 'reply' | 'correct' | 'wrong' | 'failed'>('play');
  const [message, setMessage] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [usedSolution, setUsedSolution] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);      // posición en line / puzzle
  const [userMoves, setUserMoves] = useState(0);  // para captureAll y play
  const [note, setNote] = useState<string | null>(null);
  const [expectedPlay, setExpectedPlay] = useState<string | null>(null); // mejor jugada calculada en modo play
  const orientation = useRef(game.turn).current;
  const bump = () => setVersion(v => v + 1);

  /** jugada esperada en este momento (para pistas 2 y 3 y la solución) */
  const expected = useMemo((): string | null => {
    const g = goal as Record<string, unknown>;
    if ('anyOf' in g) return (g.anyOf as string[])[0];
    if ('line' in g) return ((g.line as string[])[lineIdx] ?? '').split('|')[0] || null;
    if ('puzzle' in g) return (g.puzzle as PuzzleStepData[])[lineIdx]?.accept[0] ?? null;
    if ('mate' in g || 'check' in g) {
      const P = { ...game.P, b: game.P.b.slice() };
      for (const m of game.legal) {
        const u = make(P, m);
        const chk = inCheck(P, P.t), isMate = chk && legal(P).length === 0;
        unmake(P, m, u);
        if ('mate' in g ? isMate : chk) return moveCode(m);
      }
      return null;
    }
    if ('captureAll' in g) return game.legal.find(m => m.c) ? moveCode(game.legal.find(m => m.c)!) : null;
    if ('play' in g) return expectedPlay;
    return null;
  }, [goal, lineIdx, version, expectedPlay]); // eslint-disable-line react-hooks/exhaustive-deps

  // en modo partida libre, la pista de pieza usa la mejor jugada del motor
  useEffect(() => {
    if (!('play' in goal) || phase !== 'play') return;
    let alive = true;
    botEngine().search(game.P, { d: 4, ms: 800, n: 0 }).then(r => { if (alive && r) setExpectedPlay(moveCode(r.move)); });
    return () => { alive = false; };
  }, [version, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const hints = useMemo(() => {
    if (!expected || hintLevel < 2) return undefined;
    const ref = parseCode(expected);
    return hintLevel >= 3 ? [ref.f] : zoneAround(ref.t);
  }, [expected, hintLevel]);

  const finish = (solved: boolean) => {
    setPhase(solved ? 'correct' : 'failed');
    if (solved) { sfx('correct'); setMessage(ok ?? PRAISE[Math.floor(Math.random() * PRAISE.length)]); }
  };
  const fail = (msg: string) => {
    sfx('wrong');
    const n = mistakes + 1;
    setMistakes(n);
    // cada error sube un nivel de pista, sin llegar a la solución
    const lvl = Math.min(3, Math.max(hintLevel, n));
    setHintLevel(lvl);
    const tip = lvl === 1 ? (concept ? ` ${concept}` : '') : lvl === 2 ? ' Mira la zona marcada en azul.' : ' Prueba con la pieza marcada.';
    setMessage(msg + tip);
    setPhase('wrong');
  };

  const playReply = async (spec: string | undefined) => {
    if (!spec) return;
    setPhase('reply');
    await new Promise(r => setTimeout(r, 450));
    let m: Move | undefined;
    if (spec === '*') {
      const r = await botEngine().search(game.P, { d: 3, ms: 60000, n: 0 });
      m = r ? game.find(r.move) : undefined;
    } else m = game.find(parseCode(spec));
    if (m) { const e = game.play(m); moveSound(m, e.san, false); }
    bump();
    setPhase('play');
  };

  const onMove = async (m: Move) => {
    if (phase !== 'play') return;
    setMessage(null); setNote(null);
    const g = goal as Record<string, unknown>;
    const e = game.play(m);
    moveSound(m, e.san, false);
    bump();
    const P = game.P;
    const mated = inCheck(P, P.t) && game.legal.length === 0;
    const stalemate = !inCheck(P, P.t) && game.legal.length === 0;

    if ('anyOf' in g) {
      if ((g.anyOf as string[]).some(c => matches(m, c))) finish(true);
      else fail(wrong ?? 'Esa no es.');
    } else if ('check' in g) {
      if (inCheck(P, P.t)) finish(true); else fail(wrong ?? 'Esa jugada no da jaque.');
    } else if ('mate' in g) {
      if (mated) finish(true);
      else fail(stalemate ? '¡Ahogado! Eso serían tablas.' : inCheck(P, P.t) ? 'Es jaque, pero el rey todavía puede escapar.' : 'Eso no es jaque mate.');
    } else if ('captureAll' in g) {
      const n = userMoves + 1;
      setUserMoves(n);
      const left = P.b.some(p => p && p !== p.toUpperCase());
      if (!left) { finish(true); if (n > (g.par as number)) setMessage(`¡Listo! Lo hiciste en ${n} jugadas; se puede en ${g.par as number}.`); return; }
      if (n >= (g.par as number) + 4) { fail('Demasiadas jugadas. Empecemos de nuevo.'); game.undo(game.hist.length); setUserMoves(0); bump(); return; }
      // las negras no mueven: vuelve el turno a las blancas
      P.t = 'w'; P.ep = -1; game.legal = legal(P); bump();
    } else if ('line' in g) {
      const line = g.line as string[];
      if (!matches(m, line[lineIdx])) { game.undo(1); bump(); fail(wrong ?? 'Esa no es la jugada.'); return; }
      const userIdx = line.slice(0, lineIdx + 1).filter((_, i) => i % 2 === 0).length - 1;
      if (notes?.[userIdx]) setNote(notes[userIdx]);
      if (lineIdx + 1 >= line.length) { finish(true); return; }
      await playReply(line[lineIdx + 1]);
      if (lineIdx + 2 >= line.length) finish(true); else setLineIdx(lineIdx + 2);
    } else if ('puzzle' in g) {
      const steps = g.puzzle as PuzzleStepData[];
      if (!steps[lineIdx].accept.some(c => matches(m, c))) { game.undo(1); bump(); fail(wrong ?? 'Esa no es la mejor jugada.'); return; }
      if (!steps[lineIdx].reply) { finish(true); return; }
      setNote('¡Bien! Sigue.');
      await playReply(steps[lineIdx].reply);
      setLineIdx(lineIdx + 1);
    } else if ('play' in g) {
      const target = g.play as 'mate' | 'promote';
      const n = userMoves + 1;
      setUserMoves(n);
      if (target === 'promote' && m.pr) { finish(true); return; }
      if (target === 'mate' && mated) { finish(true); return; }
      if (stalemate) { failHard('¡Ahogado! El rey no tenía jugadas y no estaba en jaque: son tablas.'); return; }
      if (n >= (g.maxMoves as number)) { failHard(`Se acabaron las ${g.maxMoves as number} jugadas.`); return; }
      await playReply('*');
      if (target === 'promote' && !game.P.b.includes('P')) { failHard('Te capturaron el peón.'); return; }
      if (target === 'mate' && !game.P.b.some(p => p === 'Q' || p === 'R')) { failHard('Perdiste la pieza con la que dabas mate.'); return; }
    }
  };
  const failHard = (msg: string) => { sfx('wrong'); setMistakes(x => x + 1); setMessage(msg); setPhase('wrong'); resetAll.current = true; };
  const resetAll = useRef(false);

  const retry = () => {
    if (resetAll.current) { resetAll.current = false; game.undo(game.hist.length); setLineIdx(0); setUserMoves(0); bump(); }
    setMessage(null); setPhase('play');
  };
  const showSolution = async () => {
    if (!expected) return;
    setUsedSolution(true); setHintLevel(3);
    const m = game.find(parseCode(expected));
    if (!m) return;
    setPhase('play');
    await onMove(m);
    setMessage(`Solución: ${'abcdefgh'[m.f & 7]}${8 - (m.f >> 3)} → ${'abcdefgh'[m.t & 7]}${8 - (m.t >> 3)}. ${concept ?? ''}`.trim());
  };
  const askHint = () => {
    const lvl = Math.min(3, hintLevel + 1);
    setHintLevel(lvl);
    setMessage(lvl === 1 ? concept ?? 'Piensa qué quiere lograr el ejercicio.' : lvl === 2 ? 'La idea está en la zona marcada.' : 'Mueve la pieza marcada.');
  };

  const done = phase === 'correct' || phase === 'failed';
  const canMove = phase === 'play';
  const legalMoves = useMemo(() => (canMove ? game.legal : EMPTY), [canMove, version]); // eslint-disable-line react-hooks/exhaustive-deps
  const last = game.lastMove;

  return (
    <div className="exercise">
      <div className="coach-line"><span className="coach-ava">{'♞︎'}</span><p>{note ?? prompt}</p></div>
      <div className="board-holder">
        <ChessBoard P={game.P} orientation={orientation} legalMoves={legalMoves} onMove={onMove}
          lastMove={last ? { f: last.f, t: last.t } : null} animKey={game.hist.length} hints={hints} />
      </div>
      {!done && phase !== 'wrong' && (
        <div className="ex-tools">
          <span className="muted small">{phase === 'reply' ? 'El rival responde…' : `Juegan ${game.turn === 'w' ? 'blancas' : 'negras'}`}</span>
          <div className="ex-btns">
            {hintLevel < 3 && <button className="secondary small-btn" onClick={askHint}><Icon name="hint" size={16} /> Pista {hintLevel + 1}</button>}
            {hintLevel >= 3 && expected && <button className="secondary small-btn" onClick={showSolution}>Ver solución</button>}
          </div>
        </div>
      )}
      {message && !done && phase !== 'wrong' && <div className="tip">{message}</div>}
      {phase === 'wrong' && (
        <div className="feedback bad" role="status">
          <div><strong>Casi.</strong> <span>{message}</span></div>
          <div className="fb-btns">
            {hintLevel >= 3 && expected && !resetAll.current && <button className="btn-ghost" onClick={showSolution}>Ver solución</button>}
            <button className="primary" onClick={retry}>Reintentar</button>
          </div>
        </div>
      )}
      {done && (
        <div className={`feedback ${phase === 'correct' && !usedSolution ? 'good' : 'bad'}`} role="status">
          <div><strong>{usedSolution ? 'Así se resolvía.' : phase === 'correct' ? message : 'No resuelto.'}</strong>{usedSolution && message ? <span> {message}</span> : null}</div>
          <button className="primary" onClick={() => onDone({ solved: phase === 'correct' && !usedSolution, hints: usedSolution ? 3 : hintLevel, mistakes, usedSolution })}>{continueLabel}</button>
        </div>
      )}
    </div>
  );
}

