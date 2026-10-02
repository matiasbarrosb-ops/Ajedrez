/* Estructura general: encabezado, barra lateral (computador) y barra inferior (celular). */
import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../database/store.ts';
import { sessionStore, settingsStore } from '../database/session.ts';
import { Icon, type IconName } from './Icon.tsx';

interface NavItem { to: string; label: string; icon: IconName; mobile: boolean }
export const NAV: NavItem[] = [
  { to: '/', label: 'Inicio', icon: 'home', mobile: true },
  { to: '/jugar', label: 'Jugar', icon: 'play', mobile: true },
  { to: '/aprender', label: 'Aprender', icon: 'learn', mobile: true },
  { to: '/entrenar', label: 'Entrenar', icon: 'train', mobile: false },
  { to: '/problemas', label: 'Problemas', icon: 'puzzle', mobile: true },
  { to: '/partidas', label: 'Partidas', icon: 'games', mobile: false },
  { to: '/perfil', label: 'Perfil', icon: 'profile', mobile: true }
];

export function Layout({ children, bare }: { children: ReactNode; bare?: boolean }) {
  const { user } = useStore(sessionStore);
  const settings = useStore(settingsStore);
  const nav = useNavigate();
  return (
    <div className={`shell${bare ? ' bare' : ''}`}>
      <aside className="sidebar" aria-label="Secciones">
        <button className="brand" onClick={() => nav('/')}><span className="knight">{'♞︎'}</span>Jaque Mate</button>
        <nav>
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className="side-link">
              <Icon name={n.icon} />{n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="main-col">
        <header className="topbar">
          <button className="brand mobile-only" onClick={() => nav('/')}><span className="knight">{'♞︎'}</span>Jaque Mate</button>
          <div className="topbar-right">
            <button className="icon-btn" aria-label={settings.sound ? 'Silenciar' : 'Activar sonido'} aria-pressed={settings.sound}
              onClick={() => settingsStore.set(s => ({ ...s, sound: !s.sound }))}>
              <Icon name={settings.sound ? 'sound' : 'mute'} />
            </button>
            <button className="chip" onClick={() => nav(user ? '/perfil' : '/entrar')}>{user ? user.name : 'Entrar'}</button>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
      <nav className="tabbar" aria-label="Secciones">
        {NAV.filter(n => n.mobile).map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className="tab">
            <Icon name={n.icon} /><span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
