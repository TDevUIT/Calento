-- Create user_priorities table to store user's priority settings for tasks, booking links, etc.
CREATE TABLE IF NOT EXISTS user_priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'task', 'booking_link', 'habit', 'smart_meeting'
    priority VARCHAR(50) NOT NULL, -- 'critical', 'high', 'medium', 'low', 'disabled'
    position INTEGER NOT NULL DEFAULT 0, -- Order within the same priority column
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT fk_user_priorities_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    
    CONSTRAINT unique_user_item UNIQUE (user_id, item_id, item_type)
);

-- Create indexes for better query performance
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_priorities_user_id') THEN
    CREATE INDEX idx_user_priorities_user_id ON user_priorities(user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_priorities_priority') THEN
    CREATE INDEX idx_user_priorities_priority ON user_priorities(priority);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_priorities_item_type') THEN
    CREATE INDEX idx_user_priorities_item_type ON user_priorities(item_type);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_priorities_user_priority') THEN
    CREATE INDEX idx_user_priorities_user_priority ON user_priorities(user_id, priority);
  END IF;
END $$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_priorities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_priorities_updated_at ON user_priorities;

CREATE TRIGGER trigger_update_user_priorities_updated_at
    BEFORE UPDATE ON user_priorities
    FOR EACH ROW
    EXECUTE FUNCTION update_user_priorities_updated_at();

-- Add comments for documentation
COMMENT ON TABLE user_priorities IS 'Stores user priority settings for various items (tasks, booking links, etc.)';
COMMENT ON COLUMN user_priorities.item_type IS 'Type of item: task, booking_link, habit, smart_meeting';
COMMENT ON COLUMN user_priorities.priority IS 'Priority level: critical, high, medium, low, disabled';
COMMENT ON COLUMN user_priorities.position IS 'Position/order within the same priority column';
