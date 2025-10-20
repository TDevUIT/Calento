export interface DatabaseStats {
  database_name: string;
  size: string;
  connections: string;
}

export interface MemoryStats {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers?: number;
}

export interface DatabaseHealth {
  connected: boolean;
  stats: DatabaseStats;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  database: DatabaseHealth;
  memory: MemoryStats;
  version: string;
}

export interface HealthOkResponse {
  status: string;
  message: string;
}
