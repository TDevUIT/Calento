import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../database/database.module';
import { EventModule } from '../event/event.module';
import { TaskModule } from '../task/task.module';
import { CalendarModule } from '../calendar/calendar.module';
import { VectorModule } from '../vector/vector.module';
import { RagModule } from '../rag/rag.module';

import { AIController } from './ai.controller';
import { LLMModule } from '../llm/llm.module';
import { AIConversationService } from './services/conversation.service';
import { AIAnalysisService } from './services/analysis.service';
import { AIFunctionCallingService } from './services/function-calling.service';
import { AIConversationRepository } from './repositories/ai-conversation.repository';
import { AIActionRepository } from './repositories/ai-action.repository';

import { CalendarAgent } from './agents/calendar-agent';
import { TaskAgent } from './agents/task-agent';
import { AnalysisAgent } from './agents/analysis-agent';
import { AgentOrchestrator } from './services/agent.orchestrator';

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
import { PendingActionService } from './services/pending-action.service';
import { AiEnhancementMigrationService } from './services/ai-enhancement-migration.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    EventModule,
    TaskModule,
    CalendarModule,
    VectorModule,
    RagModule,
    LLMModule,
  ],
  controllers: [AIController],
  providers: [
    AIConversationService,
    AIAnalysisService,
    AIFunctionCallingService,
    AIConversationRepository,
    AIActionRepository,
    PendingActionService,
    AiEnhancementMigrationService,

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
    AIConversationService,
    AIAnalysisService,
    AgentOrchestrator,
    ToolRegistry,
    PendingActionService, // Export pending action service
  ],
})
export class AIModule implements OnModuleInit {
  private readonly tools = [
    CreateEventTool,
    CheckAvailabilityTool,
    SearchEventsTool,
    UpdateEventTool,
    DeleteEventTool,
    CreateTaskTool,
    CreateLearningPlanTool,
    AnalyzeTeamAvailabilityTool,
  ];

  constructor(
    private readonly toolRegistry: ToolRegistry,
    private readonly moduleRef: ModuleRef,
  ) { }

  onModuleInit() {
    this.tools.forEach((ToolClass) => {
      const tool = this.moduleRef.get(ToolClass, { strict: false });
      if (tool) {
        this.toolRegistry.register(tool);
      }
    });
  }
}
