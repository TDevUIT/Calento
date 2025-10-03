import { Global, Module } from '@nestjs/common';

import { MigrationService } from './migration.service';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [DatabaseService, MigrationService],
  exports: [DatabaseService, MigrationService],
})
export class DatabaseModule {}
