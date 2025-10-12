-- Migration: Fix google_event_id to allow NULL for manual events
-- Date: 2025-10-12
-- Description: Allow google_event_id to be NULL for manually created events

-- Make google_event_id nullable
ALTER TABLE events ALTER COLUMN google_event_id DROP NOT NULL;

-- Add comment
COMMENT ON COLUMN events.google_event_id IS 'Google Calendar event ID (NULL for manually created events)';
