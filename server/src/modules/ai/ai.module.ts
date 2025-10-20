import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIController } from './ai.controller';
import { GeminiService } from './services/gemini.service';
import { AIConversationService } from './services/ai-conversation.service';
import { AIAnalysisService } from './services/ai-analysis.service';
import { AIFunctionCallingService } from './services/ai-function-calling.service';
import { AIConversationRepository } from './repositories/ai-conversation.repository';
import { AIActionRepository } from './repositories/ai-action.repository';
import { DatabaseModule } from '../../database/database.module';
import { EventModule } from '../event/event.module';
import { TaskModule } from '../task/task.module';
import { CalendarModule } from '../calendar/calendar.module';

import { CalendarAgent } from './agents/calendar-agent';
import { TaskAgent } from './agents/task-agent';
import { AnalysisAgent } from './agents/analysis-agent';
import { AgentOrchestrator } from './agents/agent-orchestrator';

import { ToolRegistry } from './tools/tool-registry';
import {
  CreateEventTool,
  CheckAvailabilityTool,
  SearchEventsTool,
  UpdateEventTool,
  DeleteEventTool,
} from './tools/calendar-tools';
import { CreateTaskTool, CreateLearningPlanTool } from './tools/task-tools';
import { AnalyzeTeamAvailabilityTool } from './tools/analysis-tools';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    EventModule,
    TaskModule,
    CalendarModule,
  ],
  controllers: [AIController],
  providers: [
    GeminiService,
    AIConversationService,
    AIAnalysisService,
    AIFunctionCallingService,
    AIConversationRepository,
    AIActionRepository,

    ToolRegistry,

    CreateEventTool,
    CheckAvailabilityTool,
    SearchEventsTool,
    UpdateEventTool,
    DeleteEventTool,

    CreateTaskTool,
    CreateLearningPlanTool,

    AnalyzeTeamAvailabilityTool,

    CalendarAgent,
    TaskAgent,
    AnalysisAgent,
    AgentOrchestrator,
  ],
  exports: [
    GeminiService,
    AIConversationService,
    AIAnalysisService,
    AgentOrchestrator,
    ToolRegistry,
  ],
})
export class AIModule implements OnModuleInit {
  constructor(
    private readonly toolRegistry: ToolRegistry,
    private readonly createEventTool: CreateEventTool,
    private readonly checkAvailabilityTool: CheckAvailabilityTool,
    private readonly searchEventsTool: SearchEventsTool,
    private readonly updateEventTool: UpdateEventTool,
    private readonly deleteEventTool: DeleteEventTool,
    private readonly createTaskTool: CreateTaskTool,
    private readonly createLearningPlanTool: CreateLearningPlanTool,
    private readonly analyzeTeamAvailabilityTool: AnalyzeTeamAvailabilityTool,
  ) {}

  /**
   * Register all tools on module initialization
   */
  onModuleInit() {
    this.toolRegistry.register(this.createEventTool);
    this.toolRegistry.register(this.checkAvailabilityTool);
    this.toolRegistry.register(this.searchEventsTool);
    this.toolRegistry.register(this.updateEventTool);
    this.toolRegistry.register(this.deleteEventTool);

    this.toolRegistry.register(this.createTaskTool);
    this.toolRegistry.register(this.createLearningPlanTool);

    this.toolRegistry.register(this.analyzeTeamAvailabilityTool);
  }
}
