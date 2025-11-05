import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Tasks } from './pages/Tasks';
import { AskAI } from './pages/AskAI';
import { WelcomeTransition } from './components/WelcomeTransition';
import { GoalTracker } from './components/GoalTracker';
import { storage } from './utils/storage';

function App() {
  const isOnboarded = storage.isOnboarded();
  const [showWelcome, setShowWelcome] = useState(isOnboarded && !storage.isWelcomeShown());

  const handleWelcomeComplete = () => {
    storage.setWelcomeShown();
    setShowWelcome(false);
  };

  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait">
            {showWelcome && <WelcomeTransition onComplete={handleWelcomeComplete} />}
          </AnimatePresence>
          <Routes>
            {!isOnboarded ? (
              <>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="*" element={<Navigate to="/onboarding" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
                <Route path="/goals" element={<Layout><GoalTracker /></Layout>} />
                <Route path="/ai" element={<Layout><AskAI /></Layout>} />
                <Route path="/onboarding" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
