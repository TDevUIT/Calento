-- Migration: Enhance events table with organizer and conference data
-- Description: Adds organizer info, conference data (Google Meet, Zoom, MS Teams), and structured attendees

-- Add organizer_id column to track event creator
ALTER TABLE events ADD COLUMN organizer_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add organizer_email for external organizers (from Google Calendar sync)
ALTER TABLE events ADD COLUMN organizer_email VARCHAR(255);

-- Add organizer_name for display purposes
ALTER TABLE events ADD COLUMN organizer_name VARCHAR(255);

-- Add conference_data as JSONB to store video conference information
-- Structure: {
--   type: 'google_meet' | 'zoom' | 'ms_teams' | 'custom',
--   url: string,
--   id: string,
--   password?: string,
--   phone?: string,
--   pin?: string,
--   notes?: string
-- }
ALTER TABLE events ADD COLUMN conference_data JSONB;

-- Add visibility field for privacy control
ALTER TABLE events ADD COLUMN visibility VARCHAR(50) DEFAULT 'default' CHECK (visibility IN ('default', 'public', 'private', 'confidential'));

-- Add response_status for event acceptance status
ALTER TABLE events ADD COLUMN response_status VARCHAR(50) DEFAULT 'accepted' CHECK (response_status IN ('accepted', 'declined', 'tentative', 'needsAction'));

-- Create index for organizer queries
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_organizer_email ON events(organizer_email);

-- Create index for conference data queries
CREATE INDEX idx_events_conference_data ON events USING GIN (conference_data);

-- Add comment for documentation
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
