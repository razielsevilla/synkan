import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { Card } from '../ui/Card';
import type { Card as CardType, ColumnType } from '../../types';
import { CreateCardModal } from '../modals/CreateCardModal';
import { EditCardModal } from '../modals/EditCardModal';

const COLUMNS: { id: ColumnType; title: string; colorClass: string; dotClass: string }[] = [
  { id: 'backlog', title: 'Task Pool', colorClass: 'bg-brand-primary', dotClass: 'bg-brand-primary' },
  { id: 'ready', title: 'Up Next', colorClass: 'bg-brand-accent', dotClass: 'bg-brand-accent' },
  { id: 'progress', title: 'Doing', colorClass: 'bg-brand-surface', dotClass: 'bg-brand-surface' },
  { id: 'resolved', title: 'Finished', colorClass: 'bg-zinc-400', dotClass: 'bg-zinc-400' },
];

export const BoardView: React.FC = () => {
  const { appState, updateCard, addLog } = useAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);

  const filteredCards = appState.cards.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDrop = (e: React.DragEvent, targetCol: ColumnType) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border-2 border-brand-text rounded-2xl shadow-brutal">
        <div>
          <h2 className="text-3xl font-anton text-brand-text leading-none uppercase">{appState.boardName || 'My Workspace Board'}</h2>
          <p className="text-zinc-600 text-xs font-medium mt-1">Everything you edit here is saved directly onto your computer. No cloud logins, no tracking, completely private.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs font-semibold border-2 border-brand-text px-3 py-2.5 rounded-xl w-40 sm:w-56 bg-brand-bg focus:outline-none focus:bg-white" 
            />
          </div>
          <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2.5 text-xs font-black bg-brand-surface text-brand-text border-2 border-brand-text rounded-xl shadow-brutal-sm hover:translate-y-[-2px] hover:shadow-brutal transition-all">
            + CREATE CARD
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {COLUMNS.map((col) => {
          const colCards = filteredCards.filter(c => c.column === col.id).sort((a, b) => a.orderKey.localeCompare(b.orderKey));
          
          return (
            <div 
              key={col.id} 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, col.id)}
              className="bg-white border-2 border-brand-text rounded-2xl p-4 shadow-brutal-sm min-h-[500px] flex flex-col"
            >
              <div className="flex items-center justify-between pb-2 border-b-2 border-brand-text mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${col.dotClass}`}></span>
                  <span className="font-anton text-lg text-brand-text">{col.title}</span>
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
                    onEdit={setEditingCard} 
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <CreateCardModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      {editingCard && <EditCardModal card={editingCard} isOpen={!!editingCard} onClose={() => setEditingCard(null)} />}
    </div>
  );
};
