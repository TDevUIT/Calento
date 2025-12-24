-- ============================================================================
-- MODULE: 01_AUTH
-- Users, Credentials, and Settings
-- ============================================================================

-- Users table - stores user account information
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    -- Password reset fields
    reset_token_identifier VARCHAR(255) DEFAULT NULL,
    reset_token_secret VARCHAR(255) DEFAULT NULL,
    reset_token_expires_at TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE users IS 'Stores user account information and authentication data';
COMMENT ON COLUMN users.full_name IS 'Full display name (auto-generated from first_name + last_name)';
COMMENT ON COLUMN users.reset_token_identifier IS 'Public identifier for password reset token (safe to send in URLs)';
COMMENT ON COLUMN users.reset_token_secret IS 'Secret hash for password reset token verification';
COMMENT ON COLUMN users.reset_token_expires_at IS 'Expiration timestamp for password reset token';

-- User credentials table - stores OAuth tokens and credentials
CREATE TABLE IF NOT EXISTS user_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider provider_type DEFAULT 'google' NOT NULL,
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    expires_at TIMESTAMP,
    scope TEXT,
    sync_enabled BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE user_credentials IS 'Stores OAuth tokens and sync settings for calendar providers';
COMMENT ON COLUMN user_credentials.sync_enabled IS 'Whether automatic sync with Google Calendar is enabled';
COMMENT ON COLUMN user_credentials.last_sync_at IS 'Last successful sync timestamp';
COMMENT ON COLUMN user_credentials.is_active IS 'Whether the connection is currently active';

-- User settings table - stores per-user application/UI preferences
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON TABLE user_settings IS 'Stores per-user application settings and preferences';
COMMENT ON COLUMN user_settings.settings IS 'User preferences stored as JSONB';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_reset_token_identifier ON users(reset_token_identifier);
CREATE INDEX IF NOT EXISTS idx_users_reset_token_expires_at ON users(reset_token_expires_at);
CREATE INDEX IF NOT EXISTS idx_users_full_name ON users(full_name);

CREATE INDEX IF NOT EXISTS idx_user_credentials_user_id ON user_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credentials_provider ON user_credentials(provider);
CREATE INDEX IF NOT EXISTS idx_user_credentials_sync ON user_credentials(user_id, provider, sync_enabled, is_active);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_user_credentials_updated_at ON user_credentials;
CREATE TRIGGER trigger_user_credentials_updated_at 
    BEFORE UPDATE ON user_credentials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_user_settings_updated_at ON user_settings;
CREATE TRIGGER trigger_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
