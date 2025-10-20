import { Logger } from '@nestjs/common';
import {
  IAgent,
  AgentConfig,
  AgentRequest,
  AgentResponse,
  ToolCall,
  AgentContext,
} from './agent.interface';

/**
 * Base Agent Class
 * All specialized agents extend this class
 */
export abstract class BaseAgent implements IAgent {
  protected readonly logger: Logger;
  protected lastActivity: Date;
  protected stats: Map<string, number>;

  constructor(public readonly config: AgentConfig) {
    this.logger = new Logger(`${config.name}Agent`);
    this.lastActivity = new Date();
    this.stats = new Map();
    this.initializeStats();
  }

  /**
   * Initialize stats counters
   */
  private initializeStats() {
    this.stats.set('total_requests', 0);
    this.stats.set('successful_requests', 0);
    this.stats.set('failed_requests', 0);
    this.stats.set('tool_calls', 0);
  }

  /**
   * Check if agent can handle the request
   * Override this method in specialized agents for custom logic
   */
  async canHandle(request: AgentRequest): Promise<boolean> {
    return this.hasRelevantKeywords(request.message);
  }

  /**
   * Process the request
   * This is the main entry point for all agents
   */
  async process(request: AgentRequest): Promise<AgentResponse> {
    this.updateActivity();
    this.incrementStat('total_requests');

    try {
      this.logger.log(`Processing request: "${request.message.substring(0, 50)}..."`);

      this.validateRequest(request);

      const response = await this.execute(request);

      if (response.success) {
        this.incrementStat('successful_requests');
      } else {
        this.incrementStat('failed_requests');
      }

      if (response.toolCalls && response.toolCalls.length > 0) {
        this.incrementStat('tool_calls', response.toolCalls.length);
      }

      this.logger.log(
        `Request processed: ${response.success ? 'SUCCESS' : 'FAILED'} | Tools: ${response.toolCalls?.length || 0}`
      );

      return response;
    } catch (error) {
      this.incrementStat('failed_requests');
      this.logger.error(`Request processing failed: ${error.message}`, error.stack);

      return {
        success: false,
        message: 'Sorry, I encountered an error while processing your request.',
        error: error.message,
      };
    }
  }

  /**
   * Get agent status
   */
  getStatus() {
    return {
      healthy: true,
      lastActivity: this.lastActivity,
      stats: Object.fromEntries(this.stats),
    };
  }

  /**
   * Abstract method: Execute agent-specific logic
   * Must be implemented by specialized agents
   */
  protected abstract execute(request: AgentRequest): Promise<AgentResponse>;

  /**
   * Check if message contains relevant keywords for this agent
   */
  protected abstract hasRelevantKeywords(message: string): boolean;

  /**
   * Validate request
   */
  protected validateRequest(request: AgentRequest) {
    if (!request.message || request.message.trim().length === 0) {
      throw new Error('Message is required');
    }

    if (!request.context || !request.context.userId) {
      throw new Error('User context is required');
    }
  }

  /**
   * Update last activity timestamp
   */
  protected updateActivity() {
    this.lastActivity = new Date();
  }

  /**
   * Increment stat counter
   */
  protected incrementStat(key: string, value: number = 1) {
    const current = this.stats.get(key) || 0;
    this.stats.set(key, current + value);
  }

  /**
   * Build enhanced context for AI
   */
  protected buildEnhancedPrompt(basePrompt: string, context: AgentContext): string {
    const contextParts: string[] = [basePrompt];

    if (context.timezone) {
      contextParts.push(`\nCurrent timezone: ${context.timezone}`);
    }

    if (context.userPreferences) {
      contextParts.push(`\nUser preferences: ${JSON.stringify(context.userPreferences)}`);
    }

    if (context.metadata) {
      const metadataStr = Object.entries(context.metadata)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      contextParts.push(`\nAdditional context: ${metadataStr}`);
    }

    return contextParts.join('');
  }

  /**
   * Format tool calls for response
   */
  protected formatToolCalls(toolCalls: ToolCall[]): string {
    if (toolCalls.length === 0) return '';

    const successful = toolCalls.filter((tc) => !tc.error);
    const failed = toolCalls.filter((tc) => tc.error);

    let result = '';

    if (successful.length > 0) {
      result += `\n\nâœ… **Executed ${successful.length} action(s):**\n`;
      successful.forEach((tc) => {
        result += `- ${tc.toolName}\n`;
      });
    }

    if (failed.length > 0) {
      result += `\n\nâŒ **${failed.length} action(s) failed:**\n`;
      failed.forEach((tc) => {
        result += `- ${tc.toolName}: ${tc.error}\n`;
      });
    }

    return result;
  }

  /**
   * Extract keywords from message
   */
  protected extractKeywords(message: string): string[] {
    return message
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  /**
   * Calculate confidence score for handling this request
   */
  protected calculateConfidence(message: string, keywords: string[]): number {
    const messageKeywords = this.extractKeywords(message);
    const matches = messageKeywords.filter((mk) => keywords.includes(mk));

    if (matches.length === 0) return 0;

    return Math.min((matches.length / keywords.length) * 100, 100);
  }
}
