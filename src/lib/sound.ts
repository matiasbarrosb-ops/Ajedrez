/* Sonidos cortos generados con Web Audio (sin archivos). */
let ctx: AudioContext | null = null;
let enabled = true;
export const setSoundEnabled = (v: boolean) => { enabled = v; };

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.15, when = 0) {
  try {
    ctx = ctx || new AudioContext();
    const t = ctx.currentTime + when, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
  } catch { /* sin audio disponible */ }
}

export type Sfx = 'move' | 'capture' | 'castle' | 'check' | 'end' | 'correct' | 'wrong' | 'start';
export function sfx(k: Sfx) {
  if (!enabled) return;
  switch (k) {
    case 'move': tone(540, 0.06, 'triangle', 0.22); break;
    case 'castle': tone(540, 0.05, 'triangle', 0.2); tone(480, 0.06, 'triangle', 0.2, 0.07); break;
    case 'capture': tone(260, 0.09, 'square', 0.07); tone(170, 0.12, 'triangle', 0.2); break;
    case 'check': tone(880, 0.07, 'sine', 0.14); tone(660, 0.12, 'sine', 0.12, 0.08); break;
    case 'end': [523, 659, 784].forEach((f, i) => tone(f, 0.5, 'sine', 0.08, i * 0.06)); break;
    case 'correct': tone(660, 0.08, 'sine', 0.14); tone(990, 0.14, 'sine', 0.12, 0.08); break;
    case 'wrong': tone(220, 0.18, 'sawtooth', 0.05); break;
    case 'start': tone(660, 0.08, 'sine', 0.12); tone(880, 0.1, 'sine', 0.12, 0.09); break;
  }
}
