/// <reference lib="webworker" />
import { analyzeRoot, search, type Position, type SearchOptions } from './core.ts';

interface Req { id: number; P: Position; o: SearchOptions; kind?: 'search' | 'analyze' }

self.onmessage = (e: MessageEvent<Req>) => {
  const { id, P, o, kind } = e.data;
  const r = kind === 'analyze' ? analyzeRoot(P, o.d, o.ms) : search(P, o);
  (self as unknown as Worker).postMessage({ id, r });
};
