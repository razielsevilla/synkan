import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useAppState } from '../../context/AppStateContext';
import type { Priority, Card as CardType } from '../../types';

interface Props {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
}

export const EditCardModal: React.FC<Props> = ({ card, isOpen, onClose }) => {
  const { updateCard, deleteCard, addLog } = useAppState();
  const [title, setTitle] = useState(card.title);
  const [priority, setPriority] = useState<Priority>(card.priority);

  useEffect(() => {
    setTitle(card.title);
    setPriority(card.priority);
  }, [card]);

  const handleSave = () => {
    if (!title.trim()) return;

    updateCard({
      ...card,
      title: title.trim(),
      priority,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    addLog(`Updated properties for task: "${title.slice(0, 15)}..."`, 'info');
    onClose();
  };

  const handleTrash = () => {
    deleteCard(card.id);

    addLog(`Task moved to Trash Bin: "${card.title.slice(0, 15)}..."`, 'error');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modify Task Properties">
      <div className="space-y-4 text-left">
        <div className="flex flex-col">
          <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">Task Title</label>
          <input 
            type="text" 
            className="brutal-input font-sans text-sm" 
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">Urgency Priority</label>
            <select className="brutal-input font-bold text-sm" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              <option value="High">🚨 High Priority</option>
              <option value="Medium">⚡ Medium Priority</option>
              <option value="Low">💤 Low Priority</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">Internal Sorting Key</label>
            <input 
              type="text" 
              className="brutal-input font-mono text-sm bg-brand-bg cursor-not-allowed" 
              readOnly 
              value={card.orderKey}
              title="Ensures task lists remain in perfect order without colliding" 
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between gap-3">
        <button onClick={handleTrash} className="px-4 py-2.5 text-xs font-black border-2 border-brand-text bg-brand-accent text-white rounded-xl shadow-brutal-sm">
          🗑️ MOVE TO TRASH BIN
        </button>
        <div className="flex space-x-3">
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold border-2 border-brand-text bg-white hover:bg-brand-bg rounded-xl">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 text-xs font-black border-2 border-brand-text bg-brand-surface rounded-xl shadow-brutal-sm">SAVE CHANGES</button>
        </div>
      </div>
    </Modal>
  );
};
