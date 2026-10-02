/* Imitación mínima de Firebase Realtime Database para pruebas: guarda todo en un servidor local. */
const BASE = 'http://localhost:8003/__db';
type Tree = Record<string, unknown>;
let cache: { v: number; tree: Tree } = { v: -1, tree: {} };
interface Sub { path: string; cb: (s: Snap) => void; last?: string; done?: boolean }
const subs = new Set<Sub>();
interface Snap { exists(): boolean; val(): any } // eslint-disable-line @typescript-eslint/no-explicit-any
const getP = (t: unknown, p: string): unknown => { let o = t as any; for (const k of p.split('/').filter(Boolean)) { if (o == null || typeof o !== 'object') return null; o = o[k]; } return o === undefined ? null : o; }; // eslint-disable-line @typescript-eslint/no-explicit-any
const snap = (v: unknown): Snap => ({ exists: () => v !== null && v !== undefined, val: () => (v == null ? null : JSON.parse(JSON.stringify(v))) });
function fire(s: Sub) {
  if (s.path === '.info/serverTimeOffset') { if (!s.done) { s.done = true; s.cb(snap(0)); } return; }
  const v = getP(cache.tree, s.path), j = JSON.stringify(v);
  if (j !== s.last) { s.last = j; s.cb(snap(v)); }
}
async function pull() { const r = await fetch(BASE); cache = await r.json(); subs.forEach(fire); }
setInterval(pull, 120);
export const getDatabase = () => ({});
export const ref = (_db: unknown, path: string) => ({ path });
export async function get(r: { path: string }) { await pull(); return snap(getP(cache.tree, r.path)); }
export async function set(r: { path: string }, value: unknown) { await fetch(BASE, { method: 'POST', body: JSON.stringify({ path: r.path, value }) }); await pull(); }
export const remove = (r: { path: string }) => set(r, null);
export function onValue(r: { path: string }, cb: (s: Snap) => void) { const s: Sub = { path: r.path, cb }; subs.add(s); if (cache.v >= 0) fire(s); void pull(); return () => { subs.delete(s); }; }
export const onDisconnect = () => ({ remove() {}, cancel() {} });
export async function runTransaction(r: { path: string }, fn: (cur: any) => any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  for (let i = 0; i < 20; i++) {
    await pull();
    const cur = getP(cache.tree, r.path);
    const nv = fn(cur == null ? null : JSON.parse(JSON.stringify(cur)));
    if (nv === undefined) return { committed: false, snapshot: snap(cur) };
    const res = await fetch(BASE, { method: 'POST', body: JSON.stringify({ v: cache.v, path: r.path, value: nv }) });
    if (res.ok) { cache = await res.json(); subs.forEach(fire); return { committed: true, snapshot: snap(getP(cache.tree, r.path)) }; }
  }
  throw new Error('tx');
}
