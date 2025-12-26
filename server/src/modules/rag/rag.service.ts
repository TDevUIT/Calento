import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseService } from "../../database/database.service";
import { VectorService } from "../vector/vector.service";
import { LangChainService } from "../llm/langchain.service";

@Injectable()
export class RagService {
    private readonly logger = new Logger(RagService.name);

    constructor(
        private readonly databaseService: DatabaseService,
        private readonly vectorService: VectorService,
        private readonly configService: ConfigService,
        private readonly langChainService: LangChainService,
    ) { }

    async retrieveConsolidatedContext(userId: string, message: string): Promise<any[]> {
        try {
            this.logger.debug(`Retrieving consolidated context for user ${userId}`);

            const expandedQuery = await this.withTimeout(
                this.expandQuery(message),
                3000,
                message // fallback to original message
            );
            this.logger.debug(`Original query: "${message}" -> Expanded: "${expandedQuery}"`);


            const similarContexts = await this.vectorService.searchHybrid(
                userId,
                expandedQuery,
                10
            );

            this.logger.debug(`Retrieved ${similarContexts.length} candidates for reranking`);

            const rerankedContexts = await this.withTimeout(
                this.rerankContexts(message, similarContexts),
                3000,
                similarContexts // fallback to original contexts
            );

            const topContexts = rerankedContexts.slice(0, 3);

            this.logger.debug(`Reranked to top ${topContexts.length} contexts`);

            return topContexts.map(c => c.context);
        } catch (error) {
            this.logger.error('Failed to retrieve consolidated context', error);
            // Non-blocking error - just return empty context
            return [];
        }
    }

    private async withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
        let timeoutId: NodeJS.Timeout;
        const timeoutPromise = new Promise<T>((resolve) => {
            timeoutId = setTimeout(() => {
                this.logger.warn(`Operation timed out after ${ms}ms, using fallback`);
                resolve(fallback);
            }, ms);
        });

        try {
            const result = await Promise.race([promise, timeoutPromise]);
            clearTimeout(timeoutId!);
            return result;
        } catch (error) {
            clearTimeout(timeoutId!);
            this.logger.error(`Operation failed: ${error.message}, using fallback`);
            return fallback;
        }
    }

    private async expandQuery(originalQuery: string): Promise<string> {
        try {
            const prompt = `You are an expert search query optimizer for a calendar assistant.
            Rewrite the following user query to be more specific and keyword-rich for a vector database search.
            Focus on extracting dates, times, people, and specific actions.
            If the query is relative (e.g. "next week"), try to convert it to general time terms if you don't have the current date, OR just make it semantically richer.
            Output ONLY the rewritten query text. No quotes.

            User Query: "${originalQuery}"`;

            const result = await this.langChainService.chat(prompt);
            return result.text.trim();
        } catch (error) {
            this.logger.warn(`Query expansion failed, using original query. Error: ${error.message}`);
            return originalQuery;
        }
    }

    private async rerankContexts(query: string, contexts: any[]): Promise<any[]> {
        if (contexts.length <= 3) return contexts;

        try {
            const contextList = contexts.map((c, i) => `[${i}] ${JSON.stringify(c.context).substring(0, 300)}...`).join('\n');
            const prompt = `You are a Relevance Reranker.
            Rank the following contexts based on their relevance to the user query: "${query}"
            Contexts:
            ${contextList}

            Return ONLY a JSON array of indices sorted by relevance, e.g. [0, 4, 2]. Select top 3.`;

            const result = await this.langChainService.chat(prompt);
            const indicesStr = result.text.match(/\[.*\]/)?.[0] || '[]';
            const indices: number[] = JSON.parse(indicesStr);

            if (Array.isArray(indices) && indices.length > 0) {
                return indices.map(i => contexts[i]).filter(Boolean);
            }
            return contexts;
        } catch (error) {
            this.logger.warn(`Reranking failed: ${error.message}`);
            return contexts;
        }
    }

    async addUserContext(
        userId: string,
        context: Record<string, any>
    ): Promise<{ id: string }> {
        try {
            this.logger.log(`Adding context for user ${userId}`);

            const result = await this.vectorService.storeContext(userId, context);

            this.logger.log(`Context stored with ID: ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error('Failed to add user context', error);
            throw new Error(`Failed to add context: ${error.message}`);
        }
    }

    async getUserContexts(userId: string, limit: number = 10): Promise<any[]> {
        try {
            return await this.vectorService.getUserContexts(userId, limit);
        } catch (error) {
            this.logger.error('Failed to get user contexts', error);
            throw new Error(`Failed to get contexts: ${error.message}`);
        }
    }

    async deleteUserContext(userId: string, contextId: string): Promise<void> {
        try {
            await this.vectorService.deleteContext(userId, contextId);
        } catch (error) {
            this.logger.error('Failed to delete user context', error);
            throw new Error(`Failed to delete context: ${error.message}`);
        }
    }
}
