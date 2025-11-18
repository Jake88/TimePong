import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { GameProvider } from '@/context/GameContext';
import HomePage from '@/pages/HomePage';
import GamePage from '@/pages/GamePage';
import CardListPage from '@/pages/CardListPage';
import { theme } from '@/theme';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.primaryBackgroundColor};
  font-family: ${theme.fontFamily};
`;

function App() {
  return (
    <GameProvider>
      <Router>
        <AppContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/cards" element={<CardListPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppContainer>
      </Router>
    </GameProvider>
  );
}

export default App;
