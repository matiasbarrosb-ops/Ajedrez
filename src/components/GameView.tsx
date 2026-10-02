/* Pantalla de partida reutilizable: barras de jugador, tablero, panel con estado, controles y jugadas. */
import type { ReactNode } from 'react';
import type { Color, Move, Position } from '../engine/core.ts';
import type { HistoryEntry } from '../chess/game.ts';
import { ChessBoard } from './ChessBoard.tsx';
import { PlayerBar } from './PlayerBar.tsx';
import { MoveList } from './MoveList.tsx';
import { Icon, type IconName } from './Icon.tsx';

export interface PlayerInfo { name: string; rating?: number | null; clockMs?: number | null; status?: 'online' | 'offline' | null; tag?: string }

export interface Control { id: string; icon: IconName; label: string; onClick: () => void; disabled?: boolean; tone?: 'warn' | 'hot' }

interface Props {
  P: Position;
  orientation: Color;
  players: Record<Color, PlayerInfo>;
  legalMoves: Move[];
  onMove: (m: Move) => void;
  hist: HistoryEntry[];
  status: ReactNode;
  banner?: ReactNode;
  controls: Control[];
  overlay?: ReactNode;
  footer?: ReactNode;
}

export function GameView({ P, orientation, players, legalMoves, onMove, hist, status, banner, controls, overlay, footer }: Props) {
  const top: Color = orientation === 'w' ? 'b' : 'w';
  const bottom: Color = orientation;
  const last = hist.length ? hist[hist.length - 1].m : null;
  return (
    <div className="game-layout">
      <div className="play-col">
        <PlayerBar color={top} P={P} {...players[top]} active={P.t === top} />
        <div className="board-holder">
          <ChessBoard P={P} orientation={orientation} legalMoves={legalMoves} onMove={onMove}
            lastMove={last ? { f: last.f, t: last.t } : null} animKey={hist.length} />
          {overlay}
        </div>
        <PlayerBar color={bottom} P={P} {...players[bottom]} active={P.t === bottom} />
      </div>
      <aside className="panel">
        <div className="sec">
          <div className="status">{status}</div>
          {banner && <div className="banner">{banner}</div>}
          <div className="ctrls">
            {controls.map(c => (
              <button key={c.id} className={`btn${c.tone ? ' ' + c.tone : ''}`} onClick={c.onClick} disabled={c.disabled}>
                <Icon name={c.icon} />{c.label}
              </button>
            ))}
          </div>
        </div>
        <div className="sec">
          <div className="label">Jugadas</div>
          <MoveList hist={hist} />
        </div>
        {footer && <div className="sec">{footer}</div>}
      </aside>
    </div>
  );
}

interface ResultProps {
  title: string;
  reason: string;
  score: string;
  extra?: ReactNode;
  primary: { label: string; onClick: () => void; disabled?: boolean };
  onMenu: () => void;
  onClose: () => void;
}
export function ResultOverlay({ title, reason, score, extra, primary, onMenu, onClose }: ResultProps) {
  return (
    <div className="overlay">
      <div className="card result-card" role="dialog" aria-label={title}>
        <h2>{title}</h2>
        <p className="muted">{reason}</p>
        <div className="score">{score}</div>
        {extra}
        <button className="primary" onClick={primary.onClick} disabled={primary.disabled}>{primary.label}</button>
        <div className="row2">
          <button className="btn-ghost" onClick={onMenu}>Menú</button>
          <button className="btn-ghost" onClick={onClose}>Ver tablero</button>
        </div>
      </div>
    </div>
  );
}
