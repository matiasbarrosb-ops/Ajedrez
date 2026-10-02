/* Partida en este dispositivo: contra un bot o entre dos personas. Se guarda para poder continuarla. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { other, type Color, type Move } from '../engine/core.ts';
import { botEngine } from '../engine/client.ts';
import { botById } from '../engine/bots.ts';
import { ChessGame, type GameResult } from '../chess/game.ts';
import { timeControlById } from '../chess/clock.ts';
import { START_FEN } from '../chess/notation.ts';
import { local } from '../lib/storage.ts';
import { sfx } from '../lib/sound.ts';

export interface LocalConfig {
  mode: 'bot' | 'local';
  botId: number;
  /** color del usuario contra el bot (en modo local siempre 'w' abajo) */
  human: Color;
  tc: string;
}

interface Saved extends LocalConfig {
  moves: string[];
  clock: { w: number; b: number } | null;
  result: GameResult | null;
  startedAt: number;
}

const KEY = 'jm-local-game';
export const loadSavedLocal = () => local.get<Saved | null>(KEY, null);
export const clearSavedLocal = () => local.remove(KEY);
export function startLocalGame(cfg: LocalConfig) {
  const tc = timeControlById(cfg.tc);
  const s: Saved = { ...cfg, moves: [], clock: tc.baseMs ? { w: tc.baseMs, b: tc.baseMs } : null, result: null, startedAt: Date.now() };
  local.set(KEY, s);
}

export function moveSound(m: Move, san: string, over: boolean) {
  if (over) sfx('end');
  else if (san.endsWith('+') || san.endsWith('#')) sfx('check');
  else if (m.c) sfx('capture');
  else if (m.fl & 12) sfx('castle');
  else sfx('move');
}

export function useLocalGame() {
  const saved = useRef(loadSavedLocal()).current;
  const cfg: LocalConfig = saved ?? { mode: 'bot', botId: 3, human: 'w', tc: 'none' };
  const tc = timeControlById(cfg.tc);
  const gameRef = useRef(new ChessGame(START_FEN, saved?.moves ?? []));
  const clockRef = useRef<{ w: number; b: number } | null>(saved?.clock ?? null);
  const [result, setResult] = useState<GameResult | null>(saved?.result ?? null);
  const [thinking, setThinking] = useState(false);
  const [version, setVersion] = useState(0);
  const [, setTick] = useState(0);
  const token = useRef(0);
  const lastTick = useRef(performance.now());
  const resultRef = useRef(result);
  resultRef.current = result;
  const game = gameRef.current;
  const bot = botById(cfg.botId);

  const save = useCallback((res: GameResult | null = resultRef.current) => {
    local.set(KEY, { ...cfg, moves: gameRef.current.codes, clock: clockRef.current, result: res, startedAt: saved?.startedAt ?? Date.now() } satisfies Saved);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isBotTurn = () => cfg.mode === 'bot' && game.turn !== cfg.human;

  const play = useCallback((m: Move) => {
    const g = gameRef.current;
    const mover = g.turn;
    const e = g.play(m);
    if (clockRef.current) clockRef.current[mover] += tc.incMs;
    lastTick.current = performance.now();
    const res = g.boardResult();
    moveSound(m, e.san, !!res);
    if (res) setResult(res);
    save(res);
    setVersion(v => v + 1);
  }, [save, tc.incMs]);

  // turno del bot
  useEffect(() => {
    if (result || !isBotTurn()) return;
    const my = ++token.current;
    setThinking(true);
    const t0 = Date.now();
    const opts = { ...bot.opts };
    if (game.hist.length < 8 && opts.n < 20) opts.n += 14; // algo de variedad en la apertura
    if (clockRef.current) opts.ms = Math.min(opts.ms, Math.max(150, clockRef.current[game.turn] / 30));
    botEngine().search(game.P, opts).then(r => {
      setTimeout(() => {
        if (my !== token.current) return;
        setThinking(false);
        if (!r) return;
        const m = game.find(r.move);
        if (m) play(m);
      }, Math.max(0, 420 - (Date.now() - t0)));
    });
    return () => { token.current++; setThinking(false); };
  }, [version, result]); // eslint-disable-line react-hooks/exhaustive-deps

  // reloj
  useEffect(() => {
    if (!clockRef.current) return;
    const h = setInterval(() => {
      const now = performance.now(), dt = now - lastTick.current;
      lastTick.current = now;
      const c = clockRef.current!;
      if (resultRef.current || !gameRef.current.hist.length) return;
      const side = gameRef.current.turn;
      c[side] -= dt;
      if (c[side] <= 0) {
        c[side] = 0;
        token.current++;
        const res: GameResult = { winner: other(side), reason: 'tiempo' };
        setResult(res); setThinking(false); sfx('end'); save(res);
      }
      setTick(t => t + 1);
    }, 100);
    return () => clearInterval(h);
  }, [save]);

  const undo = () => {
    if (!game.hist.length) return;
    token.current++;
    let n = 1;
    if (cfg.mode === 'bot' && game.turn === cfg.human) n = 2;
    game.undo(Math.min(n, game.hist.length));
    setResult(null); setThinking(false);
    lastTick.current = performance.now();
    save(null);
    setVersion(v => v + 1);
  };
  const resign = () => {
    if (result) return;
    token.current++;
    const loser = cfg.mode === 'bot' ? cfg.human : game.turn;
    const res: GameResult = { winner: other(loser), reason: 'abandono' };
    setResult(res); setThinking(false); sfx('end'); save(res);
  };
  const agreeDraw = () => {
    if (result) return;
    const res: GameResult = { winner: null, reason: 'acuerdo' };
    setResult(res); sfx('end'); save(res);
  };

  const humanCanMove = !result && !thinking && (cfg.mode === 'local' || game.turn === cfg.human);
  return { cfg, tc, bot, game, version, result, thinking, clock: clockRef.current, humanCanMove, play, undo, resign, agreeDraw };
}
