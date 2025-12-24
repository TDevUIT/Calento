import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
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

        this.model = new ChatGoogleGenerativeAI({
            apiKey,
            model: 'gemini-1.5-flash',
            maxOutputTokens: 2048,
        });
    }

    /**
     * Chat with enhanced function calling support
     * Properly maps conversation history and binds tools for LLM function calling
     */
    async chat(
        message: string,
        history: any[] = [],
        options: {
            systemPrompt?: string;
            tools?: StructuredTool[];
            userId?: string;
            long_term_memory?: any[];
        } = {},
    ): Promise<{ text: string; functionCalls?: any[] }> {
        try {
            const messages: BaseMessage[] = [];

            // Add system prompt with context
            if (options.systemPrompt) {
                messages.push(new SystemMessage(options.systemPrompt));
            }

            // Map conversation history to LangChain messages
            if (history && history.length > 0) {
                for (const msg of history) {
                    if (msg.role === 'user') {
                        messages.push(new HumanMessage(msg.content));
                    } else if (msg.role === 'assistant') {
                        const content = msg.content || '';
                        // If there were function calls, we might need to represent them?
                        // For simplicity in this structure, we assume assistant msg is just text or we rely on the implementation
                        // IF the assistant message had tool calls, we should ideally represent them.
                        // But existing history structure might simply store text.
                        // Let's assume content is enough for now unless we store tool_calls in history explicitly
                        messages.push(new AIMessage(content));
                    } else if (msg.role === 'function') {
                        messages.push(new ToolMessage({
                            content: JSON.stringify(msg.function_response || msg.content),
                            tool_call_id: msg.function_call?.name || 'unknown', // Ideally we store call_id
                            name: msg.function_call?.name,
                        }));
                    }
                }
            }

            if (message) {
                messages.push(new HumanMessage(message));
            }

            // Bind tools if provided
            let modelToUse: any = this.model;
            if (options.tools && options.tools.length > 0) {
                modelToUse = this.model.bindTools(options.tools);
                this.logger.debug(`Bound ${options.tools.length} tools to model`);
            }

            const response = await modelToUse.invoke(messages);

            // Extract function calls from response
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

            return {
                text: response.content as string,
                functionCalls,
            };
        } catch (error) {
            this.logger.error('Chat request failed', error);
            throw error;
        }
    }

    /**
     * Streaming chat with function calling support
     * Yields text chunks and function calls as they arrive
     */
    async *chatStream(
        message: string,
        history: any[] = [],
        options: {
            systemPrompt?: string;
            tools?: StructuredTool[];
            userId?: string;
            long_term_memory?: any[];
        } = {},
    ): AsyncGenerator<{ text?: string; functionCall?: any }, void, unknown> {
        try {
            const messages: BaseMessage[] = [];

            if (options.systemPrompt) {
                messages.push(new SystemMessage(options.systemPrompt));
            }

            // Map conversation history
            if (history && history.length > 0) {
                for (const msg of history) {
                    if (msg.role === 'user') {
                        messages.push(new HumanMessage(msg.content));
                    } else if (msg.role === 'assistant') {
                        messages.push(new AIMessage(msg.content));
                    } else if (msg.role === 'function') {
                        messages.push(new ToolMessage({
                            content: JSON.stringify(msg.function_response || msg.content),
                            tool_call_id: msg.function_call?.name || 'unknown',
                            name: msg.function_call?.name,
                        }));
                    }
                }
            }

            if (message) {
                messages.push(new HumanMessage(message));
            }

            // Bind tools if provided
            let modelToUse: any = this.model;
            if (options.tools && options.tools.length > 0) {
                modelToUse = this.model.bindTools(options.tools);
                this.logger.debug(`Streaming with ${options.tools.length} tools bound`);
            }

            const stream = await modelToUse.stream(messages);

            for await (const chunk of stream) {
                // Yield text chunks
                if (chunk.content) {
                    yield { text: chunk.content as string };
                }

                // Yield function calls
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
        } catch (error) {
            this.logger.error('Chat stream failed', error);
            throw error;
        }
    }
}
