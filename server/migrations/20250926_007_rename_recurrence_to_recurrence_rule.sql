-- Migration: Rename recurrence column to recurrence_rule for consistency
-- Date: 2025-10-12
-- Issue: Code uses recurrence_rule but database has recurrence column

-- UP Migration
-- Rename column to match code expectations
ALTER TABLE events 
RENAME COLUMN recurrence TO recurrence_rule;

-- Add comment for documentation
COMMENT ON COLUMN events.recurrence_rule IS 'RRULE format for recurring events (RFC 5545 compliant)';

-- DOWN Migration
-- Rename back to original name
-- ALTER TABLE events 
-- RENAME COLUMN recurrence_rule TO recurrence;
