
export interface DatabaseQueryResult<T = any> {
    rows: T[];
    rowCount: number;
    command: string;
}

export interface DatabaseTransaction {
    query<T = any>(text: string, params?: any[]): Promise<DatabaseQueryResult<T>>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
    poolSize?: number;
    connectionTimeoutMillis?: number;
    idleTimeoutMillis?: number;
}

export interface RepositoryOptions {
    transaction?: DatabaseTransaction;
    skipValidation?: boolean;
    includeDeleted?: boolean;
}


export interface BulkOperationResult {
    success: number;
    failed: number;
    errors: string[];
}
