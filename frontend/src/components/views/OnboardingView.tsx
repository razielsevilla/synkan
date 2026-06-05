import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';

export const OnboardingView: React.FC = () => {
  const { setBoardAndAlias, addLog } = useAppState();
  
  const [mode, setMode] = useState<'SELECT' | 'CREATE' | 'JOIN'>('SELECT');
  const [alias, setAlias] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [boardName, setBoardName] = useState('');

  const handleCreate = () => {
    if (!alias.trim()) {
      addLog('Please enter your name.', 'error');
      return;
    }
    const finalBoardName = boardName.trim() || 'Untitled Board';
    // Generate a random board ID
    const newBoardId = 'board_' + Math.random().toString(36).substring(2, 15);
    setBoardAndAlias(newBoardId, alias.trim(), finalBoardName);
    addLog(`Created new board: ${newBoardId}`, 'success');
  };

  const handleJoin = () => {
    if (!alias.trim() || !inviteCode.trim()) {
      addLog('Please enter your name and the invite code.', 'error');
      return;
    }
    setBoardAndAlias(inviteCode.trim(), alias.trim());
    addLog(`Joined board: ${inviteCode}`, 'success');
  };

  return (
    <div className="fixed inset-0 bg-brand-bg flex items-center justify-center p-4 z-50">
      <div className="max-w-md w-full bg-white border-4 border-brand-text shadow-brutal p-8 rounded-2xl flex flex-col items-center">
        
        <div className="w-16 h-16 bg-brand-primary border-2 border-brand-text flex items-center justify-center font-anton text-3xl text-brand-text shadow-brutal-sm rounded-xl mb-6">
          S
        </div>
        <h1 className="text-4xl font-anton text-brand-text mb-2 text-center">WELCOME TO SYNKAN</h1>
        <p className="text-zinc-600 text-sm font-medium text-center mb-8">
          The local-first, peer-to-peer Kanban board. No cloud, no logins.
        </p>

        {mode === 'SELECT' && (
          <div className="w-full space-y-4">
            <button 
              onClick={() => setMode('CREATE')}
              className="w-full py-4 bg-brand-primary text-white font-anton text-xl rounded-xl border-2 border-brand-text shadow-brutal-sm hover:translate-y-[-2px] transition-transform"
            >
              CREATE NEW BOARD
            </button>
            <button 
              onClick={() => setMode('JOIN')}
              className="w-full py-4 bg-white text-brand-text font-anton text-xl rounded-xl border-2 border-brand-text shadow-brutal-sm hover:translate-y-[-2px] transition-transform"
            >
              JOIN EXISTING BOARD
            </button>
          </div>
        )}

        {(mode === 'CREATE' || mode === 'JOIN') && (
          <div className="w-full space-y-5 animate-fade-in text-left">
            <div>
              <label className="text-xs font-mono font-bold text-zinc-500 uppercase block mb-2">
                Your Display Name
              </label>
              <input 
                type="text" 
                placeholder="e.g. Alice"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                className="w-full border-2 border-brand-text p-3 rounded-xl bg-white font-bold"
                autoFocus
              />
            </div>

            {mode === 'CREATE' && (
              <div>
                <label className="text-xs font-mono font-bold text-zinc-500 uppercase block mb-2">
                  Board Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Project Alpha"
                  value={boardName}
                  onChange={e => setBoardName(e.target.value)}
                  className="w-full border-2 border-brand-text p-3 rounded-xl bg-white font-bold"
                />
              </div>
            )}

            {mode === 'JOIN' && (
              <div>
                <label className="text-xs font-mono font-bold text-zinc-500 uppercase block mb-2">
                  Board Invite Code
                </label>
                <input 
                  type="text" 
                  placeholder="Paste invite code here"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  className="w-full border-2 border-brand-text p-3 rounded-xl bg-white font-mono text-sm"
                />
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <button 
                onClick={() => setMode('SELECT')}
                className="flex-1 py-3 bg-zinc-200 text-brand-text font-bold rounded-xl border-2 border-brand-text hover:bg-zinc-300"
              >
                BACK
              </button>
              <button 
                onClick={mode === 'CREATE' ? handleCreate : handleJoin}
                className="flex-1 py-3 bg-brand-primary text-white font-anton text-lg rounded-xl border-2 border-brand-text shadow-brutal-sm hover:translate-y-[-1px]"
              >
                {mode === 'CREATE' ? 'CREATE' : 'JOIN'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
