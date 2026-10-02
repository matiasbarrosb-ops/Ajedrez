/* Inicio: qué hacer hoy, acceso directo a jugar, problema del día y progreso. */
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../database/store.ts';
import { onboardingStore, sessionStore } from '../database/session.ts';
import { currentStreak, dueReviews, levelOf, progressStore, rankOf, ratingWeekAgo, skills, today } from '../profile/progress.ts';
import { ALL_LESSONS } from '../lessons/data.ts';
import { dailyPuzzle, difficultyLabel, themeLabel, todayKey } from '../problems/bank.ts';
import { Icon } from '../components/Icon.tsx';
import { Records } from '../components/Records.tsx';
import { loadSavedLocal } from '../hooks/useLocalGame.ts';
import { MiniBoard } from './PuzzlesPage.tsx';

export function HomePage() {
  const nav = useNavigate();
  const { user } = useStore(sessionStore);
  const ob = useStore(onboardingStore);
  const p = useStore(progressStore);
  if (!ob.done) return <Navigate to="/bienvenida" replace />;

  const saved = loadSavedLocal();
  const lv = levelOf(p.xp);
  const streak = currentStreak(p);
  const t = today(p);
  const nextLesson = ALL_LESSONS.find(l => !p.lessons[l.id]);
  const daily = dailyPuzzle();
  const dailyDone = !!p.days[todayKey()]?.daily;
  const due = dueReviews(p).length;
  const goals = [
    { done: t.lessons >= 1, title: '1 lección', sub: nextLesson ? `Siguiente: ${nextLesson.title}` : 'Repasa la que quieras', to: nextLesson ? `/leccion/${nextLesson.id}` : '/aprender', cta: 'Empezar' },
    { done: t.puzzles >= 5, title: `5 problemas (${Math.min(5, t.puzzles)}/5)`, sub: due ? `Primero tus ${due} repasos pendientes` : 'Elegidos para tu rating', to: due ? '/problema?modo=repaso' : '/problema', cta: 'Resolver' },
    { done: t.games >= 1, title: '1 partida', sub: 'Contra un bot o un amigo', to: '/jugar', cta: 'Jugar' }
  ];
  const allDone = goals.every(g => g.done);
  const recent = p.attempts.filter(a => a.source !== 'leccion');
  const acc = recent.length ? Math.round((100 * recent.filter(a => a.correct && a.hints === 0).length) / recent.length) : null;
  const week = ratingWeekAgo(p);
  const weakest = skills(p).find(s => s.pct < 70);

  return (
    <div className="page home">
      <section className="hello">
        <div className="hello-avatar">{(user?.name ?? 'J').charAt(0).toUpperCase()}</div>
        <div className="hello-text">
          <h1>{user ? `Hola, ${user.name}` : 'Hola'}</h1>
          <p className="muted">{rankOf(p)} · Nivel {lv.level} · rating {p.rating}</p>
          <div className="xp-bar" aria-label={`${p.xp - lv.from} de ${lv.to - lv.from} XP para el nivel ${lv.level + 1}`}><div style={{ width: `${(100 * (p.xp - lv.from)) / (lv.to - lv.from)}%` }} /></div>
        </div>
        <div className={`streak${streak ? ' on' : ''}`} title="Racha de días"><Icon name="fire" size={20} /><strong>{streak}</strong><span>{streak === 1 ? 'día' : 'días'}</span></div>
      </section>

      <button className="primary hero-btn" onClick={() => nav('/jugar')}>Jugar<small>Bots, amigos online o en este teléfono</small></button>
      {saved && !saved.result && saved.moves.length > 0 && (
        <button className="secondary resume" onClick={() => nav('/partida')}>Continuar tu partida ({saved.moves.length} jugadas)</button>
      )}

      <div className="home-grid">
        <section className="card-block">
          <div className="card-h"><h2>Tu objetivo de hoy</h2><span className="muted small">{goals.filter(g => g.done).length} de 3</span></div>
          {allDone && <div className="all-done"><Icon name="check" /> ¡Completaste tu entrenamiento de hoy!</div>}
          <ul className="goals">
            {goals.map(g => (
              <li key={g.title} className={g.done ? 'done' : ''}>
                <span className="goal-box">{g.done && <Icon name="check" size={14} />}</span>
                <div><strong>{g.title}</strong><small>{g.sub}</small></div>
                {!g.done && <Link className="secondary small-btn" to={g.to}>{g.cta}</Link>}
              </li>
            ))}
          </ul>
        </section>

        <section className="card-block daily-card">
          <div className="card-h"><h2>Problema del día</h2>{dailyDone && <span className="pill good">Resuelto</span>}</div>
          <div className="daily-body">
            <MiniBoard fen={daily.fen} />
            <div className="daily-info">
              <p className="muted small">{themeLabel(daily.theme)}</p>
              <p className="muted small">{difficultyLabel(daily.rating)} · {daily.rating}</p>
              <Link className="primary small-btn" to="/problema?modo=diario">{dailyDone ? 'Ver otra vez' : 'Resolver'}</Link>
            </div>
          </div>
        </section>

        <section className="card-block">
          <div className="card-h"><h2>Tu progreso</h2><Link className="link" to="/perfil">Ver perfil</Link></div>
          <div className="stat-grid">
            <div className="stat"><span className="stat-v">{p.rating}</span><span className="stat-l">Rating de partidas {p.rating !== week ? <em className={p.rating > week ? 'good' : 'bad'}>{p.rating > week ? '+' : ''}{p.rating - week} en 7 días</em> : null}</span></div>
            <div className="stat"><span className="stat-v">{p.puzzleRating}</span><span className="stat-l">Rating de problemas</span></div>
            <div className="stat"><span className="stat-v">{recent.length}</span><span className="stat-l">Problemas jugados</span></div>
            <div className="stat"><span className="stat-v">{acc === null ? '—' : `${acc}%`}</span><span className="stat-l">Aciertos sin pistas</span></div>
          </div>
          {weakest && <p className="reco"><Icon name="hint" size={16} /> Te recomendamos practicar <Link to={`/problema?tema=${weakest.theme}`}>{themeLabel(weakest.theme).toLowerCase()}</Link>: aciertas {weakest.pct}%.</p>}
        </section>

        {user && (
          <section className="card-block">
            <div className="card-h"><h2>Marcador</h2><Link to="/perfil" className="link">Ver todo</Link></div>
            <Records user={user} limit={4} />
          </section>
        )}
      </div>
    </div>
  );
}
