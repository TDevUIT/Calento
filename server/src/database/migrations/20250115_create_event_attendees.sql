-- Migration: Create event_attendees table for invitation system
-- Date: 2025-01-15
-- Author: System

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    
    -- Attendee information
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    
    -- Response status
    response_status VARCHAR(50) DEFAULT 'needsAction' CHECK (
        response_status IN ('accepted', 'declined', 'tentative', 'needsAction')
    ),
    
    -- Invitation token for email links
    invitation_token VARCHAR(255) UNIQUE,
    invitation_sent_at TIMESTAMP,
    invitation_remind_count INTEGER DEFAULT 0,
    is_organizer BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    UNIQUE (event_id, email)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_email ON event_attendees(email);
CREATE INDEX IF NOT EXISTS idx_event_attendees_token ON event_attendees(invitation_token);
CREATE INDEX IF NOT EXISTS idx_event_attendees_status ON event_attendees(response_status);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_event_attendees_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS event_attendees_update_timestamp ON event_attendees;
CREATE TRIGGER event_attendees_update_timestamp
    BEFORE UPDATE ON event_attendees
    FOR EACH ROW
    EXECUTE FUNCTION update_event_attendees_timestamp();

-- Add comment
COMMENT ON TABLE event_attendees IS 'Stores event attendees and their RSVP status for invitation system';
COMMENT ON COLUMN event_attendees.invitation_token IS 'Secure token for invitation email links';
COMMENT ON COLUMN event_attendees.response_status IS 'RSVP status: accepted, declined, tentative, or needsAction';
