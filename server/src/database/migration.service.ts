import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DatabaseService } from './database.service';

export interface Migration {
  id: string;
  name: string;
  up: string;
  down: string;
  timestamp: Date;
}

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);
  private readonly migrationsPath = path.join(__dirname, '../../migrations');
  private readonly schemaFile = 'schema.sql';

  constructor(private readonly databaseService: DatabaseService) { }

  async initializeMigrationsTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS migrations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await this.databaseService.query(createTableQuery);
      this.logger.log('✅ Migrations table initialized');
    } catch (error) {
      this.logger.error(
        '❌ Failed to initialize migrations table:',
        error.message,
      );
      throw error;
    }
  }

  async getExecutedMigrations(): Promise<string[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT id FROM migrations ORDER BY executed_at ASC',
      );
      return result.rows.map((row) => row.id);
    } catch (error) {
      this.logger.error('Failed to get executed migrations:', error.message);
      return [];
    }
  }

  /**
   * Check if this is a fresh database (no migrations executed yet)
   */
  async isFreshDatabase(): Promise<boolean> {
    const executedMigrations = await this.getExecutedMigrations();
    return executedMigrations.length === 0;
  }

  /**
   * Run the consolidated schema.sql file for fresh database setup
   */
  async runSchemaFile(): Promise<void> {
    const schemaPath = path.join(this.migrationsPath, this.schemaFile);

    if (!fs.existsSync(schemaPath)) {
      this.logger.warn(`⚠️ Schema file not found: ${schemaPath}`);
      return;
    }

    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

    try {
      await this.databaseService.transaction(async (client) => {
        await client.query(schemaContent);

        // Record schema.sql as executed migration
        await client.query(
          'INSERT INTO migrations (id, name) VALUES ($1, $2)',
          [this.schemaFile.replace('.sql', ''), this.schemaFile],
        );
      });

      this.logger.log(`✅ Executed schema file: ${this.schemaFile}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to execute schema file:`,
        error.message,
      );
      throw error;
    }
  }

  loadMigrationFiles(): Migration[] {
    if (!fs.existsSync(this.migrationsPath)) {
      fs.mkdirSync(this.migrationsPath, { recursive: true });
      this.logger.log(
        `📁 Created migrations directory: ${this.migrationsPath}`,
      );
      return [];
    }

    const files = fs
      .readdirSync(this.migrationsPath)
      .filter((file) => file.endsWith('.sql'))
      // Exclude schema.sql from individual migration files
      .filter((file) => file !== this.schemaFile)
      .sort();

    const migrations: Migration[] = [];

    for (const file of files) {
      const filePath = path.join(this.migrationsPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      const downMarkerRegex = /^-- DOWN Migration:.*$/m;
      const downMarkerMatch = content.match(downMarkerRegex);

      let upContent = content;
      let downContent = '';

      if (downMarkerMatch) {
        const downMarkerIndex = content.indexOf(downMarkerMatch[0]);
        upContent = content.substring(0, downMarkerIndex).trim();
        downContent = content
          .substring(downMarkerIndex + downMarkerMatch[0].length)
          .trim();
      }

      upContent = upContent.replace(/^-- UP Migration:.*$/m, '').trim();
      upContent = upContent.replace(/^-- =+$/m, '').trim();

      const lines = upContent.split('\n');
      let startIndex = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '' || line.startsWith('--')) {
          startIndex = i + 1;
        } else {
          break;
        }
      }

      upContent = lines.slice(startIndex).join('\n').trim();

      const migration: Migration = {
        id: file.replace('.sql', ''),
        name: file,
        up: upContent,
        down: downContent,
        timestamp: new Date(),
      };

      this.logger.debug(`Loaded migration ${file}:`);
      this.logger.debug(`UP content length: ${upContent.length}`);
      this.logger.debug(`DOWN content length: ${downContent.length}`);
      this.logger.debug(
        `UP content preview: ${upContent.substring(0, 200)}...`,
      );

      migrations.push(migration);
    }

    return migrations;
  }

  async runMigrations(): Promise<void> {
    await this.initializeMigrationsTable();

    const isFresh = await this.isFreshDatabase();

    // For fresh database, run the consolidated schema.sql
    if (isFresh) {
      const schemaPath = path.join(this.migrationsPath, this.schemaFile);

      if (fs.existsSync(schemaPath)) {
        this.logger.log('🆕 Fresh database detected, running schema.sql...');
        await this.runSchemaFile();
        this.logger.log('🎉 Database schema initialized successfully');
        return;
      }
    }

    // For existing database or if no schema.sql, run individual migrations
    const executedMigrations = await this.getExecutedMigrations();
    const allMigrations = this.loadMigrationFiles();

    const pendingMigrations = allMigrations.filter(
      (migration) => !executedMigrations.includes(migration.id),
    );

    if (pendingMigrations.length === 0) {
      this.logger.log('✅ No pending migrations');
      return;
    }

    this.logger.log(
      `🔄 Running ${pendingMigrations.length} pending migrations...`,
    );

    for (const migration of pendingMigrations) {
      try {
        await this.databaseService.transaction(async (client) => {
          await client.query(migration.up);

          await client.query(
            'INSERT INTO migrations (id, name) VALUES ($1, $2)',
            [migration.id, migration.name],
          );
        });

        this.logger.log(`✅ Executed migration: ${migration.name}`);
      } catch (error) {
        this.logger.error(
          `❌ Failed to execute migration ${migration.name}:`,
          error.message,
        );
        throw error;
      }
    }

    this.logger.log('🎉 All migrations completed successfully');
  }

  async rollbackLastMigration(): Promise<void> {
    const executedMigrations = await this.getExecutedMigrations();

    if (executedMigrations.length === 0) {
      this.logger.log('No migrations to rollback');
      return;
    }

    const lastMigrationId = executedMigrations[executedMigrations.length - 1];

    // Cannot rollback schema.sql
    if (lastMigrationId === 'schema') {
      this.logger.warn('⚠️ Cannot rollback schema.sql - this is the base schema');
      this.logger.warn('To reset database, drop and recreate the database instead');
      return;
    }

    const allMigrations = this.loadMigrationFiles();
    const migration = allMigrations.find((m) => m.id === lastMigrationId);

    if (!migration) {
      throw new Error(`Migration file not found for: ${lastMigrationId}`);
    }

    if (!migration.down) {
      throw new Error(`No down migration defined for: ${lastMigrationId}`);
    }

    try {
      await this.databaseService.transaction(async (client) => {
        await client.query(migration.down);

        await client.query('DELETE FROM migrations WHERE id = $1', [
          migration.id,
        ]);
      });

      this.logger.log(`✅ Rolled back migration: ${migration.name}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to rollback migration ${migration.name}:`,
        error.message,
      );
      throw error;
    }
  }

  generateMigration(name: string): string {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');
    const filename = `${timestamp}_${name.toLowerCase().replace(/\s+/g, '_')}.sql`;
    const filePath = path.join(this.migrationsPath, filename);

    const template = `-- UP Migration: ${name}
-- ============================================
-- Date: ${new Date().toISOString().split('T')[0]}
-- Description: Add description here

-- Add your migration SQL here


-- DOWN Migration: ${name}
-- ============================================

-- Add your rollback SQL here (commented out by default)
-- DROP TABLE IF EXISTS ...
-- ALTER TABLE ... DROP COLUMN ...

`;

    fs.writeFileSync(filePath, template);
    this.logger.log(`📝 Generated migration file: ${filename}`);

    return filePath;
  }

  /**
   * Get migration status summary
   */
  async getMigrationStatus(): Promise<{
    executed: string[];
    pending: string[];
    hasSchema: boolean;
  }> {
    const executed = await this.getExecutedMigrations();
    const allMigrations = this.loadMigrationFiles();
    const pending = allMigrations
      .filter((m) => !executed.includes(m.id))
      .map((m) => m.id);

    const schemaPath = path.join(this.migrationsPath, this.schemaFile);
    const hasSchema = fs.existsSync(schemaPath);

    return { executed, pending, hasSchema };
  }
}
