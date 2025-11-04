-- Migration: Add Password Reset Fields
-- Description: Add password_reset_token and password_reset_expires columns to users table
-- Date: 2024-11-04

-- Add password reset columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;

-- Add index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token 
ON users(password_reset_token) 
WHERE password_reset_token IS NOT NULL;

-- Add index for expiration cleanup
CREATE INDEX IF NOT EXISTS idx_users_password_reset_expires 
ON users(password_reset_expires) 
WHERE password_reset_expires IS NOT NULL;

-- Add comment
COMMENT ON COLUMN users.password_reset_token IS 'Token used for password reset (hex string)';
COMMENT ON COLUMN users.password_reset_expires IS 'Expiration timestamp for password reset token';
