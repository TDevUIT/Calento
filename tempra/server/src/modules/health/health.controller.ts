import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly databaseService: DatabaseService) {}
  @Public()
  @Get()
  @ApiOperation({ 
    summary: '💚 System health check',
    description: 'System health check with database, memory, and uptime info'
  })
  @ApiResponse({ 
    status: 200, 
    description: '✅ System health information',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2024-01-15T10:30:00Z',
        uptime: 3600.5,
        database: {
          connected: true,
          stats: {
            totalConnections: 10,
            activeConnections: 2,
            idleConnections: 8
          }
        },
        memory: {
          rss: 45678592,
          heapTotal: 20971520,
          heapUsed: 18874368,
          external: 1089024
        },
        version: 'v18.17.0'
      }
    }
  })
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
      memory: process.memoryUsage(),
      version: process.version,
    };
  }

  @Get('db')
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
