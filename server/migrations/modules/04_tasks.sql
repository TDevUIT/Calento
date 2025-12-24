-- ============================================================================
-- MODULE: 04_TASKS
-- Tasks and Priorities
-- ============================================================================

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    project_id UUID,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    estimated_duration INTEGER, -- in minutes
    actual_duration INTEGER, -- in minutes
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE tasks IS 'User tasks and to-do items';
COMMENT ON COLUMN tasks.status IS 'Task status: todo, in_progress, completed, cancelled';
COMMENT ON COLUMN tasks.priority IS 'Task priority: low, medium, high, critical';
COMMENT ON COLUMN tasks.recurrence_rule IS 'Recurrence rule in RRULE format';
COMMENT ON COLUMN tasks.estimated_duration IS 'Estimated duration in minutes';
COMMENT ON COLUMN tasks.actual_duration IS 'Actual duration in minutes';
COMMENT ON COLUMN tasks.is_deleted IS 'Soft deletion flag';

-- User priorities table - for priority board
CREATE TABLE IF NOT EXISTS user_priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'task', 'booking_link', 'habit', 'smart_meeting'
    priority VARCHAR(50) NOT NULL, -- 'critical', 'high', 'medium', 'low', 'disabled'
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_item UNIQUE (user_id, item_id, item_type)
);

COMMENT ON TABLE user_priorities IS 'Stores user priority settings for various items (tasks, booking links, etc.)';
COMMENT ON COLUMN user_priorities.item_type IS 'Type of item: task, booking_link, habit, smart_meeting';
COMMENT ON COLUMN user_priorities.priority IS 'Priority level: critical, high, medium, low, disabled';
COMMENT ON COLUMN user_priorities.position IS 'Position/order within the same priority column';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks(deleted_at);
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON tasks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_priority ON tasks(user_id, priority);

CREATE INDEX IF NOT EXISTS idx_user_priorities_user_id ON user_priorities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_priorities_priority ON user_priorities(priority);
CREATE INDEX IF NOT EXISTS idx_user_priorities_item_type ON user_priorities(item_type);
CREATE INDEX IF NOT EXISTS idx_user_priorities_user_priority ON user_priorities(user_id, priority);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_update_tasks_updated_at ON tasks;
CREATE TRIGGER trigger_update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_user_priorities_updated_at ON user_priorities;
CREATE TRIGGER trigger_update_user_priorities_updated_at
    BEFORE UPDATE ON user_priorities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
