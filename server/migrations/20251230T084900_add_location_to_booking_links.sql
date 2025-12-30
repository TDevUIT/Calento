ALTER TABLE booking_links
  ADD COLUMN IF NOT EXISTS location VARCHAR(100);

ALTER TABLE booking_links
  ADD COLUMN IF NOT EXISTS location_link TEXT;
