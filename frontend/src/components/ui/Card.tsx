import React from 'react';
import type { Card as CardType } from '../../types';

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
}

export const Card: React.FC<CardProps> = ({ card, onEdit }) => {
  let borderColor = 'border-brand-text';
  let badgeColor = 'bg-brand-bg text-brand-text border-brand-text';

  if (card.priority === 'High') {
    borderColor = 'border-brand-accent';
    badgeColor = 'bg-brand-accent text-white border-brand-accent';
  } else if (card.priority === 'Medium') {
    borderColor = 'border-brand-primary';
    badgeColor = 'bg-brand-primary text-white border-brand-primary';
  }

  return (
    <div 
      draggable
      onDragStart={(e) => e.dataTransfer.setData('cardId', card.id)}
      className={`bg-white p-3.5 rounded-xl border-2 ${borderColor} flex flex-col justify-between hover:translate-y-[-2px] transition-transform shadow-brutal-sm relative group text-left cursor-pointer`} 
      onClick={() => onEdit(card)}
    >

      <div className="text-sm font-bold text-brand-text leading-snug pr-12">{card.title}</div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-200 text-[10px]">
        <span className={`px-2 py-0.5 rounded font-bold border ${badgeColor}`}>
          {card.priority.toUpperCase()} PRIORITY
        </span>
        <span className="font-mono text-zinc-400 font-bold" title="Last modified">
          {card.updatedAt}
        </span>
      </div>
    </div>
  );
};
