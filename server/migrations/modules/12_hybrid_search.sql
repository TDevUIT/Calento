-- ============================================================================
-- MODULE: 12_HYBRID_SEARCH
-- Hybrid Search Support (tsvector)
-- ============================================================================

-- Add text_search_vector column
ALTER TABLE user_context_summary 
ADD COLUMN IF NOT EXISTS text_search_vector tsvector;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_user_context_summary_text_search 
ON user_context_summary USING GIN(text_search_vector);

-- Function to automatically update tsvector from context
CREATE OR REPLACE FUNCTION user_context_summary_tsvector_trigger() RETURNS trigger AS $$
DECLARE
    text_content TEXT;
BEGIN
    -- Try to extract text content from likely fields
    text_content := NEW.context->>'text' || ' ' || 
                    COALESCE(NEW.context->>'content', '') || ' ' || 
                    COALESCE(NEW.context->>'summary', '') || ' ' || 
                    COALESCE(NEW.context->>'message', '') || ' ' ||
                    COALESCE(NEW.context->>'_text_content', '');
    
    -- If empty, just stringify the whole thing (fallback)
    IF length(trim(text_content)) = 0 THEN
        text_content := NEW.context::text;
    END IF;

    NEW.text_search_vector := to_tsvector('english', text_content);
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Trigger to update tsvector on insert or update
DROP TRIGGER IF EXISTS tsvectorupdate ON user_context_summary;
CREATE TRIGGER tsvectorupdate 
BEFORE INSERT OR UPDATE ON user_context_summary
FOR EACH ROW EXECUTE FUNCTION user_context_summary_tsvector_trigger();
