-- Migration: Create event_attendees table
-- Description: Create separate table for event attendees to support invitation tracking
-- Date: 2025-10-15

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    response_status VARCHAR(50) DEFAULT 'needsAction',
    is_optional BOOLEAN DEFAULT false,
    is_organizer BOOLEAN DEFAULT false,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique attendee per event
    UNIQUE(event_id, email)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_email ON event_attendees(email);
CREATE INDEX IF NOT EXISTS idx_event_attendees_response_status ON event_attendees(response_status);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_event_attendees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_event_attendees_updated_at ON event_attendees;

CREATE TRIGGER trigger_update_event_attendees_updated_at
    BEFORE UPDATE ON event_attendees
    FOR EACH ROW
    EXECUTE FUNCTION update_event_attendees_updated_at();

-- Migrate existing attendees from events.attendees JSONB to event_attendees table
-- This will populate the new table with existing data
DO $$
DECLARE
    event_record RECORD;
    attendee_record JSONB;
BEGIN
    -- Loop through all events that have attendees
    FOR event_record IN 
        SELECT id, attendees 
        FROM events 
        WHERE attendees IS NOT NULL 
        AND jsonb_array_length(attendees) > 0
    LOOP
        -- Loop through each attendee in the JSONB array
        FOR attendee_record IN 
            SELECT * FROM jsonb_array_elements(event_record.attendees)
        LOOP
            -- Insert attendee into event_attendees table
            INSERT INTO event_attendees (
                event_id,
                email,
                name,
                response_status,
                is_optional,
                is_organizer,
                comment
            )
            VALUES (
                event_record.id,
                attendee_record->>'email',
                attendee_record->>'name',
                COALESCE(attendee_record->>'response_status', 'needsAction'),
                COALESCE((attendee_record->>'is_optional')::boolean, false),
                COALESCE((attendee_record->>'is_organizer')::boolean, false),
                attendee_record->>'comment'
            )
            ON CONFLICT (event_id, email) DO NOTHING;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Successfully migrated attendees from events.attendees JSONB to event_attendees table';
END $$;

-- Add comment
COMMENT ON TABLE event_attendees IS 'Stores event attendees with invitation tracking support';
