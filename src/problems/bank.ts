/* Banco de problemas verificados con el motor (generado por tools/build-puzzles.ts). */
import data from './puzzles.json';

export interface PuzzleStepData { accept: string[]; reply?: string }
export interface Puzzle {
  id: string;
  fen: string;
  theme: string;
  rating: number;
  /** en cada turno propio: jugadas aceptadas y la respuesta del rival */
  steps: PuzzleStepData[];
  /** casilla de destino y de origen de la primera jugada (para las pistas 2 y 3) */
  target: number;
  from: number;
}

export const PUZZLES: Puzzle[] = data as Puzzle[];

export const THEMES: Record<string, { label: string; hint: string; concept: string }> = {
  mate1: { label: 'Mate en 1', hint: '¿Qué jaque deja al rey sin ninguna casilla libre?', concept: 'Un jaque mate es un jaque del que el rey no puede escapar, taparse ni capturar al atacante.' },
  mate2: { label: 'Mate en 2', hint: 'Empieza por los jaques y las jugadas que quitan casillas al rey. ¿Qué puede responder el rival?', concept: 'En un mate en 2, la primera jugada deja al rival sin defensa contra el mate siguiente.' },
  mate3: { label: 'Mate en 3', hint: 'Busca una serie de jaques que vaya cerrando las salidas del rey.', concept: 'Los mates largos se calculan jugada por jugada, imaginando siempre la mejor defensa.' },
  doble: { label: 'Ataque doble', hint: '¿Alguna jugada ataca dos piezas a la vez?', concept: 'Un ataque doble amenaza dos cosas al mismo tiempo: el rival solo puede salvar una.' },
  colgada: { label: 'Pieza colgada', hint: '¿Hay alguna pieza rival que nadie defiende?', concept: 'Una pieza sin defensa se puede capturar gratis.' },
  coronacion: { label: 'Coronación', hint: '¿Hay algún peón cerca de la última fila? ¿Qué pasa si corona?', concept: 'Un peón que corona se convierte en dama: muchas veces vale la pena sacrificar algo para lograrlo.' },
  material: { label: 'Ganar material', hint: 'Revisa jaques, capturas y amenazas: una de ellas gana algo.', concept: 'Ganar material es quedarse con más puntos de piezas que el rival.' }
};
export const themeLabel = (t: string) => THEMES[t]?.label ?? t;

/** Acepta id directo ('p12') o 'tema-n' (el n-ésimo del tema, de menor a mayor rating). */
export function puzzleById(id: string): Puzzle | undefined {
  const direct = PUZZLES.find(p => p.id === id);
  if (direct) return direct;
  const m = /^([a-z0-9]+)-(\d+)$/.exec(id);
  if (!m) return undefined;
  return PUZZLES.filter(p => p.theme === m[1])[Number(m[2]) - 1];
}

export function difficultyLabel(r: number): string {
  return r < 900 ? 'Fácil' : r < 1300 ? 'Media' : r < 1700 ? 'Difícil' : 'Muy difícil';
}

export const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** El mismo problema para todos ese día, elegido entre los de dificultad media. */
export function dailyPuzzle(key = todayKey()): Puzzle {
  const pool = PUZZLES.filter(p => p.rating >= 900 && p.rating <= 1600);
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

export const LEVELS: { id: string; label: string; min: number; max: number }[] = [
  { id: 'facil', label: 'Fácil', min: 0, max: 899 },
  { id: 'media', label: 'Media', min: 900, max: 1299 },
  { id: 'dificil', label: 'Difícil', min: 1300, max: 1699 },
  { id: 'muydificil', label: 'Muy difícil', min: 1700, max: 9999 }
];

/**
 * Siguiente problema cerca del rating del usuario, priorizando temas débiles.
 * Nunca repite uno ya visto mientras queden problemas sin ver (la ventana de rating se agranda si hace falta).
 */
export function pickPuzzle(rating: number, opts: { theme?: string; level?: string; recent?: Set<string>; weakThemes?: string[] } = {}): Puzzle {
  const lv = LEVELS.find(l => l.id === opts.level);
  const base = PUZZLES.filter(p => (!opts.theme || p.theme === opts.theme) && (!lv || (p.rating >= lv.min && p.rating <= lv.max)));
  let pool = base.filter(p => !opts.recent?.has(p.id));
  if (!pool.length) pool = base.length ? base : PUZZLES;
  const target = lv ? Math.max(lv.min, Math.min(lv.max, rating)) : rating;
  for (const win of [100, 175, 275, 450, 99999]) {
    const near = pool.filter(p => Math.abs(p.rating - target) <= win);
    if (near.length >= 4 || win === 99999) {
      const list = near.length ? near : pool;
      const weak = list.filter(p => opts.weakThemes?.includes(p.theme));
      const from = weak.length && Math.random() < 0.4 ? weak : list;
      return from[Math.floor(Math.random() * from.length)];
    }
  }
  return pool[0];
}

/** Cuántos problemas quedan sin ver. */
export const unseenCount = (seen: Set<string>) => PUZZLES.filter(p => !seen.has(p.id)).length;
