export enum SyncStrategy {
  MERGE_PREFER_CALENTO = 'merge_prefer_calento',
  MERGE_PREFER_GOOGLE = 'merge_prefer_google',
  KEEP_BOTH = 'keep_both',
}

export enum ConflictReason {
  DUPLICATE = 'duplicate',
  TIME_OVERLAP = 'time_overlap',
  MISSING_MAPPING = 'missing_mapping',
}

export enum ConflictResolution {
  PREFER_CALENTO = 'prefer_calento',
  PREFER_GOOGLE = 'prefer_google',
  KEEP_BOTH = 'keep_both',
  MANUAL_MERGE = 'manual_merge',
  DELETE_BOTH = 'delete_both',
  IGNORE = 'ignore',
}

export interface SyncConflict {
  calendoEventId?: string;
  googleEventId?: string;
  reason: ConflictReason;
  calendoEvent?: any;
  googleEvent?: any;
  resolution?: string;
  resolved?: boolean;
  createdAt?: Date;
  resolvedAt?: Date;
}

export interface InitialSyncResult {
  totalGoogleEvents: number;
  totalCalentoEvents: number;
  imported: number;
  conflicts: SyncConflict[];
  errors: string[];
}

export interface SyncResult {
  success: boolean;
  syncedToGoogle: boolean;
  googleEventId?: string;
  error?: string;
}

export interface SyncStatus {
  connectedToGoogle: boolean;
  isSyncEnabled: boolean;
  canSync: boolean;
  lastSyncAt?: Date;
}
