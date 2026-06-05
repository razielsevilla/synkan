export type Priority = 'High' | 'Medium' | 'Low';
export type ColumnType = 'backlog' | 'ready' | 'progress' | 'resolved';

export interface Card {
  id: string;
  title: string;
  column: ColumnType;
  priority: Priority;
  orderKey: string;
  updatedAt: string;
}

export interface Tombstone {
  id: string;
  title: string;
  column: ColumnType;
  priority: Priority;
  deletedAt: string;
}

export interface Peer {
  id: string;
  alias: string;
  status: 'CONNECTED' | 'PENDING' | 'OFFLINE';
}

export interface Warning {
  id: string;
  message: string;
  timestamp: string;
}

export interface AppState {
  boardName?: string;
  cards: Card[];
  tombstones: Tombstone[];
  peers: Peer[];
  warnings: Warning[];
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
  timestamp: string;
}
