import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../ui/Card';
import type { Card as CardType, ColumnType } from '../../types';
import { CreateCardModal } from '../modals/CreateCardModal';
import { CardDetailModal } from '../modals/CardDetailModal';
import { Lock, ArrowRight } from 'lucide-react';

const COLUMNS: { id: ColumnType; title: string; colorClass: string; dotClass: string }[] = [
  { id: 'backlog', title: 'Task Pool', colorClass: 'bg-brand-primary', dotClass: 'bg-brand-primary' },
  { id: 'ready', title: 'Up Next', colorClass: 'bg-brand-accent', dotClass: 'bg-brand-accent' },
  { id: 'progress', title: 'Doing', colorClass: 'bg-brand-surface', dotClass: 'bg-brand-surface' },
  { id: 'resolved', title: 'Finished', colorClass: 'bg-zinc-400', dotClass: 'bg-zinc-400' },
];

export const BoardView: React.FC = () => {
  const { appState, localPeerId, updateCard, updateWorkflow, addLog } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);

  const { workflow, roles } = appState;
  const myRole = roles[localPeerId] || 'DEV';
  const isPO = myRole === 'PO';
  const isDEV = myRole === 'DEV';
  const canManageState = myRole === 'PO' || myRole === 'SM';

  const activeSprint = appState.sprints.find(s => s.id === workflow.activeSprintId);
  const isBoardLocked = workflow.phase !== 'active_sprint';
  const canMoveCards = !isBoardLocked && !isPO;
  const canCreateCards = !isBoardLocked && !isDEV;
  
  const sprintCards = activeSprint 
    ? appState.cards.filter(c => c.sprintId === activeSprint.id)
    : [];

  const filteredCards = sprintCards.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDrop = (e: React.DragEvent, targetCol: ColumnType) => {
    if (!canMoveCards) return;
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    if (!cardId) return;

    const cards = appState.cards;
    const cardIndex = cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = { ...cards[cardIndex] };
    if (card.column === targetCol) return;

    const colCards = cards.filter(c => c.column === targetCol).sort((a, b) => a.orderKey.localeCompare(b.orderKey));
    let newKey = 'A';
    if (colCards.length > 0) {
       const lastKey = colCards[colCards.length - 1].orderKey;
       newKey = String.fromCharCode(lastKey.charCodeAt(0) + 1);
    }
    
    card.column = targetCol;
    card.orderKey = newKey;
    card.updatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    updateCard(card);
    addLog(`Moved card "${card.title.slice(0, 15)}..." to ${targetCol.toUpperCase()}`, 'success');
  };

  const handleEndSprint = () => {
    if (!canManageState) return;
    updateWorkflow({ phase: 'review' });
    addLog('Sprint ended. Moving to Sprint Review phase.', 'info');
  };

  if (!activeSprint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-white p-8 border-2 border-brand-text rounded-2xl shadow-brutal max-w-lg">
          <h2 className="text-3xl font-anton text-brand-text leading-none uppercase mb-2">No Active Sprint</h2>
          <p className="text-zinc-600 text-sm font-medium">To see tasks on the board, you must first start a sprint from the Backlog Planning view.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border-2 border-brand-text rounded-2xl shadow-brutal">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-anton text-brand-text leading-none uppercase">{activeSprint.name}</h2>
            {workflow.phase === 'active_sprint' && <span className="bg-brand-primary text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Active Sprint</span>}
            {workflow.phase === 'review' && <span className="bg-brand-accent text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">In Review</span>}
            {workflow.phase === 'retro' && <span className="bg-zinc-700 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">In Retrospective</span>}
          </div>
          <p className="text-zinc-600 text-xs font-medium mt-1 font-mono">{activeSprint.startDate} to {activeSprint.endDate} • {activeSprint.goal}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search active sprint..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs font-semibold border-2 border-brand-text px-3 py-2.5 rounded-xl w-full sm:w-56 bg-brand-bg focus:outline-none focus:bg-white" 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {canCreateCards && (
              <button onClick={() => setIsCreateOpen(true)} className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-black bg-brand-surface text-brand-text border-2 border-brand-text rounded-xl shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all justify-center">
                + CREATE CARD
              </button>
            )}
            {workflow.phase === 'active_sprint' && canManageState && (
              <button onClick={handleEndSprint} className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-black bg-brand-text text-white border-2 border-brand-text rounded-xl shadow-brutal-sm hover:translate-y-[-2px] transition-all flex justify-center items-center gap-2">
                END SPRINT <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {isBoardLocked && (
        <div className="bg-zinc-200 border-2 border-brand-text p-4 rounded-xl flex items-center justify-center gap-3">
          <Lock size={20} className="text-zinc-600" />
          <p className="text-sm font-bold text-zinc-700">The board is currently locked for the {workflow.phase === 'review' ? 'Sprint Review' : 'Retrospective'} phase.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start opacity-95">
        {COLUMNS.map((col) => {
          const colCards = filteredCards.filter(c => c.column === col.id).sort((a, b) => a.orderKey.localeCompare(b.orderKey));
          
          return (
            <div 
              key={col.id} 
              onDragOver={(e) => { if (canMoveCards) e.preventDefault(); }}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-white border-2 border-brand-text rounded-2xl p-4 shadow-brutal-sm min-h-[300px] md:min-h-[500px] flex flex-col ${!canMoveCards ? 'bg-zinc-50 border-zinc-300 shadow-none' : ''}`}
            >
              <div className="flex items-center justify-between pb-2 border-b-2 border-brand-text mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${col.dotClass} ${!canMoveCards ? 'opacity-50' : ''}`}></span>
                  <span className={`font-anton text-lg ${!canMoveCards ? 'text-zinc-500' : 'text-brand-text'}`}>{col.title}</span>
                </div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-bg border border-brand-text rounded">
                  {colCards.length}
                </span>
              </div>
              <div className="space-y-3 flex-1">
                {colCards.map(card => (
                  <Card 
                    key={card.id} 
                    card={card} 
                    onEdit={canMoveCards ? setEditingCard : () => {}} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <CreateCardModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      {editingCard && canMoveCards && <CardDetailModal card={editingCard} isOpen={!!editingCard} onClose={() => setEditingCard(null)} />}
    </div>
  );
};
