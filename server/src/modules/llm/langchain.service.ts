import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AI_CONSTANTS, ERROR_MESSAGES } from '../ai/constants/ai.constants';
import { AIThinkingProcess } from '../ai/interfaces/ai.interface';
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  BaseMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { StructuredTool } from '@langchain/core/tools';

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(LangChainService.name);
  private model: ChatGoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey =
      this.configService.get<string>('GEMINI_API_KEY') ||
      this.configService.get<string>('GOOGLE_API_KEY');

    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
    }

    const modelName =
      this.configService.get<string>('GEMINI_MODEL') ||
      AI_CONSTANTS.GEMINI.MODEL;

    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      model: modelName,
      temperature: AI_CONSTANTS.GEMINI.TEMPERATURE,
      topP: AI_CONSTANTS.GEMINI.TOP_P,
      topK: AI_CONSTANTS.GEMINI.TOP_K,
      maxOutputTokens: AI_CONSTANTS.GEMINI.MAX_OUTPUT_TOKENS,
      streaming: true,
    } as any);
  }

  async chat(
    message: string,
    history: any[] = [],
    options: {
      systemPrompt?: string;
      tools?: StructuredTool[];
      userId?: string;
      long_term_memory?: any[];
      showThinking?: boolean;
    } = {},
  ): Promise<{
    text: string;
    functionCalls?: any[];
    thinking?: AIThinkingProcess;
    confidence?: 'high' | 'medium' | 'low';
    needsClarification?: string[];
  }> {
    try {
      const messages: BaseMessage[] = [];

      if (options.systemPrompt) {
        messages.push(new SystemMessage(options.systemPrompt));
      }

      if (history && history.length > 0) {
        for (const msg of history) {
          if (msg.role === 'user') {
            messages.push(new HumanMessage(msg.content));
          } else if (msg.role === 'assistant') {
            const content = msg.content || '';
            if (
              msg.tool_calls &&
              Array.isArray(msg.tool_calls) &&
              msg.tool_calls.length > 0
            ) {
              messages.push(
                new AIMessage({
                  content,
                  additional_kwargs: {
                    tool_calls: msg.tool_calls,
                  },
                } as any),
              );
            } else {
              messages.push(new AIMessage(content));
            }
          } else if (msg.role === 'function') {
            messages.push(
              new ToolMessage({
                content: JSON.stringify(msg.function_response || msg.content),
                tool_call_id:
                  msg.tool_call_id || msg.function_call?.name || 'unknown', // Ideally we store call_id
                name: msg.function_call?.name,
              }),
            );
          }
        }
      }

      if (message) {
        messages.push(new HumanMessage(message));
      }

      let modelToUse: any = this.model;
      if (options.tools && options.tools.length > 0) {
        modelToUse = this.model.bindTools(options.tools);
        this.logger.debug(`Bound ${options.tools.length} tools to model`);
      }

      const response = await modelToUse.invoke(messages);

      const functionCalls: any[] = [];
      if (response.additional_kwargs?.tool_calls) {
        for (const toolCall of response.additional_kwargs.tool_calls) {
          try {
            functionCalls.push({
              name: toolCall.function.name,
              arguments: JSON.parse(toolCall.function.arguments),
            });
          } catch (parseError) {
            this.logger.warn(
              `Failed to parse tool call arguments: ${parseError.message}`,
            );
          }
        }
      }

      const responseText = response.content as string;

      // Parse thinking from response
      const thinking = options.showThinking
        ? this.parseThinkingFromResponse(responseText)
        : undefined;

      // Extract confidence and clarifying questions
      const confidenceData = this.extractConfidenceData(responseText);

      return {
        text: this.cleanResponseText(responseText),
        functionCalls,
        thinking,
        confidence: confidenceData.confidence,
        needsClarification: confidenceData.needsClarification,
      };
    } catch (error) {
      this.logger.error('Chat request failed', error);
      throw error;
    }
  }

  async *chatStream(
    message: string,
    history: any[] = [],
    options: {
      systemPrompt?: string;
      tools?: StructuredTool[];
      userId?: string;
      long_term_memory?: any[];
      showThinking?: boolean;
    } = {},
  ): AsyncGenerator<{
    text?: string;
    functionCall?: any;
    thinking?: Partial<AIThinkingProcess>;
    confidence?: 'high' | 'medium' | 'low';
  }, void, unknown> {
    try {
      const messages: BaseMessage[] = [];

      const startedAt = Date.now();
      let firstChunkAt: number | null = null;
      let chunkCount = 0;

      if (options.systemPrompt) {
        messages.push(new SystemMessage(options.systemPrompt));
      }

      if (history && history.length > 0) {
        for (const msg of history) {
          if (msg.role === 'user') {
            messages.push(new HumanMessage(msg.content));
          } else if (msg.role === 'assistant') {
            const content = msg.content || '';
            if (
              msg.tool_calls &&
              Array.isArray(msg.tool_calls) &&
              msg.tool_calls.length > 0
            ) {
              messages.push(
                new AIMessage({
                  content,
                  additional_kwargs: {
                    tool_calls: msg.tool_calls,
                  },
                } as any),
              );
            } else {
              messages.push(new AIMessage(content));
            }
          } else if (msg.role === 'function') {
            messages.push(
              new ToolMessage({
                content: JSON.stringify(msg.function_response || msg.content),
                tool_call_id:
                  msg.tool_call_id || msg.function_call?.name || 'unknown',
                name: msg.function_call?.name,
              }),
            );
          }
        }
      }

      if (message) {
        messages.push(new HumanMessage(message));
      }

      let modelToUse: any = this.model;
      if (options.tools && options.tools.length > 0) {
        modelToUse = this.model.bindTools(options.tools);
        this.logger.warn(`Streaming with ${options.tools.length} tools bound`);
      }

      const stream = await modelToUse.stream(messages);

      let fullResponse = '';
      for await (const chunk of stream) {
        chunkCount += 1;
        this.logger.debug(
          `Chunk ${chunkCount} received. Type: ${typeof chunk.content}. Is Array: ${Array.isArray(chunk.content)}`,
        );

        if (chunk.content) {
          if (typeof chunk.content === 'string') {
            this.logger.debug(
              `Chunk ${chunkCount} string length: ${chunk.content.length}`,
            );
            if (chunk.content.length > 0) {
              if (firstChunkAt === null) {
                firstChunkAt = Date.now();
                this.logger.debug(
                  `First stream chunk after ${firstChunkAt - startedAt}ms`,
                );
              }

              fullResponse += chunk.content;

              // Check for thinking tags
              if (options.showThinking && chunk.content.includes('<thinking>')) {
                const thinking = this.parseThinkingFromResponse(fullResponse);
                if (thinking) {
                  yield { thinking };
                }
              }

              // Check for confidence
              if (chunk.content.match(/Confidence:/i)) {
                const confidenceData = this.extractConfidenceData(fullResponse);
                if (confidenceData.confidence) {
                  yield { confidence: confidenceData.confidence };
                }
              }

              // Yield clean text (without tags)
              const cleanText = this.cleanStreamChunk(chunk.content);
              if (cleanText) {
                yield { text: cleanText };
              }
            }
          } else if (Array.isArray(chunk.content)) {
            this.logger.debug(
              `Chunk ${chunkCount} array length: ${chunk.content.length}`,
            );
            for (const part of chunk.content as any[]) {
              if (!part) continue;

              if (
                part.type === 'text' &&
                typeof part.text === 'string' &&
                part.text.length > 0
              ) {
                if (firstChunkAt === null) {
                  firstChunkAt = Date.now();
                  this.logger.debug(
                    `First stream chunk after ${firstChunkAt - startedAt}ms`,
                  );
                }
                yield { text: part.text };
                continue;
              }

              if (part.type === 'functionCall' && part.functionCall?.name) {
                yield {
                  functionCall: {
                    name: part.functionCall.name,
                    arguments: part.functionCall.args || {},
                  },
                };
                continue;
              }
            }
          }
        }

        if (chunk.additional_kwargs?.tool_calls) {
          for (const toolCall of chunk.additional_kwargs.tool_calls) {
            try {
              yield {
                functionCall: {
                  name: toolCall.function.name,
                  arguments: JSON.parse(toolCall.function.arguments),
                },
              };
            } catch (parseError) {
              this.logger.warn(
                `Failed to parse streaming tool call: ${parseError.message}`,
              );
            }
          }
        }
      }

      this.logger.debug(`Stream completed with ${chunkCount} chunks`);
    } catch (error) {
      this.logger.error('Chat stream failed', error);
      throw error;
    }
  }

  private parseThinkingFromResponse(
    content: string,
  ): AIThinkingProcess | undefined {
    const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/);
    if (!thinkingMatch) return undefined;

    const thinkingContent = thinkingMatch[1];

    return {
      understanding: this.extractSection(thinkingContent, 'Understanding'),
      dataRetrieved: this.extractListSection(thinkingContent, 'Data Retrieved'),
      reasoning: this.extractListSection(thinkingContent, 'Reasoning'),
      conclusion: this.extractSection(thinkingContent, 'Conclusion'),
    };
  }

  private extractSection(content: string, sectionName: string): string {
    const regex = new RegExp(
      `${sectionName}:\\s*([^\\n]+(?:\\n(?!\\d+\\.|[A-Z][a-z]+:)[^\\n]+)*)`,
      'i',
    );
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }

  private extractListSection(content: string, sectionName: string): string[] {
    const regex = new RegExp(
      `${sectionName}:\\s*([\\s\\S]*?)(?=\\n\\d+\\.|\\n[A-Z][a-z]+:|$)`,
      'i',
    );
    const match = content.match(regex);
    if (!match) return [];

    return match[1]
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.trim().substring(1).trim())
      .filter(Boolean);
  }

  private extractConfidenceData(content: string): {
    confidence?: 'high' | 'medium' | 'low';
    needsClarification?: string[];
  } {
    // Extract confidence from response
    const confidenceMatch = content.match(/Confidence:\s*(high|medium|low)/i);
    const confidence = confidenceMatch
      ? (confidenceMatch[1].toLowerCase() as 'high' | 'medium' | 'low')
      : undefined;

    // Extract clarifying questions if present
    const clarifyMatch = content.match(/<clarify>([\s\S]*?)<\/clarify>/);
    const needsClarification = clarifyMatch
      ? clarifyMatch[1]
        .split('\n')
        .filter((q) => q.trim().startsWith('-'))
        .map((q) => q.trim().substring(1).trim())
        .filter(Boolean)
      : undefined;

    return { confidence, needsClarification };
  }

  private cleanResponseText(content: string): string {
    // Remove thinking tags and confidence markers
    return content
      .replace(/<thinking>[\s\S]*?<\/thinking>/g, '')
      .replace(/<clarify>[\s\S]*?<\/clarify>/g, '')
      .replace(/Confidence:\s*(high|medium|low)/gi, '')
      .trim();
  }

  private cleanStreamChunk(chunk: string): string {
    // For streaming, we need to be careful not to break mid-tag
    // Only clean if we have complete tags
    let cleaned = chunk;

    // Remove complete thinking tags
    cleaned = cleaned.replace(/<thinking>[\s\S]*?<\/thinking>/g, '');
    // Remove complete clarify tags
    cleaned = cleaned.replace(/<clarify>[\s\S]*?<\/clarify>/g, '');
    // Remove confidence markers
    cleaned = cleaned.replace(/Confidence:\s*(high|medium|low)/gi, '');

    // Remove partial opening/closing tags to avoid showing them
    cleaned = cleaned.replace(/<\/?thinking>/g, '');
    cleaned = cleaned.replace(/<\/?clarify>/g, '');

    return cleaned.trim();
  }
}
