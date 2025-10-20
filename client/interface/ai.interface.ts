﻿export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  function_call?: {
    name: string;
    arguments: Record<string, any>;
  };
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  context?: Record<string, any>;
  history?: AIMessage[];
}

export interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
  result?: any;
}

export interface ActionPerformed {
  type: string;
  status: string;
  result?: any;
}

export interface PendingAction {
  id: string;
  type: string;
  title: string;
  description: string;
  parameters: Record<string, any>;
  analysis?: {
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
  };
  requires_confirmation: boolean;
}

export interface ThinkingStep {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  label: string;
  icon?: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    response: string;
    conversation_id: string;
    function_calls?: FunctionCall[];
    actions?: ActionPerformed[];
    pending_actions?: PendingAction[];
    thinking_steps?: ThinkingStep[];
    timestamp: Date;
  };
}

export interface StreamChatRequest {
  message: string;
  conversation_id?: string;
  context?: Record<string, any>;
}

export interface FunctionExecutionRequest {
  function_name: string;
  parameters: Record<string, any>;
  conversation_id?: string;
}

export interface FunctionExecutionResponse {
  success: boolean;
  data: {
    result: any;
    execution_time: number;
  };
}
