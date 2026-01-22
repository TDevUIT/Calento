-- ============================================================================
-- MIGRATION: 20260122_001_add_is_admin_to_users
-- Add system admin flag to users table
-- ============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE users
            ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;

        CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
    END IF;
END $$;
