-- UP Migration: Add password reset token fields to users table
-- =========================================================
-- Date: 2024-10-06
-- Description: Add reset_token_identifier, reset_token_secret, reset_token_expires_at fields to users table

ALTER TABLE users 
ADD COLUMN reset_token_identifier VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_token_secret VARCHAR(255) DEFAULT NULL,
ADD COLUMN reset_token_expires_at TIMESTAMP DEFAULT NULL;

-- Create index for password reset token queries
CREATE INDEX idx_users_reset_token_identifier ON users(reset_token_identifier);
CREATE INDEX idx_users_reset_token_expires_at ON users(reset_token_expires_at);

-- Add comment to document the purpose of these fields
COMMENT ON COLUMN users.reset_token_identifier IS 'Public identifier for password reset token (safe to send in URLs)';
COMMENT ON COLUMN users.reset_token_secret IS 'Secret hash for password reset token verification';
COMMENT ON COLUMN users.reset_token_expires_at IS 'Expiration timestamp for password reset token';

-- DOWN Migration: Remove password reset token fields
-- =================================================

-- DROP INDEX IF EXISTS idx_users_reset_token_expires_at;
-- DROP INDEX IF EXISTS idx_users_reset_token_identifier;
-- ALTER TABLE users DROP COLUMN IF EXISTS reset_token_expires_at;
-- ALTER TABLE users DROP COLUMN IF EXISTS reset_token_secret;
-- ALTER TABLE users DROP COLUMN IF EXISTS reset_token_identifier;
