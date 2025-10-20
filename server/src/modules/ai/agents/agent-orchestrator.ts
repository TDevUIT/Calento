import { Injectable, Logger } from '@nestjs/common';
import { IAgent, AgentRequest, AgentResponse, AgentType } from './base/agent.interface';
import { CalendarAgent } from './calendar-agent';
import { TaskAgent } from './task-agent';
import { AnalysisAgent } from './analysis-agent';
import { SYSTEM_PROMPTS } from '../prompts/system-prompts';

@Injectable()
export class AgentOrchestrator {
  private readonly logger = new Logger(AgentOrchestrator.name);
  private readonly agents: Map<AgentType, IAgent> = new Map();

  constructor(
    private readonly calendarAgent: CalendarAgent,
    private readonly taskAgent: TaskAgent,
    private readonly analysisAgent: AnalysisAgent
  ) {
    this.registerAgents();
  }

  private registerAgents() {
    this.agents.set(AgentType.CALENDAR, this.calendarAgent);
    this.agents.set(AgentType.TASK, this.taskAgent);
    this.agents.set(AgentType.ANALYSIS, this.analysisAgent);

    this.logger.log(`Registered ${this.agents.size} agents`);
  }

  async process(request: AgentRequest): Promise<AgentResponse> {
    try {
      this.logger.log(`Orchestrating request: "${request.message.substring(0, 50)}..."`);

      const selectedAgents = await this.selectAgents(request);

      if (selectedAgents.length === 0) {
        return {
          success: false,
          message: 'Sorry, I am not sure how I can help with this request.',
          error: 'No suitable agent found',
        };
      }

      if (selectedAgents.length === 1) {
        return await selectedAgents[0].process(request);
      }

      return await this.handleMultiAgent(selectedAgents, request);
    } catch (error) {
      this.logger.error('Orchestration failed', error.stack);
      return {
        success: false,
        message: 'Sorry, I encountered an error while processing your request.',
        error: error.message,
      };
    }
  }

  private async selectAgents(request: AgentRequest): Promise<IAgent[]> {
    const candidates: Array<{ agent: IAgent; confidence: number }> = [];

    for (const [type, agent] of this.agents) {
      const canHandle = await agent.canHandle(request);

      if (canHandle) {
        const status = agent.getStatus();
        const confidence = this.calculateAgentConfidence(request, agent);

        candidates.push({ agent, confidence });
        this.logger.debug(`Agent ${type} can handle request (confidence: ${confidence}%)`);
      }
    }

    candidates.sort((a, b) => b.confidence - a.confidence);

    const selected = candidates.filter((c) => c.confidence > 20).map((c) => c.agent);

    if (selected.length > 1) {
      const topConfidence = candidates[0].confidence;
      const similarAgents = candidates.filter((c) => c.confidence >= topConfidence - 10);

      const hasAnalysis = similarAgents.find((c) => c.agent.config.type === AgentType.ANALYSIS);
      if (hasAnalysis && request.message.toLowerCase().includes('team')) {
        return [hasAnalysis.agent];
      }

      return [selected[0]];
    }

    return selected;
  }

  private calculateAgentConfidence(request: AgentRequest, agent: IAgent): number {
    const message = request.message.toLowerCase();
    let confidence = 0;

    switch (agent.config.type) {
      case AgentType.CALENDAR:
        const calendarKeywords = ['calendar', 'schedule', 'event', 'meeting', 'appointment', 'book'];
        confidence = this.matchKeywords(message, calendarKeywords);
        break;

      case AgentType.TASK:
        const taskKeywords = ['task', 'work', 'todo', 'plan', 'planning', 'learn', 'study'];
        confidence = this.matchKeywords(message, taskKeywords);
        break;

      case AgentType.ANALYSIS:
        const analysisKeywords = [
          'analyze',
          'analysis',
          'team',
          'group',
          'member',
          'people',
          'availability',
          'free',
          'optimal',
        ];
        confidence = this.matchKeywords(message, analysisKeywords);

        if (message.includes('team') || message.includes('group')) {
          confidence += 20;
        }
        break;
    }

    return Math.min(confidence, 100);
  }

  private matchKeywords(message: string, keywords: string[]): number {
    const matches = keywords.filter((keyword) => message.includes(keyword));
    if (matches.length === 0) return 0;

    return Math.min((matches.length / keywords.length) * 100, 80);
  }

  private async handleMultiAgent(
    agents: IAgent[],
    request: AgentRequest
  ): Promise<AgentResponse> {
    this.logger.log(`Multi-agent workflow: ${agents.map((a) => a.config.type).join(', ')}`);

    const responses: AgentResponse[] = [];

    for (const agent of agents) {
      const response = await agent.process(request);
      responses.push(response);

      if (!response.success) {
        return response;
      }
    }

    return this.synthesizeResponses(responses);
  }

  private synthesizeResponses(responses: AgentResponse[]): AgentResponse {
    const allSuccessful = responses.every((r) => r.success);
    const allToolCalls = responses.flatMap((r) => r.toolCalls || []);

    const combinedMessage = responses
      .map((r, i) => {
        if (i === 0) return r.message;
        return `\n\n${r.message}`;
      })
      .join('');

    return {
      success: allSuccessful,
      message: combinedMessage,
      data: {
        agent_responses: responses.map((r) => ({
          message: r.message,
          success: r.success,
        })),
      },
      toolCalls: allToolCalls,
    };
  }

  getStatus() {
    const agentStatuses = Array.from(this.agents.entries()).map(([type, agent]) => ({
      type,
      status: agent.getStatus(),
    }));

    return {
      total_agents: this.agents.size,
      agents: agentStatuses,
      healthy: agentStatuses.every((a) => a.status.healthy),
    };
  }

  getAgent(type: AgentType): IAgent | undefined {
    return this.agents.get(type);
  }
}
