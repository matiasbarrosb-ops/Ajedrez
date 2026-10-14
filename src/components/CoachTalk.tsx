/* Modo entrenador: barra de ventaja y el entrenador conversando arriba del tablero, con globos de diálogo. */
import type { ReactNode } from 'react';
import { MATE } from '../engine/core.ts';
import { splitSan, type Mood } from '../coach/talk.ts';
import { FigSan } from './MoveList.tsx';

export interface Bubble { id: string; text: string }

/** Texto con las jugadas [[Nc3]] dibujadas con figuras. */
export function TalkText({ text }: { text: string }) {
  const parts = splitSan(text);
  return <>{parts.map((p, i) => (i % 2 ? <strong key={i}><FigSan san={p} /></strong> : <span key={i}>{p}</span>))}</>;
}

/** Barra horizontal de ventaja: blanco a la izquierda, negro a la derecha, con el número del lado que gana. */
export function EvalBar({ cp }: { cp: number | null }) {
  const v = cp ?? 0;
  const mate = Math.abs(v) > MATE - 1000;
  const pct = mate ? (v > 0 ? 100 : 0) : 100 / (1 + Math.exp(-0.00368208 * Math.max(-1500, Math.min(1500, v))));
  const label = mate ? `M${Math.max(1, Math.ceil((MATE - Math.abs(v)) / 2))}` : (v >= 0 ? '+' : '−') + Math.abs(v / 100).toFixed(2).replace('.', ',');
  const white = v >= 0;
  return (
    <div className="evalh" role="img" aria-label={`Evaluación ${label}`}>
      <div className="evalh-fill" style={{ width: `${Math.max(4, Math.min(96, pct))}%` }} />
      {cp !== null && <span className={`evalh-num ${white ? 'w' : 'b'}`}>{white ? label : label.replace('−', '-')}</span>}
    </div>
  );
}

interface Props {
  cp: number | null;
  bubbles: Bubble[];
  mood: Mood;
  thinking?: boolean;
  actions?: ReactNode;
}

export function CoachTalk({ cp, bubbles, mood, thinking, actions }: Props) {
  return (
    <div className="talk">
      <div className="talk-top">
        <EvalBar cp={cp} />
      </div>
      <div className="talk-row">
        <div className={`coach-face ${mood}`} aria-hidden="true">
          <span className="cf-knight">{'♞︎'}</span>
          <span className="cf-mouth" />
        </div>
        <div className="talk-bubbles" aria-live="polite">
          {bubbles.length === 0 && !thinking && <p className="tb">¡Hola! Juguemos. Haz tu jugada y te voy contando.</p>}
          {bubbles.slice(-2).map(b => <p key={b.id} className="tb"><TalkText text={b.text} /></p>)}
          {thinking && <p className="tb typing" aria-label="El entrenador está pensando"><span /><span /><span /></p>}
        </div>
      </div>
      {actions && <div className="talk-acts">{actions}</div>}
    </div>
  );
}
