-- Migration: Create webhook_channels table
-- Description: Stores Google Calendar webhook watch channels for push notifications
-- Created: 2025-09-26

-- Create webhook_channels table
CREATE TABLE IF NOT EXISTS webhook_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    calendar_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) NOT NULL UNIQUE,
    resource_id VARCHAR(255) NOT NULL,
    resource_uri TEXT NOT NULL,
    token VARCHAR(500),
    expiration TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Foreign key constraint (if users table exists)
    CONSTRAINT fk_webhook_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_webhook_channels_user_id ON webhook_channels(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_channels_channel_id ON webhook_channels(channel_id);
CREATE INDEX IF NOT EXISTS idx_webhook_channels_active ON webhook_channels(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_webhook_channels_expiration ON webhook_channels(expiration) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_webhook_channels_user_calendar ON webhook_channels(user_id, calendar_id) WHERE is_active = TRUE;

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_webhook_channels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_webhook_channels_updated_at
    BEFORE UPDATE ON webhook_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_webhook_channels_updated_at();

-- Add comment to table
COMMENT ON TABLE webhook_channels IS 'Stores Google Calendar webhook watch channels for receiving push notifications about calendar changes';
COMMENT ON COLUMN webhook_channels.channel_id IS 'Unique channel ID generated when creating the watch';
COMMENT ON COLUMN webhook_channels.resource_id IS 'Resource ID returned by Google Calendar API';
COMMENT ON COLUMN webhook_channels.resource_uri IS 'URI of the resource being watched';
COMMENT ON COLUMN webhook_channels.token IS 'Optional verification token for webhook requests';
COMMENT ON COLUMN webhook_channels.expiration IS 'When the watch channel expires (max 7 days from creation)';
COMMENT ON COLUMN webhook_channels.is_active IS 'Whether the channel is currently active';
