-- Migration: Add color field to events table
-- Date: 2025-10-12
-- Description: Add color field to support event color coding in UI

-- Add color column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'color'
    ) THEN
        ALTER TABLE events ADD COLUMN color VARCHAR(50);
    END IF;
END $$;

-- Set default color for existing events
UPDATE events SET color = 'blue' WHERE color IS NULL;

-- Add comment
COMMENT ON COLUMN events.color IS 'Event color for UI display (e.g., blue, green, pink, purple, orange, red)';

-- Create index for better query performance when filtering by color
CREATE INDEX IF NOT EXISTS idx_events_color ON events(color);
