import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useAppState } from '../../context/AppStateContext';
import type { Priority, Card as CardType, CardType as CType } from '../../types';
import { Save, Trash2, AlignLeft, User, Hash, Box, Target } from 'lucide-react';

interface Props {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailModal: React.FC<Props> = ({ card, isOpen, onClose }) => {
  const { appState, localPeerId, localAlias, updateCard, deleteCard, addLog } = useAppState();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState<Priority>(card.priority);
  const [type, setType] = useState<CType>(card.type || 'task');
  const [storyPoints, setStoryPoints] = useState<number | ''>(card.storyPoints || '');
  const [assigneeId, setAssigneeId] = useState(card.assigneeId || '');
  const [sprintId, setSprintId] = useState(card.sprintId || '');
  const [epicId, setEpicId] = useState(card.epicId || '');
  const [startDate, setStartDate] = useState(card.startDate || '');
  const [endDate, setEndDate] = useState(card.endDate || '');

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description || '');
    setPriority(card.priority);
    setType(card.type || 'task');
    setStoryPoints(card.storyPoints || '');
    setAssigneeId(card.assigneeId || '');
    setSprintId(card.sprintId || '');
    setEpicId(card.epicId || '');
    setStartDate(card.startDate || '');
    setEndDate(card.endDate || '');
  }, [card]);

  const handleSave = () => {
    if (!title.trim()) return;

    updateCard({
      ...card,
      title: title.trim(),
      description: description.trim(),
      priority,
      type,
      storyPoints: storyPoints === '' ? undefined : Number(storyPoints),
      assigneeId: assigneeId || undefined,
      sprintId: sprintId || undefined,
      epicId: epicId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
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
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
      <div className="space-y-5 text-left max-h-[70vh] overflow-y-auto px-1 pb-4">
        <div className="flex flex-col">
          <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">Task Title</label>
          <input 
            type="text" 
            className="brutal-input font-sans text-lg font-bold" 
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><Box size={12} /> Type</label>
            <select className="brutal-input font-bold text-sm bg-white" value={type} onChange={e => setType(e.target.value as CType)}>
              <option value="epic">👑 Epic</option>
              <option value="story">📘 Story</option>
              <option value="task">📝 Task</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">Urgency Priority</label>
            <select className="brutal-input font-bold text-sm bg-white" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              <option value="High">🚨 High Priority</option>
              <option value="Medium">⚡ Medium Priority</option>
              <option value="Low">💤 Low Priority</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><AlignLeft size={12} /> Description</label>
          <textarea 
            className="brutal-input font-sans text-sm min-h-[100px] resize-y" 
            placeholder="Add acceptance criteria or details..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-brand-text pt-4">
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><Hash size={12} /> Story Points</label>
            <input 
              type="number" 
              min="0"
              className="brutal-input font-sans text-sm" 
              placeholder="e.g. 3, 5, 8"
              value={storyPoints}
              onChange={e => setStoryPoints(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><User size={12} /> Assignee</label>
            <select className="brutal-input font-sans text-sm bg-white" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
              <option value="">Unassigned</option>
              <option value={localPeerId}>Me ({localAlias})</option>
              {appState.peers.map(p => (
                <option key={p.id} value={p.id}>{p.alias}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><Target size={12} /> Sprint</label>
            <select className="brutal-input font-sans text-sm bg-white" value={sprintId} onChange={e => setSprintId(e.target.value)}>
              <option value="">Backlog (No Sprint)</option>
              {appState.sprints.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1"><Box size={12} /> Epic</label>
            <select className="brutal-input font-sans text-sm bg-white" value={epicId} onChange={e => setEpicId(e.target.value)}>
              <option value="">No Epic</option>
              {appState.epics.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="text-xs font-sans font-bold text-zinc-500 uppercase mb-1">End Date (Due)</label>
            <input 
              type="date" 
              className="brutal-input font-sans text-sm bg-white" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center border-t-2 border-brand-text pt-4">
        <button onClick={handleTrash} className="flex items-center gap-1 px-4 py-2 text-xs font-black border-2 border-brand-text bg-red-100 text-red-700 hover:bg-red-200 rounded-xl transition-colors">
          <Trash2 size={14} /> TRASH
        </button>
        <div className="flex space-x-3">
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold border-2 border-brand-text bg-white hover:bg-brand-bg rounded-xl">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-1 px-5 py-2 text-xs font-black border-2 border-brand-text bg-brand-surface rounded-xl shadow-brutal-sm hover:translate-y-[-2px] transition-transform">
            <Save size={14} /> SAVE
          </button>
        </div>
      </div>
    </Modal>
  );
};
