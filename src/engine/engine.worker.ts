/// <reference lib="webworker" />
import { search, type Position, type SearchOptions } from './core.ts';

interface Req { id: number; P: Position; o: SearchOptions }

self.onmessage = (e: MessageEvent<Req>) => {
  const { id, P, o } = e.data;
  (self as unknown as Worker).postMessage({ id, r: search(P, o) });
};
