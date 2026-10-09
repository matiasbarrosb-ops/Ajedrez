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
 * Cinco niveles con saltos claros (comprobados con `node tools/bot-match.ts`: cada uno le gana con amplitud al anterior).
 * - r (azar): probabilidad de mover cualquier cosa, como quien recién aprende.
 * - c (descuido): probabilidad de jugar sin mirar las respuestas del rival → deja piezas colgadas y no ve amenazas.
 * - n (ruido): hace que elijan a veces jugadas peores.
 */
export const BOTS: Bot[] = [
  { id: 11, name: 'Novato', rating: 250, blurb: 'Recién aprende a mover: regala piezas casi siempre', opts: { d: 1, ms: 200, n: 400, c: 1, r: 0.55 } },
  { id: 12, name: 'Básico', rating: 550, blurb: 'Captura lo que ve, pero no mira tus amenazas', opts: { d: 1, ms: 300, n: 200, c: 0.75 } },
  { id: 13, name: 'Intermedio', rating: 900, blurb: 'Defiende sus piezas y castiga errores simples', opts: { d: 2, ms: 600, n: 90, c: 0.2 } },
  { id: 14, name: 'Avanzado', rating: 1300, blurb: 'Calcula tácticas cortas y rara vez se equivoca', opts: { d: 3, ms: 1200, n: 30, c: 0.03 } },
  { id: 15, name: 'Experto', rating: 1700, blurb: 'Juega sus mejores jugadas y calcula profundo', opts: { d: 5, ms: 3000, n: 0 } }
];

/** Niveles anteriores (7 bots) → nivel nuevo más parecido, para partidas y preferencias guardadas. */
const OLD: Record<number, number> = { 1: 11, 2: 11, 3: 12, 4: 12, 5: 13, 6: 14, 7: 15 };
export const botById = (id: number) => BOTS.find(b => b.id === (OLD[id] ?? id)) ?? BOTS[1];
