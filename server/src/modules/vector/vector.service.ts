import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { DatabaseService } from "../../database/database.service";

import { StoreContextDto } from './dto/store-context.dto';
import { VectorSearchResult } from './interfaces/vector-search-result.interface';

@Injectable()
export class VectorService {
    private readonly logger = new Logger(VectorService.name);
    private embeddingModel: GoogleGenerativeAIEmbeddings;

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly configService: ConfigService,
    ) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        this.embeddingModel = new GoogleGenerativeAIEmbeddings({
            apiKey,
            modelName: "text-embedding-004",
        });
    }

    /**
     * Generate embedding for a given text
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            this.logger.log(`Generating embedding for text (${text.length} chars)`);
            const embedding = await this.embeddingModel.embedQuery(text);
            return embedding;
        } catch (error) {
            this.logger.error('Failed to generate embedding', error);
            throw new Error(`Embedding generation failed: ${error.message}`);
        }
    }

    /**
     * Store user context with embedding
     */
    async storeContext(
        userId: string,
        context: Record<string, any>,
        embedding?: number[],
        textToEmbed?: string
    ): Promise<{ id: string }> {
        try {

            // Generate embedding if not provided
            const contextText = textToEmbed || this.formatContextToText(context);
            const finalEmbedding = embedding || await this.generateEmbedding(contextText);

            // Enhance context with the text representation if not present
            // This ensures LangChainService can display readable text instead of JSON
            const contextToStore = {
                ...context,
                _text_content: context._text_content || contextText
            };

            const query = `
                INSERT INTO user_context_summary (user_id, context, embedding)
                VALUES ($1, $2, $3)
                RETURNING id
            `;

            const result = await this.databaseService.query(query, [
                userId,
                JSON.stringify(contextToStore),
                JSON.stringify(finalEmbedding),
            ]);

            this.logger.log(`Stored context for user ${userId}`);
            return { id: result.rows[0].id };
        } catch (error) {
            this.logger.error('Failed to store context', error);
            throw new Error(`Context storage failed: ${error.message}`);
        }
    }

    /**
     * Delete context by metadata key-value pair
     */
    async deleteContextByMetadata(userId: string, key: string, value: any): Promise<void> {
        try {
            // Assuming context is stored as JSONB
            const query = `
                DELETE FROM user_context_summary
                WHERE user_id = $1 AND context->>$2 = $3
            `;

            await this.databaseService.query(query, [
                userId,
                key,
                String(value) // Ensure value is string for JSON->> operator
            ]);

            this.logger.log(`Deleted context via metadata ${key}=${value} for user ${userId}`);
        } catch (error) {
            this.logger.error('Failed to delete context by metadata', error);
            throw new Error(`Context deletion failed: ${error.message}`);
        }
    }

    /**
     * Search for similar contexts using vector similarity
     */
    async searchSimilar(
        userId: string,
        queryText: string,
        limit: number = 5
    ): Promise<VectorSearchResult[]> {
        try {
            // Generate embedding for query
            const queryEmbedding = await this.generateEmbedding(queryText);

            // Perform vector similarity search using cosine distance
            const query = `
                SELECT 
                    id,
                    context,
                    1 - (embedding <=> $1::vector) as similarity
                FROM user_context_summary
                WHERE user_id = $2
                ORDER BY embedding <=> $1::vector
                LIMIT $3
            `;

            const result = await this.databaseService.query(query, [
                JSON.stringify(queryEmbedding),
                userId,
                limit,
            ]);

            this.logger.log(`Found ${result.rows.length} similar contexts for user ${userId}`);

            return result.rows.map(row => ({
                id: row.id,
                context: row.context,
                similarity: parseFloat(row.similarity),
            }));
        } catch (error) {
            this.logger.error('Failed to search similar contexts', error);
            throw new Error(`Similarity search failed: ${error.message}`);
        }
    }

    /**
     * Hybrid Search (Vector + Full Text)
     */
    async searchHybrid(
        userId: string,
        queryText: string,
        limit: number = 5
    ): Promise<VectorSearchResult[]> {
        try {
            const queryEmbedding = await this.generateEmbedding(queryText);

            // Combine Vector Search and Full-Text Search
            const query = `
                WITH vector_results AS (
                    SELECT id, 1 - (embedding <=> $1::vector) as vector_score
                    FROM user_context_summary
                    WHERE user_id = $2
                    ORDER BY embedding <=> $1::vector
                    LIMIT 20
                ),
                text_results AS (
                    SELECT id, ts_rank(text_search_vector, websearch_to_tsquery('english', $3)) as text_score
                    FROM user_context_summary
                    WHERE user_id = $2 AND text_search_vector @@ websearch_to_tsquery('english', $3)
                    ORDER BY text_score DESC
                    LIMIT 20
                )
                SELECT 
                    COALESCE(v.id, t.id) as id,
                    ucs.context,
                    COALESCE(v.vector_score, 0) as vector_score,
                    COALESCE(t.text_score, 0) as text_score,
                    (COALESCE(v.vector_score, 0) * 0.7 + COALESCE(t.text_score, 0) * 0.3) as combined_score
                FROM vector_results v
                FULL OUTER JOIN text_results t ON v.id = t.id
                JOIN user_context_summary ucs ON ucs.id = COALESCE(v.id, t.id)
                ORDER BY combined_score DESC
                LIMIT $4
            `;

            const result = await this.databaseService.query(query, [
                JSON.stringify(queryEmbedding),
                userId,
                queryText,
                limit,
            ]);

            this.logger.log(`Hybrid search found ${result.rows.length} contexts`);

            return result.rows.map(row => ({
                id: row.id,
                context: row.context,
                similarity: parseFloat(row.combined_score), // Use combined score as similarity
            }));
        } catch (error) {
            this.logger.error('Hybrid search failed (falling back to vector)', error);
            // Fallback to normal vector search if table column missing or other error
            return this.searchSimilar(userId, queryText, limit);
        }
    }

    /**
     * Get all contexts for a user
     */
    async getUserContexts(userId: string, limit: number = 10): Promise<any[]> {
        try {
            const query = `
                SELECT id, context, created_at, updated_at
                FROM user_context_summary
                WHERE user_id = $1
                ORDER BY created_at DESC
                LIMIT $2
            `;

            const result = await this.databaseService.query(query, [userId, limit]);
            return result.rows;
        } catch (error) {
            this.logger.error('Failed to get user contexts', error);
            throw new Error(`Failed to get contexts: ${error.message}`);
        }
    }

    /**
     * Delete a context
     */
    async deleteContext(userId: string, contextId: string): Promise<void> {
        try {
            const query = `
                DELETE FROM user_context_summary
                WHERE id = $1 AND user_id = $2
            `;

            await this.databaseService.query(query, [contextId, userId]);
            this.logger.log(`Deleted context ${contextId} for user ${userId}`);
        } catch (error) {
            this.logger.error('Failed to delete context', error);
            throw new Error(`Context deletion failed: ${error.message}`);
        }
    }

    /**
     * Convert context object to a more natural language string
     */
    private formatContextToText(context: Record<string, any>): string {
        // If context has a specific 'text' or 'content' field, use it
        if (typeof context.text === 'string') return context.text;
        if (typeof context.content === 'string') return context.content;
        if (typeof context.summary === 'string') return context.summary;
        if (typeof context.message === 'string') return context.message;

        // Otherwise, json stringify but maybe aim for cleaner format in future
        return JSON.stringify(context);
    }
}