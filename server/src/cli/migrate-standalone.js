#!/usr/bin/env node
/**
 * Standalone migration runner for production environments
 * This script runs migrations without requiring the full NestJS context
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tempra',
};

const migrationsPath = path.join(__dirname, '../../migrations');

async function initializeMigrationsTable(client) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await client.query(createTableQuery);
  console.log('✅ Migrations table initialized');
}

async function getExecutedMigrations(client) {
  try {
    const result = await client.query(
      'SELECT id FROM migrations ORDER BY executed_at ASC'
    );
    return result.rows.map((row) => row.id);
  } catch (error) {
    console.error('Failed to get executed migrations:', error.message);
    return [];
  }
}

function loadMigrationFiles() {
  if (!fs.existsSync(migrationsPath)) {
    console.log(`❌ Migrations directory not found: ${migrationsPath}`);
    return [];
  }

  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const migrations = [];

  for (const file of files) {
    const filePath = path.join(migrationsPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract migration ID from filename (format: YYYYMMDD_NNN_name.sql)
    const match = file.match(/^(\d{8}_\d{3})_(.+)\.sql$/);
    if (!match) {
      console.warn(`⚠️  Skipping invalid migration filename: ${file}`);
      continue;
    }

    const id = match[1];
    const name = match[2];

    // Split UP and DOWN migrations
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

    // Clean up UP content
    upContent = upContent.replace(/^-- UP Migration:.*$/m, '').trim();
    upContent = upContent.replace(/^-- =+$/m, '').trim();

    // Remove leading comment lines
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

    migrations.push({
      id,
      name,
      file,
      up: upContent,
      down: downContent,
    });
  }

  return migrations;
}

async function runMigrations() {
  const client = new Client(dbConfig);

  try {
    console.log('🔌 Connecting to database...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);
    
    await client.connect();
    console.log('✅ Connected to database');

    // Initialize migrations table
    await initializeMigrationsTable(client);

    // Get already executed migrations
    const executedMigrations = await getExecutedMigrations(client);
    console.log(`📋 Found ${executedMigrations.length} already executed migrations`);

    // Load migration files
    const migrations = loadMigrationFiles();
    console.log(`📁 Found ${migrations.length} migration files`);

    // Filter pending migrations
    const pendingMigrations = migrations.filter(
      (m) => !executedMigrations.includes(m.id)
    );

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations to run');
      return;
    }

    console.log(`🚀 Running ${pendingMigrations.length} pending migrations...\n`);

    // Run each pending migration
    for (const migration of pendingMigrations) {
      console.log(`📝 Running migration: ${migration.file}`);
      
      try {
        // Start transaction
        await client.query('BEGIN');

        // Execute migration
        await client.query(migration.up);

        // Record migration
        await client.query(
          'INSERT INTO migrations (id, name) VALUES ($1, $2)',
          [migration.id, migration.name]
        );

        // Commit transaction
        await client.query('COMMIT');
        
        console.log(`   ✅ Migration ${migration.file} completed successfully\n`);
      } catch (error) {
        // Rollback on error
        await client.query('ROLLBACK');
        console.error(`   ❌ Migration ${migration.file} failed:`, error.message);
        throw error;
      }
    }

    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration process failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run migrations
runMigrations()
  .then(() => {
    console.log('🎉 Migration process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  });
