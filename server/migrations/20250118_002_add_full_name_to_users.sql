-- UP Migration: Add full_name column to users table
-- ===================================================

-- Add full_name column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(200);

-- Update existing users to have full_name from first_name and last_name
UPDATE users 
SET full_name = TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))
WHERE full_name IS NULL AND (first_name IS NOT NULL OR last_name IS NOT NULL);

-- Create index for full_name
CREATE INDEX IF NOT EXISTS idx_users_full_name ON users(full_name);

-- DOWN Migration
-- ===============
-- ALTER TABLE users DROP COLUMN IF EXISTS full_name;
-- DROP INDEX IF EXISTS idx_users_full_name;
