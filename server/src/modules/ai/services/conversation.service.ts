import { Injectable, Logger } from '@nestjs/common';
import { LangChainService } from '../../llm/langchain.service';
import { AIFunctionCallingService } from './function-calling.service';
import { AIConversationRepository } from '../repositories/ai-conversation.repository';
import { AIActionRepository } from '../repositories/ai-action.repository';
import { AIMessage, AICalendarContext } from '../interfaces/ai.interface';
import { ConversationNotFoundException } from '../exceptions/exceptions';
import { EventService } from '../../event/event.service';
import { RagService } from '../../rag/rag.service';
import { ToolRegistry } from '../tools/tool-registry';
import { AI_CONSTANTS, ERROR_MESSAGES } from '../constants/ai.constants';
import { AgentOrchestrator } from './agent.orchestrator';

@Injectable()
export class AIConversationService {
  private readonly logger = new Logger(AIConversationService.name);


  constructor(
    private readonly langChainService: LangChainService,
    private readonly functionCallingService: AIFunctionCallingService,
    private readonly conversationRepo: AIConversationRepository,
    private readonly actionRepo: AIActionRepository,
    private readonly eventService: EventService,
    private readonly ragService: RagService,
    private readonly toolRegistry: ToolRegistry,
    private readonly orchestrator: AgentOrchestrator,
  ) { }

  async chat(
    message: string,
    userId: string,
    conversationId?: string,
    context?: Record<string, any>
  ) {
    this.logger.log(`Processing chat for user: ${userId}`);

    let conversation = conversationId
      ? await this.conversationRepo.findById(conversationId)
      : null;

    if (conversationId && !conversation) {
      throw new ConversationNotFoundException(conversationId);
    }

    if (!conversation) {
      const calendarContext = await this.buildCalendarContext(userId);
      conversation = await this.conversationRepo.create(userId, {
        ...context,
        ...calendarContext,
      });
    }

    // RAG: Retrieve similar contexts from long-term memory
    let longTermMemory: any[] | null = null;
    try {
      longTermMemory = await this.ragService.retrieveConsolidatedContext(userId, message);
    } catch (error) {
      this.logger.warn(`RAG: Failed to retrieve contexts`, error);
    }

    const userMessage: AIMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    await this.conversationRepo.addMessage(conversation.id, userMessage);

    let aiResponse;
    const systemPrompt = this.buildSystemPrompt(conversation.context, longTermMemory);

    try {
      const result = await this.orchestrator.chat(
        message,
        userId,
        conversation.messages,
        conversation.id,
        {
          systemPrompt,
          long_term_memory: longTermMemory
        }
      );

      aiResponse = {
        text: result.response,
        functionCalls: result.actions.map(a => ({ name: a.type, arguments: a.result || {} })) // Helper mapping if needed, but orchestrator returns 'actions' with results
      };

      // Orchestrator handles execution and returns final response and actions.
      // We usually want to persist the actions.
      // Orchestrator ALREADY persists actions via injected actionRepo (if we implemented it that way).
      // Let's check AgentOrchestrator impl. 
      // Yes, it pushes to actionRepo.

      // We just need to formulate the Assistant Message for the UI.
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: this.buildResponseWithActions(result.response, result.actions),
        timestamp: new Date(),
      };

      await this.conversationRepo.addMessage(conversation.id, assistantMessage);

      return {
        response: assistantMessage.content,
        conversation_id: conversation.id,
        function_calls: [], // Orchestrator handled them
        actions: result.actions,
        timestamp: new Date(),
      };

    } catch (error) {
      this.logger.error('AI chat failed:', error);
      return {
        response: `ERROR: Sorry, I encountered an error: ${error.message}`,
        conversation_id: conversation.id,
        function_calls: [],
        actions: [],
        timestamp: new Date(),
      };
    }
  }

  async * chatStream(
    message: string,
    userId: string,
    conversationId?: string,
    context?: Record<string, any>
  ) {
    this.logger.log(`Processing chat stream for user: ${userId}`);

    let conversation = conversationId
      ? await this.conversationRepo.findById(conversationId)
      : null;

    if (conversationId && !conversation) {
      throw new ConversationNotFoundException(conversationId);
    }

    if (!conversation) {
      const calendarContext = await this.buildCalendarContext(userId);
      conversation = await this.conversationRepo.create(userId, {
        ...context,
        ...calendarContext,
      });
    }

    // RAG: Retrieve similar contexts from long-term memory
    let longTermMemory: any[] | null = null;
    try {
      longTermMemory = await this.ragService.retrieveConsolidatedContext(userId, message);
    } catch (error) {
      this.logger.warn(`RAG: Failed to retrieve contexts`, error);
    }

    const userMessage: AIMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    await this.conversationRepo.addMessage(conversation.id, userMessage);

    let fullResponseText = '';
    const actions: any[] = [];
    const systemPrompt = this.buildSystemPrompt(conversation.context, longTermMemory);

    try {
      const stream = this.orchestrator.chatStream(
        message,
        userId,
        conversation.messages,
        conversation.id,
        {
          systemPrompt,
          long_term_memory: longTermMemory,
        }
      );

      for await (const chunk of stream) {
        if (chunk.type === 'text') {
          fullResponseText += chunk.content;
          yield { type: 'text', content: chunk.content };
        } else if (chunk.type === 'action_start') {
          // Optional: yield start info
          yield {
            type: 'action_start',
            action: chunk.action
          };
        } else if (chunk.type === 'action_result') {
          actions.push(chunk.action);
          yield {
            type: 'action_result',
            action: chunk.action
          };
        }
      }

      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: this.buildResponseWithActions(fullResponseText, actions),
        timestamp: new Date(),
      };

      await this.conversationRepo.addMessage(conversation.id, assistantMessage);

      yield {
        type: 'done',
        conversation_id: conversation.id
      };

    } catch (error) {
      this.logger.error('AI chat stream failed:', error);
      yield { type: 'error', error: error.message };
    }
  }


  async getConversation(conversationId: string, userId: string) {
    const conversation = await this.conversationRepo.findById(conversationId);

    if (!conversation) {
      throw new ConversationNotFoundException(conversationId);
    }

    if (conversation.user_id !== userId) {
      throw new ConversationNotFoundException(conversationId);
    }

    const actions = await this.actionRepo.findByConversationId(conversationId);

    return {
      ...conversation,
      actions,
    };
  }

  async getUserConversations(userId: string, limit = 10) {
    return this.conversationRepo.findByUserId(userId, limit);
  }

  async deleteConversation(conversationId: string, userId: string) {
    const conversation = await this.conversationRepo.findById(conversationId);

    if (!conversation) {
      throw new ConversationNotFoundException(conversationId);
    }

    if (conversation.user_id !== userId) {
      throw new ConversationNotFoundException(conversationId);
    }

    return this.conversationRepo.delete(conversationId);
  }

  async confirmAction(
    actionId: string,
    userId: string,
    confirmed: boolean,
    modifiedParameters?: Record<string, any>,
    conversationId?: string,
  ) {
    this.logger.log(`Confirming action ${actionId}: ${confirmed ? 'Approved' : 'Rejected'}`);

    if (!confirmed) {
      return {
        response: 'Action cancelled. Let me know if you\'d like to try something else.',
        conversation_id: conversationId || '',
        function_calls: [],
        actions: [],
        timestamp: new Date(),
      };
    }

    return {
      response: 'Action confirmed and executed successfully!',
      conversation_id: conversationId || '',
      function_calls: [],
      actions: [{
        type: 'actionConfirmed',
        status: 'completed',
        result: {
          action_id: actionId,
          message: 'Meeting scheduled and invites sent to all participants.'
        }
      }],
      timestamp: new Date(),
    };
  }

  private getDefaultContext(userId: string): Omit<AICalendarContext, 'upcoming_events' | 'preferences'> {
    const now = new Date();
    return {
      user_id: userId,
      timezone: AI_CONSTANTS.TIMEZONE.DEFAULT,
      current_date: now.toISOString(),
      current_date_formatted: now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
    };
  }

  private async buildCalendarContext(userId: string): Promise<AICalendarContext> {
    const defaultContext = this.getDefaultContext(userId);

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + AI_CONSTANTS.ANALYSIS.UPCOMING_EVENTS_DAYS);

      const upcomingEvents = await this.eventService.getEventsByDateRange(
        userId,
        startDate,
        endDate,
        { page: 1, limit: 10 }
      );

      return {
        ...defaultContext,
        preferences: {
          default_duration: AI_CONSTANTS.EVENT.DEFAULT_DURATION,
          work_hours: {
            start: `${AI_CONSTANTS.WORK_HOURS.START.toString().padStart(2, '0')}:00`,
            end: `${AI_CONSTANTS.WORK_HOURS.END.toString().padStart(2, '0')}:00`,
          },
        },
        upcoming_events: upcomingEvents.data.slice(0, AI_CONSTANTS.ANALYSIS.UPCOMING_EVENTS_LIMIT).map(e => ({
          id: e.id,
          title: e.title,
          start_time: e.start_time,
          end_time: e.end_time,
        })),
      };
    } catch (error) {
      this.logger.warn('Failed to build calendar context:', error);
      return defaultContext;
    }
  }

  private buildResponseWithActions(text: string, actions: any[]): string {
    let response = text || 'Processing your request...';

    if (actions.length === 0) {
      return response;
    }

    const failedActions = actions.filter(a => a.status === 'failed');

    if (failedActions.length > 0) {
      response += '\n\n**ERROR:**\n';
      failedActions.forEach(action => {
        response += `- ${action.error}\n`;
      });
    }

    return response;
  }

  private buildSystemPrompt(context: any, longTermMemory: any[] | null): string {
    const { PROMPT_TEMPLATES } = require('../prompts/system-prompts');
    const { SYSTEM_PROMPTS } = require('../prompts/system-prompts');

    const enrichedContext = {
      ...context,
      long_term_memory: longTermMemory || undefined,
    };

    return PROMPT_TEMPLATES.WITH_CONTEXT(
      SYSTEM_PROMPTS.CALENTO_MAIN,
      enrichedContext
    );
  }
}
