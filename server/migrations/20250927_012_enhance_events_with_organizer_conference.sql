-- Migration: Enhance events table with organizer and conference data
-- Description: Adds organizer info, conference data (Google Meet, Zoom, MS Teams), and structured attendees

-- Add columns if they don't exist
DO $$
BEGIN
  -- Add organizer_id column to track event creator
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'organizer_id') THEN
    ALTER TABLE events ADD COLUMN organizer_id UUID REFERENCES users(id) ON DELETE SET NULL;
  END IF;

  -- Add organizer_email for external organizers (from Google Calendar sync)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'organizer_email') THEN
    ALTER TABLE events ADD COLUMN organizer_email VARCHAR(255);
  END IF;

  -- Add organizer_name for display purposes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'organizer_name') THEN
    ALTER TABLE events ADD COLUMN organizer_name VARCHAR(255);
  END IF;

  -- Add conference_data as JSONB to store video conference information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'conference_data') THEN
    ALTER TABLE events ADD COLUMN conference_data JSONB;
  END IF;

  -- Add visibility field for privacy control
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'visibility') THEN
    ALTER TABLE events ADD COLUMN visibility VARCHAR(50) DEFAULT 'default' CHECK (visibility IN ('default', 'public', 'private', 'confidential'));
  END IF;

  -- Add response_status for event acceptance status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'response_status') THEN
    ALTER TABLE events ADD COLUMN response_status VARCHAR(50) DEFAULT 'accepted' CHECK (response_status IN ('accepted', 'declined', 'tentative', 'needsAction'));
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_events_organizer_id') THEN
    CREATE INDEX idx_events_organizer_id ON events(organizer_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_events_organizer_email') THEN
    CREATE INDEX idx_events_organizer_email ON events(organizer_email);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_events_conference_data') THEN
    CREATE INDEX idx_events_conference_data ON events USING GIN (conference_data);
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN events.organizer_id IS 'Internal user ID who created/organized the event';
COMMENT ON COLUMN events.organizer_email IS 'Email of the organizer (for synced external events)';
COMMENT ON COLUMN events.organizer_name IS 'Display name of the organizer';
COMMENT ON COLUMN events.conference_data IS 'Video conference information (Google Meet, Zoom, MS Teams, etc.)';
COMMENT ON COLUMN events.visibility IS 'Event visibility level';
COMMENT ON COLUMN events.response_status IS 'User response to event invitation';

-- Update existing events to set organizer_id from calendar owner
-- This assumes calendar has a user_id field
UPDATE events e
SET organizer_id = c.user_id
FROM calendars c
WHERE e.calendar_id = c.id AND e.organizer_id IS NULL;
