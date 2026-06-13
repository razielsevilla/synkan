import React from 'react';
import { useAppState } from '../../context/AppStateContext';

export type TabType = 'board' | 'backlog' | 'ceremonies' | 'analytics' | 'mesh' | 'journal' | 'database';

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
    { id: 'board', icon: '🏃', label: 'Active Sprint' },
    { id: 'backlog', icon: '📋', label: 'Backlog & Plan' },
    { id: 'ceremonies', icon: '📅', label: 'Scrum Ceremonies' },
    { id: 'analytics', icon: '📈', label: 'Metrics & Charts' },
    { id: 'mesh', icon: '🕸️', label: 'Connect & Sync' },
    { id: 'journal', icon: '📓', label: 'History & Trash' },
    { id: 'database', icon: '💾', label: 'Data & Storage' }
  ] as const;

  return (
    <aside className="fixed bottom-0 left-0 w-full md:relative md:w-64 border-t-4 md:border-t-0 md:border-r-4 border-brand-text bg-white flex flex-col justify-between z-20 pb-2 md:pb-0">
      <nav className="flex flex-row md:flex-col overflow-x-auto p-2 md:p-3 space-x-2 md:space-x-0 md:space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center md:items-stretch">
        <div className="hidden md:block px-3 py-2 text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider flex-shrink-0">
          My Workspace
        </div>
        
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-shrink-0 flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-xl border-2 transition-all ${
                isActive ? 'border-brand-text bg-brand-surface shadow-brutal-sm' : 'border-transparent hover:bg-brand-bg'
              }`}
              title={tab.label}
            >
              <span className="text-2xl md:text-lg leading-none">{tab.icon}</span>
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
