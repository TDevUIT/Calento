import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../database/database.module';
import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { VectorModule } from '../vector/vector.module';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [ConfigModule, DatabaseModule, VectorModule, LLMModule],
  controllers: [RagController],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}
