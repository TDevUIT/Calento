export type ItemType = 'task' | 'booking_link' | 'habit' | 'smart_meeting';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low' | 'disabled';

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

export interface UpdatePriorityRequest {
  item_id: string;
  item_type: ItemType;
  priority: PriorityLevel;
  position?: number;
}

export interface BulkUpdatePriorityRequest {
  updates: UpdatePriorityRequest[];
}
