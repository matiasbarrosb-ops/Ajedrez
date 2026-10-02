import type { SearchOptions } from './core.ts';

export interface Bot {
  id: number;
  name: string;
  /** rating aproximado, usado para el Elo del usuario */
  rating: number;
  blurb: string;
  opts: SearchOptions;
}

/** Niveles de bot. El "ruido" hace que los bots débiles elijan a veces jugadas peores. */
export const BOTS: Bot[] = [
  { id: 1, name: 'Bot 1', rating: 400, blurb: 'Principiante: deja piezas colgadas', opts: { d: 1, ms: 400, n: 380 } },
  { id: 2, name: 'Bot 2', rating: 800, blurb: 'Fácil: ve capturas simples', opts: { d: 2, ms: 700, n: 150 } },
  { id: 3, name: 'Bot 3', rating: 1200, blurb: 'Intermedio: castiga errores claros', opts: { d: 3, ms: 1200, n: 45 } },
  { id: 4, name: 'Bot 4', rating: 1600, blurb: 'Avanzado: calcula tácticas', opts: { d: 4, ms: 2200, n: 8 } },
  { id: 5, name: 'Bot 5', rating: 2000, blurb: 'Experto: juega sus mejores jugadas', opts: { d: 6, ms: 3500, n: 0 } }
];
export const botById = (id: number) => BOTS.find(b => b.id === id) ?? BOTS[2];
