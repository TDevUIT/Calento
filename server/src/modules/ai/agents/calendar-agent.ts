import { Injectable } from '@nestjs/common';
import { BaseAgent } from './base/base-agent';
import {
  AgentType,
  AgentCapability,
  AgentRequest,
  AgentResponse,
  ToolCall,
} from './base/agent.interface';
import { SYSTEM_PROMPTS } from '../prompts/system-prompts';
import { ToolRegistry } from '../tools/tool-registry';
import { LangChainService } from '../../llm/langchain.service';

/**
 * Calendar Agent
 * Specialized in calendar operations
 */
@Injectable()
export class CalendarAgent extends BaseAgent {
  private readonly keywords = [
    'calendar',
    'schedule',
    'event',
    'meeting',
    'appointment',
    'book',
    'booking',
    'create',
    'make',
    'delete',
    'remove',
    'update',
    'edit',
    'search',
    'find',
    'check',
    'available',
    'free',
    'busy',
  ];

  constructor(
    private readonly toolRegistry: ToolRegistry,
    private readonly langChainService: LangChainService,
  ) {
    super({
      type: AgentType.CALENDAR,
      name: 'Calendar',
      description: 'Manages calendar events and availability',
      capabilities: [
        AgentCapability.CREATE_EVENT,
        AgentCapability.UPDATE_EVENT,
        AgentCapability.DELETE_EVENT,
        AgentCapability.CHECK_AVAILABILITY,
        AgentCapability.SEARCH_EVENTS,
      ],
      systemPrompt: SYSTEM_PROMPTS.CALENDAR_AGENT,
    });
  }

  protected async execute(request: AgentRequest): Promise<AgentResponse> {
    try {
      const enhancedPrompt = this.buildEnhancedPrompt(
        this.config.systemPrompt,
        request.context,
      );

      const tools = this.toolRegistry.getToolDescriptions('calendar');

      const aiResponse = await this.langChainService.chat(
        request.message,
        request.history || [],
        {
          systemPrompt: enhancedPrompt,
          tools,
          userId: request.context.userId,
        },
      );

      const toolCalls: ToolCall[] = [];
      if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
        for (const funcCall of aiResponse.functionCalls) {
          try {
            const result = await this.toolRegistry.execute(
              funcCall.name,
              funcCall.arguments,
              request.context,
            );

            toolCalls.push({
              toolName: funcCall.name,
              arguments: funcCall.arguments,
              result: result.result,
              executionTime: result.executionTime,
            });
          } catch (error) {
            toolCalls.push({
              toolName: funcCall.name,
              arguments: funcCall.arguments,
              error: error.message,
            });
          }
        }
      }

      const formattedToolCalls = this.formatToolCalls(toolCalls);
      const finalMessage = `${aiResponse.text}${formattedToolCalls}`;

      return {
        success: true,
        message: finalMessage,
        data: {
          ai_response: aiResponse.text,
          tool_calls: toolCalls,
        },
        toolCalls,
        confidence: this.calculateConfidence(request.message, this.keywords),
      };
    } catch (error) {
      this.logger.error('Calendar agent execution failed', error.stack);
      return {
        success: false,
        message:
          'Sorry, I encountered an error while processing your calendar request.',
        error: error.message,
      };
    }
  }

  protected hasRelevantKeywords(message: string): boolean {
    const messageLower = message.toLowerCase();
    return this.keywords.some((keyword) => messageLower.includes(keyword));
  }
}
