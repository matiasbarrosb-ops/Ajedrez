/* Entrar o crear cuenta con nombre + PIN. */
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthError, signIn } from '../database/auth.ts';
import { firebaseConfigured } from '../database/firebase.ts';

export function LoginPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const back = params.get('volver') || '/';
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!firebaseConfigured()) return (
    <div className="page narrow"><div className="card-lg"><h1>Cuentas</h1>
      <p className="muted">Las cuentas se activan cuando se configure el servidor (Firebase). Mientras tanto puedes jugar contra los bots y en este teléfono sin cuenta.</p>
      <button className="primary" onClick={() => nav('/jugar')}>Ir a Jugar</button></div></div>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(null); setBusy(true);
    try { await signIn(name, pin, register); nav(back, { replace: true }); }
    catch (ex) { setErr(ex instanceof AuthError ? ex.message : 'No se pudo conectar. Inténtalo de nuevo.'); }
    finally { setBusy(false); }
  };
  return (
    <div className="page narrow">
      <div className="card-lg">
        <div className="hero-glyph">{'♚︎'}</div>
        <h1>{register ? 'Crear cuenta' : 'Entrar'}</h1>
        <p className="muted">{register ? 'Elige un nombre y un PIN de 4 números. Con eso entras desde cualquier teléfono.' : 'Usa tu nombre y tu PIN para guardar tu progreso y jugar online.'}</p>
        <form className="form" onSubmit={submit} autoComplete="off">
          <label className="field"><span className="label">Nombre</span>
            <input id="name" value={name} maxLength={16} required placeholder="Ej: Matías" onChange={e => setName(e.target.value)} /></label>
          <label className="field"><span className="label">PIN de 4 números</span>
            <input id="pin" type="password" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required placeholder="••••" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} /></label>
          {err && <p className="err" role="alert">{err}</p>}
          <button className="primary" type="submit" disabled={busy}>{register ? 'Crear cuenta' : 'Entrar'}</button>
        </form>
        <button className="link" onClick={() => { setRegister(r => !r); setErr(null); }}>{register ? 'Ya tengo cuenta' : '¿Primera vez? Crear cuenta'}</button>
      </div>
    </div>
  );
}
