/* Ritmos de juego y formato del reloj. */

export interface TimeControl {
  id: string;
  label: string;
  /** categoría que se muestra agrupada */
  group: 'Bullet' | 'Blitz' | 'Rápida' | 'Sin reloj';
  baseMs: number;
  incMs: number;
}

const tc = (min: number, inc: number, group: TimeControl['group']): TimeControl =>
  ({ id: `${min}+${inc}`, label: `${min}+${inc}`, group, baseMs: min * 60000, incMs: inc * 1000 });

export const TIME_CONTROLS: TimeControl[] = [
  tc(1, 0, 'Bullet'), tc(2, 1, 'Bullet'),
  tc(3, 0, 'Blitz'), tc(3, 2, 'Blitz'), tc(5, 0, 'Blitz'),
  tc(10, 0, 'Rápida'), tc(10, 5, 'Rápida'), tc(15, 10, 'Rápida')
];
export const NO_CLOCK: TimeControl = { id: 'none', label: 'Sin reloj', group: 'Sin reloj', baseMs: 0, incMs: 0 };

/** Busca un ritmo por id ("10+5"), acepta ritmos personalizados con el mismo formato. */
export function timeControlById(id: string): TimeControl {
  if (id === 'none') return NO_CLOCK;
  const known = TIME_CONTROLS.find(t => t.id === id);
  if (known) return known;
  const m = /^(\d+)\+(\d+)$/.exec(id);
  if (m) return { id, label: id, group: 'Rápida', baseMs: Number(m[1]) * 60000, incMs: Number(m[2]) * 1000 };
  return NO_CLOCK;
}

export function formatClock(ms: number): string {
  ms = Math.max(0, ms);
  if (ms < 10000) return (ms / 1000).toFixed(1).replace('.', ',');
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
}
