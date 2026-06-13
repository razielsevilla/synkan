import React, { useState } from 'react';

import type { TabType } from '../layout/Sidebar';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChangeTab: (tab: TabType) => void;
}

export const TutorialModal: React.FC<Props> = ({ isOpen, onClose, onChangeTab }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps: { title: string, emoji: string, content: string, tab: TabType }[] = [
    {
      tab: 'backlog',
      title: 'Phase 1 & 2: Backlog & Plan',
      emoji: '📋',
      content: 'Start here! The Product Owner creates Product Backlog Items (PBIs). Then, start Sprint Planning to break them down into subtasks (cards) and plan your next sprint.'
    },
    {
      tab: 'board',
      title: 'Phase 3: Active Sprint',
      emoji: '🏃',
      content: 'Once a sprint is active, Developers work on tasks here. You will be prompted for a Mandatory Daily Standup before you can access the board every day.'
    },
    {
      tab: 'ceremonies',
      title: 'Scrum Ceremonies',
      emoji: '📅',
      content: 'Ceremonies are strictly tied to the active phase. Conduct Daily Standups, then when the sprint ends, lock the board to perform your Sprint Review and Retrospective.'
    },
    {
      tab: 'analytics',
      title: 'Metrics & Charts',
      emoji: '📈',
      content: 'Track your team\'s progress locally. View your active sprint burndown chart and historical velocity without sending data to the cloud.'
    },
    {
      tab: 'mesh',
      title: 'Connect & Assign Roles',
      emoji: '📡',
      content: 'Share your Invite Code. Once teammates join securely via peer-to-peer, the Product Owner or Scrum Master can assign them Scrum Roles (PO, SM, DEV).'
    },
    {
      tab: 'journal',
      title: 'History & Trash',
      emoji: '🗑️',
      content: 'Did you delete a card by mistake? You can restore it here. You can also permanently delete cards to free up local storage space.'
    },
    {
      tab: 'database',
      title: 'Data & Storage',
      emoji: '💾',
      content: 'Monitor your browser storage usage and view the local database tables. You can also leave or switch to a different board from here.'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      onChangeTab(steps[nextStep].tab);
    } else {
      onChangeTab('board');
      onClose();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 p-4 z-[60]">
      <div className="bg-white border-4 border-brand-text w-full max-w-sm rounded-2xl shadow-brutal flex flex-col overflow-hidden animate-fade-in relative">
        
        {/* Pointer / Arrow (Visual only) */}
        <div className="absolute -left-3 top-8 w-6 h-6 bg-white border-l-4 border-b-4 border-brand-text transform rotate-45 hidden md:block"></div>
        
        {/* Header */}
        <div className="bg-brand-primary p-6 text-center border-b-4 border-brand-text">
          <div className="text-6xl mb-4 animate-bounce">{steps[step].emoji}</div>
          <h2 className="text-2xl font-anton text-white tracking-wide">{steps[step].title}</h2>
        </div>

        {/* Body */}
        <div className="p-8 min-h-[160px] flex items-center justify-center text-center">
          <p className="text-zinc-700 font-medium leading-relaxed">
            {steps[step].content}
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-brand-bg border-t-2 border-brand-text flex justify-between items-center">
          <div className="flex space-x-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full border border-brand-text ${i === step ? 'bg-brand-primary' : 'bg-white'}`}
              />
            ))}
          </div>
          
          <button 
            onClick={handleNext}
            className="px-6 py-2 bg-brand-accent text-white font-anton text-lg rounded-xl border-2 border-brand-text shadow-brutal-sm hover:translate-y-[-1px] transition-transform"
          >
            {step === steps.length - 1 ? 'GET STARTED' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
};
