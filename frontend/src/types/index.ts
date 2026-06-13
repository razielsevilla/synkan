export type Priority = 'High' | 'Medium' | 'Low';
export type ColumnType = 'backlog' | 'ready' | 'progress' | 'resolved';
export type CardType = 'epic' | 'story' | 'task';
export type SprintStatus = 'planning' | 'active' | 'closed';

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  updatedAt: string;
}

export interface Epic {
  id: string;
  title: string;
  description?: string;
  updatedAt: string;
}

export type CeremonyType = 'planning' | 'daily' | 'review' | 'retro';

export interface CeremonyNote {
  id: string;
  sprintId: string;
  type: CeremonyType;
  content: string; // JSON string or plain text depending on type
  authorId: string;
  createdAt: string;
}

export interface Card {
  id: string;
  title: string;
  column: ColumnType;
  priority: Priority;
  orderKey: string;
  updatedAt: string;
  
  // V2 Scrumban additions
  description?: string;
  sprintId?: string;
  epicId?: string;
  storyPoints?: number;
  assigneeId?: string;
  type?: CardType;
  startDate?: string;
  endDate?: string;
}

export interface Tombstone {
  id: string;
  title: string;
  column: ColumnType;
  priority: Priority;
  deletedAt: string;
}

export type ScrumRole = 'PO' | 'SM' | 'DEV';

export interface Peer {
  id: string;
  alias: string;
  status: 'CONNECTED' | 'PENDING' | 'OFFLINE';
  role?: ScrumRole;
}

export type WorkflowPhase = 'initial_backlog' | 'planning' | 'planning_locked' | 'active_sprint' | 'review' | 'retro' | 'refinement';

export interface WorkflowState {
  id: 'global';
  phase: WorkflowPhase;
  activeSprintId: string | null;
  standupTime: string; // e.g., "09:00"
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
  sprints: Sprint[];
  epics: Epic[];
  ceremonyNotes: CeremonyNote[];
  workflow: WorkflowState;
  roles: Record<string, ScrumRole>;
  invites: Record<string, ScrumRole>;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
  timestamp: string;
}
