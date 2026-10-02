/* Problemas: rating propio, temas, problema del día y sesión de resolución. */
import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { dailyPuzzle, difficultyLabel, pickPuzzle, puzzleById, PUZZLES, THEMES, themeLabel, todayKey, type Puzzle } from '../problems/bank.ts';
import { dueReviews, progressStore, recordPuzzle, skills, today } from '../profile/progress.ts';
import { useStore } from '../database/store.ts';
import { MoveExercise, type ExerciseResult } from '../components/MoveExercise.tsx';
import { ChessBoard } from '../components/ChessBoard.tsx';
import { parseFen } from '../chess/notation.ts';
import { Icon } from '../components/Icon.tsx';
import type { Move } from '../engine/core.ts';

const EMPTY: Move[] = [];

/** Miniatura de tablero solo para mostrar. */
export function MiniBoard({ fen }: { fen: string }) {
  const P = useMemo(() => parseFen(fen), [fen]);
  return <div className="mini-board"><ChessBoard P={P} orientation={P.t} legalMoves={EMPTY} coordinates={false} /></div>;
}

export function PuzzlesPage() {
  const p = useStore(progressStore);
  const nav = useNavigate();
  const daily = dailyPuzzle();
  const dailyDone = !!p.days[todayKey()]?.daily;
  const recent = p.attempts.filter(a => a.source !== 'leccion');
  const acc = recent.length ? Math.round((100 * recent.filter(a => a.correct && a.hints === 0).length) / recent.length) : null;
  const due = dueReviews(p);
  const counts = useMemo(() => { const c: Record<string, number> = {}; PUZZLES.forEach(z => { c[z.theme] = (c[z.theme] || 0) + 1; }); return c; }, []);
  return (
    <div className="page">
      <h1 className="page-title">Problemas</h1>
      <section className="stat-row">
        <div className="stat"><span className="stat-v">{p.puzzleRating}</span><span className="stat-l">Tu rating</span></div>
        <div className="stat"><span className="stat-v">{recent.length}</span><span className="stat-l">Jugados</span></div>
        <div className="stat"><span className="stat-v">{acc === null ? '—' : `${acc}%`}</span><span className="stat-l">Aciertos sin pistas</span></div>
      </section>
      <button className="primary hero-btn" onClick={() => nav('/problema')}>
        Resolver problemas<small>Elegidos para tu rating ({p.puzzleRating})</small>
      </button>
      {due.length > 0 && <Link className="secondary resume" to="/problema?modo=repaso">Repaso: {due.length} pendiente{due.length === 1 ? '' : 's'} hoy</Link>}

      <section className="card-block daily-card">
        <div className="card-h"><h2>Problema del día</h2>{dailyDone && <span className="pill good">Resuelto</span>}</div>
        <div className="daily-body">
          <MiniBoard fen={daily.fen} />
          <div className="daily-info">
            <p><strong>Tu desafío de hoy</strong></p>
            <p className="muted small">{themeLabel(daily.theme)} · {difficultyLabel(daily.rating)} · {daily.rating}</p>
            <p className="muted small">Juegan {daily.fen.split(' ')[1] === 'w' ? 'blancas' : 'negras'}</p>
            <button className="primary small-btn" onClick={() => nav('/problema?modo=diario')}>{dailyDone ? 'Verlo otra vez' : 'Resolver'}</button>
          </div>
        </div>
      </section>

      <section className="card-block">
        <h2>Por tema</h2>
        <div className="theme-grid">
          {Object.entries(THEMES).map(([k, t]) => (
            <Link key={k} to={`/problema?tema=${k}`} className="theme-card">
              <strong>{t.label}</strong><span className="muted small">{counts[k] ?? 0} problemas</span>
            </Link>
          ))}
        </div>
      </section>
      <p className="muted small">Hoy: {today(p).puzzles} problemas resueltos.</p>
    </div>
  );
}

/** Sesión de problemas: ?modo=diario | repaso, ?tema=..., ?id=... */
export function PuzzlePage() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const mode = params.get('modo') as 'diario' | 'repaso' | null;
  const theme = params.get('tema') ?? undefined;
  const p = useStore(progressStore);
  const seen = useRef(new Set<string>(p.attempts.slice(-60).map(a => a.id)));
  const [count, setCount] = useState(0);
  const [last, setLast] = useState<{ delta: number; xp: number; solved: boolean } | null>(null);

  const puzzle: Puzzle | null = useMemo(() => {
    if (params.get('id')) return puzzleById(params.get('id')!) ?? null;
    if (mode === 'diario') return dailyPuzzle();
    if (mode === 'repaso') { const d = dueReviews(progressStore.get()); return d.length ? puzzleById(d[0].id) ?? null : null; }
    const weak = skills(progressStore.get()).filter(s => s.pct < 60).map(s => s.theme);
    return pickPuzzle(progressStore.get().puzzleRating, { theme, recent: seen.current, weakThemes: weak });
  }, [count, mode, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!puzzle) return (
    <div className="page narrow"><div className="card-lg"><h1>¡Repaso al día!</h1><p className="muted">No tienes problemas pendientes para hoy. Vuelve mañana o resuelve problemas nuevos.</p><Link className="primary" to="/problema">Problemas nuevos</Link></div></div>
  );

  const onDone = (r: ExerciseResult) => {
    seen.current.add(puzzle.id);
    const dailyAlready = mode === 'diario' && !!progressStore.get().days[todayKey()]?.daily;
    const res = recordPuzzle(puzzle, r.solved, r.hints, mode === 'diario' && !dailyAlready ? 'diario' : mode === 'repaso' ? 'repaso' : 'problemas');
    setLast({ ...res, solved: r.solved });
    if (mode === 'diario') return;
    setCount(c => c + 1);
  };

  const side = puzzle.fen.split(' ')[1] === 'w' ? 'blancas' : 'negras';
  const t = THEMES[puzzle.theme];
  return (
    <div className="page puzzle-page">
      <div className="lesson-top">
        <button className="icon-btn" aria-label="Volver" onClick={() => nav('/problemas')}><Icon name="back" /></button>
        <div className="puzzle-meta">
          <strong>{mode === 'diario' ? 'Problema del día' : mode === 'repaso' ? 'Repaso' : theme ? t?.label : 'Problemas'}</strong>
          <span className="muted small">{difficultyLabel(puzzle.rating)} · {puzzle.rating} · tu rating {p.puzzleRating}</span>
        </div>
      </div>
      {last && (
        <div className={`result-chip ${last.solved ? 'good' : 'bad'}`}>
          {last.solved ? 'Resuelto' : 'No resuelto'} · rating {last.delta >= 0 ? '+' : ''}{last.delta} · +{last.xp} XP
        </div>
      )}
      {mode === 'diario' && last ? (
        <div className="card-block">
          <h2>{last.solved ? '¡Resolviste el desafío de hoy!' : 'Desafío de hoy terminado'}</h2>
          <p><strong>{t?.label}.</strong> {t?.concept}</p>
          <p className="muted small">Tu racha se actualizó. Mañana hay un problema nuevo.</p>
          <div className="row2"><Link className="primary" to="/problema">Más problemas</Link><Link className="secondary" to="/">Inicio</Link></div>
        </div>
      ) : (
        <MoveExercise key={puzzle.id + count} fen={puzzle.fen} goal={{ puzzle: puzzle.steps }}
          prompt={`Juegan ${side}. Encuentra la mejor jugada.${theme || mode ? '' : ''}`}
          concept={t?.hint} ok={`¡Correcto! ${t?.label ?? ''}.`} onDone={onDone} continueLabel={mode === 'diario' ? 'Ver resultado' : 'Siguiente problema'} />
      )}
    </div>
  );
}
