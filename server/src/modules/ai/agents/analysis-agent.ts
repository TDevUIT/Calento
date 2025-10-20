import { Injectable } from '@nestjs/common';
import { BaseAgent } from './base/base-agent';
import { AgentType, AgentCapability, AgentRequest, AgentResponse, ToolCall } from './base/agent.interface';
import { SYSTEM_PROMPTS, RESPONSE_FORMATS } from '../prompts/system-prompts';
import { ToolRegistry } from '../tools/tool-registry';
import { GeminiService } from '../services/gemini.service';

/**
 * Analysis Agent
 * Specialized in calendar intelligence and team analysis
 */
@Injectable()
export class AnalysisAgent extends BaseAgent {
  private readonly keywords = [
    'analyze',
    'analysis',
    'team',
    'group',
    'availability',
    'free',
    'available',
    'suitable time',
    'best time',
    'optimal',
    'optimize',
    'conflict',
    'compare',
    'comparison',
    'member',
    'people',
    'everyone',
    'colleagues',
    'intelligence',
    'insight',
  ];

  constructor(
    private readonly toolRegistry: ToolRegistry,
    private readonly geminiService: GeminiService
  ) {
    super({
      type: AgentType.ANALYSIS,
      name: 'Analysis',
      description: 'Performs calendar intelligence and team availability analysis',
      capabilities: [AgentCapability.ANALYZE_TEAM],
      systemPrompt: SYSTEM_PROMPTS.ANALYSIS_AGENT,
    });
  }

  protected async execute(request: AgentRequest): Promise<AgentResponse> {
    try {
      const enhancedPrompt = this.buildEnhancedPrompt(this.config.systemPrompt, request.context);
      const tools = this.toolRegistry.getToolDescriptions('analysis');

      const aiResponse = await this.geminiService.chat(
        request.message,
        request.history || [],
        {
          systemPrompt: enhancedPrompt + '\n\n' + RESPONSE_FORMATS.ANALYSIS,
          tools,
          userId: request.context.userId,
        }
      );

      const toolCalls: ToolCall[] = [];
      if (aiResponse.functionCalls && aiResponse.functionCalls.length > 0) {
        for (const funcCall of aiResponse.functionCalls) {
          try {
            const result = await this.toolRegistry.execute(
              funcCall.name,
              funcCall.arguments,
              request.context
            );

            toolCalls.push({
              toolName: funcCall.name,
              arguments: funcCall.arguments,
              result: result.result,
              executionTime: result.executionTime,
            });
          } catch (error) {
            toolCalls.push({
              toolName: funcCall.name,
              arguments: funcCall.arguments,
              error: error.message,
            });
          }
        }
      }

      // Format analysis response with rich formatting
      const formattedResponse = this.formatAnalysisResponse(aiResponse.text, toolCalls);

      return {
        success: true,
        message: formattedResponse,
        data: {
          ai_response: aiResponse.text,
          tool_calls: toolCalls,
          analysis: toolCalls.length > 0 ? toolCalls[0].result : null,
        },
        toolCalls,
        confidence: this.calculateConfidence(request.message, this.keywords),
      };
    } catch (error) {
      this.logger.error('Analysis agent execution failed', error.stack);
      return {
        success: false,
        message: 'Sorry, I encountered an error while analyzing your team calendar.',
        error: error.message,
      };
    }
  }

  protected hasRelevantKeywords(message: string): boolean {
    const messageLower = message.toLowerCase();
    return this.keywords.some((keyword) => messageLower.includes(keyword));
  }

  /**
   * Format analysis response with rich details
   */
  private formatAnalysisResponse(aiText: string, toolCalls: any[]): string {
    if (toolCalls.length === 0) {
      return aiText;
    }

    const analysisResult = toolCalls[0]?.result;
    if (!analysisResult || !analysisResult.analysis) {
      return aiText;
    }

    const { analysis, conflicts, best_match, match_score } = analysisResult;

    let formatted = `${aiText}\n\n`;

    // Analysis Summary
    formatted += `📊 **AI Analysis**\n`;
    formatted += `⏱️ Duration: ${analysis.duration}\n`;
    formatted += `✓ Checked ${analysis.calendars_checked} team member calendars\n`;
    formatted += `📅 Identified ${analysis.windows_found} mutual availability windows\n`;

    // Conflicts
    if (conflicts && conflicts.length > 0) {
      formatted += `\n⚠️ **Conflicts Found:**\n`;
      conflicts.forEach((c: any) => {
        formatted += `✕ ${c.time} - ${c.reason}\n`;
      });
    }

    // Best Match
    if (best_match) {
      const scoreEmoji = match_score >= 90 ? '✅' : match_score >= 70 ? '⚠️' : '❌';
      formatted += `\n${scoreEmoji} **Best Match (Score: ${match_score}%)**\n`;
      formatted += `📅 ${best_match.day} • ${best_match.time}\n`;
      formatted += `👥 ${best_match.availability}\n`;
      formatted += `💡 ${best_match.reason}\n`;
    }

    return formatted;
  }
}
