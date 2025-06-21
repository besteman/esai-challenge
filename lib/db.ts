import { neon } from "@neondatabase/serverless";

// Database connection utility for NeonDB
export class NeonDBConnection {
  private static instance: NeonDBConnection;
  private connection: ReturnType<typeof neon>;

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
  public getConnection() {
    return this.connection;
  }

  // Execute a query with the correct NeonDB serverless API
  public async query(sql: string, params: any[] = []) {
    try {
      // Always use the .query() method for consistency
      // This handles both parameterized and non-parameterized queries
      const result = await this.connection.query(sql, params);

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Execute multiple queries in sequence
  public async transaction(queries: Array<{ sql: string; params?: any[] }>) {
    try {
      const results = [];

      for (const { sql, params = [] } of queries) {
        const result = await this.query(sql, params);

        results.push(result);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }
}

// Helper function to get database connection
export const getNeonDB = () => {
  return NeonDBConnection.getInstance().getConnection();
};

// Helper function to execute queries
export const executeQuery = async (sql: string, params: any[] = []) => {
  const db = NeonDBConnection.getInstance();

  return await db.query(sql, params);
};

// Helper function to execute transactions
export const executeTransaction = async (
  queries: Array<{ sql: string; params?: any[] }>,
) => {
  const db = NeonDBConnection.getInstance();

  return await db.transaction(queries);
};

// Export the connection instance for direct access if needed
export default NeonDBConnection;
