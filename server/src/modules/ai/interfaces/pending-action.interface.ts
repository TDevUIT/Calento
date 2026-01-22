export interface PendingAction {
  id: string;
  conversation_id: string;
  type: string;
  title: string;
  description: string;
  parameters: Record<string, any>;
  analysis?: ActionAnalysis;
  requires_confirmation: boolean;
  confirmation_status: 'not_required' | 'awaiting_confirmation' | 'confirmed' | 'rejected';
  created_at: Date;
}

export interface ActionAnalysis {
  match_score?: number;
  conflicts?: string[];
  suggestions?: string[];
  availability?: {
    checked_calendars: number;
    available_slots: number;
    best_time?: string;
  };
  members?: {
    name: string;
    available: boolean;
  }[];
}

export interface ActionConfirmation {
  action_id: string;
  confirmed: boolean;
  modified_parameters?: Record<string, any>;
}
