/* Perfil: cuenta, marcador y ajustes. Las estadísticas completas llegan en la etapa 8. */
import { useNavigate } from 'react-router-dom';
import { useStore } from '../database/store.ts';
import { onboardingStore, sessionStore, settingsStore, type Settings } from '../database/session.ts';
import { signOut } from '../database/auth.ts';
import { Records } from '../components/Records.tsx';
import { useState } from 'react';
import { currentStreak, levelOf, progressStore, rankOf, skills } from '../profile/progress.ts';
import { themeLabel } from '../problems/bank.ts';
import { ALL_LESSONS } from '../lessons/data.ts';

function RatingChart({ points }: { points: { d: string; r: number }[] }) {
  if (points.length < 2) return <p className="muted small">Juega partidas contra bots o amigos para ver la evolución de tu rating.</p>;
  const pts = points.slice(-30), W = 600, H = 140, pad = 24;
  const lo = Math.min(...pts.map(p => p.r)) - 20, hi = Math.max(...pts.map(p => p.r)) + 20;
  const x = (i: number) => pad + (i * (W - 2 * pad)) / (pts.length - 1), y = (r: number) => H - pad - ((r - lo) * (H - 2 * pad)) / (hi - lo);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p.r).toFixed(1)}`).join(' ');
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Rating en tus últimas partidas">
      <line x1={pad} x2={W - pad} y1={H - pad} y2={H - pad} className="axis" />
      <path d={`${d} L${x(pts.length - 1)} ${H - pad} L${pad} ${H - pad} Z`} className="area" />
      <path d={d} className="line" />
      <circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1].r)} r="4" className="dot" />
      <text x={pad} y={14} className="lbl">{hi - 20}</text>
      <text x={pad} y={H - 6} className="lbl">{lo + 20}</text>
      <text x={W - pad} y={y(pts[pts.length - 1].r) - 10} textAnchor="end" className="lbl strong">{pts[pts.length - 1].r}</text>
    </svg>
  );
}

export function ProfilePage() {
  const nav = useNavigate();
  const { user } = useStore(sessionStore);
  const settings = useStore(settingsStore);
  const p = useStore(progressStore);
  const lv = levelOf(p.xp);
  const games = p.games, w = games.filter(g => g.result === 'win').length, l = games.filter(g => g.result === 'loss').length, d = games.filter(g => g.result === 'draw').length;
  const recent = p.attempts.filter(a => a.source !== 'leccion');
  const acc = recent.length ? Math.round((100 * recent.filter(a => a.correct && a.hints === 0).length) / recent.length) : null;
  const sk = skills(p).filter(x => x.n >= 10);
  const strong = sk.filter(x => x.pct >= 75), weak = sk.filter(x => x.pct <= 55);
  const lessonsDone = Object.keys(p.lessons).length;
  const [armed, setArmed] = useState(false);
  const toggle = (k: keyof Settings) => settingsStore.set(s => ({ ...s, [k]: !s[k] }));
  return (
    <div className="page">
      <h1 className="page-title">Perfil</h1>
      <section className="card-block profile-head">
        <div className="hello-avatar big">{(user?.name ?? 'I').charAt(0).toUpperCase()}</div>
        <div>
          <h2>{user?.name ?? 'Invitado'}</h2>
          <p className="muted small">{user ? 'Tu progreso se guarda en tu cuenta.' : 'Sin cuenta: tu progreso queda solo en este teléfono.'}</p>
        </div>
        {user
          ? <button className={`secondary small-btn${armed ? ' warn' : ''}`} onClick={() => { if (armed) { signOut(); setArmed(false); } else { setArmed(true); setTimeout(() => setArmed(false), 3000); } }}>{armed ? '¿Cerrar sesión?' : 'Cerrar sesión'}</button>
          : <button className="primary small-btn" onClick={() => nav('/entrar?volver=/perfil')}>Entrar</button>}
      </section>

      <section className="card-block">
        <div className="card-h"><h2>{rankOf(p)} · Nivel {lv.level}</h2><span className="muted small">{p.xp - lv.from}/{lv.to - lv.from} XP</span></div>
        <div className="xp-bar"><div style={{ width: `${(100 * (p.xp - lv.from)) / (lv.to - lv.from)}%` }} /></div>
        <div className="stat-grid">
          <div className="stat"><span className="stat-v">{p.rating}</span><span className="stat-l">Rating de partidas</span></div>
          <div className="stat"><span className="stat-v">{p.puzzleRating}</span><span className="stat-l">Rating de problemas</span></div>
          <div className="stat"><span className="stat-v">{currentStreak(p)}</span><span className="stat-l">Racha (mejor: {p.streak.best})</span></div>
          <div className="stat"><span className="stat-v">{p.xp}</span><span className="stat-l">XP total</span></div>
        </div>
      </section>

      <section className="card-block">
        <h2>Rating de partidas</h2>
        <RatingChart points={p.ratingHistory} />
      </section>

      <section className="card-block">
        <h2>Estadísticas</h2>
        <div className="stat-grid">
          <div className="stat"><span className="stat-v">{games.length}</span><span className="stat-l">Partidas · {w} V · {l} D · {d} T</span></div>
          <div className="stat"><span className="stat-v">{recent.length}</span><span className="stat-l">Problemas{acc !== null ? ` · ${acc}% sin pistas` : ''}</span></div>
          <div className="stat"><span className="stat-v">{lessonsDone}/{ALL_LESSONS.length}</span><span className="stat-l">Lecciones</span></div>
        </div>
        <div className="sw-grid">
          <div><span className="label">Fortalezas</span><p>{strong.length ? strong.map(x => `${themeLabel(x.theme)} (${x.pct}%)`).join(', ') : 'Aún sin datos suficientes (10 intentos por tema).'}</p></div>
          <div><span className="label">Áreas para mejorar</span><p>{weak.length ? weak.map(x => `${themeLabel(x.theme)} (${x.pct}%)`).join(', ') : 'Aún sin datos suficientes (10 intentos por tema).'}</p></div>
        </div>
      </section>

      <section className="card-block">
        <h2>Marcador</h2>
        {user ? <Records user={user} /> : <p className="muted small">Entra para guardar tus resultados contra amigos y bots.</p>}
      </section>

      <section className="card-block">
        <h2>Ajustes</h2>
        <div className="settings">
          <label className="switch"><span>Sonido</span><input type="checkbox" checked={settings.sound} onChange={() => toggle('sound')} /></label>
          <button className="link left" onClick={() => { onboardingStore.set({ done: false }); nav('/bienvenida'); }}>Volver a responder la bienvenida</button>
        </div>
      </section>
    </div>
  );
}
