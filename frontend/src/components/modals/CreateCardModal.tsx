import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAppState } from '../../context/AppStateContext';
import type { Priority, ColumnType } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { appState, addCard, addLog } = useAppState();
  const [title, setTitle] = useState('');
  const [column, setColumn] = useState<ColumnType>('backlog');
  const [priority, setPriority] = useState<Priority>('Medium');

  const handleSubmit = () => {
    if (!title.trim()) return;

    const colCards = appState.cards.filter(c => c.column === column).sort((a, b) => a.orderKey.localeCompare(b.orderKey));
    let newKey = 'A';
    if (colCards.length > 0) {
      const lastKey = colCards[colCards.length - 1].orderKey;
      newKey = String.fromCharCode(lastKey.charCodeAt(0) + 1);
    }

    const newCard = {
      id: 'card-' + Math.floor(Math.random() * 1000000),
      title: title.trim(),
      column,
      priority,
      orderKey: newKey,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addCard(newCard);

    addLog(`Created new task: "${newCard.title.slice(0, 15)}..."`, 'success');
    setTitle('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <div className="space-y-4 text-left">
        <div className="flex flex-col">
          <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">What needs to be done?</label>
          <input 
            type="text" 
            className="brutal-input font-sans text-sm" 
            placeholder="e.g. Prepare quarterly progress deck"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">Board Column</label>
            <select className="brutal-input font-bold text-sm" value={column} onChange={e => setColumn(e.target.value as ColumnType)}>
              <option value="backlog">Task Pool</option>
              <option value="ready">Up Next</option>
              <option value="progress">Doing</option>
              <option value="resolved">Finished</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">How urgent is this?</label>
            <select className="brutal-input font-bold text-sm" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              <option value="High">🚨 High Priority</option>
              <option value="Medium">⚡ Medium Priority</option>
              <option value="Low">💤 Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button onClick={onClose} className="px-5 py-2 text-xs font-bold border-2 border-brand-text bg-white hover:bg-brand-bg rounded-xl">Cancel</button>
        <button onClick={handleSubmit} className="px-5 py-2 text-xs font-black border-2 border-brand-text bg-brand-surface rounded-xl shadow-brutal-sm">CREATE CARD</button>
      </div>
    </Modal>
  );
};
