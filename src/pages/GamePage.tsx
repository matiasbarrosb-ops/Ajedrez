/* Partida contra un bot o entre dos personas en este teléfono. */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import type { Color, Move } from '../engine/core.ts';
import { REASON_TEXT } from '../chess/game.ts';
import { GameView, ResultOverlay, type Control, type PlayerInfo } from '../components/GameView.tsx';
import { loadSavedLocal, startLocalGame, useLocalGame } from '../hooks/useLocalGame.ts';
import { useStore } from '../database/store.ts';
import { sessionStore } from '../database/session.ts';
import { bumpRecord } from '../database/online.ts';
import { recordGame, updateGame } from '../profile/progress.ts';
import { settingsStore } from '../database/session.ts';
import { useCoach, qualityString } from '../coach/useCoach.ts';
import { CoachPanel } from '../components/CoachPanel.tsx';
import type { CoachNote } from '../coach/coach.ts';
import { botLine, mistakeLine, reactToMove, toSpeech, type Mood } from '../coach/talk.ts';
import { CoachTalk, type Bubble } from '../components/CoachTalk.tsx';
import type { BadgeKind, BoardArrow } from '../components/ChessBoard.tsx';
import { ChessGame } from '../chess/game.ts';
import { START_FEN } from '../chess/notation.ts';
import { Icon } from '../components/Icon.tsx';
import { speak, stopSpeaking } from '../lib/voice.ts';
import { REASON_TEXT as RT } from '../chess/game.ts';
import { loadSavedLocal as loadSaved } from '../hooks/useLocalGame.ts';

const EMPTY: Move[] = [];

export function GamePage() {
  const [key, setKey] = useState(0);
  if (!loadSavedLocal()) return <Navigate to="/jugar" replace />;
  return <LocalGame key={key} onRestart={() => setKey(k => k + 1)} />;
}

function LocalGame({ onRestart }: { onRestart: () => void }) {
  const nav = useNavigate();
  const { user } = useStore(sessionStore);
  // el entrenador puede frenar al bot mientras comenta tu jugada o espera que decidas
  const holdRef = useRef(false);
  const g = useLocalGame(holdRef);
  const { cfg, game, result, thinking, clock, humanCanMove } = g;
  const [flip, setFlip] = useState(false);
  const [overSeen, setOverSeen] = useState(!!result);
  const [armedResign, setArmedResign] = useState(0);
  const recorded = useRef(!!result);
  const recId = useRef<string | null>(null);
  const settings = useStore(settingsStore);
  const sides: Color[] = cfg.mode === 'bot' ? [cfg.human] : ['w', 'b'];
  // modo entrenador: el entrenador conversa arriba del tablero y habla en voz alta. Modo Bots: sin comentarios (se analiza en silencio para tus estadísticas).
  const coachMode = cfg.mode === 'bot' && !!cfg.coach;
  const coach = useCoach(game, g.version, sides, cfg.mode === 'bot' ? true : settings.coach);
  const [showBest, setShowBest] = useState(false);
  // para la franja: tu última jugada calificada y, si es posterior, la última del rival
  const lastMine = [...coach.msgs].reverse().find(m => m.kind === 'move');
  const mineNote = lastMine?.kind === 'move' ? lastMine.note : null;
  useEffect(() => { setShowBest(false); }, [g.version, mineNote?.ply]);
  useEffect(() => () => stopSpeaking(), []);

  /* ---------- modo entrenador: conversación, pausas, íconos y flechas ---------- */
  const n = game.hist.length;
  const botTurn = cfg.mode === 'bot' && game.turn !== cfg.human;
  const lastIsMine = coachMode && n > 0 && botTurn;           // la última jugada fue tuya y el bot aún no responde
  const myPly = lastIsMine ? n - 1 : n >= 2 && coachMode ? n - 2 : -1; // tu última jugada en el tablero
  const myNote: CoachNote | undefined = coach.notes.find(x => x.ply === myPly);
  const [continued, setContinued] = useState<Set<number>>(new Set());
  const [timedOut, setTimedOut] = useState<number>(-1);
  const waiting = lastIsMine && !result && !myNote && timedOut !== n - 1;
  const paused = lastIsMine && !result && !!myNote && myNote.q >= 4 && !continued.has(myNote.ply);
  const shouldHold = waiting || paused;
  const wasHeld = useRef(false);
  useLayoutEffect(() => {
    holdRef.current = shouldHold;
    if (wasHeld.current && !shouldHold) g.kick();
    wasHeld.current = shouldHold;
  });
  // si el análisis se demora demasiado, el bot juega igual
  useEffect(() => {
    if (!waiting) return;
    const t = setTimeout(() => setTimedOut(n - 1), 5000);
    return () => clearTimeout(t);
  }, [waiting, n]);

  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [mood, setMood] = useState<Mood>('happy');
  const talked = useRef(new Set<string>());
  const prevThreat = useRef(false);
  // al deshacer o reintentar, se olvidan los comentarios y pausas de las jugadas borradas
  useEffect(() => {
    for (const k of [...talked.current]) if (+(/\d+/.exec(k)?.[0] ?? 0) >= n) talked.current.delete(k);
    setContinued(c => (Array.from(c).some(p => p >= n) ? new Set(Array.from(c).filter(p => p < n)) : c));
  }, [n]);
  const say = (text: string, m: Mood, replace: boolean) => {
    const b = { id: `${Date.now()}-${Math.random()}`, text };
    setBubbles(bs => (replace ? [b] : [...bs, b].slice(-2)));
    setMood(m);
    if (settings.voice && settings.sound) speak(toSpeech(text));
  };
  // tu jugada calificada → el entrenador reacciona (o te frena si fue un error)
  useEffect(() => {
    if (!coachMode || !myNote) return;
    const key = `me${myNote.ply}:${game.codes.slice(0, myNote.ply + 1).join(',')}`;
    if (talked.current.has(key) || myNote.ply < n - 2) return;
    talked.current.add(key);
    if (myNote.q >= 4) {
      const after = new ChessGame(START_FEN, game.codes.slice(0, myNote.ply + 1));
      const l = mistakeLine(myNote, after.P);
      say(l.text, l.mood, true);
    } else {
      const prev = myNote.ply > 0 ? game.hist[myNote.ply - 1] : null;
      const l = reactToMove(myNote, prevThreat.current, prev?.m.c ? prev.m.t : null);
      say(l.text, l.mood, true);
    }
  }, [myNote, coachMode]); // eslint-disable-line react-hooks/exhaustive-deps
  // la jugada del bot → dice lo que hace
  useEffect(() => {
    if (!coachMode || !n || botTurn) return;
    const last = game.hist[n - 1];
    const key = `bot${n - 1}:${game.codes.join(',')}`;
    if (talked.current.has(key)) return;
    talked.current.add(key);
    const before = new ChessGame(START_FEN, game.codes.slice(0, n - 1));
    const l = botLine(before.P, last.m, game.codes);
    prevThreat.current = l.threat;
    // si tu jugada anterior ya tiene comentario, el del bot va debajo; si no, lo reemplaza
    say(l.text, l.mood, n === 1 || !coach.notes.some(x => x.ply === n - 2));
  }, [g.version, coachMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const retry = () => {
    stopSpeaking();
    g.undo();
    setBubbles([{ id: `retry${Date.now()}`, text: '¡Dale! Busca una jugada mejor.' }]);
    setMood('happy');
  };
  const goOn = () => {
    if (!myNote) return;
    setContinued(c => new Set(c).add(myNote.ply));
    setShowBest(false);
  };
  const KIND: BadgeKind[] = ['best', 'excellent', 'good', 'inaccuracy', 'mistake', 'blunder'];
  const badge = coachMode && myNote && myNote.to !== undefined && myNote.ply === myPly
    ? { sq: myNote.to, kind: myNote.book && myNote.q <= 1 ? 'book' as const : KIND[myNote.q] }
    : null;
  const arrows: BoardArrow[] = [];
  if (coachMode && paused && myNote?.threat) arrows.push({ f: myNote.threat.f, t: myNote.threat.t, tone: 'bad' });
  if (coachMode && showBest && myNote?.bestMove && myNote.ply === myPly) arrows.push({ ...myNote.bestMove, tone: 'good' });
  const talkActions = coachMode && !result ? (
    paused ? (
      <>
        <button className="btn-ghost" onClick={goOn}><Icon name="play" size={18} />Continuar</button>
        <button className="primary sm" onClick={retry}><Icon name="undo" size={18} />Reintentar</button>
        {myNote?.best && <button className="link" onClick={() => setShowBest(v => !v)}>{showBest ? 'Ocultar mejor' : 'Ver mejor'}</button>}
      </>
    ) : myNote && myNote.q >= 2 && myNote.best && myNote.ply === myPly ? (
      <button className="link" onClick={() => setShowBest(v => !v)}>{showBest ? 'Ocultar mejor jugada' : 'Ver mejor jugada'}</button>
    ) : null
  ) : null;

  const bestHints = !coachMode && showBest && mineNote?.bestMove ? [mineNote.bestMove.f, mineNote.bestMove.t] : undefined;

  const baseOrientation: Color = cfg.mode === 'bot' ? cfg.human : 'w';
  const orientation: Color = flip ? (baseOrientation === 'w' ? 'b' : 'w') : baseOrientation;
  const legalMoves = useMemo(() => (humanCanMove ? game.legal : EMPTY), [humanCanMove, g.version]); // eslint-disable-line react-hooks/exhaustive-deps

  // cuando termina: mostrar resultado y anotar en el marcador contra la compu
  useEffect(() => {
    if (!result) return;
    setOverSeen(false);
    if (!recorded.current) {
      const human = cfg.mode === 'bot' ? cfg.human : 'w';
      const rec = recordGame({
        date: Date.now(), mode: cfg.mode, opponent: cfg.mode === 'bot' ? g.bot.name : 'Dos jugadores', opponentRating: cfg.mode === 'bot' ? g.bot.rating : undefined,
        color: human, result: !result.winner ? 'draw' : result.winner === human ? 'win' : 'loss', reason: RT[result.reason], moves: game.codes, tc: cfg.tc,
        durationMs: Date.now() - (loadSaved()?.startedAt ?? Date.now()),
        qs: qualityString(coach.notes, game.hist.length), ...(coach.accuracy !== null ? { acc: coach.accuracy } : {})
      });
      recId.current = rec.id;
    }
    if (!recorded.current && cfg.mode === 'bot' && user && game.hist.length >= 2) {
      const res = !result.winner ? 'd' : result.winner === cfg.human ? 'w' : 'l';
      void bumpRecord(user.uid, `~bot${g.bot.id}`, `${g.bot.name} · ${g.bot.rating}`, res);
    }
    recorded.current = true;
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  // el análisis de las últimas jugadas puede terminar después del final: se actualiza la partida guardada
  useEffect(() => {
    if (!result || !recId.current || !coach.notes.length) return;
    updateGame(recId.current, { qs: qualityString(coach.notes, game.hist.length), ...(coach.accuracy !== null ? { acc: coach.accuracy } : {}) });
  }, [coach.notes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const players: Record<Color, PlayerInfo> = cfg.mode === 'bot'
    ? {
      [cfg.human]: { name: user?.name ?? 'Tú', clockMs: clock?.[cfg.human] ?? null },
      [cfg.human === 'w' ? 'b' : 'w']: { name: g.bot.name, rating: g.bot.rating, clockMs: clock?.[cfg.human === 'w' ? 'b' : 'w'] ?? null, tag: thinking && !clock ? 'pensando…' : undefined }
    } as Record<Color, PlayerInfo>
    : { w: { name: 'Blancas', clockMs: clock?.w ?? null }, b: { name: 'Negras', clockMs: clock?.b ?? null } };

  let status;
  if (result) {
    status = <>{titleFor(result.winner, cfg)}<small>{REASON_TEXT[result.reason]} · {scoreFor(result.winner)}</small></>;
  } else if (paused) {
    status = <>Revisa tu jugada<small>Reintenta o continúa la partida.</small></>;
  } else if (thinking || waiting) {
    status = <>{g.bot.name} está pensando…<small>{g.bot.blurb}</small></>;
  } else {
    const turn = cfg.mode === 'bot' ? 'Tu turno' : game.turn === 'w' ? 'Juegan blancas' : 'Juegan negras';
    status = <>{turn}{game.inCheck ? ' · ¡Jaque!' : ''}<small>{game.hist.length ? `Jugada ${Math.floor(game.hist.length / 2) + 1}` : 'Toca o arrastra una pieza para mover.'}</small></>;
  }

  const resignArmed = Date.now() - armedResign < 3000;
  const controls: Control[] = [
    { id: 'undo', icon: 'undo', label: 'Deshacer', onClick: () => { stopSpeaking(); g.undo(); if (coachMode) setBubbles([]); }, disabled: !game.hist.length },
    { id: 'flip', icon: 'flip', label: 'Girar', onClick: () => setFlip(f => !f) },
    ...(cfg.mode === 'local' ? [{ id: 'draw', icon: 'draw' as const, label: 'Tablas', onClick: g.agreeDraw, disabled: !!result }] : []),
    {
      id: 'resign', icon: 'flag', label: resignArmed ? '¿Seguro?' : 'Rendirse', tone: resignArmed ? 'warn' : undefined, disabled: !!result,
      onClick: () => { if (resignArmed) { setArmedResign(0); g.resign(); } else { setArmedResign(Date.now()); setTimeout(() => setArmedResign(a => a), 3100); } }
    }
  ];

  const again = () => {
    startLocalGame({ ...cfg, human: cfg.mode === 'bot' ? (cfg.human === 'w' ? 'b' : 'w') : 'w' });
    onRestart();
  };

  return (
    <GameView
      P={game.P} orientation={orientation} players={players} legalMoves={legalMoves} onMove={g.play} hist={game.hist}
      status={status} controls={controls}
      overlay={result && !overSeen ? (
        <ResultOverlay title={titleFor(result.winner, cfg)} reason={REASON_TEXT[result.reason]} score={scoreFor(result.winner)}
          primary={{ label: cfg.mode === 'bot' ? 'Revancha (colores cambiados)' : 'Otra partida', onClick: again }}
          onMenu={() => nav('/jugar')} onClose={() => setOverSeen(true)} />
      ) : null}
      coach={cfg.mode === 'local' || coachMode ? <CoachPanel msgs={coach.msgs} busy={coach.busy} accuracy={coach.accuracy} notes={coach.notes} showSide={cfg.mode === 'local'}
        enabled={coachMode || settings.coach} onToggle={coachMode ? undefined : () => settingsStore.set(s => ({ ...s, coach: !s.coach }))} /> : undefined}
      talk={coachMode ? <CoachTalk cp={coach.evalNow} bubbles={bubbles} mood={mood} thinking={waiting || (thinking && !paused)} actions={talkActions} /> : undefined}
      hints={bestHints} badge={badge} arrows={arrows}
      footer={<button className="btn-ghost" onClick={() => nav('/jugar')}>Volver a Jugar</button>}
    />
  );
}

function titleFor(winner: Color | null, cfg: { mode: string; human: Color }) {
  if (!winner) return 'Tablas';
  if (cfg.mode === 'bot') return winner === cfg.human ? '¡Ganaste!' : 'Ganó el bot';
  return winner === 'w' ? 'Ganan blancas' : 'Ganan negras';
}
const scoreFor = (w: Color | null) => (!w ? '½ – ½' : w === 'w' ? '1 – 0' : '0 – 1');
