import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../database/database.module';
import { VectorService } from './vector.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [VectorService],
  exports: [VectorService],
})
export class VectorModule {}
