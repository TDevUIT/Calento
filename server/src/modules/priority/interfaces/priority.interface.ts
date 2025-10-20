export enum ItemType {
  TASK = 'task',
  BOOKING_LINK = 'booking_link',
  HABIT = 'habit',
  SMART_MEETING = 'smart_meeting',
}

export enum PriorityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  DISABLED = 'disabled',
}

export interface UserPriority {
  id: string;
  user_id: string;
  item_id: string;
  item_type: ItemType;
  priority: PriorityLevel;
  position: number;
  created_at: Date;
  updated_at: Date;
}

export interface PriorityUpdatePayload {
  item_id: string;
  item_type: ItemType;
  priority: PriorityLevel;
  position?: number;
}

export interface BulkPriorityUpdate {
  updates: PriorityUpdatePayload[];
}
