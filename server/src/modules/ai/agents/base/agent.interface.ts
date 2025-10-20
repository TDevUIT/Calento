export enum AgentType {
  CALENDAR = 'calendar',
  TASK = 'task',
  ANALYSIS = 'analysis',
  ORCHESTRATOR = 'orchestrator',
}

export enum AgentCapability {
  CREATE_EVENT = 'create_event',
  UPDATE_EVENT = 'update_event',
  DELETE_EVENT = 'delete_event',
  CHECK_AVAILABILITY = 'check_availability',
  SEARCH_EVENTS = 'search_events',
  CREATE_TASK = 'create_task',
  CREATE_LEARNING_PLAN = 'create_learning_plan',
  ANALYZE_TEAM = 'analyze_team_availability',
}

export interface AgentConfig {
  type: AgentType;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  systemPrompt: string;
}

export interface AgentContext {
  userId: string;
  conversationId?: string;
  timezone?: string;
  userPreferences?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface AgentRequest {
  message: string;
  context: AgentContext;
  history?: AgentMessage[];
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: any;
  toolCalls?: ToolCall[];
  error?: string;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface ToolCall {
  toolName: string;
  arguments: Record<string, any>;
  result?: any;
  error?: string;
  executionTime?: number;
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
}

export interface IAgent {
  /**
   * Agent configuration
   */
  readonly config: AgentConfig;

  /**
   * Check if agent can handle the request
   */
  canHandle(request: AgentRequest): Promise<boolean>;

  /**
   * Process the request and return response
   */
  process(request: AgentRequest): Promise<AgentResponse>;

  /**
   * Get agent's current status
   */
  getStatus(): {
    healthy: boolean;
    lastActivity: Date;
    stats: Record<string, number>;
  };
}

export interface ITool {
  /**
   * Tool name (must match function name)
   */
  readonly name: string;

  /**
   * Tool description
   */
  readonly description: string;

  /**
   * Tool category
   */
  readonly category: 'calendar' | 'task' | 'analysis';

  /**
   * Execute the tool
   */
  execute(args: Record<string, any>, context: AgentContext): Promise<any>;
}
