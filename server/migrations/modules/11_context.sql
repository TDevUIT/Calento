-- ============================================================================
-- MODULE: 11_CONTEXT
-- User Context Summary (Vector Store)
-- ============================================================================

-- User Context Summary table
CREATE TABLE IF NOT EXISTS user_context_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    context JSONB NOT NULL DEFAULT '{}',
    embedding vector(1536), -- Vector embedding for semantic search (OpenAI default)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE user_context_summary IS 'Stores context information for each user with vector embeddings';

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_user_context_summary_user_id ON user_context_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_user_context_summary_created_at ON user_context_summary(created_at DESC);

-- HNSW Index for fast approximate nearest neighbor search
-- Note: 'vector_cosine_ops' is typical for embeddings. 
-- Adjust 'm' and 'ef_construction' if needed for performance tuning.
CREATE INDEX IF NOT EXISTS idx_user_context_summary_embedding 
    ON user_context_summary USING hnsw (embedding vector_cosine_ops);

-- TRIGGERS
DROP TRIGGER IF EXISTS trigger_update_user_context_summary_updated_at ON user_context_summary;
CREATE TRIGGER trigger_update_user_context_summary_updated_at
    BEFORE UPDATE ON user_context_summary
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
