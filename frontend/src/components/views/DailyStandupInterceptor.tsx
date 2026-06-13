import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CheckCircle, Calendar as CalendarIcon, AlertTriangle, Clock } from 'lucide-react';

export const DailyStandupInterceptor: React.FC = () => {
  const { appState, localPeerId, addCeremonyNote, addLog } = useAppState();
  
  const [dailyDone, setDailyDone] = useState('');
  const [dailyDoing, setDailyDoing] = useState('');
  const [dailyBlockers, setDailyBlockers] = useState('');
  const [needsStandup, setNeedsStandup] = useState(false);

  useEffect(() => {
    if (appState.workflow.phase !== 'active_sprint' || !appState.workflow.activeSprintId) {
      setNeedsStandup(false);
      return;
    }

    const today = new Date().toDateString();
    
    // Check if the user has already submitted a daily standup today for this sprint
    const hasSubmittedToday = appState.ceremonyNotes.some(note => {
      const isDaily = note.type === 'daily';
      const isMine = note.authorId === localPeerId;
      const isThisSprint = note.sprintId === appState.workflow.activeSprintId;
      const isCreatedToday = new Date(note.createdAt).toDateString() === today;
      
      return isDaily && isMine && isThisSprint && isCreatedToday;
    });

    setNeedsStandup(!hasSubmittedToday);
  }, [appState.workflow.phase, appState.workflow.activeSprintId, appState.ceremonyNotes, localPeerId]);

  if (!needsStandup) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyDone.trim() && !dailyDoing.trim() && !dailyBlockers.trim()) return;

    const dailyData = {
      done: dailyDone.trim(),
      doing: dailyDoing.trim(),
      blockers: dailyBlockers.trim()
    };

    addCeremonyNote({
      id: 'ceremony-' + Math.floor(Math.random() * 1000000),
      sprintId: appState.workflow.activeSprintId!,
      type: 'daily',
      content: JSON.stringify(dailyData),
      authorId: localPeerId,
      createdAt: new Date().toISOString()
    });
    
    addLog('Daily Standup submitted.', 'success');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg p-4 backdrop-blur-md">
      <div className="bg-white border-4 border-brand-text rounded-3xl shadow-brutal w-full max-w-xl animate-in slide-in-from-bottom-8 duration-500">
        
        <div className="bg-brand-accent p-6 border-b-4 border-brand-text rounded-t-[20px] text-brand-text text-center">
          <Clock size={48} className="mx-auto mb-3" />
          <h2 className="text-4xl font-anton uppercase leading-none mb-2">Time for Standup!</h2>
          <p className="font-bold text-sm">Before you can access the sprint board, please provide your daily update.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-black text-brand-text flex items-center gap-2 mb-2 uppercase tracking-wide">
                <CheckCircle size={14} className="text-brand-primary" /> What did you do since the last update?
              </label>
              <input 
                autoFocus
                className="brutal-input text-sm w-full" 
                value={dailyDone} 
                onChange={e => setDailyDone(e.target.value)} 
                placeholder="e.g., Completed the login API..." 
              />
            </div>
            
            <div>
              <label className="text-xs font-black text-brand-text flex items-center gap-2 mb-2 uppercase tracking-wide">
                <CalendarIcon size={14} className="text-brand-accent" /> What will you do today?
              </label>
              <input 
                className="brutal-input text-sm w-full" 
                value={dailyDoing} 
                onChange={e => setDailyDoing(e.target.value)} 
                placeholder="e.g., Working on the dashboard UI..." 
              />
            </div>
            
            <div>
              <label className="text-xs font-black text-brand-text flex items-center gap-2 mb-2 uppercase tracking-wide">
                <AlertTriangle size={14} className="text-red-500" /> Any blockers?
              </label>
              <input 
                className="brutal-input text-sm w-full" 
                value={dailyBlockers} 
                onChange={e => setDailyBlockers(e.target.value)} 
                placeholder="e.g., Waiting on design assets..." 
              />
            </div>

            <button 
              type="submit"
              disabled={!dailyDone.trim() && !dailyDoing.trim() && !dailyBlockers.trim()}
              className="w-full mt-6 bg-brand-text text-white font-black text-lg py-4 rounded-xl border-4 border-transparent hover:border-brand-primary hover:bg-brand-bg hover:text-brand-text hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              SUBMIT UPDATE TO UNLOCK BOARD
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
