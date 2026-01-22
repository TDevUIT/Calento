import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class AiEnhancementMigrationService {
    private readonly logger = new Logger(AiEnhancementMigrationService.name);

    constructor(private readonly db: DatabaseService) { }

    async runMigrations() {
        this.logger.log('Running AI enhancement migrations...');

        try {
            await this.db.query(`
        ALTER TABLE user_context_summary 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
      `);

            await this.db.query(`
        CREATE INDEX IF NOT EXISTS idx_user_context_temporal 
        ON user_context_summary(user_id, created_at DESC);
      `);

            await this.db.query(`
        ALTER TABLE ai_actions 
        ADD COLUMN IF NOT EXISTS requires_confirmation BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS confirmation_status VARCHAR(50) DEFAULT 'not_required';
      `);

            this.logger.log('Migrations completed successfully');
            return true;
        } catch (error) {
            this.logger.error('Migration failed', error);
            throw error;
        }
    }
}
