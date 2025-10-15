-- Migration: Add invitation support to events
-- Date: 2025-01-15

-- Add invitation-related fields to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS created_from_invitation BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS original_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS organizer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS organizer_email VARCHAR(255);

-- Create event_attendees table if not exists
CREATE TABLE IF NOT EXISTS event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- For authenticated users
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- For guest users
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    is_guest BOOLEAN DEFAULT FALSE,
    
    -- Response status
    response_status VARCHAR(50) DEFAULT 'needsAction' CHECK (
        response_status IN ('accepted', 'declined', 'tentative', 'needsAction')
    ),
    
    -- Invitation metadata
    invitation_token VARCHAR(255) UNIQUE,
    invited_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    UNIQUE (event_id, email),
    CHECK (user_id IS NOT NULL OR is_guest = TRUE)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_email ON event_attendees(email);
CREATE INDEX IF NOT EXISTS idx_event_attendees_token ON event_attendees(invitation_token);
CREATE INDEX IF NOT EXISTS idx_event_attendees_status ON event_attendees(response_status);
CREATE INDEX IF NOT EXISTS idx_events_original_event ON events(original_event_id);

-- Create invitation_tokens table for tracking
CREATE TABLE IF NOT EXISTS invitation_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    attendee_email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    
    -- Security
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    is_valid BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    sent_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE (event_id, attendee_email)
);

CREATE INDEX IF NOT EXISTS idx_invitation_tokens_token ON invitation_tokens(token);
CREATE INDEX IF NOT EXISTS idx_invitation_tokens_event ON invitation_tokens(event_id);
CREATE INDEX IF NOT EXISTS idx_invitation_tokens_expires ON invitation_tokens(expires_at);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_event_attendees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event_attendees
DROP TRIGGER IF EXISTS event_attendees_updated_at ON event_attendees;
CREATE TRIGGER event_attendees_updated_at
    BEFORE UPDATE ON event_attendees
    FOR EACH ROW
    EXECUTE FUNCTION update_event_attendees_updated_at();

-- Seed data comment
COMMENT ON TABLE event_attendees IS 'Stores event attendees and their RSVP status. Supports both authenticated Calento users and guest users.';
COMMENT ON TABLE invitation_tokens IS 'Secure tokens for invitation links sent via email.';
