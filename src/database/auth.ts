/* Cuentas simples: nombre + PIN de 4 números. Pensado para jugar entre amigos. */
import { getFb } from './firebase.ts';
import { sessionStore, setUser, type User } from './session.ts';

export const normalizeName = (n: string) =>
  n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
}

export class AuthError extends Error {}

export async function signIn(rawName: string, pin: string, register: boolean): Promise<User> {
  const name = rawName.trim().replace(/\s+/g, ' ');
  const uid = normalizeName(name);
  if (uid.length < 2) throw new AuthError('El nombre necesita al menos 2 letras o números.');
  if (name.length > 16) throw new AuthError('El nombre puede tener hasta 16 caracteres.');
  if (!/^\d{4}$/.test(pin)) throw new AuthError('El PIN tiene que ser de 4 números.');
  const fb = await getFb();
  if (!fb) throw new AuthError('No hay conexión con el servidor. Revisa tu internet.');
  const pinHash = await sha256(`${uid}:${pin}:jaque-mate`);
  let user: User;
  if (register) {
    const res = await fb.runTransaction(fb.r(`users/${uid}`), cur => (cur ? undefined : { name, pinHash, created: Date.now() }));
    if (!res.committed) throw new AuthError('Ese nombre ya está ocupado. Prueba con otro o entra con tu PIN.');
    user = { uid, name, pinHash };
  } else {
    const snap = await fb.get(fb.r(`users/${uid}`));
    if (!snap.exists()) throw new AuthError('No existe una cuenta con ese nombre. Toca “Crear cuenta”.');
    if (snap.val().pinHash !== pinHash) throw new AuthError('PIN incorrecto.');
    user = { uid, name: snap.val().name, pinHash };
  }
  setUser(user);
  return user;
}

export function signOut() { setUser(null); }

/** Al abrir la app, confirma que la cuenta guardada sigue siendo válida. */
export async function verifySavedUser(): Promise<void> {
  const u = sessionStore.get().user;
  if (!u) return;
  const fb = await getFb();
  if (!fb) return;
  try {
    const s = await fb.get(fb.r(`users/${u.uid}`));
    if (!s.exists() || s.val().pinHash !== u.pinHash) setUser(null);
  } catch { /* sin conexión: se mantiene */ }
}
