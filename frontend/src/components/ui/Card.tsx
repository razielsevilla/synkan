import React from 'react';
import type { Card as CardType } from '../../types';
import { useAppState } from '../../context/AppStateContext';

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
}

export const Card: React.FC<CardProps> = ({ card, onEdit }) => {
  const { appState, localPeerId, localAlias } = useAppState();
  let borderColor = 'border-brand-text';
  let badgeColor = 'bg-brand-bg text-brand-text border-brand-text';

  if (card.priority === 'High') {
    borderColor = 'border-brand-accent';
    badgeColor = 'bg-brand-accent text-white border-brand-accent';
  } else if (card.priority === 'Medium') {
    borderColor = 'border-brand-primary';
    badgeColor = 'bg-brand-primary text-white border-brand-primary';
  }

  const typeIcon = card.type === 'epic' ? '👑' : card.type === 'story' ? '📘' : '📝';
  const assignee = card.assigneeId === localPeerId 
    ? { id: localPeerId, alias: localAlias, role: appState.roles[localPeerId] }
    : appState.peers.find(p => p.id === card.assigneeId);

  return (
    <div 
      draggable
      onDragStart={(e) => e.dataTransfer.setData('cardId', card.id)}
      className={`bg-white p-3.5 rounded-xl border-2 ${borderColor} flex flex-col justify-between hover:translate-y-[-2px] transition-transform shadow-brutal-sm relative group text-left cursor-pointer`} 
      onClick={() => onEdit(card)}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-1 rounded">{typeIcon} {card.type?.toUpperCase() || 'TASK'}</span>
        {card.storyPoints !== undefined && (
          <span className="text-[10px] font-bold font-mono bg-brand-surface text-brand-text border border-brand-text px-1.5 rounded-full" title="Story Points">
            {card.storyPoints}
          </span>
        )}
      </div>

      <div className="text-sm font-bold text-brand-text leading-snug mb-3">{card.title}</div>
      
      <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-[10px]">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded font-bold border ${badgeColor}`}>
            {card.priority.toUpperCase()} PRIORITY
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {assignee && (
            <div className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-[8px] border border-brand-text" title={`Assigned to ${assignee.alias}`}>
              {assignee.alias.substring(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-mono text-zinc-400 font-bold" title="Last modified">
            {card.updatedAt}
          </span>
        </div>
      </div>
    </div>
  );
};
