-- UP Migration: add_team_id_to_events
-- ============================================
-- Date: 2025-12-28
-- Description: Add team_id column to events table

ALTER TABLE events ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;


-- DOWN Migration: add_team_id_to_events
-- ============================================

ALTER TABLE events DROP COLUMN IF EXISTS team_id;
