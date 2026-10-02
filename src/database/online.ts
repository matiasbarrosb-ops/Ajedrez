/* Partidas online por código de sala (Firebase Realtime Database). */
import type { Color } from '../engine/core.ts';
import { timeControlById } from '../chess/clock.ts';
import type { EndReason } from '../chess/game.ts';
import { getFb, serverNow, type Fb } from './firebase.ts';
import type { User } from './session.ts';

export interface RoomPlayer { uid: string; name: string }
export interface RoomResult { w: Color | 'd'; r: EndReason }
export interface Room {
  created: number;
  host: string;
  tc: string;
  status: 'waiting' | 'playing' | 'over';
  players: Partial<Record<Color, RoomPlayer>>;
  moves?: string;
  clock?: { w: number; b: number; at: number; inc: number } | null;
  result?: RoomResult;
  drawOffer?: Color | null;
  rematch?: Partial<Record<Color, boolean>>;
  next?: string;
  recorded?: boolean;
  online?: Partial<Record<Color, boolean>>;
}

export interface RecordEntry { w: number; l: number; d: number; name: string; last: number }

const CODE_ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
export const roomMoves = (r: Room | null | undefined) => (r?.moves ? r.moves.split(' ').filter(Boolean) : []);
export const cleanCode = (raw: string) => raw.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
export const roomLink = (code: string) => `${location.origin}${location.pathname}#/sala/${code}`;
export const colorOfUser = (r: Room, uid: string): Color | null =>
  r.players.w?.uid === uid ? 'w' : r.players.b?.uid === uid ? 'b' : null;

async function needFb(): Promise<Fb> {
  const fb = await getFb();
  if (!fb) throw new Error('El modo online no está configurado.');
  return fb;
}
function genCode() { let s = ''; for (let i = 0; i < 4; i++) s += CODE_ABC[Math.floor(Math.random() * CODE_ABC.length)]; return s; }

function newRoom(host: string, players: Room['players'], tcId: string, status: Room['status']): Room {
  const tc = timeControlById(tcId);
  return {
    created: Date.now(), host, tc: tcId, status, players, moves: '',
    clock: tc.baseMs ? { w: tc.baseMs, b: tc.baseMs, at: 0, inc: tc.incMs } : null
  };
}
async function createWith(fb: Fb, data: Room): Promise<string> {
  for (let i = 0; i < 6; i++) {
    const code = genCode();
    const res = await fb.runTransaction(fb.r(`rooms/${code}`), cur => (cur ? undefined : data));
    if (res.committed) return code;
  }
  throw new Error('No se pudo crear la sala.');
}

export async function createRoom(user: User, color: Color | 'r', tcId: string): Promise<string> {
  const fb = await needFb();
  const c: Color = color === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : color;
  return createWith(fb, newRoom(user.uid, { [c]: { uid: user.uid, name: user.name } }, tcId, 'waiting'));
}

export type JoinOutcome = 'ok' | 'none' | 'full';
export async function joinRoom(user: User, code: string): Promise<JoinOutcome> {
  const fb = await needFb();
  let why: JoinOutcome = 'ok';
  const res = await fb.runTransaction(fb.r(`rooms/${code}`), (cur: Room | null) => {
    if (!cur) { why = 'none'; return cur; }
    const p = cur.players || {};
    if (p.w?.uid === user.uid || p.b?.uid === user.uid) { why = 'ok'; return cur; }
    if (cur.status !== 'waiting') { why = 'full'; return undefined; }
    const free: Color | null = !p.w ? 'w' : !p.b ? 'b' : null;
    if (!free) { why = 'full'; return undefined; }
    p[free] = { uid: user.uid, name: user.name };
    cur.players = p; cur.status = 'playing'; why = 'ok';
    return cur;
  });
  if (!res.snapshot.val()) return 'none';
  return res.committed ? 'ok' : why;
}

export async function watchRoom(code: string, cb: (r: Room | null) => void): Promise<() => void> {
  const fb = await needFb();
  return fb.onValue(fb.r(`rooms/${code}`), s => cb(s.val()));
}

export async function setPresence(code: string, color: Color): Promise<() => void> {
  const fb = await needFb();
  const ref = fb.r(`rooms/${code}/online/${color}`);
  await fb.set(ref, true);
  fb.onDisconnect(ref).remove();
  return () => { fb.onDisconnect(ref).cancel(); fb.remove(ref); };
}

export async function deleteRoom(code: string) { const fb = await needFb(); await fb.remove(fb.r(`rooms/${code}`)); }

/** Envía una jugada. n = cantidad de jugadas antes de esta (evita jugadas duplicadas o fuera de turno). */
export async function sendMove(code: string, user: User, n: number, moveCode: string, over: RoomResult | null): Promise<boolean> {
  const fb = await needFb();
  const res = await fb.runTransaction(fb.r(`rooms/${code}`), (cur: Room | null) => {
    if (!cur || cur.status !== 'playing') return undefined;
    const mv = roomMoves(cur);
    if (mv.length !== n) return undefined;
    const mover: Color = n % 2 ? 'b' : 'w';
    if (cur.players[mover]?.uid !== user.uid) return undefined;
    const now = serverNow();
    if (cur.clock) {
      if (n >= 1) {
        cur.clock[mover] -= Math.max(0, now - cur.clock.at);
        if (cur.clock[mover] <= 0) { cur.clock[mover] = 0; cur.status = 'over'; cur.result = { w: mover === 'w' ? 'b' : 'w', r: 'tiempo' }; return cur; }
      }
      cur.clock[mover] += cur.clock.inc || 0;
      cur.clock.at = now;
    }
    mv.push(moveCode); cur.moves = mv.join(' '); cur.drawOffer = null;
    if (over) { cur.status = 'over'; cur.result = over; }
    return cur;
  });
  return res.committed;
}

export async function finishRoom(code: string, result: RoomResult, guard?: (r: Room) => boolean): Promise<boolean> {
  const fb = await needFb();
  const res = await fb.runTransaction(fb.r(`rooms/${code}`), (cur: Room | null) => {
    if (!cur || cur.status !== 'playing') return undefined;
    if (guard && !guard(cur)) return undefined;
    cur.status = 'over'; cur.result = result; cur.drawOffer = null;
    return cur;
  });
  return res.committed;
}

export async function offerDraw(code: string, color: Color | null) { const fb = await needFb(); await fb.set(fb.r(`rooms/${code}/drawOffer`), color); }
export async function askRematch(code: string, color: Color) { const fb = await needFb(); await fb.set(fb.r(`rooms/${code}/rematch/${color}`), true); }

/** Cuando ambos pidieron revancha: crea la sala nueva con colores cambiados (una sola vez). */
export async function makeRematch(code: string, room: Room, user: User): Promise<void> {
  const fb = await needFb();
  const players = { w: room.players.b, b: room.players.w };
  const nc = await createWith(fb, newRoom(user.uid, players, room.tc, 'playing'));
  const res = await fb.runTransaction(fb.r(`rooms/${code}/next`), cur => (cur ? undefined : nc));
  if (!res.committed) await fb.remove(fb.r(`rooms/${nc}`));
}

/** Tiempo restante de un jugador según el reloj guardado en la sala. */
export function roomClock(room: Room, c: Color): number | null {
  if (!room.clock) return null;
  let v = room.clock[c];
  const n = roomMoves(room).length, turn: Color = n % 2 ? 'b' : 'w';
  if (room.status === 'playing' && n >= 1 && c === turn) v -= serverNow() - room.clock.at;
  return v;
}

/** Anota el resultado en el marcador de ambos jugadores (una sola vez por sala). */
export async function recordRoomResult(code: string, room: Room): Promise<void> {
  const fb = await needFb();
  const res = await fb.runTransaction(fb.r(`rooms/${code}/recorded`), cur => (cur ? undefined : true));
  if (!res.committed || roomMoves(room).length < 2 || !room.result) return;
  const w = room.players.w!, b = room.players.b!, win = room.result.w;
  await Promise.all([
    bumpRecord(w.uid, b.uid, b.name, win === 'd' ? 'd' : win === 'w' ? 'w' : 'l'),
    bumpRecord(b.uid, w.uid, w.name, win === 'd' ? 'd' : win === 'b' ? 'w' : 'l')
  ]);
}

export async function bumpRecord(uid: string, opp: string, oppName: string, res: 'w' | 'l' | 'd'): Promise<void> {
  const fb = await getFb();
  if (!fb) return;
  await fb.runTransaction(fb.r(`records/${uid}/${opp}`), (cur: RecordEntry | null) => {
    const r = cur || { w: 0, l: 0, d: 0, name: oppName, last: 0 };
    r.name = oppName; r[res] = (r[res] || 0) + 1; r.last = Date.now();
    return r;
  });
}

export async function watchRecords(uid: string, cb: (r: Record<string, RecordEntry>) => void): Promise<() => void> {
  const fb = await getFb();
  if (!fb) return () => {};
  return fb.onValue(fb.r(`records/${uid}`), s => cb(s.val() || {}));
}
export async function watchRecord(uid: string, opp: string, cb: (r: RecordEntry | null) => void): Promise<() => void> {
  const fb = await getFb();
  if (!fb) return () => {};
  return fb.onValue(fb.r(`records/${uid}/${opp}`), s => cb(s.val()));
}
