-- Migration: Add timezone column to availabilities table
-- Date: 2025-10-17

-- Add timezone column with default value 'UTC'
ALTER TABLE availabilities 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC' NOT NULL;

-- Add comment
COMMENT ON COLUMN availabilities.timezone IS 'Timezone for the availability rule (e.g., UTC, America/New_York)';

-- Create index for better query performance when filtering by timezone
CREATE INDEX IF NOT EXISTS idx_availabilities_timezone 
ON availabilities(timezone);
