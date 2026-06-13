import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import type { AppState, Card, LogEntry, Tombstone, Peer, Sprint, Epic, CeremonyNote, WorkflowState, ScrumRole } from '../types';

const PEER_KEY = 'synkan_local_peer_id';
const ALIAS_KEY = 'synkan_local_alias';
const BOARD_KEY = 'synkan_active_board';

interface AppStateContextValue {
  appState: AppState;
  localPeerId: string;
  localAlias: string;
  logs: LogEntry[];
  addLog: (message: string, type?: 'info' | 'error' | 'success') => void;
  clearLogs: () => void;
  clearWarnings: () => void;
  
  // CRDT Actions
  addCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  deleteCard: (cardId: string) => void;
  restoreCard: (cardId: string) => void;
  permanentDelete: (cardId: string) => void;
  
  addSprint: (sprint: Sprint) => void;
  updateSprint: (sprint: Sprint) => void;
  addEpic: (epic: Epic) => void;
  updateEpic: (epic: Epic) => void;
  
  addCeremonyNote: (note: CeremonyNote) => void;
  deleteCeremonyNote: (id: string) => void;
  
  updateWorkflow: (updates: Partial<WorkflowState>) => void;
  assignRole: (peerId: string, role: ScrumRole) => void;
  addInvite: (token: string, role: ScrumRole) => void;
  
  // Board & Mesh Actions
  activeRoom: string | null;
  setBoardAndAlias: (boardId: string, alias: string, initialBoardName?: string, inviteToken?: string) => void;
  leaveBoard: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localPeerId, setLocalPeerId] = useState('');
  const [localAlias, setLocalAlias] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  // Use useMemo to keep the Y.Doc instance stable
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yCards = useMemo(() => ydoc.getMap<Card>('cards'), [ydoc]);
  const yTombstones = useMemo(() => ydoc.getMap<Tombstone>('tombstones'), [ydoc]);
  const yMetadata = useMemo(() => ydoc.getMap<string>('metadata'), [ydoc]);
  const ySprints = useMemo(() => ydoc.getMap<Sprint>('sprints'), [ydoc]);
  const yEpics = useMemo(() => ydoc.getMap<Epic>('epics'), [ydoc]);
  const yCeremonyNotes = useMemo(() => ydoc.getMap<CeremonyNote>('ceremonyNotes'), [ydoc]);
  const yWorkflow = useMemo(() => ydoc.getMap<any>('workflow'), [ydoc]);
  const yRoles = useMemo(() => ydoc.getMap<ScrumRole>('roles'), [ydoc]);
  const yInvites = useMemo(() => ydoc.getMap<ScrumRole>('invites'), [ydoc]);

  const [appState, setAppState] = useState<AppState>({
    cards: [],
    tombstones: [],
    peers: [],
    warnings: [],
    sprints: [],
    epics: [],
    ceremonyNotes: [],
    workflow: { id: 'global', phase: 'initial_backlog', activeSprintId: null, standupTime: '09:00' },
    roles: {},
    invites: {}
  });

  const [provider, setProvider] = useState<WebrtcProvider | null>(null);
  const [idbProvider, setIdbProvider] = useState<IndexeddbPersistence | null>(null);

  useEffect(() => {
    // Generate or load Peer ID
    let peerId = localStorage.getItem(PEER_KEY);
    if (!peerId) {
      const arr = new Uint8Array(8);
      window.crypto.getRandomValues(arr);
      peerId = 'device_' + Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(PEER_KEY, peerId);
    }
    setLocalPeerId(peerId);

    // Check for existing board
    const savedBoardId = localStorage.getItem(BOARD_KEY);
    const savedAlias = localStorage.getItem(ALIAS_KEY) || 'Anonymous';
    setLocalAlias(savedAlias);
    
    if (savedBoardId) {
      setBoardAndAlias(savedBoardId, savedAlias);
    }
    
    // Listen to Yjs changes
    const updateReactState = () => {
      const workflowState = yWorkflow.get('global') as WorkflowState || { id: 'global', phase: 'initial_backlog', activeSprintId: null, standupTime: '09:00' };
      const rolesObj = Object.fromEntries(yRoles.entries());
      
      setAppState(prev => ({
        ...prev,
        boardName: yMetadata.get('name') || undefined,
        cards: Array.from(yCards.values()),
        tombstones: Array.from(yTombstones.values()),
        sprints: Array.from(ySprints.values()),
        epics: Array.from(yEpics.values()),
        ceremonyNotes: Array.from(yCeremonyNotes.values()),
        workflow: workflowState,
        roles: rolesObj,
        invites: Object.fromEntries(yInvites.entries()),
        peers: prev.peers.map(p => ({ ...p, role: rolesObj[p.id] }))
      }));
    };

    yCards.observe(updateReactState);
    yTombstones.observe(updateReactState);
    yMetadata.observe(updateReactState);
    ySprints.observe(updateReactState);
    yEpics.observe(updateReactState);
    yCeremonyNotes.observe(updateReactState);
    yWorkflow.observe(updateReactState);
    yRoles.observe(updateReactState);
    yInvites.observe(updateReactState);

    return () => {
      yCards.unobserve(updateReactState);
      yTombstones.unobserve(updateReactState);
      yMetadata.unobserve(updateReactState);
      ySprints.unobserve(updateReactState);
      yEpics.unobserve(updateReactState);
      yCeremonyNotes.unobserve(updateReactState);
      yWorkflow.unobserve(updateReactState);
      yRoles.unobserve(updateReactState);
      yInvites.unobserve(updateReactState);
    };
  }, []);

  const setBoardAndAlias = (boardId: string, alias: string, initialBoardName?: string, inviteToken?: string) => {
    localStorage.setItem(BOARD_KEY, boardId);
    localStorage.setItem(ALIAS_KEY, alias);
    setLocalAlias(alias);
    
    // 1. Setup local IndexedDB persistence scoped to this boardId
    if (idbProvider) {
      idbProvider.destroy();
    }
    const newIdb = new IndexeddbPersistence(`synkan_yjs_store_${boardId}`, ydoc);
    
    newIdb.on('synced', () => {
      ydoc.transact(() => {
        if (initialBoardName && !yMetadata.has('name')) {
          yMetadata.set('name', initialBoardName);
        }
        if (!yWorkflow.has('global')) {
          yWorkflow.set('global', { id: 'global', phase: 'initial_backlog', activeSprintId: null, standupTime: '09:00' });
        }
        if (!yRoles.has(localPeerId || localStorage.getItem(PEER_KEY) || '') && !inviteToken) {
          // Board creator gets Scrum Master role automatically (if no invite token used)
          yRoles.set(localPeerId || localStorage.getItem(PEER_KEY) || '', 'SM');
        }
      });
      
      // Force update
      const workflowState = yWorkflow.get('global') as WorkflowState || { id: 'global', phase: 'initial_backlog', activeSprintId: null, standupTime: '09:00' };
      const rolesObj = Object.fromEntries(yRoles.entries());
      
      setAppState(prev => ({
        ...prev,
        boardName: yMetadata.get('name') || undefined,
        cards: Array.from(yCards.values()),
        tombstones: Array.from(yTombstones.values()),
        sprints: Array.from(ySprints.values()),
        epics: Array.from(yEpics.values()),
        ceremonyNotes: Array.from(yCeremonyNotes.values()),
        workflow: workflowState,
        roles: rolesObj,
        invites: Object.fromEntries(yInvites.entries())
      }));
    });
    setIdbProvider(newIdb);

    // 2. Setup WebRTC Provider
    if (provider) {
      provider.destroy();
    }
    const newProvider = new WebrtcProvider(boardId, ydoc, {
      signaling: [import.meta.env.VITE_SIGNALING_URL || 'ws://localhost:4444']
    });

    // Update awareness (presence)
    newProvider.awareness.setLocalStateField('user', {
      name: alias,
      id: localPeerId || localStorage.getItem(PEER_KEY)
    });

    newProvider.awareness.on('change', () => {
      const states = Array.from(newProvider.awareness.getStates().values());
      const peers: Peer[] = states
        .map((s: any) => ({
          id: s.user?.id || 'unknown',
          alias: s.user?.name || 'Anonymous',
          status: 'CONNECTED' as const,
          role: yRoles.get(s.user?.id || 'unknown')
        }))
        .filter(p => p.id !== (localPeerId || localStorage.getItem(PEER_KEY))); // Exclude self
      
      setAppState(prev => ({ ...prev, peers }));
    });

    newProvider.on('synced', (isSynced: { synced: boolean }) => {
      if (isSynced.synced && inviteToken) {
        const pId = localPeerId || localStorage.getItem(PEER_KEY) || '';
        if (!yRoles.has(pId)) {
          const roleForToken = yInvites.get(inviteToken);
          if (roleForToken) {
            ydoc.transact(() => {
              yRoles.set(pId, roleForToken);
            });
            addLog(`Joined securely as ${roleForToken}!`, 'success');
          } else {
            addLog('Invite token is invalid. You joined as DEV.', 'error');
            ydoc.transact(() => {
              yRoles.set(pId, 'DEV');
            });
          }
        }
      }
    });

    setProvider(newProvider);
    setActiveRoom(boardId);
  };

  const leaveBoard = () => {
    localStorage.removeItem(BOARD_KEY);
    localStorage.removeItem(ALIAS_KEY);
    window.location.reload();
  };

  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: LogEntry = { id: Math.random().toString(), message, type, timestamp };
    setLogs(prev => [...prev, newLog]);
  };

  const clearLogs = () => setLogs([]);

  const clearWarnings = () => {
    setAppState(prev => ({ ...prev, warnings: [] }));
  };

  // CRDT Actions
  const addCard = (card: Card) => {
    yCards.set(card.id, card);
  };

  const updateCard = (card: Card) => {
    yCards.set(card.id, card);
  };

  const deleteCard = (cardId: string) => {
    const card = yCards.get(cardId);
    if (card) {
      ydoc.transact(() => {
        yCards.delete(cardId);
        yTombstones.set(cardId, {
          id: card.id,
          title: card.title,
          column: card.column,
          priority: card.priority,
          deletedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      });
    }
  };

  const restoreCard = (cardId: string) => {
    const tombstone = yTombstones.get(cardId);
    if (tombstone) {
      ydoc.transact(() => {
        yTombstones.delete(cardId);
        yCards.set(cardId, {
          id: tombstone.id,
          title: tombstone.title,
          column: tombstone.column,
          priority: tombstone.priority,
          orderKey: 'A',
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      });
    }
  };

  const permanentDelete = (cardId: string) => {
    yTombstones.delete(cardId);
  };

  const addSprint = (sprint: Sprint) => ySprints.set(sprint.id, sprint);
  const updateSprint = (sprint: Sprint) => ySprints.set(sprint.id, sprint);
  const addEpic = (epic: Epic) => yEpics.set(epic.id, epic);
  const updateEpic = (epic: Epic) => yEpics.set(epic.id, epic);
  
  const addCeremonyNote = (note: CeremonyNote) => yCeremonyNotes.set(note.id, note);
  const deleteCeremonyNote = (id: string) => yCeremonyNotes.delete(id);
  
  const updateWorkflow = (updates: Partial<WorkflowState>) => {
    const current = yWorkflow.get('global') as WorkflowState || { id: 'global', phase: 'initial_backlog', activeSprintId: null, standupTime: '09:00' };
    yWorkflow.set('global', { ...current, ...updates });
  };
  
  const assignRole = (peerId: string, role: ScrumRole) => yRoles.set(peerId, role);
  const addInvite = (token: string, role: ScrumRole) => yInvites.set(token, role);

  return (
    <AppStateContext.Provider value={{ 
      appState, localPeerId, localAlias, logs, addLog, clearLogs, clearWarnings,
      addCard, updateCard, deleteCard, restoreCard, permanentDelete,
      addSprint, updateSprint, addEpic, updateEpic,
      addCeremonyNote, deleteCeremonyNote,
      updateWorkflow, assignRole, addInvite,
      activeRoom, setBoardAndAlias, leaveBoard
    }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
};
