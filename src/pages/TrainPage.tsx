/* Entrenar: repaso espaciado, práctica por tema según tus resultados, y finales. */
import { Link } from 'react-router-dom';
import { useStore } from '../database/store.ts';
import { dueReviews, progressStore, skills } from '../profile/progress.ts';
import { THEMES, themeLabel } from '../problems/bank.ts';
import { lessonById } from '../lessons/data.ts';
import { Icon } from '../components/Icon.tsx';

export function TrainPage() {
  const p = useStore(progressStore);
  const due = dueReviews(p);
  const sk = skills(p);
  const weakest = sk.find(s => s.pct < 70);
  const upcoming = Object.values(p.review).length - due.length;
  const endgames = ['coronar', 'reydama', 'dostorres'].map(id => lessonById(id)!).filter(Boolean);
  return (
    <div className="page">
      <h1 className="page-title">Entrenar</h1>
      <p className="muted lead">Practica justo lo que más te cuesta. Los problemas que fallas vuelven mañana, y si los aciertas, en 3, 7, 14 y 30 días.</p>

      <section className="card-block">
        <div className="card-h"><h2>Repaso de errores</h2><span className="pill">{due.length} hoy</span></div>
        {due.length
          ? <><p className="muted small">{due.length} problema{due.length === 1 ? '' : 's'} para repasar hoy{upcoming > 0 ? ` · ${upcoming} más en los próximos días` : ''}.</p><Link className="primary" to="/problema?modo=repaso">Empezar repaso</Link></>
          : <p className="muted small">{upcoming > 0 ? `No hay repasos para hoy. Tienes ${upcoming} programados para los próximos días.` : 'Cuando falles un problema o uses pistas, aparecerá aquí para repasarlo.'}</p>}
      </section>

      <section className="card-block">
        <h2>Recomendado para ti</h2>
        {weakest
          ? <><p>Tu tema más débil es <strong>{themeLabel(weakest.theme)}</strong>: aciertas {weakest.pct}% sin pistas en tus últimos intentos.</p><Link className="primary" to={`/problema?tema=${weakest.theme}`}>Practicar {themeLabel(weakest.theme).toLowerCase()}</Link></>
          : <p className="muted small">Resuelve al menos 5 problemas de un tema y aquí verás qué te conviene practicar.</p>}
        {sk.length > 0 && (
          <div className="skill-list">
            {sk.slice().sort((a, b) => b.pct - a.pct).map(s => (
              <div key={s.theme} className="skill">
                <span>{themeLabel(s.theme)}</span>
                <div className="bar"><div style={{ width: `${s.pct}%` }} className={s.pct >= 75 ? 'good' : s.pct <= 55 ? 'bad' : ''} /></div>
                <span className="muted small">{s.pct}%</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card-block">
        <h2>Práctica por tema</h2>
        <div className="theme-grid">
          {Object.entries(THEMES).map(([k, t]) => <Link key={k} to={`/problema?tema=${k}`} className="theme-card"><strong>{t.label}</strong><span className="muted small">{t.concept}</span></Link>)}
        </div>
      </section>

      <section className="card-block">
        <h2>Finales contra el motor</h2>
        <div className="theme-grid">
          {endgames.map(l => (
            <Link key={l.id} to={`/leccion/${l.id}`} className="theme-card">
              <strong>{l.title}</strong><span className="muted small">{p.lessons[l.id] ? `Completada ${'★'.repeat(p.lessons[l.id].stars)}` : l.summary[0]}</span>
            </Link>
          ))}
        </div>
      </section>
      <Link className="link" to="/aprender"><Icon name="learn" size={16} /> Ver todas las lecciones</Link>
    </div>
  );
}
