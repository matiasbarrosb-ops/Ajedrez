/* Partidas: historial y visor jugada por jugada. */
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../database/store.ts';
import { progressStore, type GameRecord } from '../profile/progress.ts';
import { ChessGame } from '../chess/game.ts';
import { START_FEN } from '../chess/notation.ts';
import { ChessBoard } from '../components/ChessBoard.tsx';
import { FigSan } from '../components/MoveList.tsx';
import { Icon } from '../components/Icon.tsx';
import type { Move } from '../engine/core.ts';

const EMPTY: Move[] = [];
const RESULT: Record<GameRecord['result'], string> = { win: 'Victoria', loss: 'Derrota', draw: 'Tablas' };
const fmtDate = (t: number) => new Date(t).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
const fmtDur = (ms: number) => { const m = Math.round(ms / 60000); return m < 1 ? '<1 min' : `${m} min`; };

export function GamesPage() {
  const p = useStore(progressStore);
  const games = p.games;
  const w = games.filter(g => g.result === 'win').length, l = games.filter(g => g.result === 'loss').length, d = games.filter(g => g.result === 'draw').length;
  return (
    <div className="page">
      <h1 className="page-title">Partidas</h1>
      <section className="stat-row">
        <div className="stat"><span className="stat-v">{games.length}</span><span className="stat-l">Jugadas</span></div>
        <div className="stat"><span className="stat-v good">{w}</span><span className="stat-l">Victorias</span></div>
        <div className="stat"><span className="stat-v bad">{l}</span><span className="stat-l">Derrotas</span></div>
        <div className="stat"><span className="stat-v">{d}</span><span className="stat-l">Tablas</span></div>
      </section>
      {!games.length && (
        <section className="card-block"><p className="muted">Todavía no hay partidas terminadas. Cuando juegues, cada partida queda aquí para revisarla jugada por jugada.</p><Link className="primary" to="/jugar">Jugar una partida</Link></section>
      )}
      <div className="game-list">
        {games.map(g => (
          <Link key={g.id} to={`/partidas/${g.id}`} className="game-row">
            <span className={`res-dot ${g.result}`} aria-hidden="true" />
            <div className="gr-main">
              <strong>{RESULT[g.result]} vs {g.opponent}</strong>
              <span className="muted small">{fmtDate(g.date)} · {g.tc === 'none' ? 'sin reloj' : g.tc} · {Math.ceil(g.moves.length / 2)} jugadas · {g.reason}</span>
            </div>
            {g.ratingAfter != null && g.ratingBefore != null && (
              <span className={`gr-delta ${g.ratingAfter >= g.ratingBefore ? 'good' : 'bad'}`}>{g.ratingAfter >= g.ratingBefore ? '+' : ''}{g.ratingAfter - g.ratingBefore}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GameViewerPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const p = useStore(progressStore);
  const rec = p.games.find(g => g.id === id);
  const full = useMemo(() => new ChessGame(START_FEN, rec?.moves ?? []), [rec]);
  const [ply, setPly] = useState(full.hist.length);
  const view = useMemo(() => new ChessGame(START_FEN, (rec?.moves ?? []).slice(0, ply)), [rec, ply]);
  if (!rec) return <div className="page narrow"><div className="card-lg"><h1>Partida no encontrada</h1><Link className="primary" to="/partidas">Volver</Link></div></div>;
  const last = view.lastMove;
  const rows = [];
  for (let i = 0; i < full.hist.length; i += 2) rows.push(
    <div key={i} className="mrow">
      <span className="n">{i / 2 + 1}.</span>
      <button className={`mv${ply === i + 1 ? ' last' : ''}`} onClick={() => setPly(i + 1)}><FigSan san={full.hist[i].san} /></button>
      {full.hist[i + 1] ? <button className={`mv${ply === i + 2 ? ' last' : ''}`} onClick={() => setPly(i + 2)}><FigSan san={full.hist[i + 1].san} /></button> : <span />}
    </div>
  );
  return (
    <div className="game-layout viewer">
      <div className="play-col">
        <div className="viewer-h">
          <button className="icon-btn" aria-label="Volver" onClick={() => nav('/partidas')}><Icon name="back" /></button>
          <div><strong>{RESULT[rec.result]} vs {rec.opponent}</strong><span className="muted small"> · {fmtDate(rec.date)} · {rec.reason} · {fmtDur(rec.durationMs)}</span></div>
        </div>
        <div className="board-holder">
          <ChessBoard P={view.P} orientation={rec.color} legalMoves={EMPTY} lastMove={last ? { f: last.f, t: last.t } : null} animKey={ply} />
        </div>
        <div className="nav-btns">
          <button className="btn" onClick={() => setPly(0)} aria-label="Inicio">⏮</button>
          <button className="btn" onClick={() => setPly(x => Math.max(0, x - 1))} aria-label="Anterior">◀</button>
          <button className="btn" onClick={() => setPly(x => Math.min(full.hist.length, x + 1))} aria-label="Siguiente">▶</button>
          <button className="btn" onClick={() => setPly(full.hist.length)} aria-label="Final">⏭</button>
        </div>
      </div>
      <aside className="panel">
        <div className="sec"><div className="status">Jugada {Math.ceil(ply / 2)} de {Math.ceil(full.hist.length / 2)}<small>{rec.ratingAfter != null ? `Rating ${rec.ratingBefore} → ${rec.ratingAfter}` : rec.mode === 'local' ? 'Partida en este teléfono' : ''}</small></div></div>
        <div className="sec"><div className="label">Jugadas</div><div className="moves">{rows}</div></div>
      </aside>
    </div>
  );
}
