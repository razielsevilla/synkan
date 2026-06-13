import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useAppState } from '../../context/AppStateContext';
import type { Sprint } from '../../types';
import { Save, Calendar, Target, Type } from 'lucide-react';

interface Props {
  sprint: Sprint;
  isOpen: boolean;
  onClose: () => void;
}

export const SprintDetailModal: React.FC<Props> = ({ sprint, isOpen, onClose }) => {
  const { updateSprint, addLog } = useAppState();
  const [name, setName] = useState(sprint.name);
  const [goal, setGoal] = useState(sprint.goal);
  const [startDate, setStartDate] = useState(sprint.startDate);
  const [endDate, setEndDate] = useState(sprint.endDate);

  useEffect(() => {
    setName(sprint.name);
    setGoal(sprint.goal);
    setStartDate(sprint.startDate);
    setEndDate(sprint.endDate);
  }, [sprint]);

  const handleSave = () => {
    if (!name.trim()) return;

    updateSprint({
      ...sprint,
      name: name.trim(),
      goal: goal.trim(),
      startDate,
      endDate,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    addLog(`Updated sprint details for: "${name}"`, 'info');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Sprint">
      <div className="space-y-5 text-left max-h-[70vh] overflow-y-auto px-1 pb-4">
        
        <div className="flex flex-col">
          <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><Type size={12} /> Sprint Name</label>
          <input 
            type="text" 
            className="brutal-input font-sans text-lg font-bold" 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sprint 1"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><Target size={12} /> Sprint Goal</label>
          <textarea 
            className="brutal-input font-sans text-sm min-h-[80px] resize-y" 
            value={goal}
            onChange={e => setGoal(e.target.value)}
            placeholder="What is the main objective of this sprint?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-brand-text pt-4">
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><Calendar size={12} /> Start Date</label>
            <input 
              type="date" 
              className="brutal-input font-sans text-sm" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><Calendar size={12} /> End Date</label>
            <input 
              type="date" 
              className="brutal-input font-sans text-sm" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>

      </div>

      <div className="mt-6 flex justify-end items-center border-t-2 border-brand-text pt-4 space-x-3">
        <button onClick={onClose} className="px-5 py-2 text-xs font-bold border-2 border-brand-text bg-white hover:bg-brand-bg rounded-xl">Cancel</button>
        <button onClick={handleSave} className="flex items-center gap-1 px-5 py-2 text-xs font-black border-2 border-brand-text bg-brand-surface rounded-xl shadow-brutal-sm hover:translate-y-[-2px] transition-transform">
          <Save size={14} /> SAVE
        </button>
      </div>
    </Modal>
  );
};
