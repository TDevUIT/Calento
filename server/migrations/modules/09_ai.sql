-- ============================================================================
-- MODULE: 09_AI
-- AI Conversations and Actions
-- ============================================================================

-- AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    messages JSONB NOT NULL DEFAULT '[]',
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE ai_conversations IS 'Stores AI conversation history for each user';
COMMENT ON COLUMN ai_conversations.messages IS 'Array of conversation messages in chronological order';
COMMENT ON COLUMN ai_conversations.context IS 'Additional context like timezone, preferences, etc.';

-- AI actions table
CREATE TABLE IF NOT EXISTS ai_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    result JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE ai_actions IS 'Tracks AI function calls and their execution results';
COMMENT ON COLUMN ai_actions.status IS 'Status: pending, completed, or failed';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_actions_conversation_id ON ai_actions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_status ON ai_actions(status);
CREATE INDEX IF NOT EXISTS idx_ai_actions_created_at ON ai_actions(created_at DESC);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_ai_conversations_updated_at ON ai_conversations;
CREATE TRIGGER trigger_ai_conversations_updated_at
    BEFORE UPDATE ON ai_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_ai_actions_updated_at ON ai_actions;
CREATE TRIGGER trigger_ai_actions_updated_at
    BEFORE UPDATE ON ai_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
