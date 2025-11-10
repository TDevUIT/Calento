#!/usr/bin/env ts-node

/**
 * Migration Script: Google Calendar Two-Way Sync
 * 
 * Purpose: Trigger initial sync for users who connected Google Calendar
 * before the two-way sync feature was implemented.
 * 
 * Usage:
 *   npm run migrate:google-sync
 *   or
 *   ts-node scripts/migrate-google-sync.ts
 */

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { CalendarSyncManagerService } from '../src/modules/event/services/calendar-sync-manager.service';
import { WebhookService } from '../src/modules/webhook/services/webhook.service';
import { SyncStrategy } from '../src/modules/event/types/sync.types';

async function bootstrap() {
  const logger = new Logger('GoogleSyncMigration');
  
  logger.log('🚀 Starting Google Calendar Sync Migration...');
  
  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const databaseService = app.get(DatabaseService);
  const syncManager = app.get(CalendarSyncManagerService);
  const webhookService = app.get(WebhookService);

  try {
    // Step 1: Find all users connected to Google Calendar
    logger.log('📊 Fetching users connected to Google Calendar...');
    
    const query = `
      SELECT DISTINCT user_id 
      FROM user_credentials 
      WHERE provider = 'google' 
      AND access_token IS NOT NULL
      AND deleted_at IS NULL
    `;
    
    const result = await databaseService.query(query);
    const userIds = result.rows.map(row => row.user_id);
    
    logger.log(`✅ Found ${userIds.length} users to sync`);
    
    if (userIds.length === 0) {
      logger.log('ℹ️  No users to migrate. Exiting...');
      await app.close();
      return;
    }

    // Step 2: Sync each user
    let successCount = 0;
    let failCount = 0;
    
    for (const userId of userIds) {
      try {
        logger.log(`\n🔄 Processing user: ${userId}`);
        
        // Check if user already has events from Google
        const checkQuery = `
          SELECT COUNT(*) as count 
          FROM events 
          WHERE user_id = $1 
          AND google_event_id IS NOT NULL
        `;
        const checkResult = await databaseService.query(checkQuery, [userId]);
        const existingGoogleEvents = parseInt(checkResult.rows[0].count);
        
        if (existingGoogleEvents > 0) {
          logger.log(`  ℹ️  User already has ${existingGoogleEvents} synced events. Skipping...`);
          continue;
        }
        
        // Perform initial sync
        logger.log(`  🔄 Running initial sync...`);
        const syncResult = await syncManager.performInitialSync(
          userId,
          SyncStrategy.KEEP_BOTH
        );
        
        logger.log(`  ✅ Sync completed: ${syncResult.imported} events imported`);
        
        // Setup webhook if not exists
        try {
          logger.log(`  🔔 Setting up webhook...`);
          await webhookService.watchCalendar(userId, {
            calendar_id: 'primary',
            expiration: 604800000, // 7 days
          });
          logger.log(`  ✅ Webhook setup completed`);
        } catch (webhookError) {
          logger.warn(`  ⚠️  Webhook setup failed:`, webhookError.message);
        }
        
        successCount++;
        
      } catch (error) {
        logger.error(`  ❌ Failed to sync user ${userId}:`, error.message);
        failCount++;
      }
    }
    
    // Step 3: Summary
    logger.log('\n' + '='.repeat(60));
    logger.log('📊 Migration Summary:');
    logger.log(`   Total users: ${userIds.length}`);
    logger.log(`   ✅ Success: ${successCount}`);
    logger.log(`   ❌ Failed: ${failCount}`);
    logger.log(`   ⏭️  Skipped: ${userIds.length - successCount - failCount}`);
    logger.log('='.repeat(60));
    
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await app.close();
    logger.log('✅ Migration completed. Application closed.');
  }
}

bootstrap().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
