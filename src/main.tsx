import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import App from './App.tsx';
import { loadLichess } from './problems/bank.ts';
import './lib/voice.ts'; // prepara la voz y la desbloquea con el primer toque

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
// el banco grande de problemas se baja en segundo plano apenas abre la app
void loadLichess();

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
