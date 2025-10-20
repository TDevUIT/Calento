import { Logger } from '@nestjs/common';
import { AgentContext } from '../agents/base/agent.interface';

/**
 * Base Tool Interface
 */
export interface ITool {
  readonly name: string;
  readonly description: string;
  readonly category: 'calendar' | 'task' | 'analysis';
  readonly parameters: any;
  execute(args: Record<string, any>, context: AgentContext): Promise<any>;
}

/**
 * Base Tool Class
 */
export abstract class BaseTool implements ITool {
  protected readonly logger: Logger;

  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly category: 'calendar' | 'task' | 'analysis',
    public readonly parameters: any
  ) {
    this.logger = new Logger(`Tool:${name}`);
  }

  /**
   * Execute the tool
   */
  async execute(args: Record<string, any>, context: AgentContext): Promise<any> {
    this.logger.log(`Executing tool: ${this.name} for user: ${context.userId}`);

    try {
      this.validateArgs(args);

      const result = await this.run(args, context);

      this.logger.log(`Tool execution successful: ${this.name}`);
      return {
        success: true,
        result,
      };
    } catch (error) {
      this.logger.error(`Tool execution failed: ${this.name}`, error.stack);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Tool-specific execution logic
   */
  protected abstract run(args: Record<string, any>, context: AgentContext): Promise<any>;

  /**
   * Validate arguments
   */
  protected validateArgs(args: Record<string, any>) {
    const required = this.parameters.required || [];

    for (const field of required) {
      if (!args[field]) {
        throw new Error(`Missing required parameter: ${field}`);
      }
    }
  }
}
