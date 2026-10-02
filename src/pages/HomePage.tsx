/* Inicio: qué hacer hoy, acceso directo a jugar y progreso. */
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../database/store.ts';
import { onboardingStore, sessionStore } from '../database/session.ts';
import { BOTS } from '../engine/bots.ts';
import { Icon } from '../components/Icon.tsx';
import { Records } from '../components/Records.tsx';
import { loadSavedLocal } from '../hooks/useLocalGame.ts';
import { suggestedBot } from './PlayPage.tsx';
import { GOAL_LABEL } from './WelcomePage.tsx';

export function HomePage() {
  const nav = useNavigate();
  const { user } = useStore(sessionStore);
  const ob = useStore(onboardingStore);
  if (!ob.done) return <Navigate to="/bienvenida" replace />;
  const bot = BOTS[suggestedBot() - 1];
  const saved = loadSavedLocal();
  const goals = ob.goals?.length ? ob.goals.map(g => GOAL_LABEL[g] ?? g).join(', ') : 'jugar mejor';

  return (
    <div className="page home">
      <section className="hello">
        <div className="hello-avatar">{(user?.name ?? 'I').charAt(0).toUpperCase()}</div>
        <div className="hello-text">
          <h1>{user ? `Hola, ${user.name}` : 'Hola'}</h1>
          <p className="muted">Tu foco: {goals}</p>
        </div>
      </section>

      <button className="primary hero-btn" onClick={() => nav('/jugar')}>
        <Icon name="play" /> Jugar
        <small>Bots, amigos online o en este teléfono</small>
      </button>
      {saved && !saved.result && saved.moves.length > 0 && (
        <button className="secondary resume" onClick={() => nav('/partida')}>Continuar tu partida ({saved.moves.length} jugadas)</button>
      )}

      <div className="home-grid">
        <section className="card-block">
          <div className="card-h"><h2>Entrenamiento de hoy</h2></div>
          <ul className="goals">
            <li><span className="goal-box" /><div><strong>Una partida contra {bot.name}</strong><small>Rival sugerido para tu nivel ({bot.rating})</small></div>
              <button className="secondary small-btn" onClick={() => nav('/jugar')}>Jugar</button></li>
            <li className="soon"><span className="goal-box" /><div><strong>1 lección</strong><small>Lecciones interactivas</small></div><span className="pill">Próximamente</span></li>
            <li className="soon"><span className="goal-box" /><div><strong>5 problemas</strong><small>Con pistas y rating propio</small></div><span className="pill">Próximamente</span></li>
          </ul>
        </section>

        <section className="card-block daily">
          <div className="card-h"><h2>Problema del día</h2><span className="pill">Próximamente</span></div>
          <p className="muted small">Cada día un desafío nuevo, con su tema y dificultad. Resolverlo suma a tu racha.</p>
        </section>

        <section className="card-block">
          <div className="card-h"><h2>Marcador</h2>{user && <Link to="/perfil" className="link">Ver todo</Link>}</div>
          {user ? <Records user={user} limit={4} /> : <p className="muted small">Entra con tu cuenta para guardar tus resultados contra amigos y bots.</p>}
        </section>
      </div>
    </div>
  );
}
