/* Lección: explicación → ejemplo → pregunta → ejercicio con pistas → resumen → XP. */
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { lessonById, ALL_LESSONS, type Step } from '../lessons/data.ts';
import { puzzleById, THEMES } from '../problems/bank.ts';
import { completeLesson, recordPuzzle } from '../profile/progress.ts';
import { ChessBoard } from '../components/ChessBoard.tsx';
import { MoveExercise, type ExerciseResult } from '../components/MoveExercise.tsx';
import { parseFen, sqIndex } from '../chess/notation.ts';
import { gen, inCheck, make, unmake, type Move } from '../engine/core.ts';
import { sfx } from '../lib/sound.ts';
import { Icon } from '../components/Icon.tsx';

const EMPTY: Move[] = [];

export function LessonPage() {
  const { id = '' } = useParams();
  const lesson = lessonById(id);
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [hints, setHints] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [result, setResult] = useState<{ stars: number; xp: number } | null>(null);
  if (!lesson) return <div className="page narrow"><div className="card-lg"><h1>No encontramos esa lección</h1><Link className="primary" to="/aprender">Volver a Aprender</Link></div></div>;

  const steps = lesson.steps;
  const next = () => {
    if (i + 1 < steps.length) { setI(i + 1); return; }
    sfx('end');
    setResult(completeLesson(lesson.id, hints, mistakes));
  };
  const onExercise = (r: ExerciseResult, puzzle?: { id: string; theme: string; rating: number }) => {
    setHints(h => h + r.hints); setMistakes(m => m + r.mistakes);
    if (puzzle) recordPuzzle(puzzle, r.solved, r.hints, 'leccion');
    next();
  };

  const idx = ALL_LESSONS.findIndex(l => l.id === lesson.id);
  const following = ALL_LESSONS[idx + 1];

  if (result) return (
    <div className="page narrow lesson-end">
      <div className="card-lg">
        <div className="big-stars" aria-label={`${result.stars} de 3 estrellas`}>{'★'.repeat(result.stars)}<span>{'★'.repeat(3 - result.stars)}</span></div>
        <h1>Lección completada</h1>
        <p className="muted">{lesson.title} · +{result.xp} XP</p>
        <div className="summary">
          <span className="label">Lo que aprendiste</span>
          <ul>{lesson.summary.map(s => <li key={s}><Icon name="check" size={16} />{s}</li>)}</ul>
        </div>
        {following && following.unit.level === lesson.unit.level
          ? <button className="primary" onClick={() => { setI(0); setHints(0); setMistakes(0); setResult(null); nav(`/leccion/${following.id}`); }}>Siguiente: {following.title}</button>
          : <Link className="primary" to="/aprender">Volver al camino</Link>}
        <Link className="link" to="/aprender">Ver todas las lecciones</Link>
      </div>
    </div>
  );

  return (
    <div className="page lesson">
      <div className="lesson-top">
        <button className="icon-btn" aria-label="Salir de la lección" onClick={() => nav('/aprender')}><Icon name="back" /></button>
        <div className="lesson-bar" aria-label={`Paso ${i + 1} de ${steps.length}`}><div style={{ width: `${(100 * i) / steps.length}%` }} /></div>
        <span className="muted small">{i + 1}/{steps.length}</span>
      </div>
      <h1 className="lesson-title">{lesson.title}</h1>
      <StepView key={`${lesson.id}-${i}`} step={steps[i]} onNext={next} onExercise={onExercise} />
    </div>
  );
}

function StepView({ step, onNext, onExercise }: { step: Step; onNext: () => void; onExercise: (r: ExerciseResult, pz?: { id: string; theme: string; rating: number }) => void }) {
  if (step.t === 'info') return <InfoView step={step} onNext={onNext} />;
  if (step.t === 'quiz') return <QuizView step={step} onNext={onNext} />;
  if (step.t === 'puzzle') {
    const pz = puzzleById(step.id);
    if (!pz) return <button className="primary" onClick={onNext}>Continuar</button>;
    const side = pz.fen.split(' ')[1] === 'w' ? 'blancas' : 'negras';
    return <MoveExercise fen={pz.fen} goal={{ puzzle: pz.steps }} prompt={step.text ?? `Juegan ${side}. ${THEMES[pz.theme]?.label ?? ''}: encuentra la mejor jugada.`}
      concept={THEMES[pz.theme]?.hint} onDone={r => onExercise(r, pz)} />;
  }
  return <MoveExercise fen={step.fen} goal={step.goal} prompt={step.text} concept={step.hint} ok={step.ok} wrong={step.wrong} notes={step.notes} onDone={r => onExercise(r)} />;
}

function InfoView({ step, onNext }: { step: Extract<Step, { t: 'info' }>; onNext: () => void }) {
  const P = useMemo(() => parseFen(step.fen), [step.fen]);
  const from = step.showMoves ? sqIndex(step.showMoves) : null;
  const moves = useMemo(() => (from === null ? [] : gen({ ...P, t: P.b[from] && P.b[from] === P.b[from]!.toUpperCase() ? 'w' : 'b' }).filter(m => m.f === from)), [P, from]);
  // los movimientos ilegales (que dejan al rey en jaque) no se muestran
  const legalShown = useMemo(() => {
    if (from === null) return [];
    const side = P.b[from] === P.b[from]!.toUpperCase() ? 'w' : 'b';
    return moves.filter(m => { const copy = { ...P, b: P.b.slice(), t: side as 'w' | 'b' }; return legalCheck(copy, m); });
  }, [moves, P, from]);
  return (
    <div className="exercise">
      <div className="coach-line"><span className="coach-ava">{'♞︎'}</span><p>{step.text}</p></div>
      <div className="board-holder">
        <ChessBoard P={P} orientation="w" legalMoves={EMPTY} showMovesFrom={from} showMoves={legalShown} marks={step.marks?.map(sqIndex)} />
      </div>
      <div className="feedback neutral"><span /><button className="primary" onClick={onNext}>Continuar</button></div>
    </div>
  );
}

function legalCheck(P: ReturnType<typeof parseFen>, m: Move) { const side = P.t; const u = make(P, m); const ok = !inCheck(P, side); unmake(P, m, u); return ok; }

function QuizView({ step, onNext }: { step: Extract<Step, { t: 'quiz' }>; onNext: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const correct = picked === step.answer;
  const choose = (k: number) => {
    if (picked === step.answer) return;
    setPicked(k); setTries(t => t + 1);
    sfx(k === step.answer ? 'correct' : 'wrong');
  };
  return (
    <div className="quiz">
      <div className="coach-line"><span className="coach-ava">{'♞︎'}</span><p>{step.text}</p></div>
      <div className="quiz-options">
        {step.options.map((o, k) => (
          <button key={o} className={`quiz-opt${picked === k ? (k === step.answer ? ' good' : ' bad') : ''}`} onClick={() => choose(k)} disabled={correct}>{o}</button>
        ))}
      </div>
      {picked !== null && (
        <div className={`feedback ${correct ? 'good' : 'bad'}`} role="status">
          <div><strong>{correct ? (tries === 1 ? '¡Muy bien!' : '¡Ahora sí!') : 'Casi.'}</strong> <span>{correct ? step.explain ?? '' : 'Piénsalo otra vez y elige otra opción.'}</span></div>
          {correct && <button className="primary" onClick={onNext}>Continuar</button>}
        </div>
      )}
    </div>
  );
}
