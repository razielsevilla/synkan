import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAppState } from '../../context/AppStateContext';
import type { Priority, ColumnType } from '../../types';

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledSprintId?: string;
  prefilledEpicId?: string;
}

export const CreateCardModal: React.FC<CreateCardModalProps> = ({ isOpen, onClose, prefilledSprintId, prefilledEpicId }) => {
  const { appState, localPeerId, addCard, addLog } = useAppState();
  const [title, setTitle] = useState('');
  const [column, setColumn] = useState<ColumnType>('backlog');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [storyPoints, setStoryPoints] = useState<number | ''>('');
  const [epicId, setEpicId] = useState<string>(prefilledEpicId || '');

  const handleSubmit = () => {
    if (!title.trim()) {
      addLog('Task title is required.', 'error');
      return;
    }
    if (!assigneeId) {
      addLog('You must assign a team member to this task.', 'error');
      return;
    }

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
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sprintId: prefilledSprintId || undefined,
      epicId: epicId || undefined,
      assigneeId: assigneeId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      storyPoints: storyPoints === '' ? undefined : Number(storyPoints)
    };

    addCard(newCard);

    addLog(`Created new task: "${newCard.title.slice(0, 15)}..."`, 'success');
    setTitle('');
    setStartDate('');
    setEndDate('');
    setStoryPoints('');
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
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 text-left">Assign To (Required)</label>
            <select className="brutal-input font-bold text-sm" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
              <option value="" disabled>Select a member...</option>
              <option value={localPeerId}>Me ({appState.roles[localPeerId] || 'DEV'})</option>
              {appState.peers.map(p => (
                <option key={p.id} value={p.id}>{p.alias} ({p.role || 'DEV'})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 text-left">Epic</label>
            <select className="brutal-input font-bold text-sm" value={epicId} onChange={e => setEpicId(e.target.value)}>
              <option value="">No Epic</option>
              {appState.epics.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-zinc-200 pt-4">
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">Story Pts</label>
            <input 
              type="number" 
              min="0"
              className="brutal-input font-sans text-sm" 
              placeholder="e.g. 5"
              value={storyPoints}
              onChange={e => setStoryPoints(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">Start Date</label>
            <input 
              type="date" 
              className="brutal-input font-sans text-sm bg-white" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">End Date</label>
            <input 
              type="date" 
              className="brutal-input font-sans text-sm bg-white" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
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
