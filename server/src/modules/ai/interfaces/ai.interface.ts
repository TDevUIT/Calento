export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  function_call?: AIFunctionCall;
  function_response?: any;
  thinking_steps?: ThinkingStep[];
  timestamp?: Date;
}

export interface ThinkingStep {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  label: string;
  icon?: string;
  timestamp?: Date;
}

export interface AIFunctionCall {
  name: string;
  arguments: Record<string, any>;
}

export interface AIConversation {
  id: string;
  user_id: string;
  messages: AIMessage[];
  context?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface AIAction {
  id: string;
  conversation_id: string;
  action_type: string;
  parameters: Record<string, any>;
  result?: Record<string, any>;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
  created_at: Date;
}

export interface AIFunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface AIStreamResponse {
  text: string;
  done: boolean;
  function_calls?: AIFunctionCall[];
}

export interface AICalendarContext {
  user_id: string;
  timezone?: string;
  current_date?: string;
  current_date_formatted?: string;
  preferences?: {
    default_duration?: number;
    work_hours?: { start: string; end: string };
    preferred_meeting_times?: string[];
  };
  upcoming_events?: any[];
  available_calendars?: any[];
}
