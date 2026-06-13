import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAppState } from '../../context/AppStateContext';
import type { Sprint } from '../../types';

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSprintModal: React.FC<CreateSprintModalProps> = ({ isOpen, onClose }) => {
  const { appState, addSprint, updateWorkflow, addLog } = useAppState();
  const { sprints } = appState;
  
  const [name, setName] = useState(`Sprint ${sprints.length + 1}`);
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setName(`Sprint ${sprints.length + 1}`);
      setGoal('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  }, [isOpen, sprints.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !goal.trim() || !startDate || !endDate) return;

    const newSprint: Sprint = {
      id: 'sprint-' + Math.floor(Math.random() * 1000000),
      name: name.trim(),
      goal: goal.trim(),
      startDate,
      endDate,
      status: 'planning',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addSprint(newSprint);
    updateWorkflow({ activeSprintId: newSprint.id, phase: 'planning' });
    addLog(`Created new sprint: ${newSprint.name}`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Sprint">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-600 mb-1 uppercase font-mono">Sprint Name</label>
          <input
            type="text"
            className="brutal-input w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Sprint 12"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-600 mb-1 uppercase font-mono">Sprint Goal</label>
          <textarea
            className="brutal-input w-full min-h-[80px]"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Deliver the new dashboard and fix critical login bugs..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1 uppercase font-mono">Start Date</label>
            <input
              type="date"
              className="brutal-input w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-600 mb-1 uppercase font-mono">End Date</label>
            <input
              type="date"
              className="brutal-input w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={!name.trim() || !goal.trim() || !startDate || !endDate}
            className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold border-2 border-brand-text shadow-brutal-sm hover:translate-y-[-2px] transition-transform disabled:opacity-50 disabled:hover:translate-y-0"
          >
            CREATE SPRINT
          </button>
        </div>
      </form>
    </Modal>
  );
};
