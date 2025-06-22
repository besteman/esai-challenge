// Database-specific type definitions

// Neon DB connection type
export interface NeonConnection {
  query: (sql: string, params?: QueryParam[]) => Promise<any[]>;
}

// Query parameter types
export type QueryParam = string | number | boolean | null | undefined;
export type QueryParams = QueryParam[];

// Database query result types
export type DatabaseRow = Record<string, any>;
export type QueryResult<T = DatabaseRow> = T[];

// Transaction query configuration
export interface TransactionQuery {
  sql: string;
  params?: QueryParams;
}

// Database operation result types
export interface DatabaseOperationResult<T = DatabaseRow> {
  data: T[];
  rowCount: number;
}

// Database error types
export interface DatabaseError extends Error {
  message: string;
  code?: string;
  detail?: string;
  hint?: string;
  position?: string;
  internalPosition?: string;
  internalQuery?: string;
  where?: string;
  schema?: string;
  table?: string;
  column?: string;
  dataType?: string;
  constraint?: string;
  file?: string;
  line?: string;
  routine?: string;
}

// Connection configuration types
export interface DatabaseConfig {
  url: string;
  ssl?: boolean;
  timeout?: number;
  maxRetries?: number;
}

// Query execution options
export interface QueryOptions {
  timeout?: number;
  retries?: number;
  logQuery?: boolean;
}

// Transaction execution options
export interface TransactionOptions {
  timeout?: number;
  retries?: number;
  logQueries?: boolean;
  rollbackOnError?: boolean;
}

// Database connection status
export interface ConnectionStatus {
  connected: boolean;
  lastActivity?: Date;
  errorCount: number;
  queryCount: number;
}

// Generic database record type with common fields
export interface BaseRecord {
  id: number;
  created_at: string;
  updated_at?: string;
}

// Type for database migrations
export interface Migration {
  id: string;
  name: string;
  sql: string;
  rollback?: string;
  appliedAt?: Date;
}

// Type guards for database operations
export type DatabaseResult<T = any> = T[] | T | null;

// Utility types for type-safe database operations
export type SelectResult<T> = T[];
export type InsertResult<T> = T;
export type UpdateResult<T> = T;
export type DeleteResult = { affectedRows: number };

// Database operation types
export type DatabaseOperation =
  | "SELECT"
  | "INSERT"
  | "UPDATE"
  | "DELETE"
  | "CREATE"
  | "DROP"
  | "ALTER";

// Query builder types (for future extensibility)
export interface QueryBuilder {
  select(columns?: string[]): QueryBuilder;
  from(table: string): QueryBuilder;
  where(condition: string, value?: QueryParam): QueryBuilder;
  orderBy(column: string, direction?: "ASC" | "DESC"): QueryBuilder;
  limit(count: number): QueryBuilder;
  offset(count: number): QueryBuilder;
  build(): { sql: string; params: QueryParams };
}

// Database schema information types
export interface ColumnInfo {
  columnName: string;
  dataType: string;
  isNullable: boolean;
  defaultValue?: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface TableInfo {
  tableName: string;
  columns: ColumnInfo[];
  indexes: string[];
  constraints: string[];
}

// Database health check types
export interface HealthCheck {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: Date;
  responseTime: number;
  details?: {
    connectionStatus: boolean;
    queryPerformance: number;
    errorRate: number;
  };
}
