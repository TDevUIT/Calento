import { AIMessage } from '../interfaces/ai.interface';

export class ConversationContextManager {
    private static recentEntities = new Map<string, any>();

    static enrichQuery(query: string, history: AIMessage[]): string {
        // Resolve Vietnamese pronouns
        const pronouns = ['nó', 'đó', 'họ', 'anh ấy', 'cô ấy', 'cuộc họp đó', 'sự kiện đó'];
        let enrichedQuery = query;

        for (const pronoun of pronouns) {
            const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
            if (regex.test(query)) {
                const entity = this.getLastMentionedEntity(history);
                if (entity) {
                    enrichedQuery = enrichedQuery.replace(
                        regex,
                        entity.title || entity.name || pronoun
                    );
                }
            }
        }

        return enrichedQuery;
    }

    private static getLastMentionedEntity(history: AIMessage[]): any {
        // Look for the last mentioned event/task/meeting in recent messages
        for (let i = history.length - 1; i >= 0; i--) {
            const msg = history[i];

            // Check assistant messages for created/mentioned entities
            if (msg.role === 'assistant' && msg.content) {
                // Look for event mentions
                const eventMatch = msg.content.match(/sự kiện\s+"([^"]+)"/);
                if (eventMatch) {
                    return { type: 'event', title: eventMatch[1] };
                }

                // Look for meeting mentions
                const meetingMatch = msg.content.match(/cuộc họp\s+"([^"]+)"/);
                if (meetingMatch) {
                    return { type: 'meeting', title: meetingMatch[1] };
                }

                // Look for task mentions
                const taskMatch = msg.content.match(/nhiệm vụ\s+"([^"]+)"/);
                if (taskMatch) {
                    return { type: 'task', title: taskMatch[1] };
                }

                // Look for generic creation confirmations
                const createdMatch = msg.content.match(/đã tạo.*?"([^"]+)"/);
                if (createdMatch) {
                    return { type: 'entity', title: createdMatch[1] };
                }
            }

            // Check function responses for created entities
            if (msg.role === 'function' && msg.function_response) {
                const response = msg.function_response;
                if (response.title) {
                    return { type: 'entity', title: response.title, data: response };
                }
            }
        }

        return null;
    }

    static trackEntity(type: string, title: string, data?: any): void {
        this.recentEntities.set(`${type}:${title}`, {
            type,
            title,
            data,
            timestamp: new Date(),
        });
    }

    static getEntity(type: string, title: string): any {
        return this.recentEntities.get(`${type}:${title}`);
    }

    static clearOldEntities(maxAge: number = 3600000): void {
        // Clear entities older than maxAge (default 1 hour)
        const now = new Date();
        for (const [key, entity] of this.recentEntities.entries()) {
            if (now.getTime() - entity.timestamp.getTime() > maxAge) {
                this.recentEntities.delete(key);
            }
        }
    }
}
