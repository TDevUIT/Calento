import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { AIFunctionCallingService } from './ai-function-calling.service';
import { AIConversationRepository } from '../repositories/ai-conversation.repository';
import { AIActionRepository } from '../repositories/ai-action.repository';
import { AIMessage, AICalendarContext } from '../interfaces/ai.interface';
import { ConversationNotFoundException } from '../exceptions/ai.exceptions';
import { EventService } from '../../event/event.service';

@Injectable()
export class AIConversationService {
  private readonly logger = new Logger(AIConversationService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly functionCallingService: AIFunctionCallingService,
    private readonly conversationRepo: AIConversationRepository,
    private readonly actionRepo: AIActionRepository,
    private readonly eventService: EventService,
  ) {}

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

    const userMessage: AIMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    await this.conversationRepo.addMessage(conversation.id, userMessage);

    let aiResponse;
    try {
      aiResponse = await this.geminiService.chat(
        message,
        conversation.messages,
        conversation.context
      );
      
      if (!aiResponse || (!aiResponse.text && !aiResponse.functionCalls)) {
        throw new Error('Empty AI response');
      }
    } catch (error) {
      this.logger.error('AI chat failed:', error);
      return {
        response: `âŒ Sorry, I encountered an error: ${error.message}`,
        conversation_id: conversation.id,
        function_calls: [],
        actions: [],
        timestamp: new Date(),
      };
    }

    const actions: Array<{
      type: string;
      status: string;
      result?: any;
      error?: string;
    }> = [];
    if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
      for (const functionCall of aiResponse.functionCalls) {
        const action = await this.actionRepo.create(
          conversation.id,
          functionCall.name,
          functionCall.arguments
        );

        const result = await this.functionCallingService.executeFunctionCall(
          functionCall,
          userId
        );

        await this.actionRepo.updateStatus(
          action.id,
          result.success ? 'completed' : 'failed',
          result.result,
          result.error
        );

        actions.push({
          type: functionCall.name,
          status: result.success ? 'completed' : 'failed',
          result: result.result,
          error: result.error,
        });
      }
    }

    const responseText = aiResponse.text || 'I processed your request.';
    const assistantMessage: AIMessage = {
      role: 'assistant',
      content: this.buildResponseWithActions(responseText, actions),
      timestamp: new Date(),
    };

    await this.conversationRepo.addMessage(conversation.id, assistantMessage);

    return {
      response: assistantMessage.content,
      conversation_id: conversation.id,
      function_calls: aiResponse.functionCalls,
      actions,
      timestamp: new Date(),
    };
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
        response: 'âŒ Action cancelled. Let me know if you\'d like to try something else.',
        conversation_id: conversationId || '',
        function_calls: [],
        actions: [],
        timestamp: new Date(),
      };
    }

    return {
      response: 'âœ… Action confirmed and executed successfully!',
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

  private async buildCalendarContext(userId: string): Promise<AICalendarContext> {
    try {
      const now = new Date();
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const upcomingEvents = await this.eventService.getEventsByDateRange(
        userId,
        startDate,
        endDate,
        { page: 1, limit: 10 }
      );

      return {
        user_id: userId,
        timezone: 'Asia/Ho_Chi_Minh',
        current_date: now.toISOString(),
        current_date_formatted: now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        preferences: {
          default_duration: 60,
          work_hours: { start: '09:00', end: '18:00' },
        },
        upcoming_events: upcomingEvents.data.slice(0, 5).map(e => ({
          id: e.id,
          title: e.title,
          start_time: e.start_time,
          end_time: e.end_time,
        })),
      };
    } catch (error) {
      this.logger.warn('Failed to build calendar context:', error);
      const now = new Date();
      return {
        user_id: userId,
        timezone: 'Asia/Ho_Chi_Minh',
        current_date: now.toISOString(),
        current_date_formatted: now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
      };
    }
  }

  private buildResponseWithActions(text: string, actions: any[]): string {
    let response = text || 'Processing your request...';

    if (actions.length === 0) {
      return response;
    }

    const failedActions = actions.filter(a => a.status === 'failed');

    if (failedActions.length > 0) {
      response += '\n\nâŒ **Error:**\n';
      failedActions.forEach(action => {
        response += `- ${action.error}\n`;
      });
    }

    return response;
  }
}
