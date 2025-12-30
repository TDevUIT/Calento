-- ============================================================================
-- MIGRATION: 13_BOOKING_LINKS_LOCATION
-- Add missing columns to booking_links table
-- ============================================================================

ALTER TABLE booking_links
  ADD COLUMN IF NOT EXISTS location VARCHAR(100);

ALTER TABLE booking_links
  ADD COLUMN IF NOT EXISTS location_link TEXT;
