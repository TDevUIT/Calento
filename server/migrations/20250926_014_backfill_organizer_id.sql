-- Migration: Backfill organizer_id for existing events
-- Description: Set organizer_id to calendar owner's user_id for events that don't have organizer_id
-- Date: 2025-10-14

-- Update events to set organizer_id from the calendar's user_id
UPDATE events e
SET organizer_id = c.user_id,
    updated_at = CURRENT_TIMESTAMP
FROM calendars c
WHERE e.calendar_id = c.id
  AND e.organizer_id IS NULL;

-- Log result
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Backfilled organizer_id for % events', updated_count;
END $$;
