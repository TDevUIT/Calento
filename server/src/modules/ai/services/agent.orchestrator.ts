import { Injectable, Logger } from '@nestjs/common';
import { LangChainService } from '../../llm/langchain.service';

import { ToolRegistry } from '../tools/tool-registry';
import { AIMessage, AIThinkingProcess } from '../interfaces/ai.interface';
import { AIActionRepository } from '../repositories/ai-action.repository';

@Injectable()
export class AgentOrchestrator {
  private readonly logger = new Logger(AgentOrchestrator.name);
  private readonly MAX_ITERATIONS = 5;

  constructor(
    private readonly langChainService: LangChainService,
    private readonly toolRegistry: ToolRegistry,
    private readonly actionRepo: AIActionRepository,
  ) { }

  /**
   * Orchestrate the agent loop for static chat
   */
  async chat(
    message: string,
    userId: string,
    history: AIMessage[],
    conversationId: string,
    context: any = {},
  ): Promise<{
    response: string;
    actions: any[];
    confidence?: 'high' | 'medium' | 'low';
    needsClarification?: string[];
    thinking?: AIThinkingProcess;
  }> {
    const currentHistory = [...history];
    const actions: any[] = [];
    let iterations = 0;
    const tools = this.getLangChainTools(userId);

    if (message && message.length > 0) {
      currentHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });
    }

    while (iterations < this.MAX_ITERATIONS) {
      this.logger.debug(`Agent Loop Iteration ${iterations + 1}`);

      const aiResponse = await this.langChainService.chat('', currentHistory, {
        systemPrompt: context.systemPrompt,
        tools,
        userId,
        long_term_memory: context.long_term_memory,
      });

      if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
        this.logger.log(
          `Agent decided to call ${aiResponse.functionCalls.length} tools`,
        );

        const toolCallsForTurn = aiResponse.functionCalls.map((call, index) => {
          const toolCallId = `${conversationId}:${iterations}:${index}`;
          return {
            id: toolCallId,
            type: 'function',
            function: {
              name: call.name,
              arguments: JSON.stringify(call.arguments ?? {}),
            },
          };
        });

        currentHistory.push({
          role: 'assistant',
          content: aiResponse.text || '',
          tool_calls: toolCallsForTurn,
        });

        for (const call of aiResponse.functionCalls) {
          const callIndex = aiResponse.functionCalls.indexOf(call);
          const toolCallId = `${conversationId}:${iterations}:${callIndex}`;

          const action = await this.actionRepo.create(
            conversationId,
            call.name,
            call.arguments,
          );

          let result;
          try {
            const executionResult = await this.toolRegistry.execute(
              call.name,
              call.arguments,
              { userId },
            );
            result = executionResult; // ToolRegistry.execute returns { success, result... } wrapped by BaseTool or just result?
            // BaseTool.execute returns { success, result }
            // ToolRegistry.execute returns { ...result, executionTime }
            // So result structure is preserved.
          } catch (error) {
            result = { success: false, error: error.message };
          }

          await this.actionRepo.updateStatus(
            action.id,
            result.success ? 'completed' : 'failed',
            result.result,
            result.error,
          );

          actions.push({
            type: call.name,
            status: result.success ? 'completed' : 'failed',
            result: result.result,
            error: result.error,
          });

          currentHistory.push({
            role: 'function',
            content: JSON.stringify(result.result || result.error),
            tool_call_id: toolCallId,
            function_call: {
              name: call.name,
              arguments: call.arguments,
            },
            function_response: result.result,
          });
        }

        message = '';
        iterations++;
      } else {
        return {
          response: aiResponse.text,
          actions,
          confidence: aiResponse.confidence,
          needsClarification: aiResponse.needsClarification,
          thinking: aiResponse.thinking,
        };
      }
    }

    return {
      response: 'I reached the maximum number of steps without a final answer.',
      actions,
      confidence: 'low',
      needsClarification: ['Could you please clarify your request?'],
    };
  }

  /**
   * Orchestrate the agent loop for streaming chat
   */
  async *chatStream(
    message: string,
    userId: string,
    history: AIMessage[],
    conversationId: string,
    context: any = {},
  ): AsyncGenerator<any, void, unknown> {
    const currentHistory = [...history];
    let iterations = 0;
    const tools = this.getLangChainTools(userId);

    if (message && message.length > 0) {
      currentHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });
    }

    while (iterations < this.MAX_ITERATIONS) {
      const stream = this.langChainService.chatStream('', currentHistory, {
        systemPrompt: context.systemPrompt,
        tools,
        userId,
        long_term_memory: context.long_term_memory,
      });

      let collectedText = '';
      const collectedTools: any[] = [];

      for await (const chunk of stream) {
        if (chunk.text) {
          collectedText += chunk.text;
          yield { type: 'text', content: chunk.text };
        }
        if (chunk.functionCall) {
          collectedTools.push(chunk.functionCall);
        }
      }

      if (collectedTools.length > 0) {
        const toolCallsForTurn = collectedTools.map((tool, index) => {
          const toolCallId = `${conversationId}:${iterations}:${index}`;
          return {
            id: toolCallId,
            type: 'function',
            function: {
              name: tool.name,
              arguments: JSON.stringify(tool.arguments ?? {}),
            },
          };
        });

        currentHistory.push({
          role: 'assistant',
          content: collectedText || '',
          tool_calls: toolCallsForTurn,
        });

        for (const tool of collectedTools) {
          const toolIndex = collectedTools.indexOf(tool);
          const toolCallId = `${conversationId}:${iterations}:${toolIndex}`;

          yield {
            type: 'action_start',
            action: { type: tool.name, parameters: tool.arguments },
          };

          const action = await this.actionRepo.create(
            conversationId,
            tool.name,
            tool.arguments,
          );

          let result;
          try {
            const executionResult = await this.toolRegistry.execute(
              tool.name,
              tool.arguments,
              { userId },
            );
            result = executionResult;
          } catch (error) {
            result = { success: false, error: error.message };
          }

          await this.actionRepo.updateStatus(
            action.id,
            result.success ? 'completed' : 'failed',
            result.result,
            result.error,
          );

          yield {
            type: 'action_result',
            action: {
              type: tool.name,
              status: result.success ? 'completed' : 'failed',
              result: result.result,
              error: result.error,
            },
          };

          currentHistory.push({
            role: 'function',
            content: JSON.stringify(result.result || result.error),
            tool_call_id: toolCallId,
            function_call: {
              name: tool.name,
              arguments: tool.arguments,
            },
            function_response: result.result,
          });
        }

        message = '';
        iterations++;
      } else {
        // If we have collected text but no tools, we update history and break the loop
        if (collectedText) {
          currentHistory.push({
            role: 'assistant',
            content: collectedText,
          });
        }
        return;
      }
    }
  }
  private getLangChainTools(userId: string) {
    const allTools = this.toolRegistry.getAllTools();
    const context = { userId };
    return allTools.map((tool) => (tool as any).toLangChainTool(context));
  }
}
