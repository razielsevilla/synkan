import React from 'react';
import { useAppState } from '../../context/AppStateContext';

export type TabType = 'board' | 'mesh' | 'journal' | 'database';

interface SidebarProps {
  currentTab: TabType;
  setTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab }) => {
  const { localPeerId, addLog } = useAppState();

  const handleTabChange = (tab: TabType) => {
    setTab(tab);
    addLog(`Switched app screen to "${tab.toUpperCase()}"`, 'info');
  };

  const tabs = [
    { id: 'board', icon: '📁', label: 'Workspace Board' },
    { id: 'mesh', icon: '🕸️', label: 'Connect & Sync' },
    { id: 'journal', icon: '📓', label: 'History & Trash' },
    { id: 'database', icon: '💾', label: 'Data & Storage' }
  ] as const;

  return (
    <aside className="w-16 md:w-64 border-r-4 border-brand-text bg-white flex flex-col justify-between z-20">
      <nav className="p-3 space-y-2">
        <div className="hidden md:block px-3 py-2 text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider">
          My Workspace
        </div>
        
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl border-2 text-left transition-all ${
                isActive ? 'border-brand-text bg-brand-surface shadow-brutal-sm' : 'border-transparent hover:bg-brand-bg'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className={`font-bold text-sm hidden md:inline tracking-wide font-sans ${isActive ? 'text-brand-text' : 'text-zinc-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t-2 border-brand-text bg-brand-bg hidden md:block">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
          <span className="text-[10px] font-mono font-bold text-zinc-500">YOUR DEVICE ID</span>
        </div>
        <div className="text-xs font-mono font-bold text-brand-text mt-1 break-all truncate" title={localPeerId}>
          {localPeerId || 'Identifying Device...'}
        </div>
      </div>
    </aside>
  );
};
