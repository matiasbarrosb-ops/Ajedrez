/* Partida contra un bot o entre dos personas en este teléfono. */
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { CoachPanel, CoachStrip } from '../components/CoachPanel.tsx';
import { sanToSpeech, speechForNote } from '../coach/coach.ts';
import { speak, stopSpeaking, voiceSupported } from '../lib/voice.ts';
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
  const g = useLocalGame();
  const { cfg, game, result, thinking, clock, humanCanMove } = g;
  const [flip, setFlip] = useState(false);
  const [overSeen, setOverSeen] = useState(!!result);
  const [armedResign, setArmedResign] = useState(0);
  const recorded = useRef(!!result);
  const recId = useRef<string | null>(null);
  const settings = useStore(settingsStore);
  const sides: Color[] = cfg.mode === 'bot' ? [cfg.human] : ['w', 'b'];
  // modo entrenador: comentarios bajo el reloj y con voz. Modo Bots: sin comentarios (se analiza en silencio para tus estadísticas).
  const coachMode = cfg.mode === 'bot' && !!cfg.coach;
  const coach = useCoach(game, g.version, sides, cfg.mode === 'bot' ? true : settings.coach);
  const [showBest, setShowBest] = useState(false);
  const spoken = useRef(new Set<string>());
  // para la franja: tu última jugada calificada y, si es posterior, la última del rival
  const lastMine = [...coach.msgs].reverse().find(m => m.kind === 'move');
  const lastOpp = [...coach.msgs].reverse().find(m => m.kind === 'opp');
  const mineNote = lastMine?.kind === 'move' ? lastMine.note : null;
  const oppNote = lastOpp?.kind === 'opp' && (!mineNote || lastOpp.ply > mineNote.ply) ? lastOpp.note : null;
  useEffect(() => { setShowBest(false); }, [g.version, mineNote?.ply]);
  // voz: cada comentario nuevo se lee una vez (solo los recientes, no los de jugadas viejas)
  useEffect(() => {
    if (!coachMode || !settings.voice) return;
    for (const m of coach.msgs) {
      const key = `${m.kind}${m.ply}${m.note.san}`;
      if (spoken.current.has(key)) continue;
      spoken.current.add(key);
      if (m.ply < game.hist.length - 2) continue;
      if (m.kind === 'move') speak(speechForNote(m.note));
      else {
        const l = m.note.lines.find(x => !/^No hay amenazas|^Desarrolló|^Enrocó/.test(x));
        if (l) speak(`El rival juega ${sanToSpeech(m.note.san)}. ${l}`);
      }
    }
  }, [coach.msgs, coachMode, settings.voice]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => stopSpeaking(), []);
  const bestHints = showBest && mineNote?.bestMove ? [mineNote.bestMove.f, mineNote.bestMove.t] : undefined;

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
  } else if (thinking) {
    status = <>{g.bot.name} está pensando…<small>{g.bot.blurb}</small></>;
  } else {
    const turn = cfg.mode === 'bot' ? 'Tu turno' : game.turn === 'w' ? 'Juegan blancas' : 'Juegan negras';
    status = <>{turn}{game.inCheck ? ' · ¡Jaque!' : ''}<small>{game.hist.length ? `Jugada ${Math.floor(game.hist.length / 2) + 1}` : 'Toca o arrastra una pieza para mover.'}</small></>;
  }

  const resignArmed = Date.now() - armedResign < 3000;
  const controls: Control[] = [
    { id: 'undo', icon: 'undo', label: 'Deshacer', onClick: g.undo, disabled: !game.hist.length },
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
      strip={coachMode ? <CoachStrip mine={mineNote} opp={oppNote} busy={coach.busy} showBest={showBest} onShowBest={() => setShowBest(v => !v)}
        voiceOn={settings.voice} onVoice={() => { if (settings.voice) stopSpeaking(); settingsStore.set(s => ({ ...s, voice: !s.voice })); }} voiceAvailable={voiceSupported()} /> : undefined}
      hints={bestHints}
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
