/* Aprender: camino de lecciones por nivel, estilo paso a paso. */
import { Link } from 'react-router-dom';
import { UNITS, type Level } from '../lessons/data.ts';
import { useStore } from '../database/store.ts';
import { progressStore } from '../profile/progress.ts';
import { glyph } from '../components/pieces.ts';
import { Icon } from '../components/Icon.tsx';
import { useState } from 'react';
import { local } from '../lib/storage.ts';

const LEVELS: Level[] = ['Tácticas', 'Aperturas', 'Principiante', 'Intermedio', 'Avanzado'];
/** en Tácticas y Aperturas todas las lecciones están abiertas: eliges el tema que quieras practicar */
const FREE: Level[] = ['Tácticas', 'Aperturas'];
const INTRO: Partial<Record<Level, string>> = {
  'Tácticas': 'Cada lección enseña una táctica y te da 5 problemas de partidas reales, de más fácil a más difícil.',
  'Aperturas': 'Las tácticas y trampas típicas de cada apertura, con problemas de partidas que empezaron así.'
};

export function LearnPage() {
  const p = useStore(progressStore);
  const [level, setLevel] = useState<Level>(() => { const l = local.get<Level>('jm-learn-level2', 'Tácticas'); return LEVELS.includes(l) ? l : 'Tácticas'; });
  const pick = (l: Level) => { setLevel(l); local.set('jm-learn-level2', l); };
  const units = UNITS.filter(u => u.level === level);
  const all = units.flatMap(u => u.lessons);
  const doneCount = all.filter(l => p.lessons[l.id]).length;
  // dentro de cada nivel se avanza en orden: abierta = completada o la primera sin completar
  const firstOpen = all.findIndex(l => !p.lessons[l.id]);

  return (
    <div className="page">
      <h1 className="page-title">Aprender</h1>
      <div className="level-tabs" role="tablist">
        {LEVELS.map(l => {
          const ls = UNITS.filter(u => u.level === l).flatMap(u => u.lessons);
          const d = ls.filter(x => p.lessons[x.id]).length;
          return (
            <button key={l} role="tab" aria-selected={level === l} className={level === l ? 'on' : ''} onClick={() => pick(l)}>
              {l}<small>{d}/{ls.length}</small>
            </button>
          );
        })}
      </div>
      <div className="level-progress"><div style={{ width: `${(100 * doneCount) / Math.max(1, all.length)}%` }} /></div>
      {INTRO[level] && <p className="muted small">{INTRO[level]}</p>}

      {units.map(u => (
        <section key={u.id} className="unit">
          <header className="unit-h">
            <div><span className="label">{u.level}</span><h2>{u.title}</h2><p className="muted small">{u.desc}</p></div>
          </header>
          <div className="path">
            {u.lessons.map(l => {
              const idx = all.findIndex(x => x.id === l.id);
              const done = p.lessons[l.id];
              const open = FREE.includes(level) || done || idx === firstOpen || firstOpen === -1;
              const current = idx === firstOpen;
              const offset = [0, 1, 2, 1, 0, -1, -2, -1][idx % 8];
              return (
                <div key={l.id} className="path-row" style={{ ['--off' as string]: offset }}>
                  {open ? (
                    <Link to={`/leccion/${l.id}`} className={`node${done ? ' done' : ''}${current ? ' current' : ''}`} aria-label={`${l.title}${done ? ', completada' : ''}`}>
                      <span className="node-glyph">{glyph(l.glyph)}</span>
                      {done && <span className="stars">{'★'.repeat(done.stars)}{'☆'.repeat(3 - done.stars)}</span>}
                    </Link>
                  ) : (
                    <span className="node locked" aria-label={`${l.title}, bloqueada`}><Icon name="lock" size={22} /></span>
                  )}
                  <span className={`node-label${open ? '' : ' muted'}`}>{l.title}{current && <em>Siguiente</em>}</span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
