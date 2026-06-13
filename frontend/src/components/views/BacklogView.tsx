import React, { useState } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CreateEpicModal } from '../modals/CreateEpicModal';
import { CreateCardModal } from '../modals/CreateCardModal';
import { CreateSprintModal } from '../modals/CreateSprintModal';
import { Card as CardUi } from '../ui/Card';
import { Plus, ArrowRight, Layers, Lock } from 'lucide-react';

export const BacklogView: React.FC = () => {
  const { appState, localPeerId, updateWorkflow, updateSprint, updateCard, addLog } = useAppState();
  const [isCreateEpicOpen, setIsCreateEpicOpen] = useState(false);
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [isCreateSubtaskOpen, setIsCreateSubtaskOpen] = useState(false);
  const [selectedEpicForSubtask, setSelectedEpicForSubtask] = useState<string | null>(null);

  const { workflow, epics, cards, sprints, roles } = appState;
  const myRole = roles[localPeerId] || 'DEV';
  const isPO = myRole === 'PO';
  const isSM = myRole === 'SM';
  const canManageState = isPO || isSM;

  const handleInitializePlanning = () => {
    if (!canManageState) return;
    updateWorkflow({ phase: 'planning' });
    addLog('Transitioned to Sprint Planning Phase.', 'info');
  };

  const activeOrPlanningSprint = sprints.find(s => s.status === 'planning' || s.status === 'active');

  const handleStartSprint = () => {
    if (!activeOrPlanningSprint || (!isSM && workflow.phase === 'planning_locked')) return;
    updateSprint({ ...activeOrPlanningSprint, status: 'active', updatedAt: new Date().toLocaleTimeString() });
    updateWorkflow({ phase: 'active_sprint' });
    addLog(`Started sprint: ${activeOrPlanningSprint.name}`, 'success');
  };

  const handleLockSprint = () => {
    if (!activeOrPlanningSprint || !canManageState) return;
    updateWorkflow({ phase: 'planning_locked' });
    addLog('Sprint plan locked. Waiting for Scrum Master approval.', 'info');
  };

  const handleSprintDateChange = (field: 'startDate' | 'endDate', value: string) => {
    if (!activeOrPlanningSprint) return;
    updateSprint({ ...activeOrPlanningSprint, [field]: value, updatedAt: new Date().toLocaleTimeString() });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 border-2 border-brand-text rounded-2xl shadow-brutal">
        <div>
          <h2 className="text-3xl font-anton text-brand-text leading-none uppercase flex items-center gap-2">
            <Layers size={28} /> Product Backlog
          </h2>
          <p className="text-zinc-600 text-xs font-medium mt-1">Manage Product Backlog Items (PBIs) and initiate Sprint Planning.</p>
        </div>
        <div className="flex items-center gap-3">
          {workflow.phase === 'initial_backlog' && canManageState && epics.length > 0 && (
            <button 
              onClick={handleInitializePlanning}
              className="px-4 py-2.5 text-xs font-black bg-brand-primary text-white border-2 border-brand-text rounded-xl shadow-brutal-sm hover:translate-y-[-2px] transition-all flex items-center gap-2"
            >
              Start First Sprint Planning <ArrowRight size={14} />
            </button>
          )}
          {canManageState && (
            <button 
              onClick={() => setIsCreateEpicOpen(true)} 
              className="px-4 py-2.5 text-xs font-black bg-brand-surface text-brand-text border-2 border-brand-text rounded-xl shadow-brutal-sm hover:translate-y-[-2px] transition-all flex items-center gap-1"
            >
              <Plus size={14} /> NEW PBI (EPIC)
            </button>
          )}
        </div>
      </div>

      {workflow.phase === 'initial_backlog' && (
        <div className="bg-brand-bg border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm">
          <h3 className="font-anton text-2xl text-brand-text uppercase mb-2">Phase 1: Setup Product Backlog</h3>
          <p className="text-sm text-zinc-700 mb-6">
            Welcome to Synkan V3. Before you can start working, the Product Owner must define the large-scale tasks in the Product Backlog. Once the backlog has items, you can proceed to Sprint Planning.
          </p>
        </div>
      )}

      {workflow.phase === 'planning' && (
        <div className="bg-brand-accent border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm text-brand-text flex items-center justify-between">
          <div>
            <h3 className="font-anton text-2xl uppercase mb-2">Phase 2: Sprint Planning</h3>
            <p className="text-sm font-bold mb-4">
              Break down the Product Backlog Items (PBIs) below into Subtasks (Cards). These subtasks will be placed on your Sprint Board.
            </p>
            {!activeOrPlanningSprint && canManageState && (
              <button onClick={() => setIsCreateSprintOpen(true)} className="bg-white px-4 py-2 border-2 border-brand-text font-bold shadow-brutal-sm hover:translate-y-[-2px]">
                CREATE NEW SPRINT
              </button>
            )}
            {activeOrPlanningSprint && (
              <div className="bg-white px-4 py-3 border-2 border-brand-text font-bold shadow-brutal-sm mt-2 flex flex-col sm:flex-row gap-4 items-center">
                <span>{activeOrPlanningSprint.name}</span>
                <div className="flex gap-2 items-center text-xs">
                  <label className="text-zinc-500 uppercase">Start:</label>
                  <input type="date" value={activeOrPlanningSprint.startDate} onChange={(e) => handleSprintDateChange('startDate', e.target.value)} className="border-2 border-brand-text px-2 py-1 rounded" />
                </div>
                <div className="flex gap-2 items-center text-xs">
                  <label className="text-zinc-500 uppercase">End:</label>
                  <input type="date" value={activeOrPlanningSprint.endDate} onChange={(e) => handleSprintDateChange('endDate', e.target.value)} className="border-2 border-brand-text px-2 py-1 rounded" />
                </div>
              </div>
            )}
          </div>
          
          {activeOrPlanningSprint?.status === 'planning' && canManageState && (
            <button onClick={handleLockSprint} className="bg-brand-text text-white px-6 py-4 border-2 border-brand-text font-black shadow-brutal-sm hover:translate-y-[-2px] text-sm rounded-xl mt-4 sm:mt-0">
              LOCK PLAN & SEND TO SM
            </button>
          )}
        </div>
      )}

      {workflow.phase === 'planning_locked' && (
        <div className="bg-yellow-300 border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm text-brand-text flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-anton text-2xl uppercase mb-2 flex items-center gap-2"><Lock size={20} /> Phase 2.5: Plan Locked</h3>
            <p className="text-sm font-bold mb-2">
              The sprint plan is locked and waiting for Scrum Master approval.
            </p>
            {activeOrPlanningSprint && (
              <div className="bg-white px-4 py-2 border-2 border-brand-text font-bold shadow-brutal-sm inline-block">
                {activeOrPlanningSprint.name} ({activeOrPlanningSprint.startDate} to {activeOrPlanningSprint.endDate})
              </div>
            )}
          </div>
          
          {isSM ? (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button onClick={() => updateWorkflow({ phase: 'planning' })} className="bg-white text-brand-text px-4 py-3 border-2 border-brand-text font-black shadow-brutal-sm hover:translate-y-[-2px] rounded-xl flex-1 whitespace-nowrap">
                REJECT & UNLOCK
              </button>
              <button onClick={handleStartSprint} className="bg-emerald-500 text-white px-6 py-3 border-2 border-brand-text font-black shadow-brutal-sm hover:translate-y-[-2px] rounded-xl flex-1 whitespace-nowrap">
                APPROVE & START SPRINT
              </button>
            </div>
          ) : (
             <div className="bg-white px-4 py-3 border-2 border-brand-text font-bold text-sm w-full sm:w-auto text-center">
                Waiting for Scrum Master...
             </div>
          )}
        </div>
      )}

      {(workflow.phase === 'review' || workflow.phase === 'retro') && (
        <div className="bg-zinc-200 border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm flex items-center gap-3">
          <Lock size={24} className="text-zinc-600" />
          <div>
            <h3 className="font-anton text-xl text-zinc-700 uppercase">Backlog Locked</h3>
            <p className="text-xs text-zinc-600 font-bold">The backlog cannot be modified during Sprint Review or Retrospective.</p>
          </div>
        </div>
      )}

      {/* Epics List */}
      <div className="space-y-4">
        {epics.length === 0 ? (
           <div className="bg-white border-2 border-dashed border-brand-text rounded-2xl p-12 text-center text-zinc-500">
             <Layers size={48} className="mx-auto mb-4 opacity-50" />
             <p className="font-bold">The Product Backlog is empty.</p>
             {canManageState && <p className="text-xs mt-2">Click "New PBI" to add your first large-scale task.</p>}
           </div>
        ) : (
          epics.map(epic => {
            const epicSubtasks = cards.filter(c => c.epicId === epic.id);
            return (
              <div key={epic.id} className="bg-white border-2 border-brand-text rounded-2xl p-5 shadow-brutal-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-anton text-2xl text-brand-text">{epic.title}</h4>
                    {epic.description && <p className="text-sm text-zinc-600 mt-1 max-w-3xl">{epic.description}</p>}
                  </div>
                  {workflow.phase === 'planning' && canManageState && activeOrPlanningSprint && (
                    <button 
                      onClick={() => { setSelectedEpicForSubtask(epic.id); setIsCreateSubtaskOpen(true); }}
                      className="px-3 py-1.5 text-xs font-bold bg-brand-primary text-white border-2 border-brand-text rounded-lg hover:translate-y-[-2px] transition-transform"
                    >
                      + ADD SUBTASK
                    </button>
                  )}
                </div>

                {/* Subtasks */}
                {epicSubtasks.length > 0 && (
                  <div className="mt-4 border-t-2 border-zinc-100 pt-4">
                    <h5 className="text-xs font-bold text-zinc-500 uppercase mb-3 font-mono">Subtasks</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {epicSubtasks.map(task => {
                        const isResolved = task.column === 'resolved';
                        const isInCurrentSprint = task.sprintId === activeOrPlanningSprint?.id;

                        return (
                          <div key={task.id} className="relative group">
                            {isResolved && (
                              <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-brutal-sm border border-brand-text flex items-center gap-1">
                                ✅ COMPLETED
                              </div>
                            )}
                            {!isResolved && (
                              <div className="absolute -top-2 -right-2 z-10 bg-zinc-200 text-zinc-600 text-[10px] font-black px-2 py-0.5 rounded-full shadow-brutal-sm border border-brand-text">
                                {task.column.toUpperCase()}
                              </div>
                            )}
                            
                            <CardUi card={task} onEdit={() => {}} />
                            
                            {!isResolved && workflow.phase === 'planning' && canManageState && activeOrPlanningSprint && (
                              <button 
                                onClick={() => {
                                  if (isInCurrentSprint) {
                                    updateCard({ ...task, sprintId: undefined, updatedAt: new Date().toLocaleTimeString() });
                                    addLog(`Removed "${task.title}" from sprint.`, 'info');
                                  } else {
                                    updateCard({ ...task, sprintId: activeOrPlanningSprint.id, column: 'backlog', updatedAt: new Date().toLocaleTimeString() });
                                    addLog(`Added "${task.title}" to sprint.`, 'success');
                                  }
                                }}
                                className={`mt-2 w-full text-[10px] font-bold py-1.5 rounded-lg border border-brand-text transition-colors ${
                                  isInCurrentSprint 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-brand-surface text-brand-text hover:bg-brand-primary hover:text-white'
                                }`}
                              >
                                {isInCurrentSprint ? 'EXCLUDE FROM SPRINT' : 'INCLUDE IN SPRINT'}
                              </button>
                            )}
                            
                            {!isResolved && workflow.phase === 'planning_locked' && isInCurrentSprint && (
                              <div className="mt-2 w-full text-[10px] font-bold bg-zinc-200 text-zinc-500 py-1.5 rounded-lg border border-brand-text text-center">
                                INCLUDED IN SPRINT
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <CreateEpicModal isOpen={isCreateEpicOpen} onClose={() => setIsCreateEpicOpen(false)} />
      <CreateSprintModal isOpen={isCreateSprintOpen} onClose={() => setIsCreateSprintOpen(false)} />
      <CreateCardModal 
        isOpen={isCreateCardOpen} 
        onClose={() => setIsCreateCardOpen(false)} 
      />
      <CreateCardModal 
        isOpen={isCreateSubtaskOpen} 
        onClose={() => {
          setIsCreateSubtaskOpen(false);
          setSelectedEpicForSubtask(null);
        }} 
        prefilledEpicId={selectedEpicForSubtask || undefined}
        prefilledSprintId={activeOrPlanningSprint?.id}
      />
    </div>
  );
};
