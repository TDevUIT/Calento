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

  constructor(private readonly databaseService: DatabaseService) {}

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
      this.logger.error('❌ Failed to initialize migrations table:', error.message);
      throw error;
    }
  }

  async getExecutedMigrations(): Promise<string[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT id FROM migrations ORDER BY executed_at ASC'
      );
      return result.rows.map(row => row.id);
    } catch (error) {
      this.logger.error('Failed to get executed migrations:', error.message);
      return [];
    }
  }

  loadMigrationFiles(): Migration[] {
    if (!fs.existsSync(this.migrationsPath)) {
      fs.mkdirSync(this.migrationsPath, { recursive: true });
      this.logger.log(`📁 Created migrations directory: ${this.migrationsPath}`);
      return [];
    }

    const files = fs.readdirSync(this.migrationsPath)
      .filter(file => file.endsWith('.sql'))
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
        downContent = content.substring(downMarkerIndex + downMarkerMatch[0].length).trim();
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
        timestamp: new Date()
      };

      this.logger.debug(`Loaded migration ${file}:`);
      this.logger.debug(`UP content length: ${upContent.length}`);
      this.logger.debug(`DOWN content length: ${downContent.length}`);
      this.logger.debug(`UP content preview: ${upContent.substring(0, 200)}...`);
      
      migrations.push(migration);
    }

    return migrations;
  }

  async runMigrations(): Promise<void> {
    await this.initializeMigrationsTable();
    
    const executedMigrations = await this.getExecutedMigrations();
    const allMigrations = this.loadMigrationFiles();
    
    const pendingMigrations = allMigrations.filter(
      migration => !executedMigrations.includes(migration.id)
    );

    if (pendingMigrations.length === 0) {
      this.logger.log('✅ No pending migrations');
      return;
    }

    this.logger.log(`🔄 Running ${pendingMigrations.length} pending migrations...`);

    for (const migration of pendingMigrations) {
      try {
        await this.databaseService.transaction(async (client) => {
          await client.query(migration.up);
          
          await client.query(
            'INSERT INTO migrations (id, name) VALUES ($1, $2)',
            [migration.id, migration.name]
          );
        });

        this.logger.log(`✅ Executed migration: ${migration.name}`);
      } catch (error) {
        this.logger.error(`❌ Failed to execute migration ${migration.name}:`, error.message);
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
    const allMigrations = this.loadMigrationFiles();
    const migration = allMigrations.find(m => m.id === lastMigrationId);

    if (!migration) {
      throw new Error(`Migration file not found for: ${lastMigrationId}`);
    }

    if (!migration.down) {
      throw new Error(`No down migration defined for: ${lastMigrationId}`);
    }

    try {
      await this.databaseService.transaction(async (client) => {
        await client.query(migration.down);
        
        await client.query(
          'DELETE FROM migrations WHERE id = $1',
          [migration.id]
        );
      });

      this.logger.log(`✅ Rolled back migration: ${migration.name}`);
    } catch (error) {
      this.logger.error(`❌ Failed to rollback migration ${migration.name}:`, error.message);
      throw error;
    }
  }

  generateMigration(name: string): string {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const filename = `${timestamp}_${name.toLowerCase().replace(/\s+/g, '_')}.sql`;
    const filePath = path.join(this.migrationsPath, filename);

    const template = `-- UP
    -- Add your migration SQL here


    -- DOWN
    -- Add your rollback SQL here

    `;

    fs.writeFileSync(filePath, template);
    this.logger.log(`📝 Generated migration file: ${filename}`);
    
    return filePath;
  }
}
