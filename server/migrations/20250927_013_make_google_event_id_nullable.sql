-- Migration: Make google_event_id nullable for local events
-- Description: Allow events to be created without Google Calendar sync
-- Date: 2025-10-14

-- UP Migration
-- ============

-- Make google_event_id nullable to support local events
ALTER TABLE events 
    ALTER COLUMN google_event_id DROP NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN events.google_event_id IS 'Google Calendar event ID (NULL for local events not synced to Google)';

-- Update the index to handle NULL values efficiently
DROP INDEX IF EXISTS idx_events_google_id;
CREATE INDEX idx_events_google_id ON events(google_event_id) WHERE google_event_id IS NOT NULL;

-- DOWN Migration
-- ==============

-- Revert google_event_id to NOT NULL (this will fail if NULL values exist)
-- ALTER TABLE events 
--     ALTER COLUMN google_event_id SET NOT NULL;

-- Restore original index
-- DROP INDEX IF EXISTS idx_events_google_id;
-- CREATE INDEX idx_events_google_id ON events(google_event_id);

-- Note: DOWN migration commented out because it would fail if local events exist
-- To rollback, you would need to first delete or update all local events
