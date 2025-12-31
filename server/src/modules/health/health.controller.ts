import { Controller, Get } from '@nestjs/common';
import * as v8 from 'v8';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';
import { Public } from '../../common/decorators/public.decorator';
import { ApiHealthCheck, ApiDatabaseHealthCheck } from './health.swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) { }
  @Public()
  @Get()
  @ApiHealthCheck()
  async check() {
    const dbHealth = await this.databaseService.healthCheck();
    const dbStats = await this.databaseService.getStats();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: dbHealth,
        stats: dbStats,
      },
      memory: {
        ...process.memoryUsage(),
        heapLimit: v8.getHeapStatistics().heap_size_limit,
      },
      version: process.version,
    };
  }

  @Public()
  @Get('db')
  @ApiDatabaseHealthCheck()
  async database() {
    const isHealthy = await this.databaseService.healthCheck();
    const stats = await this.databaseService.getStats();

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      stats,
      timestamp: new Date().toISOString(),
    };
  }
}
