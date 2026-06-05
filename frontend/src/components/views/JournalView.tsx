import React, { useRef, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';

export const JournalView: React.FC = () => {
  const { appState, logs, clearLogs, addLog, restoreCard, permanentDelete } = useAppState();
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleRestore = (id: string) => {
    restoreCard(id);
    addLog('Restored task from trash bin.', 'success');
  };

  const handlePermanentDelete = (id: string) => {
    permanentDelete(id);
    addLog('Permanently deleted task from disk.', 'error');
  };

  const getLogColorClass = (type: string) => {
    if (type === 'error') return 'text-brand-accent font-semibold';
    if (type === 'success') return 'text-brand-surface font-semibold';
    return 'text-[#6EADBC]';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border-2 border-brand-text rounded-2xl shadow-brutal">
        <h2 className="text-3xl font-anton text-brand-text leading-none">Activity History & Trash Bin</h2>
        <p className="text-zinc-600 text-xs font-medium mt-1">Inspect edits made to your board, view detailed changes, and manage deleted tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 text-left">
          <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm">
            <h3 className="text-lg font-anton text-brand-text border-b-2 border-brand-text pb-2 mb-4">Action Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-bg p-3 border border-brand-text rounded-lg">
                <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase block">Actions Saved</span>
                <span className="text-xl font-anton text-brand-primary">{logs.length} Actions</span>
              </div>
              <div className="bg-brand-bg p-3 border border-brand-text rounded-lg">
                <span className="text-[10px] font-sans font-bold text-zinc-500 uppercase block">Tasks in Trash</span>
                <span className="text-xl font-anton text-brand-accent">{appState.tombstones.length} Cards</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-surface border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm">
            <h4 className="text-xs font-mono font-bold text-brand-text mb-2">💡 WHAT IS THE TRASH BIN?</h4>
            <p className="text-xs text-zinc-800 leading-relaxed font-semibold">
              When you delete a card, it is sent here temporarily as a "deleted item". This is done so offline teammates have a chance to sync their updates before the task is completely removed from all devices. You can restore items to your board at any time or empty the bin forever.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm text-left flex flex-col">
          <div className="flex items-center justify-between border-b-2 border-brand-text pb-2 mb-4">
            <h3 className="text-xl font-anton text-brand-text">Live Action History</h3>
            <button onClick={clearLogs} className="text-xs font-bold text-brand-accent font-mono hover:underline">Clear History View</button>
          </div>

          <div ref={logsContainerRef} className="bg-brand-text text-[#F5F2EA] p-5 rounded-xl font-mono text-xs h-[400px] overflow-y-auto space-y-2 flex-1">
            {logs.length === 0 ? (
              <div className="text-zinc-500 italic">No activity recorded yet for this session.</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="pb-1.5 border-b border-zinc-800 text-left text-xs font-mono">
                  <span className="text-zinc-500">[{log.timestamp}]</span> <span className={getLogColorClass(log.type)}>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm text-left">
        <h3 className="text-xl font-anton text-brand-text mb-4 border-b-2 border-brand-text pb-2">Tasks Currently in Trash Bin</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className="bg-brand-bg border-b border-brand-text font-bold text-zinc-500">
                <th className="p-3">ID</th>
                <th className="p-3">TASK TITLE</th>
                <th className="p-3">PREVIOUS COLUMN</th>
                <th className="p-3">TIME DELETED</th>
                <th className="p-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {appState.tombstones.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-zinc-500 italic">Trash bin is empty.</td>
                </tr>
              ) : (
                appState.tombstones.map(tombstone => (
                  <tr key={tombstone.id} className="hover:bg-brand-bg/50">
                    <td className="p-3 font-mono">{tombstone.id}</td>
                    <td className="p-3 font-bold">{tombstone.title}</td>
                    <td className="p-3 uppercase text-[10px]">{tombstone.column}</td>
                    <td className="p-3">{tombstone.deletedAt}</td>
                    <td className="p-3 text-right space-x-3">
                      <button onClick={() => handleRestore(tombstone.id)} className="font-bold text-brand-primary hover:underline">Restore</button>
                      <button onClick={() => handlePermanentDelete(tombstone.id)} className="font-bold text-brand-accent hover:underline">Delete Forever</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
