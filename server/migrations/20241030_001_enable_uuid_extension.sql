-- Enable UUID extension for PostgreSQL
-- This must run before any tables that use uuid_generate_v4()

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify extension is enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp'
  ) THEN
    RAISE EXCEPTION 'uuid-ossp extension failed to install';
  END IF;
END $$;
