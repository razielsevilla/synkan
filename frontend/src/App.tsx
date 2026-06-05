import { useState, useEffect } from 'react';
import { AppStateProvider } from './context/AppStateContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import type { TabType } from './components/layout/Sidebar';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { BoardView } from './components/views/BoardView';
import { MeshView } from './components/views/MeshView';
import { JournalView } from './components/views/JournalView';
import { DatabaseView } from './components/views/DatabaseView';
import { OnboardingView } from './components/views/OnboardingView';
import { TutorialModal } from './components/modals/TutorialModal';
import { useAppState } from './context/AppStateContext';

function AppContent() {
  const { activeRoom } = useAppState();
  const [currentTab, setCurrentTab] = useState<TabType>('board');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (activeRoom) {
      const hasSeenTutorial = localStorage.getItem('synkan_has_seen_tutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    }
  }, [activeRoom]);

  const closeTutorial = () => {
    localStorage.setItem('synkan_has_seen_tutorial', 'true');
    setShowTutorial(false);
  };

  if (!activeRoom) {
    return <OnboardingView />;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <Header onToggleNotif={() => setIsNotifOpen(!isNotifOpen)} />
      
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar currentTab={currentTab} setTab={setCurrentTab} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 relative focus:outline-none bg-brand-bg">
          {currentTab === 'board' && <BoardView />}
          {currentTab === 'mesh' && <MeshView />}
          {currentTab === 'journal' && <JournalView />}
          {currentTab === 'database' && <DatabaseView />}
        </main>

        <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        <TutorialModal isOpen={showTutorial} onClose={closeTutorial} onChangeTab={setCurrentTab} />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}

export default App;
