import { Logger } from '@nestjs/common';
import { StructuredTool } from '@langchain/core/tools';
import { z, ZodObject, ZodRawShape } from 'zod';
import { AgentContext } from '../agents/base/agent.interface';

export interface ITool {
  readonly name: string;
  readonly description: string;
  readonly category: 'calendar' | 'task' | 'analysis';
  readonly parameters: any;
  execute(args: Record<string, any>, context: AgentContext): Promise<any>;
}

export abstract class BaseTool implements ITool {
  protected readonly logger: Logger;

  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly category: 'calendar' | 'task' | 'analysis',
    public readonly parameters: any,
  ) {
    this.logger = new Logger(`Tool:${name}`);
  }

  async execute(
    args: Record<string, any>,
    context: AgentContext,
  ): Promise<any> {
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

  protected abstract run(
    args: Record<string, any>,
    context: AgentContext,
  ): Promise<any>;

  abstract getZodSchema(): ZodObject<ZodRawShape>;

  toLangChainTool(context: AgentContext): StructuredTool {
    const self = this;
    const schema = this.getZodSchema();

    return new (class extends StructuredTool {
      name = self.name;
      description = self.description;
      schema = schema;

      async _call(args: z.infer<typeof schema>): Promise<string> {
        const result = await self.execute(args, context);
        return JSON.stringify(result);
      }
    })();
  }

  protected validateArgs(args: Record<string, any>) {
    const required = this.parameters.required || [];

    for (const field of required) {
      if (!args[field]) {
        throw new Error(`Missing required parameter: ${field}`);
      }
    }
  }
}
