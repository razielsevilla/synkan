import React, { useMemo } from 'react';
import { useAppState } from '../../context/AppStateContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { appState } = useAppState();

  // 1. Velocity Data: Points completed per closed sprint
  const velocityData = useMemo(() => {
    const closedSprints = appState.sprints.filter(s => s.status === 'closed');
    
    return closedSprints.map(sprint => {
      // Find cards that belonged to this sprint and were resolved
      // In a real app, we'd need historical logs, but for simplicity we'll assume current state
      const sprintCards = appState.cards.filter(c => c.sprintId === sprint.id);
      const completedPoints = sprintCards.filter(c => c.column === 'resolved').reduce((sum, c) => sum + (c.storyPoints || 0), 0);
      const plannedPoints = sprintCards.reduce((sum, c) => sum + (c.storyPoints || 0), 0);

      return {
        name: sprint.name,
        Completed: completedPoints,
        Planned: plannedPoints
      };
    });
  }, [appState.sprints, appState.cards]);

  // 2. Burndown Data: For the ACTIVE sprint
  const activeSprint = useMemo(() => appState.sprints.find(s => s.status === 'active'), [appState.sprints]);
  
  const burndownData = useMemo(() => {
    if (!activeSprint) return [];

    const sprintCards = appState.cards.filter(c => c.sprintId === activeSprint.id);
    const totalPoints = sprintCards.reduce((sum, c) => sum + (c.storyPoints || 0), 0);
    const completedPoints = sprintCards.filter(c => c.column === 'resolved').reduce((sum, c) => sum + (c.storyPoints || 0), 0);
    
    // Very simplified burndown: just start and current.
    // In a real local-first app, we'd parse the Yjs log to get daily points remaining.
    return [
      { day: 'Start', 'Points Remaining': totalPoints, 'Ideal': totalPoints },
      { day: 'Today', 'Points Remaining': totalPoints - completedPoints, 'Ideal': totalPoints / 2 },
      { day: 'End', 'Points Remaining': null, 'Ideal': 0 }
    ];
  }, [activeSprint, appState.cards]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border-2 border-brand-text rounded-2xl shadow-brutal">
        <h2 className="text-3xl font-anton text-brand-text leading-none uppercase">Metrics & Analytics</h2>
        <p className="text-zinc-600 text-xs font-medium mt-1">Track your team's velocity and sprint health, calculated entirely locally.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ACTIVE SPRINT BURNDOWN */}
        <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm">
          <div className="mb-6 border-b-2 border-brand-text pb-2">
            <h3 className="text-xl font-anton text-brand-text uppercase">Active Sprint Burndown</h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">
              {activeSprint ? activeSprint.name : 'No active sprint'}
            </p>
          </div>
          
          <div className="h-64 w-full">
            {!activeSprint ? (
              <div className="h-full flex items-center justify-center text-zinc-400 text-xs italic">Start a sprint to see burndown</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burndownData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#52525b', fontFamily: 'monospace' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#52525b', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '2px solid #18181B', boxShadow: '4px 4px 0px #18181B' }} 
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="Ideal" stroke="#a1a1aa" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="Points Remaining" stroke="#D1503C" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* HISTORICAL VELOCITY */}
        <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm">
          <div className="mb-6 border-b-2 border-brand-text pb-2">
            <h3 className="text-xl font-anton text-brand-text uppercase">Team Velocity</h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Historical points completed per sprint</p>
          </div>
          
          <div className="h-64 w-full">
            {velocityData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-400 text-xs italic">Complete a sprint to see velocity data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#52525b', fontFamily: 'monospace' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#52525b', fontFamily: 'monospace' }} />
                  <Tooltip 
                    cursor={{ fill: '#f4f4f5' }}
                    contentStyle={{ borderRadius: '8px', border: '2px solid #18181B', boxShadow: '4px 4px 0px #18181B' }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                  <Bar dataKey="Planned" fill="#6EADBC" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completed" fill="#2E86AB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
