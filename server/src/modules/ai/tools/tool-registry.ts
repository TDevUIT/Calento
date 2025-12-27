import { Injectable, Logger } from '@nestjs/common';
import { ITool } from './base-tool';
import { AgentContext } from '../agents/base/agent.interface';

@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);
  private readonly tools: Map<string, ITool> = new Map();

  register(tool: ITool) {
    if (this.tools.has(tool.name)) {
      this.logger.warn(
        `Tool ${tool.name} is already registered. Overwriting...`,
      );
    }

    this.tools.set(tool.name, tool);
    this.logger.log(`Registered tool: ${tool.name} (${tool.category})`);
  }

  registerMany(tools: ITool[]) {
    tools.forEach((tool) => this.register(tool));
  }

  getTool(name: string): ITool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): ITool[] {
    return Array.from(this.tools.values());
  }

  getToolsByCategory(category: 'calendar' | 'task' | 'analysis'): ITool[] {
    return this.getAllTools().filter((tool) => tool.category === category);
  }

  async execute(
    toolName: string,
    args: Record<string, any>,
    context: AgentContext,
  ): Promise<any> {
    const tool = this.getTool(toolName);

    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    const startTime = Date.now();

    try {
      const result = await tool.execute(args, context);
      const executionTime = Date.now() - startTime;

      this.logger.log(`Tool executed: ${toolName} (${executionTime}ms)`);

      return {
        ...result,
        executionTime,
      };
    } catch (error) {
      this.logger.error(`Tool execution failed: ${toolName}`, error.stack);
      throw error;
    }
  }

  getToolDescriptions(category?: 'calendar' | 'task' | 'analysis'): any[] {
    const tools = category
      ? this.getToolsByCategory(category)
      : this.getAllTools();

    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    }));
  }

  hasTool(name: string): boolean {
    return this.tools.has(name);
  }

  getStats() {
    const byCategory = {
      calendar: this.getToolsByCategory('calendar').length,
      task: this.getToolsByCategory('task').length,
      analysis: this.getToolsByCategory('analysis').length,
    };

    return {
      total: this.tools.size,
      byCategory,
      tools: Array.from(this.tools.keys()),
    };
  }
}
