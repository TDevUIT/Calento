-- Migration: Create sync_errors table for error tracking and recovery
-- Description: Table to store and track sync errors with retry logic

-- Create sync_errors table
CREATE TABLE IF NOT EXISTS sync_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    error_type VARCHAR(50) NOT NULL CHECK (error_type IN ('event_sync', 'webhook_delivery', 'calendar_connection', 'token_refresh')),
    error_message TEXT NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key constraint
    CONSTRAINT fk_sync_errors_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sync_errors_user_id ON sync_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_errors_error_type ON sync_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_sync_errors_resolved ON sync_errors(resolved);
CREATE INDEX IF NOT EXISTS idx_sync_errors_next_retry ON sync_errors(next_retry_at) WHERE resolved = false;
CREATE INDEX IF NOT EXISTS idx_sync_errors_created_at ON sync_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_sync_errors_retry_lookup ON sync_errors(resolved, retry_count, next_retry_at);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_sync_errors_user_resolved_created 
    ON sync_errors(user_id, resolved, created_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_sync_errors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_sync_errors_updated_at ON sync_errors;

CREATE TRIGGER trigger_sync_errors_updated_at
    BEFORE UPDATE ON sync_errors
    FOR EACH ROW
    EXECUTE FUNCTION update_sync_errors_updated_at();

-- Add comment to table
COMMENT ON TABLE sync_errors IS 'Stores sync errors with retry logic for automatic error recovery';
COMMENT ON COLUMN sync_errors.error_type IS 'Type of sync error: event_sync, webhook_delivery, calendar_connection, token_refresh';
COMMENT ON COLUMN sync_errors.retry_count IS 'Current number of retry attempts';
COMMENT ON COLUMN sync_errors.max_retries IS 'Maximum number of retry attempts allowed';
COMMENT ON COLUMN sync_errors.next_retry_at IS 'Timestamp when next retry should be attempted';
COMMENT ON COLUMN sync_errors.metadata IS 'Additional error context and retry parameters in JSON format';
COMMENT ON COLUMN sync_errors.resolved IS 'Whether the error has been resolved successfully';
