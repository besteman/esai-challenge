import type {
  NeonConnection,
  QueryParams,
  QueryResult,
  TransactionQuery,
  DatabaseError,
  DatabaseRow,
} from "@/types/database";

import { neon } from "@neondatabase/serverless";

// Database connection utility for NeonDB
export class NeonDBConnection {
  private static instance: NeonDBConnection;
  private connection: NeonConnection;

  private constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    this.connection = neon(process.env.DATABASE_URL);
  }

  // Singleton pattern to ensure only one connection instance
  public static getInstance(): NeonDBConnection {
    if (!NeonDBConnection.instance) {
      NeonDBConnection.instance = new NeonDBConnection();
    }

    return NeonDBConnection.instance;
  }

  // Get the database connection
  public getConnection(): NeonConnection {
    return this.connection;
  }

  // Execute a query with the correct NeonDB serverless API
  public async query<T extends DatabaseRow = DatabaseRow>(
    sql: string,
    params: QueryParams = [],
  ): Promise<QueryResult<T>> {
    try {
      // Always use the .query() method for consistency
      // This handles both parameterized and non-parameterized queries
      const result = await this.connection.query(sql, params);

      return result as QueryResult<T>;
    } catch (error) {
      throw error as DatabaseError;
    }
  }

  // Execute multiple queries in sequence
  public async transaction<T extends DatabaseRow = DatabaseRow>(
    queries: TransactionQuery[],
  ): Promise<QueryResult<T>[]> {
    try {
      const results: QueryResult<T>[] = [];

      for (const { sql, params = [] } of queries) {
        const result = await this.query<T>(sql, params);

        results.push(result);
      }

      return results;
    } catch (error) {
      throw error as DatabaseError;
    }
  }
}

// Helper function to get database connection
export const getNeonDB = (): NeonConnection => {
  return NeonDBConnection.getInstance().getConnection();
};

// Helper function to execute queries
export const executeQuery = async <T extends DatabaseRow = DatabaseRow>(
  sql: string,
  params: QueryParams = [],
): Promise<QueryResult<T>> => {
  const db = NeonDBConnection.getInstance();

  return await db.query<T>(sql, params);
};

// Helper function to execute transactions
export const executeTransaction = async <T extends DatabaseRow = DatabaseRow>(
  queries: TransactionQuery[],
): Promise<QueryResult<T>[]> => {
  const db = NeonDBConnection.getInstance();

  return await db.transaction<T>(queries);
};

// Export the connection instance for direct access if needed
export default NeonDBConnection;
