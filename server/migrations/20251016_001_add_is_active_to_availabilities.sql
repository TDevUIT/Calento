-- Migration: Add is_active column to availabilities table
-- Date: 2025-10-16

-- Add is_active column with default value TRUE
ALTER TABLE availabilities 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_availabilities_is_active 
ON availabilities(user_id, is_active) 
WHERE is_active = TRUE;

-- Add comment
COMMENT ON COLUMN availabilities.is_active IS 'Whether this availability rule is currently active';
