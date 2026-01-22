export const RAG_CONFIG = {
    temporal: {
        enabled: true,
        halfLifeDays: 30, // Context loses half relevance after 30 days
        weight: 0.3, // Temporal score contributes 30% to final score
        baseWeight: 0.7, // Original similarity contributes 70%
    },
    search: {
        defaultLimit: 5,
        maxLimit: 20,
        rerankEnabled: true,
    },
};

export interface TemporalConfig {
    enabled: boolean;
    halfLifeDays: number;
    weight: number;
    baseWeight: number;
}

export interface SearchConfig {
    defaultLimit: number;
    maxLimit: number;
    rerankEnabled: boolean;
}

export interface RagConfig {
    temporal: TemporalConfig;
    search: SearchConfig;
}
