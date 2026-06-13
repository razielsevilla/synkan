import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';
import type { CeremonyType } from '../../types';
import { CheckCircle, Trash2, ArrowRight, Plus, MessageSquare } from 'lucide-react';

export const CeremoniesView: React.FC = () => {
  const { appState, localPeerId, addCeremonyNote, deleteCeremonyNote, updateWorkflow, updateSprint, addLog } = useAppState();
  
  const { workflow, sprints, roles } = appState;
  const myRole = roles[localPeerId] || 'DEV';
  const canManageState = myRole === 'PO' || myRole === 'SM';

  const activeSprint = sprints.find(s => s.id === workflow.activeSprintId);
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<CeremonyType>('daily');

  useEffect(() => {
    if (activeSprint && !selectedSprintId) {
      setSelectedSprintId(activeSprint.id);
    }
  }, [activeSprint, selectedSprintId]);

  // Sync tab with phase if viewing active sprint
  useEffect(() => {
    if (selectedSprintId === activeSprint?.id) {
      if (workflow.phase === 'planning') setActiveTab('planning');
      if (workflow.phase === 'active_sprint') setActiveTab('daily');
      if (workflow.phase === 'review') setActiveTab('review');
      if (workflow.phase === 'retro') setActiveTab('retro');
    }
  }, [workflow.phase, selectedSprintId, activeSprint?.id]);

  const currentSprint = sprints.find(s => s.id === selectedSprintId);

  // Form states
  const [simpleText, setSimpleText] = useState('');
  
  // Retro Form
  const [retroContent, setRetroContent] = useState('');
  const [retroColumn, setRetroColumn] = useState<'well' | 'improve' | 'action'>('well');

  const handlePostNote = () => {
    if (!currentSprint) return;
    
    const baseNote = {
      id: 'ceremony-' + Math.floor(Math.random() * 1000000),
      sprintId: currentSprint.id,
      type: activeTab,
      authorId: localPeerId,
      createdAt: new Date().toISOString()
    };

    if (activeTab === 'planning' || activeTab === 'review') {
      if (!simpleText.trim()) return;
      addCeremonyNote({ ...baseNote, content: simpleText.trim() });
      setSimpleText('');
    } else if (activeTab === 'retro') {
      if (!retroContent.trim()) return;
      const retroData = {
        column: retroColumn,
        text: retroContent.trim()
      };
      addCeremonyNote({ ...baseNote, content: JSON.stringify(retroData) });
      setRetroContent('');
    }
    
    addLog(`Posted ${activeTab} update to ${currentSprint.name}`, 'success');
  };

  const handleProceedToRetro = () => {
    if (!canManageState) return;
    updateWorkflow({ phase: 'retro' });
    addLog('Transitioned to Sprint Retrospective.', 'info');
  };

  const handleCompleteSprint = () => {
    if (!canManageState || !currentSprint) return;
    updateSprint({ ...currentSprint, status: 'closed', updatedAt: new Date().toLocaleTimeString() });
    updateWorkflow({ phase: 'initial_backlog', activeSprintId: null });
    addLog(`Sprint ${currentSprint.name} completed successfully.`, 'success');
  };

  const getAuthorAlias = (id: string) => {
    if (id === localPeerId) return 'Me';
    return appState.peers.find(p => p.id === id)?.alias || 'Unknown Peer';
  };

  const currentNotes = appState.ceremonyNotes.filter(n => n.sprintId === selectedSprintId && n.type === activeTab)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const isSprintClosed = currentSprint?.status === 'closed';
  const isActiveSprint = currentSprint?.id === workflow.activeSprintId;

  // Enforce read-only state based on phase
  const isReadOnly = isSprintClosed || (isActiveSprint && workflow.phase !== activeTab && !(workflow.phase === 'active_sprint' && activeTab === 'daily'));

  // Render Helpers
  const renderSimpleFeed = () => (
    <div className="space-y-4">
      {!isReadOnly && (
        <div className="flex gap-2">
          <textarea 
            className="brutal-input flex-1 min-h-[80px]"
            placeholder="Add your notes or updates..."
            value={simpleText}
            onChange={e => setSimpleText(e.target.value)}
          />
          <button onClick={handlePostNote} className="bg-brand-primary text-white font-bold px-4 rounded-xl border-2 border-brand-text shadow-brutal-sm hover:translate-y-[-2px] transition-transform">
            POST
          </button>
        </div>
      )}

      {isActiveSprint && activeTab === 'review' && workflow.phase === 'review' && canManageState && (
        <div className="flex justify-end border-t-2 border-brand-text pt-4 mt-4">
          <button onClick={handleProceedToRetro} className="bg-brand-text text-white px-6 py-3 rounded-xl border-2 border-brand-text shadow-brutal-sm font-black flex items-center gap-2 hover:translate-y-[-2px] transition-transform">
            PROCEED TO RETROSPECTIVE <ArrowRight size={16} />
          </button>
        </div>
      )}

      <div className="space-y-3 mt-6">
        {currentNotes.map(note => (
          <div key={note.id} className="bg-white border-2 border-brand-text p-4 rounded-xl shadow-brutal-sm relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs bg-brand-surface border border-brand-text px-2 py-0.5 rounded">{getAuthorAlias(note.authorId)}</span>
              <span className="text-[10px] font-mono text-zinc-500">{new Date(note.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-zinc-800 whitespace-pre-wrap">{note.content}</p>
            {note.authorId === localPeerId && !isSprintClosed && (
              <button onClick={() => deleteCeremonyNote(note.id)} className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDailyFeed = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-anton text-lg text-brand-text uppercase border-b-2 border-brand-text pb-2">Team Updates</h3>
        {currentNotes.length === 0 ? <p className="text-zinc-500 italic text-sm">No standups posted yet.</p> : null}
        {currentNotes.map(note => {
          let data = { done: '', doing: '', blockers: '' };
          try { data = JSON.parse(note.content); } catch (e) {}

          return (
            <div key={note.id} className="bg-white border-2 border-brand-text p-4 rounded-xl shadow-brutal-sm relative group">
              <div className="flex items-center justify-between mb-3 border-b border-zinc-100 pb-2">
                <span className="font-bold text-xs bg-brand-surface border border-brand-text px-2 py-0.5 rounded">{getAuthorAlias(note.authorId)}</span>
                <span className="text-[10px] font-mono text-zinc-500">{new Date(note.createdAt).toLocaleString()}</span>
              </div>
              <div className="space-y-2 text-sm">
                {data.done && <div><span className="font-bold text-brand-primary block text-xs">DONE</span><p className="text-zinc-700">{data.done}</p></div>}
                {data.doing && <div><span className="font-bold text-brand-accent block text-xs">DOING</span><p className="text-zinc-700">{data.doing}</p></div>}
                {data.blockers && <div><span className="font-bold text-red-500 block text-xs">BLOCKERS</span><p className="text-zinc-700">{data.blockers}</p></div>}
              </div>
              {note.authorId === localPeerId && !isSprintClosed && (
                <button onClick={() => deleteCeremonyNote(note.id)} className="absolute top-3 right-3 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRetroBoard = () => {
    const retroNotes = currentNotes.map(n => {
      try {
        const data = JSON.parse(n.content);
        return { ...n, column: data.column, text: data.text };
      } catch (e) {
        return { ...n, column: 'well', text: n.content };
      }
    });

    const columns = [
      { id: 'well', title: 'Went Well', color: 'bg-brand-primary' },
      { id: 'improve', title: 'To Improve', color: 'bg-brand-accent' },
      { id: 'action', title: 'Action Items', color: 'bg-zinc-700' }
    ] as const;

    return (
      <div className="space-y-6">
        {!isReadOnly && (
          <div className="flex gap-2">
            <select 
              className="brutal-input text-xs w-40" 
              value={retroColumn} 
              onChange={e => setRetroColumn(e.target.value as any)}
            >
              <option value="well">Went Well</option>
              <option value="improve">To Improve</option>
              <option value="action">Action Items</option>
            </select>
            <input 
              className="brutal-input flex-1 text-sm" 
              placeholder="Add an item..."
              value={retroContent}
              onChange={e => setRetroContent(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePostNote()}
            />
            <button onClick={handlePostNote} className="bg-brand-text text-white px-3 rounded-xl border-2 border-brand-text hover:translate-y-[-2px] transition-transform">
              <Plus size={16} />
            </button>
          </div>
        )}

        {isActiveSprint && activeTab === 'retro' && workflow.phase === 'retro' && canManageState && (
          <div className="flex justify-end border-b-2 border-brand-text pb-4 mb-4">
            <button onClick={handleCompleteSprint} className="bg-brand-accent text-white px-6 py-3 rounded-xl border-2 border-brand-text shadow-brutal-sm font-black flex items-center gap-2 hover:translate-y-[-2px] transition-transform">
              COMPLETE SPRINT <CheckCircle size={16} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(col => (
            <div key={col.id} className="bg-brand-bg border-2 border-brand-text rounded-xl p-3 min-h-[300px]">
              <div className="flex items-center gap-2 border-b-2 border-brand-text pb-2 mb-3">
                <span className={`w-3 h-3 rounded-full ${col.color}`}></span>
                <h4 className="font-anton text-brand-text uppercase">{col.title}</h4>
              </div>
              <div className="space-y-2">
                {retroNotes.filter(n => n.column === col.id).map(note => (
                  <div key={note.id} className="bg-white border-2 border-brand-text p-3 rounded-xl shadow-brutal-sm relative group text-sm">
                    <p className="text-zinc-800 pr-5 leading-snug">{note.text}</p>
                    <div className="mt-2 text-right">
                       <span className="text-[9px] font-mono font-bold text-zinc-400">{getAuthorAlias(note.authorId)}</span>
                    </div>
                    {note.authorId === localPeerId && !isSprintClosed && (
                      <button onClick={() => deleteCeremonyNote(note.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border-2 border-brand-text rounded-2xl shadow-brutal">
        <div>
          <h2 className="text-3xl font-anton text-brand-text leading-none uppercase flex items-center gap-2">
            <MessageSquare size={28} /> Scrum Ceremonies
          </h2>
          <p className="text-zinc-600 text-xs font-medium mt-1">Plan, sync, review, and retrospect with your team.</p>
        </div>
        <div>
          <select 
            className="brutal-input text-sm font-bold bg-brand-bg"
            value={selectedSprintId}
            onChange={e => setSelectedSprintId(e.target.value)}
          >
            <option value="" disabled>Select a Sprint...</option>
            {sprints.map(s => (
              <option key={s.id} value={s.id}>{s.name} {s.status === 'active' ? '(Active)' : s.status === 'closed' ? '(Closed)' : '(Planning)'}</option>
            ))}
          </select>
        </div>
      </div>

      {!currentSprint ? (
        <div className="bg-white border-2 border-brand-text p-12 text-center rounded-2xl shadow-brutal">
          <p className="text-zinc-500 font-bold">Please select a sprint to view ceremonies.</p>
        </div>
      ) : (
        <div className="bg-white border-2 border-brand-text rounded-2xl shadow-brutal-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* Tabs Sidebar */}
          <div className="w-full md:w-48 bg-brand-bg border-b-2 md:border-b-0 md:border-r-2 border-brand-text flex flex-row md:flex-col p-2 gap-2 overflow-x-auto">
            {(['planning', 'daily', 'review', 'retro'] as CeremonyType[]).map(type => {
              // Hide tabs if they are in the future for the active sprint
              if (isActiveSprint) {
                if (workflow.phase === 'planning' && type !== 'planning') return null;
                if (workflow.phase === 'active_sprint' && (type === 'review' || type === 'retro')) return null;
                if (workflow.phase === 'review' && type === 'retro') return null;
              }

              return (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-4 py-3 text-left font-bold text-sm rounded-xl transition-all whitespace-nowrap ${
                    activeTab === type 
                      ? 'bg-brand-surface border-2 border-brand-text shadow-brutal-sm' 
                      : 'border-2 border-transparent text-zinc-500 hover:bg-zinc-200'
                  }`}
                >
                  {type === 'planning' && 'Sprint Planning'}
                  {type === 'daily' && 'Daily Standup'}
                  {type === 'review' && 'Sprint Review'}
                  {type === 'retro' && 'Retrospective'}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6">
            <div className="mb-6 border-b-2 border-brand-text pb-2">
               <h3 className="text-2xl font-anton text-brand-text uppercase">
                 {activeTab === 'planning' && 'Sprint Planning'}
                 {activeTab === 'daily' && 'Daily Standup'}
                 {activeTab === 'review' && 'Sprint Review'}
                 {activeTab === 'retro' && 'Sprint Retrospective'}
               </h3>
               <p className="text-xs text-zinc-500 font-mono mt-1">{currentSprint.name} • {currentSprint.goal}</p>
            </div>

            {/* Sprint Summary Block */}
            {activeTab === 'planning' && (
              <details className="mb-6 bg-brand-bg border-2 border-brand-text rounded-xl shadow-brutal-sm group">
                <summary className="p-3 font-anton text-sm uppercase text-brand-text cursor-pointer list-none flex justify-between items-center hover:bg-zinc-100 transition-colors">
                <span>📦 Sprint Backlog Summary ({appState.cards.filter(c => c.sprintId === selectedSprintId).length} Tasks)</span>
                <span className="text-[10px] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="p-4 border-t-2 border-brand-text bg-white">
                {(() => {
                  const sprintCards = appState.cards.filter(c => c.sprintId === selectedSprintId);
                  const sprintEpics = appState.epics.filter(e => sprintCards.some(c => c.epicId === e.id));
                  const uncategorizedCards = sprintCards.filter(c => !c.epicId);

                  if (sprintCards.length === 0) {
                    return <p className="text-xs text-zinc-500 italic">No tasks included in this sprint yet.</p>;
                  }

                  return (
                    <div className="space-y-4">
                      {sprintEpics.map(epic => {
                        const epicCards = sprintCards.filter(c => c.epicId === epic.id);
                        return (
                          <div key={epic.id}>
                            <h5 className="text-xs font-bold text-brand-text flex items-center gap-1"><span className="text-[10px]">👑</span> {epic.title}</h5>
                            <ul className="mt-1 pl-5 list-disc text-xs text-zinc-700 space-y-1 font-medium">
                              {epicCards.map(card => (
                                <li key={card.id}>{card.title} {card.storyPoints ? <span className="font-bold text-[9px] bg-zinc-100 px-1 border border-zinc-300 rounded-sm">{card.storyPoints} pts</span> : ''}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                      
                      {uncategorizedCards.length > 0 && (
                        <div>
                           <h5 className="text-xs font-bold text-brand-text flex items-center gap-1"><span className="text-[10px]">📁</span> Uncategorized Tasks</h5>
                           <ul className="mt-1 pl-5 list-disc text-xs text-zinc-700 space-y-1 font-medium">
                             {uncategorizedCards.map(card => (
                               <li key={card.id}>{card.title} {card.storyPoints ? <span className="font-bold text-[9px] bg-zinc-100 px-1 border border-zinc-300 rounded-sm">{card.storyPoints} pts</span> : ''}</li>
                             ))}
                           </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              </details>
            )}

            {(activeTab === 'planning' || activeTab === 'review') && renderSimpleFeed()}
            {activeTab === 'daily' && renderDailyFeed()}
            {activeTab === 'retro' && renderRetroBoard()}
          </div>
          
        </div>
      )}
    </div>
  );
};
