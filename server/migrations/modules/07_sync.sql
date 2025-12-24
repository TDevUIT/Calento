-- ============================================================================
-- MODULE: 07_SYNC
-- Sync Logs, Sync Errors, Webhooks, Integrations
-- ============================================================================

-- Sync logs table
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sync_type sync_status NOT NULL,
    status sync_log_status NOT NULL,
    error_message TEXT,
    synced_items_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE sync_logs IS 'Tracks synchronization operations';

-- Sync log (detailed) table
CREATE TABLE IF NOT EXISTS sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'google',
    status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed', 'disconnected'
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE sync_log IS 'Tracks sync operations history and status';

-- Sync errors table
CREATE TABLE IF NOT EXISTS sync_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    error_type VARCHAR(50) NOT NULL CHECK (error_type IN ('event_sync', 'webhook_delivery', 'calendar_connection', 'token_refresh')),
    error_message TEXT NOT NULL,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE sync_errors IS 'Stores sync errors with retry logic for automatic error recovery';
COMMENT ON COLUMN sync_errors.error_type IS 'Type of sync error: event_sync, webhook_delivery, calendar_connection, token_refresh';
COMMENT ON COLUMN sync_errors.retry_count IS 'Current number of retry attempts';
COMMENT ON COLUMN sync_errors.max_retries IS 'Maximum number of retry attempts allowed';
COMMENT ON COLUMN sync_errors.next_retry_at IS 'Timestamp when next retry should be attempted';
COMMENT ON COLUMN sync_errors.metadata IS 'Additional error context and retry parameters in JSON format';

-- Webhook channels table
CREATE TABLE IF NOT EXISTS webhook_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    calendar_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL UNIQUE,
    resource_id VARCHAR(255) NOT NULL,
    resource_uri TEXT NOT NULL,
    token VARCHAR(500),
    expiration TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE webhook_channels IS 'Stores Google Calendar webhook watch channels for receiving push notifications about calendar changes';
COMMENT ON COLUMN webhook_channels.channel_id IS 'Unique channel ID generated when creating the watch';
COMMENT ON COLUMN webhook_channels.resource_id IS 'Resource ID returned by Google Calendar API';
COMMENT ON COLUMN webhook_channels.resource_uri IS 'URI of the resource being watched';
COMMENT ON COLUMN webhook_channels.token IS 'Optional verification token for webhook requests';
COMMENT ON COLUMN webhook_channels.expiration IS 'When the watch channel expires (max 7 days from creation)';

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider provider_type NOT NULL,
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    workspace_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE integrations IS 'Stores third-party service integrations (Slack, etc.)';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_sync_logs_user_id ON sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_sync_log_user_provider ON sync_log(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON sync_log(status);

CREATE INDEX IF NOT EXISTS idx_sync_errors_user_id ON sync_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_errors_error_type ON sync_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_sync_errors_resolved ON sync_errors(resolved);
CREATE INDEX IF NOT EXISTS idx_sync_errors_next_retry ON sync_errors(next_retry_at) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_sync_errors_created_at ON sync_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_sync_errors_retry_lookup ON sync_errors(resolved, retry_count, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_sync_errors_user_resolved_created ON sync_errors(user_id, resolved, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_webhook_channels_user_id ON webhook_channels(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_channels_channel_id ON webhook_channels(channel_id);
CREATE INDEX IF NOT EXISTS idx_webhook_channels_active ON webhook_channels(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_webhook_channels_expiration ON webhook_channels(expiration) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_webhook_channels_user_calendar ON webhook_channels(user_id, calendar_id) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON integrations(provider);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_sync_logs_updated_at ON sync_logs;
CREATE TRIGGER trigger_sync_logs_updated_at 
    BEFORE UPDATE ON sync_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_sync_errors_updated_at ON sync_errors;
CREATE TRIGGER trigger_sync_errors_updated_at
    BEFORE UPDATE ON sync_errors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_webhook_channels_updated_at ON webhook_channels;
CREATE TRIGGER trigger_update_webhook_channels_updated_at
    BEFORE UPDATE ON webhook_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_integrations_updated_at ON integrations;
CREATE TRIGGER trigger_integrations_updated_at 
    BEFORE UPDATE ON integrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
