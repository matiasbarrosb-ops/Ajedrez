/*
 * Cliente del motor: habla con el Web Worker por mensajes y devuelve promesas.
 * La app nunca llama al motor directamente; así se puede cambiar por otro (p. ej. Stockfish).
 */
import { analyzeRoot, search, type Position, type RootScore, type SearchOptions, type SearchResult } from './core.ts';

export class EngineClient {
  private worker: Worker | null = null;
  private seq = 0;
  private pending = new Map<number, (r: any) => void>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor() {
    try {
      this.worker = new Worker(new URL('./engine.worker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = (e: MessageEvent<{ id: number; r: unknown }>) => {
        const cb = this.pending.get(e.data.id);
        this.pending.delete(e.data.id);
        cb?.(e.data.r);
      };
      this.worker.onerror = () => { this.worker = null; };
    } catch {
      this.worker = null;
    }
  }

  /** Pide la mejor jugada. La posición se copia: el llamador puede seguir modificándola. */
  search(P: Position, o: SearchOptions): Promise<SearchResult | null> {
    const copy: Position = { b: P.b.slice(), t: P.t, c: P.c, ep: P.ep, h: P.h, f: P.f };
    if (!this.worker) return new Promise(res => setTimeout(() => res(search(copy, o)), 20));
    const id = ++this.seq;
    return new Promise(res => {
      this.pending.set(id, res);
      this.worker!.postMessage({ id, P: copy, o });
    });
  }

  /** Evalúa todas las jugadas de la posición (para el entrenador). */
  analyze(P: Position, d: number, ms: number): Promise<{ list: RootScore[]; depth: number }> {
    const copy: Position = { b: P.b.slice(), t: P.t, c: P.c, ep: P.ep, h: P.h, f: P.f };
    if (!this.worker) return new Promise(res => setTimeout(() => res(analyzeRoot(copy, d, ms)), 20));
    const id = ++this.seq;
    return new Promise(res => {
      this.pending.set(id, res);
      this.worker!.postMessage({ id, P: copy, o: { d, ms, n: 0 }, kind: 'analyze' });
    });
  }
}

let coachShared: EngineClient | null = null;
/** Motor aparte para el entrenador, así no hace esperar al bot. */
export function coachEngine(): EngineClient {
  if (!coachShared) coachShared = new EngineClient();
  return coachShared;
}

let shared: EngineClient | null = null;
/** Motor compartido para los bots. */
export function botEngine(): EngineClient {
  if (!shared) shared = new EngineClient();
  return shared;
}
