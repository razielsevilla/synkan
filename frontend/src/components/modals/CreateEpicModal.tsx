import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { X } from 'lucide-react';
import type { Epic } from '../../types';

interface CreateEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEpicModal: React.FC<CreateEpicModalProps> = ({ isOpen, onClose }) => {
  const { addEpic, addLog } = useAppState();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEpic: Epic = {
      id: 'epic-' + Math.floor(Math.random() * 1000000),
      title: title.trim(),
      description: description.trim(),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    addEpic(newEpic);
    addLog(`Created Product Backlog Item: ${title}`, 'success');
    
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white border-4 border-brand-text rounded-2xl shadow-brutal w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-brand-text hover:text-brand-primary transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-anton text-brand-text mb-6 uppercase">New Product Backlog Item</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold font-mono text-zinc-500 uppercase mb-1">Title / Goal</label>
              <input 
                type="text" 
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Implement User Authentication"
                className="w-full border-2 border-brand-text p-3 rounded-xl bg-brand-bg font-bold focus:outline-none focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold font-mono text-zinc-500 uppercase mb-1">Description (Optional)</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="High-level requirements..."
                className="w-full border-2 border-brand-text p-3 rounded-xl bg-brand-bg text-sm focus:outline-none focus:bg-white transition-colors min-h-[100px]"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 font-bold text-zinc-500 hover:text-brand-text"
              >
                CANCEL
              </button>
              <button 
                type="submit"
                disabled={!title.trim()}
                className="px-6 py-2 bg-brand-primary text-white font-bold rounded-xl border-2 border-brand-text shadow-brutal-sm hover:translate-y-[-2px] disabled:opacity-50 transition-all"
              >
                CREATE PBI
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
