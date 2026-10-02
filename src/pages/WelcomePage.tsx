/* Bienvenida: dos preguntas para armar el plan inicial. */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingStore, type Onboarding } from '../database/session.ts';

type Exp = NonNullable<Onboarding['experience']>;
const EXPERIENCE: { value: Exp; label: string }[] = [
  { value: 'nunca', label: 'Nunca he jugado' },
  { value: 'mover', label: 'Sé mover las piezas' },
  { value: 'aveces', label: 'Juego ocasionalmente' },
  { value: 'seguido', label: 'Juego regularmente' },
  { value: 'compito', label: 'Juego competitivo' }
];
export const GOAL_LABEL: Record<string, string> = { tactica: 'táctica', aperturas: 'aperturas', finales: 'finales', estrategia: 'estrategia', jugar: 'jugar mejor' };
const GOALS = Object.entries(GOAL_LABEL);

export function WelcomePage() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [exp, setExp] = useState<Exp | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const finish = () => { onboardingStore.set({ done: true, experience: exp ?? 'mover', goals: goals.length ? goals : ['jugar'] }); nav('/', { replace: true }); };
  return (
    <div className="page narrow welcome">
      <div className="card-lg">
        <div className="hero-glyph">{'♚︎'}</div>
        {step === 0 ? (
          <>
            <h1>Bienvenido a Jaque Mate</h1>
            <p className="muted">¿Cuánto sabes de ajedrez?</p>
            <div className="choice-list" role="radiogroup">
              {EXPERIENCE.map(o => (
                <button key={o.value} role="radio" aria-checked={exp === o.value} className={`choice${exp === o.value ? ' on' : ''}`} onClick={() => setExp(o.value)}>{o.label}</button>
              ))}
            </div>
            <button className="primary" disabled={!exp} onClick={() => setStep(1)}>Siguiente</button>
          </>
        ) : (
          <>
            <h1>¿Qué quieres mejorar?</h1>
            <p className="muted">Puedes elegir más de una.</p>
            <div className="chips">
              {GOALS.map(([k, label]) => (
                <button key={k} aria-pressed={goals.includes(k)} className={`choice-chip${goals.includes(k) ? ' on' : ''}`}
                  onClick={() => setGoals(g => (g.includes(k) ? g.filter(x => x !== k) : [...g, k]))}>{label.charAt(0).toUpperCase() + label.slice(1)}</button>
              ))}
            </div>
            <button className="primary" onClick={finish}>Crear mi plan</button>
            <button className="link" onClick={() => setStep(0)}>Volver</button>
          </>
        )}
      </div>
    </div>
  );
}
