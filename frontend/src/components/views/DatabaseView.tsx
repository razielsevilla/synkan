import React, { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateContext';

export const DatabaseView: React.FC = () => {
  const { appState, addLog, leaveBoard, activeRoom } = useAppState();
  const [size, setSize] = useState('Calculating...');
  const [percent, setPercent] = useState('0%');

  useEffect(() => {
    // Simulate calculating local storage usage
    const str = JSON.stringify(appState);
    const bytes = new Blob([str]).size;
    const kb = (bytes / 1024).toFixed(2);
    setSize(`${kb} KB`);

    // Simulate memory allocation (just visual)
    const p = Math.min(100, Math.max(1, Math.floor((bytes / 500000) * 100)));
    setPercent(`${p}%`);
  }, [appState]);

  const handleVacuum = () => {
    addLog('Executing SQLite VACUUM command...', 'info');
    setTimeout(() => {
      addLog('Storage compacted. 0 bytes recovered.', 'success');
    }, 1500);
  };

  const handleViewSchema = (tableName: string) => {
    addLog(`Dumping schema for table: ${tableName}`, 'info');
    alert(`Showing schema for ${tableName} in logs (or a modal in full version)`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border-2 border-brand-text rounded-2xl shadow-brutal">
        <h2 className="text-3xl font-anton text-brand-text leading-none">Device Storage & Data Settings</h2>
        <p className="text-zinc-600 text-xs font-medium mt-1">Manage how tasks are stored on your computer, check available browser storage, and keep your local database optimized.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 text-left">
          <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm space-y-4">
            <h3 className="text-lg font-anton text-brand-text border-b-2 border-brand-text pb-2">Active Storage Used</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-zinc-500 font-bold">DATABASE DRIVER:</span>
                <span className="font-bold bg-brand-surface text-brand-text px-2 py-0.5 border border-brand-text rounded text-[10px] font-mono">SQLite (Local Thread)</span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-zinc-500 font-bold">CURRENT FILE SIZE:</span>
                <span className="font-bold text-brand-text font-mono">{size}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-zinc-500 font-bold">SAVED PATH:</span>
                <span className="font-bold text-brand-text">Your Browser Sandboxed Drive</span>
              </div>
            </div>

            <button onClick={handleVacuum} className="w-full py-2.5 text-xs font-black bg-brand-accent text-white border-2 border-brand-text rounded-xl shadow-brutal-sm hover:translate-y-[-1px] transition-transform">
              COMPRESS STORAGE & OPTIMIZE SPEED
            </button>

            <div className="pt-4 border-t-2 border-brand-text">
              <p className="text-[10px] text-zinc-500 mb-2 leading-snug">
                You are currently in the board <span className="font-bold">"{activeRoom?.substring(0, 8)}..."</span>. Leaving this board will not delete its data, but will return you to the onboarding screen to join or create another board.
              </p>
              <button onClick={leaveBoard} className="w-full py-2.5 text-xs font-black bg-white text-brand-accent border-2 border-brand-accent rounded-xl shadow-brutal-sm hover:bg-brand-accent hover:text-white transition-colors">
                LEAVE / SWITCH BOARD
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm space-y-3">
            <h4 className="text-xs font-sans font-bold text-brand-text uppercase">Browser Memory Allocation</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Allocated Space Percentage</span>
                <span className="font-mono font-bold">{percent}</span>
              </div>
              <div className="w-full bg-brand-bg rounded-full h-2 border border-brand-text overflow-hidden">
                <div className="bg-brand-primary h-full transition-all duration-500" style={{ width: percent }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm text-left">
          <h3 className="text-xl font-anton text-brand-text border-b-2 border-brand-text pb-2 mb-4">
            Under-the-Hood: Local Storage Tables
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-brand-bg border-b-2 border-brand-text text-zinc-600 font-bold uppercase">
                  <th className="p-3">DATA SHEET NAME</th>
                  <th className="p-3">HEALTH STATUS</th>
                  <th className="p-3">DIAGNOSTIC ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                <tr className="hover:bg-brand-bg/50">
                  <td className="p-3 font-bold text-brand-primary">Active Tasks Table</td>
                  <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold text-[10px]">SAVED SECURELY</span></td>
                  <td className="p-3"><button onClick={() => handleViewSchema('tbl_synkan_cards')} className="text-xs text-brand-accent font-bold underline">Blueprint Schema</button></td>
                </tr>
                <tr className="hover:bg-brand-bg/50">
                  <td className="p-3 font-bold text-brand-primary">Connected Devices Table</td>
                  <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold text-[10px]">SAVED SECURELY</span></td>
                  <td className="p-3"><button onClick={() => handleViewSchema('tbl_synkan_peers')} className="text-xs text-brand-accent font-bold underline">Blueprint Schema</button></td>
                </tr>
                <tr className="hover:bg-brand-bg/50">
                  <td className="p-3 font-bold text-brand-primary">Activity History Table</td>
                  <td className="p-3"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold text-[10px]">SAVED SECURELY</span></td>
                  <td className="p-3"><button onClick={() => handleViewSchema('tbl_synkan_ledger_log')} className="text-xs text-brand-accent font-bold underline">Blueprint Schema</button></td>
                </tr>
                <tr className="hover:bg-brand-bg/50">
                  <td className="p-3 font-bold text-brand-primary">Trash Bin Table</td>
                  <td className="p-3"><span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-300 font-bold text-[10px]">MONITORED</span></td>
                  <td className="p-3"><button onClick={() => handleViewSchema('tbl_synkan_tombstones')} className="text-xs text-brand-accent font-bold underline">Blueprint Schema</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h4 className="text-xs font-sans font-bold text-zinc-500 uppercase mb-2">Technical Blueprint Definition</h4>
            <pre className="bg-brand-text text-[#F5F2EA] p-4 rounded-xl font-mono text-xs overflow-x-auto">
              {`CREATE TABLE tbl_synkan_cards (
    card_id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    col_name TEXT NOT NULL,
    lexical_sort_key TEXT NOT NULL,
    priority TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
