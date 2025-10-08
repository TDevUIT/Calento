import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import env from '../config/env';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  async onModuleInit() {
    await this.createConnection();
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  private async createConnection() {
    try {
      this.pool = new Pool({
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        min: env.DB_POOL_MIN,
        max: env.DB_POOL_MAX,
        idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT,
        connectionTimeoutMillis: env.DB_POOL_CONNECTION_TIMEOUT,
        maxUses: env.DB_POOL_MAX_USES,
      });
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.logger.log('✅ PostgreSQL connection established successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to PostgreSQL:', error.message);
      throw error;
    }
  }

  private async closeConnection() {
    if (this.pool) {
      await this.pool.end();
      this.logger.log('🔌 PostgreSQL connection closed');
    }
  }

  async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      this.logger.debug(`Executed query in ${duration}ms: ${text}`);
      return result;
    } catch (error) {
      this.logger.error(`Query failed: ${text}`, error.message);
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.getClient();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('Transaction failed, rolled back:', error.message);
      throw error;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error.message);
      return false;
    }
  }

  async getStats() {
    try {
      const result = await this.query(
        `
        SELECT 
          pg_database.datname as database_name,
          pg_size_pretty(pg_database_size(pg_database.datname)) as size,
          (SELECT count(*) FROM pg_stat_activity WHERE datname = pg_database.datname) as connections
        FROM pg_database 
        WHERE datname = $1
      `,
        [env.DB_NAME],
      );

      return result.rows[0];
    } catch (error) {
      this.logger.error('Failed to get database stats:', error.message);
      return null;
    }
  }
}
