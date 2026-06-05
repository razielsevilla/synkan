import React from 'react';
import { useAppState } from '../../context/AppStateContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { appState, clearWarnings } = useAppState();

  return (
    <div 
      className={`fixed top-16 right-0 bottom-0 w-80 bg-white border-l-4 border-brand-text z-40 shadow-brutal-lg transform transition-transform duration-300 ease-in-out p-4 flex flex-col justify-between ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-brand-text pb-2">
          <h4 className="text-lg font-anton text-brand-text">System Alerts</h4>
          <button onClick={onClose} className="text-xs font-mono font-bold text-zinc-400 hover:text-brand-text">✕</button>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          {appState.warnings.length === 0 ? (
             <div className="text-xs text-zinc-400 font-mono italic">No active security alerts or data conflicts. Systems nominal.</div>
          ) : (
            appState.warnings.map(warning => (
              <div key={warning.id} className="p-3 bg-brand-accent/10 border-l-4 border-brand-accent rounded text-left">
                 <div className="text-[10px] text-brand-accent font-bold mb-1">{warning.timestamp}</div>
                 <div className="text-xs font-medium text-brand-text leading-tight">{warning.message}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <button onClick={clearWarnings} className="w-full py-2 bg-brand-text text-white font-mono text-[10px] uppercase font-bold rounded-lg border border-brand-text">
        Clear Warnings
      </button>
    </div>
  );
};
