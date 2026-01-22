export interface VectorSearchResult {
  id: string;
  context: any;
  similarity: number;
  temporal_score?: number;
  created_at?: Date;
}
