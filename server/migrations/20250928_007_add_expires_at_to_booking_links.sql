-- Add expires_at column to booking_links table for auto-disable feature

ALTER TABLE booking_links 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for performance when querying expired links
CREATE INDEX IF NOT EXISTS idx_booking_links_expires_at 
ON booking_links(expires_at) 
WHERE expires_at IS NOT NULL AND is_active = true;

-- Add comment
COMMENT ON COLUMN booking_links.expires_at IS 'Optional expiration date for booking link. Link will be auto-disabled after this date.';
