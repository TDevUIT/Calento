-- Migration: Add calendar sync management fields
-- Xử lý sync strategies và conflict resolution

-- 1. Thêm columns vào user_credentials để quản lý sync
ALTER TABLE user_credentials 
ADD COLUMN IF NOT EXISTS sync_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. Thêm synced_at vào events table (google_event_id đã có trong init migration)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS synced_at TIMESTAMP;

-- 3. Tạo index cho performance
CREATE INDEX IF NOT EXISTS idx_events_google_event_id ON events(google_event_id);
-- Note: events table doesn't have user_id, it uses calendar_id instead
CREATE INDEX IF NOT EXISTS idx_events_calendar_google ON events(calendar_id, google_event_id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_sync ON user_credentials(user_id, provider, sync_enabled, is_active);

-- 4. Tạo sync_log table để track sync history
CREATE TABLE IF NOT EXISTS sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'google',
    status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed', 'disconnected'
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sync_log_user_provider ON sync_log(user_id, provider);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON sync_log(status);

-- 5. Tạo event_conflicts table để track conflicts khi initial sync
CREATE TABLE IF NOT EXISTS event_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tempra_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    google_event_id VARCHAR(255),
    conflict_reason VARCHAR(100) NOT NULL, -- 'duplicate', 'time_overlap', 'missing_mapping'
    resolution VARCHAR(100), -- 'prefer_tempra', 'prefer_google', 'keep_both', 'manual'
    resolved BOOLEAN DEFAULT false,
    tempra_event_data JSONB,
    google_event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_conflicts_user ON event_conflicts(user_id);
CREATE INDEX IF NOT EXISTS idx_event_conflicts_resolved ON event_conflicts(resolved);

-- 6. Add comments for documentation
COMMENT ON COLUMN user_credentials.sync_enabled IS 'Whether automatic sync with Google Calendar is enabled';
COMMENT ON COLUMN user_credentials.last_sync_at IS 'Last successful sync timestamp';
COMMENT ON COLUMN user_credentials.is_active IS 'Whether the connection is currently active';
COMMENT ON COLUMN events.synced_at IS 'Last time this event was synced with Google Calendar';
COMMENT ON TABLE sync_log IS 'Tracks sync operations history and status';
COMMENT ON TABLE event_conflicts IS 'Stores conflicts detected during calendar sync';
