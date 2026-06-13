import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import type { ScrumRole } from '../../types';

export const MeshView: React.FC = () => {
  const { appState, localPeerId, addLog, activeRoom, assignRole, addInvite } = useAppState();
  
  const myRole = appState.roles[localPeerId] || 'DEV';
  const canAssignRoles = myRole === 'PO' || myRole === 'SM';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('Copied Board Invite Code to clipboard.', 'success');
  };

  const generateAndCopyInvite = (role: ScrumRole) => {
    if (!activeRoom) return;
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    addInvite(token, role);
    const inviteLink = `${activeRoom}__${token}`;
    navigator.clipboard.writeText(inviteLink);
    addLog(`Generated and copied secure ${role} Invite Link!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 border-2 border-brand-text rounded-2xl shadow-brutal flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-anton text-brand-text leading-none">Direct Teammate Connections</h2>
          <p className="text-zinc-600 text-xs font-medium mt-1">Connect directly with team members around you. No intermediate cloud database is used—just computer-to-computer.</p>
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-bold text-zinc-500 uppercase">My Role</span>
          <span className={`px-3 py-1 font-bold rounded border-2 shadow-brutal-sm ${myRole === 'PO' ? 'bg-brand-primary text-white border-brand-text' : myRole === 'SM' ? 'bg-brand-accent border-brand-text' : 'bg-zinc-200 border-zinc-400'}`}>
            {myRole === 'PO' ? 'Product Owner' : myRole === 'SM' ? 'Scrum Master' : 'Developer'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm space-y-6 text-left">
          <h3 className="text-xl font-anton text-brand-text border-b-2 border-brand-text pb-2">Share Board Invite Code</h3>

          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-zinc-500 mb-4 leading-snug">Generate secure, multi-use invite links for specific roles. Teammates using these links will automatically join with the assigned role.</p>
              
              {canAssignRoles ? (
                <div className="flex flex-col gap-3">
                  <button onClick={() => generateAndCopyInvite('PO')} className="w-full px-4 py-2 bg-brand-primary text-white border-2 border-brand-text rounded-xl font-bold text-xs hover:translate-y-[-2px] transition-transform shadow-brutal-sm text-left flex justify-between items-center">
                    <span>Copy Product Owner Invite</span>
                    <span className="text-lg">🔗</span>
                  </button>
                  <button onClick={() => generateAndCopyInvite('SM')} className="w-full px-4 py-2 bg-brand-accent text-brand-text border-2 border-brand-text rounded-xl font-bold text-xs hover:translate-y-[-2px] transition-transform shadow-brutal-sm text-left flex justify-between items-center">
                    <span>Copy Scrum Master Invite</span>
                    <span className="text-lg">🔗</span>
                  </button>
                  <button onClick={() => generateAndCopyInvite('DEV')} className="w-full px-4 py-2 bg-white text-brand-text border-2 border-brand-text rounded-xl font-bold text-xs hover:translate-y-[-2px] transition-transform shadow-brutal-sm text-left flex justify-between items-center">
                    <span>Copy Developer Invite</span>
                    <span className="text-lg">🔗</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    type="text" 
                    value={activeRoom || ''}
                    className="w-full text-xs font-mono border-2 border-brand-text p-2.5 rounded-lg bg-brand-bg" 
                  />
                  <button onClick={() => copyToClipboard(activeRoom || '')} className="px-3 bg-brand-surface border-2 border-brand-text rounded-lg font-bold text-xs hover:bg-white" title="Copy Invitation Key">Copy</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border-2 border-brand-text p-6 rounded-2xl shadow-brutal-sm text-left flex flex-col">
          <div className="flex items-center justify-between border-b-2 border-brand-text pb-2 mb-4">
            <h3 className="text-xl font-anton text-brand-text">Active Device Links</h3>
            {activeRoom && (
              <span className="px-2 py-1 bg-brand-surface border border-brand-text text-[10px] font-bold font-mono rounded text-brand-text">
                ROOM: {activeRoom.substring(0, 15)}...
              </span>
            )}
          </div>

          <div className="space-y-3 flex-1">
            {!activeRoom ? (
              <div className="text-center p-8 border-2 border-dashed border-brand-text rounded-xl bg-brand-bg text-zinc-500">
                <span className="text-2xl mb-2 block">📡</span>
                <span className="font-bold text-sm">Not Connected</span>
                <p className="text-xs mt-1">Generate an invite code and share it with a teammate to begin real-time sync.</p>
              </div>
            ) : appState.peers.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-brand-primary rounded-xl bg-brand-bg text-brand-primary">
                <span className="text-2xl mb-2 block animate-pulse">⏳</span>
                <span className="font-bold text-sm">Waiting for Teammates...</span>
                <p className="text-xs mt-1">You are connected to the signaling room. Waiting for someone to join.</p>
              </div>
            ) : (
              appState.peers.map(peer => (
                <div key={peer.id} className="flex items-center justify-between p-4 border-2 border-brand-text rounded-xl bg-brand-bg">
                  <div>
                    <h5 className="font-bold text-brand-text text-sm flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{peer.alias}</span>
                    </h5>
                    <span className="text-[10px] font-mono text-zinc-500 block mt-1">ID: {peer.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {canAssignRoles ? (
                      <select
                        className="text-xs font-bold p-1 border-2 border-brand-text rounded bg-white shadow-brutal-sm"
                        value={peer.role || 'DEV'}
                        onChange={(e) => assignRole(peer.id, e.target.value as any)}
                      >
                        <option value="PO">Product Owner</option>
                        <option value="SM">Scrum Master</option>
                        <option value="DEV">Developer</option>
                      </select>
                    ) : (
                      <span className="text-xs font-bold px-2 py-1 bg-zinc-200 border-2 border-zinc-400 rounded">
                        {peer.role === 'PO' ? 'Product Owner' : peer.role === 'SM' ? 'Scrum Master' : 'Developer'}
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-1 bg-brand-surface border border-brand-text rounded-md uppercase">
                      {peer.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-6 border-t-2 border-brand-text">
            <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase mb-2">How Direct Sharing Works</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Synkan works differently from traditional tools. Instead of sending your sensitive tasks to a centralized cloud company, it establishes a secure, end-to-end encrypted direct connection between your browser and your team's browsers. Your work is kept private, is incredibly fast, and keeps running even if your internet goes down.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
