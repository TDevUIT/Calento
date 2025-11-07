-- Migration: Ensure recurrence_rule column exists in events table
-- Date: 2025-11-07
-- Issue: Column e.recurrence_rule does not exist - need to rename or create it

-- UP Migration
DO $$
BEGIN
    -- Check if recurrence column exists and recurrence_rule doesn't
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'recurrence'
    ) AND NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'recurrence_rule'
    ) THEN
        -- Rename recurrence to recurrence_rule
        ALTER TABLE events RENAME COLUMN recurrence TO recurrence_rule;
        RAISE NOTICE 'Renamed column recurrence to recurrence_rule';
    
    -- Check if neither column exists
    ELSIF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'recurrence_rule'
    ) THEN
        -- Create recurrence_rule column if it doesn't exist
        ALTER TABLE events ADD COLUMN recurrence_rule TEXT;
        RAISE NOTICE 'Created recurrence_rule column';
    
    ELSE
        -- Column already exists
        RAISE NOTICE 'Column recurrence_rule already exists';
    END IF;
END $$;

-- Add index for recurrence_rule queries
CREATE INDEX IF NOT EXISTS idx_events_recurrence_rule ON events(recurrence_rule) 
WHERE recurrence_rule IS NOT NULL AND recurrence_rule != '';

-- Add comment for documentation
COMMENT ON COLUMN events.recurrence_rule IS 'RRULE format for recurring events (RFC 5545 compliant)';

-- DOWN Migration
-- Note: This is commented out to prevent accidental rollback
-- DO $$
-- BEGIN
--     IF EXISTS (
--         SELECT 1 
--         FROM information_schema.columns 
--         WHERE table_name = 'events' 
--         AND column_name = 'recurrence_rule'
--     ) THEN
--         ALTER TABLE events RENAME COLUMN recurrence_rule TO recurrence;
--     END IF;
-- END $$;
