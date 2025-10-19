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
    estimated_duration INTEGER,
    actual_duration INTEGER,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_tasks_updated_at();

COMMENT ON TABLE tasks IS 'User tasks and to-do items';
COMMENT ON COLUMN tasks.id IS 'Task unique identifier';
COMMENT ON COLUMN tasks.user_id IS 'Owner user ID';
COMMENT ON COLUMN tasks.title IS 'Task title';
COMMENT ON COLUMN tasks.description IS 'Task description';
COMMENT ON COLUMN tasks.status IS 'Task status: todo, in_progress, completed, cancelled';
COMMENT ON COLUMN tasks.priority IS 'Task priority: low, medium, high, critical';
COMMENT ON COLUMN tasks.due_date IS 'Task due date';
COMMENT ON COLUMN tasks.completed_at IS 'Task completion timestamp';
COMMENT ON COLUMN tasks.tags IS 'Task tags for categorization';
COMMENT ON COLUMN tasks.project_id IS 'Associated project ID';
COMMENT ON COLUMN tasks.parent_task_id IS 'Parent task ID for subtasks';
COMMENT ON COLUMN tasks.is_recurring IS 'Whether task is recurring';
COMMENT ON COLUMN tasks.recurrence_rule IS 'Recurrence rule in RRULE format';
COMMENT ON COLUMN tasks.estimated_duration IS 'Estimated duration in minutes';
COMMENT ON COLUMN tasks.actual_duration IS 'Actual duration in minutes';
COMMENT ON COLUMN tasks.is_deleted IS 'Soft deletion flag';
COMMENT ON COLUMN tasks.deleted_at IS 'Soft deletion timestamp';
COMMENT ON COLUMN tasks.created_at IS 'Task creation timestamp';
COMMENT ON COLUMN tasks.updated_at IS 'Task last update timestamp';
