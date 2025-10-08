#!/usr/bin/env ts-node
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MigrationService } from '../database/migration.service';
import { Logger } from '@nestjs/common';

async function runMigrations() {
  const logger = new Logger('Migration CLI');

  try {
    logger.log('🚀 Starting migration process...');

    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    const migrationService = app.get(MigrationService);

    await migrationService.runMigrations();

    logger.log('✅ Migration process completed successfully');

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration process failed:', error.message);
    process.exit(1);
  }
}

async function rollbackMigration() {
  const logger = new Logger('Rollback CLI');

  try {
    logger.log('🔄 Starting rollback process...');

    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    const migrationService = app.get(MigrationService);
    await migrationService.rollbackLastMigration();

    logger.log('✅ Rollback completed successfully');

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Rollback failed:', error.message);
    process.exit(1);
  }
}

async function generateMigration() {
  const logger = new Logger('Generate CLI');
  const migrationName = process.argv[3];

  if (!migrationName) {
    logger.error(
      '❌ Please provide a migration name: npm run migrate:generate <name>',
    );
    process.exit(1);
  }

  try {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    const migrationService = app.get(MigrationService);
    const filePath = migrationService.generateMigration(migrationName);

    logger.log(`✅ Migration file generated: ${filePath}`);

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Failed to generate migration:', error.message);
    process.exit(1);
  }
}

const command = process.argv[2];

switch (command) {
  case 'up':
    runMigrations();
    break;
  case 'down':
    rollbackMigration();
    break;
  case 'generate':
    generateMigration();
    break;
  default:
    console.log(`
      Usage: npm run migrate:<command>

      Commands:
        up        Run pending migrations
        down      Rollback last migration
        generate  Generate new migration file

      Examples:
        npm run migrate:up
        npm run migrate:down
        npm run migrate:generate create_posts_table
    `);
    process.exit(1);
}
