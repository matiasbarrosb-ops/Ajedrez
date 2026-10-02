import { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout.tsx';
import { ToastHost } from './components/Toast.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { PlayPage } from './pages/PlayPage.tsx';
import { GamePage } from './pages/GamePage.tsx';
import { RoomPage } from './pages/RoomPage.tsx';
import { LearnPage, TrainPage, PuzzlesPage, GamesPage } from './pages/SectionPages.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { WelcomePage } from './pages/WelcomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { getFb } from './database/firebase.ts';
import { verifySavedUser } from './database/auth.ts';
import { sessionStore } from './database/session.ts';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    getFb().then(fb => {
      sessionStore.set(s => ({ ...s, firebase: fb ? 'listo' : 'no-configurado' }));
      if (fb) void verifySavedUser();
    });
  }, []);
  return (
    <HashRouter>
      <ScrollTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jugar" element={<PlayPage />} />
          <Route path="/partida" element={<GamePage />} />
          <Route path="/sala/:code" element={<RoomPage />} />
          <Route path="/aprender" element={<LearnPage />} />
          <Route path="/entrenar" element={<TrainPage />} />
          <Route path="/problemas" element={<PuzzlesPage />} />
          <Route path="/partidas" element={<GamesPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/bienvenida" element={<WelcomePage />} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
      <ToastHost />
    </HashRouter>
  );
}
