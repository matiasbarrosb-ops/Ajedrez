/* Jugar: partida rápida, contra bot con ritmo a elección, amigo online o dos personas en este teléfono. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Color } from '../engine/core.ts';
import { BOTS } from '../engine/bots.ts';
import { TIME_CONTROLS } from '../chess/clock.ts';
import { Segmented } from '../components/Segmented.tsx';
import { Icon } from '../components/Icon.tsx';
import { loadSavedLocal, startLocalGame } from '../hooks/useLocalGame.ts';
import { local } from '../lib/storage.ts';
import { useStore } from '../database/store.ts';
import { onboardingStore, sessionStore } from '../database/session.ts';
import { firebaseConfigured } from '../database/firebase.ts';
import { cleanCode, createRoom } from '../database/online.ts';
import { toast } from '../components/Toast.tsx';

interface PlayPrefs { botId: number; color: Color | 'r'; tc: string; customMin: number; customInc: number }
const DEFAULT: PlayPrefs = { botId: 2, color: 'r', tc: '10+0', customMin: 20, customInc: 0 };

/** Bot sugerido según lo que respondió en la bienvenida. */
export function suggestedBot(): number {
  const e = onboardingStore.get().experience;
  return e === 'nunca' ? 1 : e === 'mover' ? 2 : e === 'aveces' ? 3 : e === 'seguido' ? 4 : e === 'compito' ? 5 : 2;
}

export function PlayPage() {
  const nav = useNavigate();
  const { user } = useStore(sessionStore);
  const [prefs, setPrefs] = useState<PlayPrefs>({ ...DEFAULT, botId: suggestedBot(), ...local.get<Partial<PlayPrefs>>('jm-play', {}) });
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const saved = loadSavedLocal();
  const update = (p: Partial<PlayPrefs>) => { const n = { ...prefs, ...p }; setPrefs(n); local.set('jm-play', n); };
  const tcId = prefs.tc === 'custom' ? `${prefs.customMin}+${prefs.customInc}` : prefs.tc;
  const pickColor = (): Color => (prefs.color === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : prefs.color);

  const startBot = (botId = prefs.botId, tc = tcId) => {
    startLocalGame({ mode: 'bot', botId, human: pickColor(), tc });
    nav('/partida');
  };
  const startLocal = () => { startLocalGame({ mode: 'local', botId: prefs.botId, human: 'w', tc: tcId }); nav('/partida'); };
  const createOnline = async () => {
    if (!user) { nav('/entrar?volver=/jugar'); return; }
    setBusy(true);
    try { nav(`/sala/${await createRoom(user, prefs.color, tcId)}`); }
    catch { toast('No se pudo crear la sala. Revisa tu internet.'); }
    finally { setBusy(false); }
  };
  const joinOnline = () => {
    const c = cleanCode(code);
    if (c.length !== 4) { toast('El código tiene 4 letras.'); return; }
    nav(`/sala/${c}`);
  };

  const groups = ['Bullet', 'Blitz', 'Rápida'] as const;
  return (
    <div className="page">
      <h1 className="page-title">Jugar</h1>

      <button className="primary hero-btn" onClick={() => startBot(prefs.botId, '10+0')}>
        <Icon name="bolt" /> Partida rápida
        <small>10 minutos contra {BOTS[prefs.botId - 1].name} ({BOTS[prefs.botId - 1].rating})</small>
      </button>
      {saved && !saved.result && saved.moves.length > 0 && (
        <button className="secondary resume" onClick={() => nav('/partida')}>Continuar partida guardada ({saved.moves.length} jugadas)</button>
      )}

      <section className="card-block">
        <h2>Rival</h2>
        <div className="bot-grid">
          {BOTS.map(b => (
            <button key={b.id} className={`bot-card${prefs.botId === b.id ? ' on' : ''}`} onClick={() => update({ botId: b.id })} aria-pressed={prefs.botId === b.id}>
              <span className="bot-ico"><Icon name="robot" size={22} /></span>
              <span className="bot-name">{b.name}</span>
              <span className="bot-rating">{b.rating}</span>
              <span className="bot-blurb">{b.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card-block">
        <h2>Ritmo</h2>
        <div className="tc-grid">
          <button className={`tc${prefs.tc === 'none' ? ' on' : ''}`} onClick={() => update({ tc: 'none' })}><span className="tc-l">Sin reloj</span><span className="tc-g">Con calma</span></button>
          {groups.flatMap(g => TIME_CONTROLS.filter(t => t.group === g).map(t => (
            <button key={t.id} className={`tc${prefs.tc === t.id ? ' on' : ''}`} onClick={() => update({ tc: t.id })}>
              <span className="tc-l">{t.label}</span><span className="tc-g">{g}</span>
            </button>
          )))}
          <button className={`tc${prefs.tc === 'custom' ? ' on' : ''}`} onClick={() => update({ tc: 'custom' })}><span className="tc-l">Personalizado</span><span className="tc-g">{prefs.customMin}+{prefs.customInc}</span></button>
        </div>
        {prefs.tc === 'custom' && (
          <div className="custom-tc">
            <label>Minutos<input type="number" min={1} max={180} value={prefs.customMin} onChange={e => update({ customMin: Math.max(1, Math.min(180, Number(e.target.value) || 1)) })} /></label>
            <label>Incremento (s)<input type="number" min={0} max={60} value={prefs.customInc} onChange={e => update({ customInc: Math.max(0, Math.min(60, Number(e.target.value) || 0)) })} /></label>
          </div>
        )}
        <div className="field">
          <span className="label">Juegas con</span>
          <Segmented value={prefs.color} onChange={v => update({ color: v })} label="Color"
            options={[{ value: 'w', label: 'Blancas' }, { value: 'r', label: 'Al azar' }, { value: 'b', label: 'Negras' }]} />
        </div>
        <button className="primary" onClick={() => startBot()}>Jugar contra {BOTS[prefs.botId - 1].name}</button>
      </section>

      <section className="card-block">
        <h2>Otros modos</h2>
        <div className="modes">
          <div className="mode">
            <div className="mode-h"><Icon name="users" /><div><strong>Amigo online</strong><small>Comparte un código; usa el ritmo y color de arriba</small></div></div>
            {firebaseConfigured() ? (
              <>
                <button className="secondary" disabled={busy} onClick={createOnline}>{user ? 'Crear sala' : 'Entrar para jugar online'}</button>
                <div className="join-row">
                  <input value={code} onChange={e => setCode(cleanCode(e.target.value))} placeholder="CÓDIGO" aria-label="Código de sala" onKeyDown={e => e.key === 'Enter' && joinOnline()} />
                  <button className="secondary" onClick={joinOnline}>Unirme</button>
                </div>
              </>
            ) : <p className="muted small">El modo online se activa cuando se configure Firebase.</p>}
          </div>
          <div className="mode">
            <div className="mode-h"><Icon name="phone" /><div><strong>Dos personas, este teléfono</strong><small>Se turnan en el mismo tablero</small></div></div>
            <button className="secondary" onClick={startLocal}>Empezar</button>
          </div>
        </div>
      </section>
    </div>
  );
}
