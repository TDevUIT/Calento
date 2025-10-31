import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, GenerativeModel, Content } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { GeminiAPIException } from '../exceptions/ai.exceptions';
import { AIMessage, AIFunctionDeclaration, AIFunctionCall } from '../interfaces/ai.interface';
import { SYSTEM_PROMPTS } from '../prompts/system-prompts';
import { FUNCTION_DESCRIPTIONS } from '../prompts/function-prompts';
import { AI_CONSTANTS, ERROR_MESSAGES } from '../constants/ai.constants';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    
    this.apiKey = apiKey;

    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.initializeModel();
  }

  private initializeModel() {
    const functionDeclarations = this.getFunctionDeclarations() as any;

    this.model = this.genAI.getGenerativeModel({
      model: AI_CONSTANTS.GEMINI.MODEL,
      generationConfig: {
        temperature: AI_CONSTANTS.GEMINI.TEMPERATURE,
        topP: AI_CONSTANTS.GEMINI.TOP_P,
        topK: AI_CONSTANTS.GEMINI.TOP_K,
        maxOutputTokens: AI_CONSTANTS.GEMINI.MAX_OUTPUT_TOKENS,
      },
      systemInstruction: this.getSystemInstruction(),
      tools: [{ functionDeclarations }],
    });

    this.logger.log('Gemini model initialized with function calling');
  }

  private getSystemInstruction(): string {
    return SYSTEM_PROMPTS.CALENTO_MAIN;
  }

  private getFunctionDeclarations(): AIFunctionDeclaration[] {
    return Object.values(FUNCTION_DESCRIPTIONS).map((func) => ({
      name: func.name,
      description: func.description,
      parameters: func.parameters,
    }));
  }

  async chat(
    message: string,
    history: AIMessage[] = [],
    context?: Record<string, any>
  ): Promise<{ text: string; functionCalls?: AIFunctionCall[] }> {
    try {
      this.logger.log(`Processing chat message: "${message.substring(0, 50)}..."`);

      if (!this.apiKey) {
        this.logger.error(ERROR_MESSAGES.API_KEY_NOT_CONFIGURED);
        throw new GeminiAPIException(
          ERROR_MESSAGES.API_KEY_NOT_CONFIGURED,
          'Please set GEMINI_API_KEY environment variable'
        );
      }

      const contents = this.convertHistoryToContents(history);
      
      let systemMessage = '';
      if (context) {
        systemMessage = this.buildContextMessage(context);
        this.logger.debug(`Context: ${systemMessage.substring(0, 100)}...`);
      }

      const chat = this.model.startChat({
        history: contents,
      });

      const prompt = systemMessage ? `${systemMessage}\n\nUser: ${message}` : message;
      this.logger.debug(`Sending prompt to Gemini (length: ${prompt.length})`);
      
      const result = await chat.sendMessage(prompt);
      const response = result.response;

      this.logger.debug(`Received response from Gemini`);

      const functionCalls = response.functionCalls();
      
      if (functionCalls && functionCalls.length > 0) {
        this.logger.log(`AI requested ${functionCalls.length} function calls: ${functionCalls.map(fc => fc.name).join(', ')}`);
        return {
          text: response.text() || 'Processing your request...',
          functionCalls: functionCalls.map(fc => ({
            name: fc.name,
            arguments: fc.args,
          })),
        };
      }

      const responseText = response.text();
      this.logger.log(`AI response (length: ${responseText?.length || 0})`);

      return {
        text: responseText || 'I processed your request.',
      };
    } catch (error) {
      this.handleApiError(error);
    }
  }


  private convertHistoryToContents(history: AIMessage[]): Content[] {
    return history.map((msg, index) => {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      
      let content = msg.content;
      
      if (index > 0 && role === 'user') {
        content = `[Follow-up message ${index}] ${msg.content}`;
      }
      
      return {
        role,
        parts: [{ text: content }],
      };
    });
  }

  private buildContextMessage(context: Record<string, any>): string {
    const parts: string[] = [];

    parts.push('**REMEMBER:** You are in a multi-turn conversation. Review ALL previous messages before responding.');
    parts.push('\n**Current Context:**');

    if (context.current_date) {
      parts.push(`Current Date/Time: ${context.current_date} (${context.current_date_formatted || 'N/A'})`);
    }

    if (context.timezone) {
      parts.push(`Timezone: ${context.timezone}`);
    }

    if (context.preferences) {
      parts.push(`User Preferences: ${JSON.stringify(context.preferences)}`);
    }

    if (context.upcoming_events && context.upcoming_events.length > 0) {
      parts.push(`Upcoming events: ${context.upcoming_events.length} events`);
    }

    if (context.conversation_turn) {
      parts.push(`\nTurn ${context.conversation_turn} - Build upon previous exchanges`);
    }

    parts.push('\nWARNING: If user provides information (emails, names, dates), USE IT immediately. Don\'t ask again!');

    return parts.join('\n') + '\n';
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      await model.generateContent('Hello');
      return true;
    } catch (error) {
      this.logger.error('Invalid Gemini API key:', error);
      return false;
    }
  }

  private handleApiError(error: any): never {
    this.logger.error('Gemini API error:', error);
    this.logger.error('Error details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
    });
    
    if (error.message?.includes('API_KEY_INVALID')) {
      throw new GeminiAPIException(
        'Invalid Gemini API key',
        'Please check your GEMINI_API_KEY environment variable'
      );
    }
    
    if (error.message?.includes('PERMISSION_DENIED')) {
      throw new GeminiAPIException(
        'Gemini API access denied',
        'Please verify your API key has proper permissions'
      );
    }
    
    throw new GeminiAPIException(
      'Failed to process chat message',
      error.message
    );
  }
}
