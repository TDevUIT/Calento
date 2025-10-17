-- Migration: Add missing columns to event_attendees table
-- Date: 2025-01-15
-- Author: System
-- Description: Add invitation_remind_count and is_organizer columns if they don't exist

-- Add invitation_remind_count column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_attendees' 
        AND column_name = 'invitation_remind_count'
    ) THEN
        ALTER TABLE event_attendees 
        ADD COLUMN invitation_remind_count INTEGER DEFAULT 0;
        
        RAISE NOTICE 'Added invitation_remind_count column to event_attendees table';
    ELSE
        RAISE NOTICE 'invitation_remind_count column already exists';
    END IF;
END$$;

-- Add is_organizer column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_attendees' 
        AND column_name = 'is_organizer'
    ) THEN
        ALTER TABLE event_attendees 
        ADD COLUMN is_organizer BOOLEAN DEFAULT false;
        
        RAISE NOTICE 'Added is_organizer column to event_attendees table';
    ELSE
        RAISE NOTICE 'is_organizer column already exists';
    END IF;
END$$;

-- Add comments
COMMENT ON COLUMN event_attendees.invitation_remind_count IS 'Number of times invitation reminder has been sent';
COMMENT ON COLUMN event_attendees.is_organizer IS 'Whether this attendee is the event organizer';
