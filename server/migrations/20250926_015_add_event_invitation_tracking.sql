-- Migration: Add Event Invitation Tracking
-- Description: Add invitation tracking fields to event_attendees table
-- Date: 2025-10-15
-- Prerequisites: 20250926_014_5_create_event_attendees_table.sql must run first

-- Ensure event_attendees table exists (should be created by previous migration)
-- If not, create it now as a safety measure
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
    UNIQUE(event_id, email)
);

-- Add invitation tracking columns to event_attendees table
ALTER TABLE event_attendees
ADD COLUMN IF NOT EXISTS invitation_token VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invitation_responded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS invitation_remind_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS can_modify_event BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS can_invite_others BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS can_see_guest_list BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS google_calendar_synced BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS google_event_id VARCHAR(255);

-- Create index for faster invitation token lookups
CREATE INDEX IF NOT EXISTS idx_event_attendees_invitation_token 
ON event_attendees(invitation_token) WHERE invitation_token IS NOT NULL;

-- Create index for invitation status queries
CREATE INDEX IF NOT EXISTS idx_event_attendees_response_status 
ON event_attendees(response_status);

-- Create index for pending invitations
CREATE INDEX IF NOT EXISTS idx_event_attendees_pending_invitations 
ON event_attendees(event_id, response_status) 
WHERE response_status = 'needsAction';

-- Add comments
COMMENT ON COLUMN event_attendees.invitation_token IS 'Unique token for accepting/declining invitation via email link';
COMMENT ON COLUMN event_attendees.invitation_sent_at IS 'Timestamp when invitation email was sent';
COMMENT ON COLUMN event_attendees.invitation_responded_at IS 'Timestamp when guest responded to invitation';
COMMENT ON COLUMN event_attendees.invitation_remind_count IS 'Number of reminder emails sent';
COMMENT ON COLUMN event_attendees.can_modify_event IS 'Guest permission to modify event details';
COMMENT ON COLUMN event_attendees.can_invite_others IS 'Guest permission to invite other attendees';
COMMENT ON COLUMN event_attendees.can_see_guest_list IS 'Guest permission to see other attendees';
COMMENT ON COLUMN event_attendees.google_calendar_synced IS 'Whether this attendee was synced to Google Calendar';
COMMENT ON COLUMN event_attendees.google_event_id IS 'Google Calendar event ID for this attendee';
