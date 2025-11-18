import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { GameProvider } from '@/context/GameContext';
import { SettingsProvider } from '@/context/SettingsContext';
import AppDrawer from '@/components/AppDrawer';
import HomePage from '@/pages/HomePage';
import GamePage from '@/pages/GamePage';
import CardListPage from '@/pages/CardListPage';
import SettingsPage from '@/pages/SettingsPage';
import NoBallModePage from '@/pages/NoBallModePage';
import { theme } from '@/theme';

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${theme.primaryBackgroundColor};
  font-family: ${theme.fontFamily};
  transform: translate3d(0, 0, 0);
`;

function App() {
  return (
    <SettingsProvider>
      <GameProvider>
        <Router>
          <AppContainer>
            <AppDrawer>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/no-ball" element={<NoBallModePage />} />
                <Route path="/cards" element={<CardListPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppDrawer>
          </AppContainer>
        </Router>
      </GameProvider>
    </SettingsProvider>
  );
}

export default App;
