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

  const baseOrientation: Color = cfg.mode === 'bot' ? cfg.human : 'w';
  const orientation: Color = flip ? (baseOrientation === 'w' ? 'b' : 'w') : baseOrientation;
  const legalMoves = useMemo(() => (humanCanMove ? game.legal : EMPTY), [humanCanMove, g.version]); // eslint-disable-line react-hooks/exhaustive-deps

  // cuando termina: mostrar resultado y anotar en el marcador contra la compu
  useEffect(() => {
    if (!result) return;
    setOverSeen(false);
    if (!recorded.current && cfg.mode === 'bot' && user && game.hist.length >= 2) {
      recorded.current = true;
      const res = !result.winner ? 'd' : result.winner === cfg.human ? 'w' : 'l';
      void bumpRecord(user.uid, `~bot${cfg.botId}`, `${g.bot.name} · ${g.bot.rating}`, res);
    }
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

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
