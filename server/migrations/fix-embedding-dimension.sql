-- ============================================================================
-- Migration: Fix Vector Embedding Dimension Mismatch
-- Description: Change embedding dimension from 1536 to 768 for Google Gemini
-- Date: 2025-12-24
-- ============================================================================

-- IMPORTANT: This migration will:
-- 1. Drop existing HNSW index (will be recreated)
-- 2. Delete all existing embeddings (they are invalid with wrong dimensions)
-- 3. Alter column to use 768 dimensions
-- 4. Recreate the HNSW index

BEGIN;

-- Step 1: Drop the existing HNSW index
DROP INDEX IF EXISTS idx_user_context_summary_embedding;

-- Step 2: Clear all existing embeddings (they have wrong dimensions)
-- Option A: Delete all rows (if you can afford to lose the data)
-- TRUNCATE TABLE user_context_summary;

-- Option B: Set embeddings to NULL (preserve context data)
UPDATE user_context_summary SET embedding = NULL;

-- Step 3: Alter the column to use 768 dimensions
ALTER TABLE user_context_summary 
ALTER COLUMN embedding TYPE vector(768);

-- Step 4: Recreate the HNSW index
CREATE INDEX idx_user_context_summary_embedding 
    ON user_context_summary USING hnsw (embedding vector_cosine_ops);

COMMIT;

-- NOTE: After running this migration, you need to:
-- 1. Re-generate embeddings for existing contexts
-- 2. Verify that new embeddings are being created with 768 dimensions
