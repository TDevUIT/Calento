-- Migration: Sync existing event attendees to event_attendees table
-- Date: 2025-01-15
-- Description: Populate event_attendees table from existing events.attendees JSONB data

DO $$
DECLARE
  event_record RECORD;
  attendee_record JSONB;
  organizer_email VARCHAR(255);
  is_organizer_flag BOOLEAN;
BEGIN
  -- Loop through all events that have attendees
  FOR event_record IN 
    SELECT 
      e.id as event_id,
      e.attendees,
      u.email as organizer_email
    FROM events e
    LEFT JOIN users u ON u.id = e.organizer_id
    WHERE e.attendees IS NOT NULL 
      AND jsonb_array_length(e.attendees) > 0
  LOOP
    organizer_email := event_record.organizer_email;
    
    -- Loop through each attendee in the JSONB array
    FOR attendee_record IN 
      SELECT * FROM jsonb_array_elements(event_record.attendees)
    LOOP
      -- Determine if this attendee is the organizer
      is_organizer_flag := LOWER(attendee_record->>'email') = LOWER(organizer_email);
      
      -- Insert attendee into event_attendees table
      INSERT INTO event_attendees (
        event_id,
        email,
        name,
        response_status,
        is_organizer,
        is_optional,
        comment,
        created_at,
        updated_at
      )
      VALUES (
        event_record.event_id,
        attendee_record->>'email',
        attendee_record->>'name',
        COALESCE(attendee_record->>'response_status', 'needsAction'),
        is_organizer_flag,
        COALESCE((attendee_record->>'is_optional')::BOOLEAN, false),
        attendee_record->>'comment',
        NOW(),
        NOW()
      )
      ON CONFLICT (event_id, email) DO UPDATE SET
        name = EXCLUDED.name,
        response_status = EXCLUDED.response_status,
        is_organizer = EXCLUDED.is_organizer,
        is_optional = EXCLUDED.is_optional,
        comment = EXCLUDED.comment,
        updated_at = NOW();
      
      RAISE NOTICE 'Synced attendee % for event % (is_organizer: %)', 
        attendee_record->>'email', 
        event_record.event_id, 
        is_organizer_flag;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Migration completed successfully';
END$$;

-- Add comment
COMMENT ON TABLE event_attendees IS 'Stores event attendees synced from events.attendees JSONB and new events';
