import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import type { AppState, Card, LogEntry, Tombstone, Peer } from '../types';

const PEER_KEY = 'synkan_local_peer_id';
const ALIAS_KEY = 'synkan_local_alias';
const BOARD_KEY = 'synkan_active_board';

interface AppStateContextValue {
  appState: AppState;
  localPeerId: string;
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
  
  // Board & Mesh Actions
  activeRoom: string | null;
  setBoardAndAlias: (boardId: string, alias: string, initialBoardName?: string) => void;
  leaveBoard: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localPeerId, setLocalPeerId] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  // Use useMemo to keep the Y.Doc instance stable
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yCards = useMemo(() => ydoc.getMap<Card>('cards'), [ydoc]);
  const yTombstones = useMemo(() => ydoc.getMap<Tombstone>('tombstones'), [ydoc]);
  const yMetadata = useMemo(() => ydoc.getMap<string>('metadata'), [ydoc]);

  const [appState, setAppState] = useState<AppState>({
    cards: [],
    tombstones: [],
    peers: [],
    warnings: []
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
    
    if (savedBoardId) {
      setBoardAndAlias(savedBoardId, savedAlias);
    }
    
    // Listen to Yjs changes
    const updateReactState = () => {
      setAppState(prev => ({
        ...prev,
        boardName: yMetadata.get('name') || undefined,
        cards: Array.from(yCards.values()),
        tombstones: Array.from(yTombstones.values())
      }));
    };

    yCards.observe(updateReactState);
    yTombstones.observe(updateReactState);
    yMetadata.observe(updateReactState);

    return () => {
      yCards.unobserve(updateReactState);
      yTombstones.unobserve(updateReactState);
      yMetadata.unobserve(updateReactState);
    };
  }, []);

  const setBoardAndAlias = (boardId: string, alias: string, initialBoardName?: string) => {
    localStorage.setItem(BOARD_KEY, boardId);
    localStorage.setItem(ALIAS_KEY, alias);
    
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
      });
      
      // Force update
      setAppState(prev => ({
        ...prev,
        boardName: yMetadata.get('name') || undefined,
        cards: Array.from(yCards.values()),
        tombstones: Array.from(yTombstones.values())
      }));
    });
    setIdbProvider(newIdb);

    // 2. Setup WebRTC Provider
    if (provider) {
      provider.destroy();
    }
    const newProvider = new WebrtcProvider(boardId, ydoc, { 
      signaling: [import.meta.env.VITE_SIGNALING_URL || 'ws://localhost:4444'],
      password: null,
      awareness: new awarenessProtocol.Awareness(ydoc)
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
          status: 'CONNECTED' as const
        }))
        .filter(p => p.id !== (localPeerId || localStorage.getItem(PEER_KEY))); // Exclude self
      
      setAppState(prev => ({ ...prev, peers }));
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

  return (
    <AppStateContext.Provider value={{ 
      appState, localPeerId, logs, addLog, clearLogs, clearWarnings,
      addCard, updateCard, deleteCard, restoreCard, permanentDelete,
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
