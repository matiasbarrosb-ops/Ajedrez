/* Secciones que se completan en las próximas etapas. Muestran qué van a tener. */

import { Icon, type IconName } from '../components/Icon.tsx';

function Soon({ title, icon, lead, items }: { title: string; icon: IconName; lead: string; items: string[] }) {
  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      <section className="card-block soon-block">
        <div className="soon-ico"><Icon name={icon} size={28} /></div>
        <p>{lead}</p>
        <ul className="soon-list">{items.map(i => <li key={i}><Icon name="check" size={16} />{i}</li>)}</ul>
        <span className="pill">Próximamente</span>
      </section>
    </div>
  );
}

const LEVELS = [
  { name: 'Principiante', topics: ['Cómo se mueve cada pieza', 'Jaque y jaque mate', 'Enroque', 'Coronación', 'Captura al paso', 'Valor de las piezas', 'Desarrollo y control del centro'] },
  { name: 'Intermedio', topics: ['Clavadas', 'Ataques dobles', 'Descubiertos', 'Desviación y atracción', 'Eliminación del defensor', 'Sobrecarga', 'Sacrificios', 'Estructuras de peones', 'Finales básicos'] },
  { name: 'Avanzado', topics: ['Cálculo', 'Estrategia y planes', 'Profilaxis', 'Finales complejos', 'Evaluación de posiciones'] }
];

export function LearnPage() {
  return (
    <div className="page">
      <h1 className="page-title">Aprender</h1>
      <p className="muted lead">Lecciones cortas e interactivas: explicación, ejemplo en el tablero, ejercicio con pistas y resumen. Se desbloquean paso a paso.</p>
      {LEVELS.map(l => (
        <section key={l.name} className="card-block">
          <div className="card-h"><h2>{l.name}</h2><span className="pill">Próximamente</span></div>
          <div className="topic-chips">{l.topics.map(t => <span key={t} className="topic"><Icon name="lock" size={14} />{t}</span>)}</div>
        </section>
      ))}
    </div>
  );
}

export const TrainPage = () => (
  <Soon title="Entrenar" icon="train" lead="Practica justo lo que más te cuesta, a partir de tus propios errores."
    items={['Repaso de errores de tus partidas y problemas', 'Repetición espaciada: mañana, en 3, 7, 14 y 30 días', 'Práctica por tema: mates, clavadas, ataques dobles, finales', 'Recomendaciones según tus resultados']} />
);
export const PuzzlesPage = () => (
  <Soon title="Problemas" icon="puzzle" lead="Encuentra la mejor jugada. Cada problema tiene tema, dificultad y rating."
    items={['Rating de problemas que sube y baja con tus aciertos', 'Temas: mate en 1 y 2, ataque doble, clavada, ganar material, finales', 'Tres pistas antes de ver la solución', 'Problema del día y racha']} />
);
export const GamesPage = () => (
  <Soon title="Partidas" icon="games" lead="Tu historial completo, para revisar y aprender de cada partida."
    items={['Fecha, rival, resultado, ritmo, apertura y precisión', 'Visor para recorrer jugada por jugada', 'Análisis con tu jugada y la mejor', 'Convertir errores en ejercicios']} />
);

