-- ============================================================================
-- MODULE: 00_SETUP
-- Extensions, Custom Types (ENUMs), and Shared Functions
-- ============================================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- CUSTOM TYPES (ENUMs)
DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('confirmed', 'cancelled', 'tentative');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sync_status AS ENUM ('pull', 'push');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sync_log_status AS ENUM ('success', 'failed', 'in_progress');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE provider_type AS ENUM ('google', 'outlook', 'apple');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_channel AS ENUM ('email', 'slack', 'zalo', 'push');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- SHARED FUNCTIONS
-- Generic updated_at trigger function (reused by all tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
