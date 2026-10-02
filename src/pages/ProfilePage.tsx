/* Perfil: cuenta, marcador y ajustes. Las estadísticas completas llegan en la etapa 8. */
import { useNavigate } from 'react-router-dom';
import { useStore } from '../database/store.ts';
import { onboardingStore, sessionStore, settingsStore, type Settings } from '../database/session.ts';
import { signOut } from '../database/auth.ts';
import { Records } from '../components/Records.tsx';
import { useState } from 'react';

export function ProfilePage() {
  const nav = useNavigate();
  const { user } = useStore(sessionStore);
  const settings = useStore(settingsStore);
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
        <h2>Marcador</h2>
        {user ? <Records user={user} /> : <p className="muted small">Entra para guardar tus resultados contra amigos y bots.</p>}
      </section>

      <section className="card-block">
        <h2>Ajustes</h2>
        <div className="settings">
          <label className="switch"><span>Sonido</span><input type="checkbox" checked={settings.sound} onChange={() => toggle('sound')} /></label>
          <label className="switch"><span>Barra de evaluación en partidas <small>próximamente</small></span><input type="checkbox" checked={settings.evalBar} onChange={() => toggle('evalBar')} /></label>
          <label className="switch"><span>Tutor que comenta las jugadas <small>próximamente</small></span><input type="checkbox" checked={settings.coach} onChange={() => toggle('coach')} /></label>
          <button className="link left" onClick={() => { onboardingStore.set({ done: false }); nav('/bienvenida'); }}>Volver a responder la bienvenida</button>
        </div>
      </section>
    </div>
  );
}
