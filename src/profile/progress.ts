/*
 * Progreso del usuario: XP, nivel, racha, rating de partidas y de problemas, intentos, repaso espaciado,
 * lecciones completadas, objetivos del día e historial de partidas.
 * Se guarda en el teléfono y, si hay sesión, en Firebase (users/{uid}/progress).
 */
import { local } from '../lib/storage.ts';
import { createStore } from '../database/store.ts';
import { getFb } from '../database/firebase.ts';
import { onboardingStore, sessionStore } from '../database/session.ts';
import { todayKey } from '../problems/bank.ts';

export interface Attempt { id: string; theme: string; correct: boolean; hints: number; date: number; source: 'problemas' | 'diario' | 'repaso' | 'leccion' }
export interface ReviewItem { due: string; interval: number; streak: number; theme: string }
export interface LessonDone { stars: number; date: number; hints: number }
export interface DayLog { lessons: number; puzzles: number; games: number; daily?: boolean; xp: number }
export interface GameRecord {
  id: string;
  date: number;
  mode: 'bot' | 'local' | 'online';
  opponent: string;
  opponentRating?: number;
  color: 'w' | 'b';
  result: 'win' | 'loss' | 'draw';
  reason: string;
  moves: string[];
  tc: string;
  durationMs: number;
  ratingBefore?: number;
  ratingAfter?: number;
}

export interface Progress {
  xp: number;
  rating: number;
  ratingGames: number;
  ratingHistory: { d: string; r: number }[];
  puzzleRating: number;
  puzzleCount: number;
  streak: { count: number; lastDay: string | null; best: number };
  lessons: Record<string, LessonDone>;
  attempts: Attempt[];
  review: Record<string, ReviewItem>;
  days: Record<string, DayLog>;
  games: GameRecord[];
  updated: number;
}

const START: Record<string, number> = { nunca: 400, mover: 600, aveces: 900, seguido: 1200, compito: 1500 };
function fresh(): Progress {
  const r = START[onboardingStore.get().experience ?? 'mover'] ?? 600;
  return { xp: 0, rating: r, ratingGames: 0, ratingHistory: [], puzzleRating: r + 200, puzzleCount: 0, streak: { count: 0, lastDay: null, best: 0 }, lessons: {}, attempts: [], review: {}, days: {}, games: [], updated: 0 };
}
/** Firebase elimina listas y objetos vacíos: se completan al leer. */
function normalize(p: Partial<Progress> | null | undefined): Progress {
  const f = fresh();
  if (!p) return f;
  return {
    ...f, ...p,
    streak: { ...f.streak, ...(p.streak ?? {}) },
    ratingHistory: Object.values(p.ratingHistory ?? []), lessons: p.lessons ?? {}, attempts: Object.values(p.attempts ?? []),
    review: p.review ?? {}, days: p.days ?? {}, games: Object.values(p.games ?? []).map(g => ({ ...g, moves: Object.values(g.moves ?? []) }))
  };
}

export const progressStore = createStore<Progress>(normalize(local.get<Progress | null>('jm-progress', null)));

let saveTimer: ReturnType<typeof setTimeout> | null = null;
function commit(p: Progress) {
  p.updated = Date.now();
  progressStore.set({ ...p });
  local.set('jm-progress', p);
  const user = sessionStore.get().user;
  if (!user) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const fb = await getFb();
    if (fb) fb.set(fb.r(`users/${user.uid}/progress`), JSON.parse(JSON.stringify(progressStore.get()))).catch(() => {});
  }, 800);
}

/** Al entrar con una cuenta: se queda con el progreso más reciente (teléfono o nube). */
export async function syncProgressFromCloud(): Promise<void> {
  const user = sessionStore.get().user;
  const fb = await getFb();
  if (!user || !fb) return;
  try {
    const snap = await fb.get(fb.r(`users/${user.uid}/progress`));
    const remote = snap.exists() ? normalize(snap.val()) : null;
    const mine = progressStore.get();
    if (remote && remote.updated > mine.updated) { progressStore.set(remote); local.set('jm-progress', remote); }
    else commit(mine);
  } catch { /* sin conexión */ }
}

const mutate = (fn: (p: Progress) => void) => { const p = structuredClone(progressStore.get()); fn(p); commit(p); };

/* ---------- niveles ---------- */
/** El nivel n parte en 25·(n−1)·(n+2) XP: 0, 100, 250, 450, 700… */
export const levelStart = (n: number) => 25 * (n - 1) * (n + 2);
export function levelOf(xp: number) {
  let n = 1;
  while (levelStart(n + 1) <= xp) n++;
  return { level: n, from: levelStart(n), to: levelStart(n + 1) };
}
export function rankOf(p: Progress): string {
  const beginnerIds = ['torre', 'alfil', 'dama', 'caballo', 'rey', 'peon', 'valor', 'jaque', 'salir', 'jaquemate', 'pasillo', 'ahogado', 'enroque', 'alpaso', 'principios', 'italiana', 'pastor'];
  const beginnerDone = beginnerIds.filter(id => p.lessons[id]).length / beginnerIds.length;
  if (p.puzzleRating >= 1700 && p.puzzleCount >= 100) return 'Avanzado';
  if (p.puzzleRating >= 1300 && beginnerDone >= 0.8) return 'Intermedio';
  if (beginnerDone >= 0.5 || p.puzzleCount >= 30) return 'Aprendiz';
  return 'Principiante';
}

/* ---------- día y racha ---------- */
const dayDiff = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
function touchDay(p: Progress, xp: number, field?: keyof Omit<DayLog, 'xp' | 'daily'>) {
  const today = todayKey();
  const d = p.days[today] ?? { lessons: 0, puzzles: 0, games: 0, xp: 0 };
  if (field) d[field]++;
  d.xp += xp;
  p.days[today] = d;
  p.xp += xp;
  // racha: un día libre permitido (faltar un día no la corta, faltar dos sí)
  const last = p.streak.lastDay;
  if (last !== today) {
    const gap = last ? dayDiff(last, today) : 99;
    p.streak.count = gap <= 2 ? p.streak.count + 1 : 1;
    p.streak.lastDay = today;
    p.streak.best = Math.max(p.streak.best, p.streak.count);
  }
  // se guardan solo los últimos 120 días
  const keys = Object.keys(p.days).sort();
  for (const k of keys.slice(0, Math.max(0, keys.length - 120))) delete p.days[k];
}
/** Racha vigente (si pasaron más de 2 días sin actividad, ya se cortó). */
export function currentStreak(p: Progress): number {
  if (!p.streak.lastDay) return 0;
  return dayDiff(p.streak.lastDay, todayKey()) <= 2 ? p.streak.count : 0;
}
export const today = (p: Progress): DayLog => p.days[todayKey()] ?? { lessons: 0, puzzles: 0, games: 0, xp: 0 };

/* ---------- Elo ---------- */
const expected = (r: number, opp: number) => 1 / (1 + 10 ** ((opp - r) / 400));
const kFactor = (n: number) => (n < 20 ? 40 : 20);

/* ---------- lecciones ---------- */
export function completeLesson(id: string, hints: number, mistakes: number) {
  const stars = Math.max(1, 3 - Math.min(2, Math.floor((hints + mistakes) / 2)));
  const xp = Math.max(5, 20 - hints * 5);
  mutate(p => {
    const prev = p.lessons[id];
    p.lessons[id] = { stars: Math.max(stars, prev?.stars ?? 0), date: Date.now(), hints };
    touchDay(p, prev ? Math.round(xp / 2) : xp, 'lessons');
  });
  return { stars, xp };
}

/* ---------- problemas ---------- */
const S_BY_HINTS = [1, 0.6, 0.3, 0];
const INTERVALS = [1, 3, 7, 14, 30];
export function recordPuzzle(pz: { id: string; theme: string; rating: number }, correct: boolean, hints: number, source: Attempt['source']) {
  let delta = 0, xpGain = 0;
  mutate(p => {
    const s = correct ? S_BY_HINTS[Math.min(3, hints)] : 0;
    if (source !== 'leccion') {
      const before = p.puzzleRating;
      p.puzzleRating = Math.round(before + kFactor(p.puzzleCount) * (s - expected(before, pz.rating)));
      p.puzzleRating = Math.max(400, p.puzzleRating);
      delta = p.puzzleRating - before;
      p.puzzleCount++;
    }
    p.attempts.push({ id: pz.id, theme: pz.theme, correct, hints, date: Date.now(), source });
    if (p.attempts.length > 400) p.attempts.splice(0, p.attempts.length - 400);
    // repaso espaciado
    const r = p.review[pz.id];
    const clean = correct && hints === 0;
    if (!clean) p.review[pz.id] = { due: addDays(1), interval: 1, streak: 0, theme: pz.theme };
    else if (r) {
      const next = r.streak + 1;
      if (next >= INTERVALS.length) delete p.review[pz.id];
      else p.review[pz.id] = { ...r, due: addDays(INTERVALS[next]), interval: INTERVALS[next], streak: next };
    }
    xpGain = source === 'diario' ? (correct ? 25 : 5) : correct ? (hints ? 5 : 10) : 2;
    touchDay(p, xpGain, 'puzzles');
    if (source === 'diario') p.days[todayKey()].daily = true;
  });
  return { delta, xp: xpGain };
}
function addDays(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return todayKey(d); }
export const dueReviews = (p: Progress) => Object.entries(p.review).filter(([, r]) => r.due <= todayKey()).map(([id, r]) => ({ id, ...r }));

/** Acierto por tema en los últimos 20 intentos (solo temas con 5 o más). */
export function skills(p: Progress): { theme: string; pct: number; n: number }[] {
  const by: Record<string, Attempt[]> = {};
  for (const a of p.attempts) (by[a.theme] ??= []).push(a);
  return Object.entries(by).map(([theme, list]) => {
    const last = list.slice(-20);
    return { theme, pct: Math.round(100 * last.filter(a => a.correct && a.hints === 0).length / last.length), n: list.length };
  }).filter(s => s.n >= 5).sort((a, b) => a.pct - b.pct);
}

/* ---------- partidas ---------- */
export function recordGame(g: Omit<GameRecord, 'id' | 'ratingBefore' | 'ratingAfter'>): GameRecord {
  let rec!: GameRecord;
  mutate(p => {
    rec = { ...g, id: 'g' + Date.now().toString(36) };
    if (g.mode !== 'local' && g.opponentRating && g.moves.length >= 2) {
      const s = g.result === 'win' ? 1 : g.result === 'draw' ? 0.5 : 0;
      rec.ratingBefore = p.rating;
      p.rating = Math.max(100, Math.round(p.rating + kFactor(p.ratingGames) * (s - expected(p.rating, g.opponentRating))));
      rec.ratingAfter = p.rating;
      p.ratingGames++;
      p.ratingHistory.push({ d: todayKey(), r: p.rating });
      if (p.ratingHistory.length > 200) p.ratingHistory.splice(0, p.ratingHistory.length - 200);
    }
    p.games.unshift(rec);
    if (p.games.length > 100) p.games.length = 100;
    touchDay(p, g.moves.length >= 2 ? (g.result === 'win' ? 20 : 10) : 0, 'games');
  });
  return rec;
}

/** Rating de hace 7 días (o el primero registrado). */
export function ratingWeekAgo(p: Progress): number {
  const limit = todayKey(new Date(Date.now() - 7 * 864e5));
  const older = p.ratingHistory.filter(h => h.d <= limit);
  return older.length ? older[older.length - 1].r : p.ratingHistory[0]?.r ?? p.rating;
}
