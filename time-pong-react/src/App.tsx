import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from '@/context/GameContext';
import HomePage from '@/pages/HomePage';
import GamePage from '@/pages/GamePage';
import CardListPage from '@/pages/CardListPage';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-[var(--primary-bg)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/cards" element={<CardListPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
