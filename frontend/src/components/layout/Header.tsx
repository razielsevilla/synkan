import React from 'react';
import { useAppState } from '../../context/AppStateContext';

interface HeaderProps {
  onToggleNotif: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleNotif }) => {
  const { appState } = useAppState();

  return (
    <header className="h-16 border-b-4 border-brand-text bg-white flex items-center justify-between px-4 sm:px-6 z-30">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-brand-surface border-2 border-brand-text flex items-center justify-center shadow-brutal-sm">
          <span className="font-anton text-xl text-brand-text">S</span>
        </div>
        <div>
          <span className="font-anton text-2xl tracking-wide text-brand-text hidden sm:inline-block">Synkan</span>
          <span className="font-anton text-2xl tracking-wide text-brand-text inline-block sm:hidden">S</span>
          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded border border-brand-text text-[9px] font-mono bg-brand-surface font-bold text-brand-text">SECURE & PRIVATE</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-6">
        <div className="flex items-center space-x-2 bg-brand-bg border-2 border-brand-text px-3 py-1 rounded-lg text-xs font-mono font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-brand-text"></span>
          <span className="text-brand-text hidden md:inline">DIRECT SYNC IS LIVE</span>
          <span className="text-brand-text md:hidden">SYNC ON</span>
        </div>
        <div className="hidden lg:flex items-center space-x-2 font-mono text-[11px] text-zinc-500">
          <span>ACTIVE TEAMMATES: <strong className="text-brand-primary">{appState.peers.length} Connected</strong></span>
          <span className="text-brand-text">|</span>
          <span>LAST SAVED: <strong className="text-brand-accent">Just Now</strong></span>
        </div>
        
        <button onClick={onToggleNotif} className="relative p-2 rounded-lg border-2 border-brand-text hover:bg-brand-bg transition-colors" title="View Recent Safety Warnings & Notices">
          <svg className="w-5 h-5 text-brand-text" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {appState.warnings.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-accent border border-brand-text text-[9px] text-white font-extrabold flex items-center justify-center rounded-full">
              {appState.warnings.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
