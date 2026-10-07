import type { SearchOptions } from './core.ts';

export interface Bot {
  id: number;
  name: string;
  /** rating aproximado, usado para el Elo del usuario */
  rating: number;
  blurb: string;
  opts: SearchOptions;
}

/**
 * Niveles de bot.
 * - n (ruido): hace que elijan a veces jugadas peores.
 * - c (descuido): probabilidad de jugar sin mirar las respuestas del rival → deja piezas colgadas,
 *   no ve amenazas y cae en trampas simples. Es lo que hace fáciles a los primeros bots.
 */
export const BOTS: Bot[] = [
  { id: 1, name: 'Novato', rating: 250, blurb: 'Recién aprende: deja piezas colgadas a cada rato', opts: { d: 1, ms: 300, n: 220, c: 1 } },
  { id: 2, name: 'Aprendiz', rating: 400, blurb: 'No ve tus amenazas y regala material', opts: { d: 1, ms: 300, n: 300, c: 0.7 } },
  { id: 3, name: 'Fácil', rating: 600, blurb: 'A veces se defiende, muchas veces se descuida', opts: { d: 1, ms: 400, n: 220, c: 0.4 } },
  { id: 4, name: 'Básico', rating: 800, blurb: 'Ve capturas simples, comete errores claros', opts: { d: 2, ms: 600, n: 150, c: 0.2 } },
  { id: 5, name: 'Intermedio', rating: 1200, blurb: 'Castiga errores claros', opts: { d: 3, ms: 1200, n: 45, c: 0.04 } },
  { id: 6, name: 'Avanzado', rating: 1600, blurb: 'Calcula tácticas', opts: { d: 4, ms: 2200, n: 8 } },
  { id: 7, name: 'Experto', rating: 2000, blurb: 'Juega sus mejores jugadas', opts: { d: 6, ms: 3500, n: 0 } }
];
export const botById = (id: number) => BOTS.find(b => b.id === id) ?? BOTS[2];
