import {
  NeonDBConnection,
  getNeonDB,
  executeQuery,
  executeTransaction,
} from "../db";

// Mock the @neondatabase/serverless module
jest.mock("@neondatabase/serverless", () => ({
  neon: jest.fn(),
}));

describe("NeonDBConnection", () => {
  const mockNeon = require("@neondatabase/serverless").neon;
  const mockConnection = {
    query: jest.fn(),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    mockNeon.mockReturnValue(mockConnection);

    // Reset the singleton instance
    (NeonDBConnection as any).instance = undefined;

    // Set up environment variable
    process.env.DATABASE_URL = "postgresql://test:test@localhost/testdb";
  });

  afterEach(() => {
    // Clean up environment
    delete process.env.DATABASE_URL;
  });

  describe("Constructor and Singleton Pattern", () => {
    it("should throw error when DATABASE_URL is not set", () => {
      delete process.env.DATABASE_URL;

      expect(() => {
        NeonDBConnection.getInstance();
      }).toThrow("DATABASE_URL environment variable is not set");
    });

    it("should create connection with DATABASE_URL", () => {
      const instance = NeonDBConnection.getInstance();

      expect(mockNeon).toHaveBeenCalledWith(
        "postgresql://test:test@localhost/testdb",
      );
      expect(instance).toBeInstanceOf(NeonDBConnection);
    });

    it("should return same instance on multiple calls (singleton)", () => {
      const instance1 = NeonDBConnection.getInstance();
      const instance2 = NeonDBConnection.getInstance();

      expect(instance1).toBe(instance2);
      expect(mockNeon).toHaveBeenCalledTimes(1);
    });

    it("should initialize connection only once", () => {
      NeonDBConnection.getInstance();
      NeonDBConnection.getInstance();
      NeonDBConnection.getInstance();

      expect(mockNeon).toHaveBeenCalledTimes(1);
    });
  });

  describe("getConnection", () => {
    it("should return the neon connection instance", () => {
      const instance = NeonDBConnection.getInstance();
      const connection = instance.getConnection();

      expect(connection).toBe(mockConnection);
    });

    it("should return same connection on multiple calls", () => {
      const instance = NeonDBConnection.getInstance();
      const connection1 = instance.getConnection();
      const connection2 = instance.getConnection();

      expect(connection1).toBe(connection2);
      expect(connection1).toBe(mockConnection);
    });
  });

  describe("query method", () => {
    let instance: NeonDBConnection;

    beforeEach(() => {
      instance = NeonDBConnection.getInstance();
    });

    it("should execute query without parameters", async () => {
      const mockResult = [{ id: 1, name: "test" }];

      mockConnection.query.mockResolvedValue(mockResult);

      const result = await instance.query("SELECT * FROM users");

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM users",
        [],
      );
      expect(result).toEqual(mockResult);
    });

    it("should execute query with parameters", async () => {
      const mockResult = [{ id: 1, name: "John" }];

      mockConnection.query.mockResolvedValue(mockResult);

      const result = await instance.query("SELECT * FROM users WHERE id = $1", [
        1,
      ]);

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = $1",
        [1],
      );
      expect(result).toEqual(mockResult);
    });

    it("should execute query with multiple parameters", async () => {
      const mockResult = [{ id: 1, name: "John", age: 25 }];

      mockConnection.query.mockResolvedValue(mockResult);

      const result = await instance.query(
        "SELECT * FROM users WHERE name = $1 AND age = $2",
        ["John", 25],
      );

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE name = $1 AND age = $2",
        ["John", 25],
      );
      expect(result).toEqual(mockResult);
    });

    it("should handle empty result sets", async () => {
      const mockResult: any[] = [];

      mockConnection.query.mockResolvedValue(mockResult);

      const result = await instance.query("SELECT * FROM users WHERE id = $1", [
        999,
      ]);

      expect(result).toEqual([]);
    });

    it("should throw error when query fails", async () => {
      const errorMessage = "Database connection failed";

      mockConnection.query.mockRejectedValue(new Error(errorMessage));

      await expect(instance.query("SELECT * FROM users")).rejects.toThrow(
        errorMessage,
      );
    });

    it("should throw error when query has syntax error", async () => {
      const syntaxError = new Error('syntax error at or near "SELEC"');

      mockConnection.query.mockRejectedValue(syntaxError);

      await expect(instance.query("SELEC * FROM users")).rejects.toThrow(
        'syntax error at or near "SELEC"',
      );
    });

    it("should handle null and undefined parameters", async () => {
      const mockResult = [{ id: 1, name: null }];

      mockConnection.query.mockResolvedValue(mockResult);

      const result = await instance.query(
        "INSERT INTO users (name) VALUES ($1)",
        [null],
      );

      expect(mockConnection.query).toHaveBeenCalledWith(
        "INSERT INTO users (name) VALUES ($1)",
        [null],
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe("transaction method", () => {
    let instance: NeonDBConnection;

    beforeEach(() => {
      instance = NeonDBConnection.getInstance();
    });

    it("should execute single query in transaction", async () => {
      const mockResult = [{ id: 1 }];

      mockConnection.query.mockResolvedValue(mockResult);

      const queries = [
        { sql: "INSERT INTO users (name) VALUES ($1)", params: ["John"] },
      ];

      const results = await instance.transaction(queries);

      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(
        "INSERT INTO users (name) VALUES ($1)",
        ["John"],
      );
      expect(results).toEqual([mockResult]);
    });

    it("should execute multiple queries in sequence", async () => {
      const mockResults = [[{ id: 1 }], [{ id: 2 }], [{ count: 2 }]];

      mockConnection.query
        .mockResolvedValueOnce(mockResults[0])
        .mockResolvedValueOnce(mockResults[1])
        .mockResolvedValueOnce(mockResults[2]);

      const queries = [
        { sql: "INSERT INTO users (name) VALUES ($1)", params: ["John"] },
        { sql: "INSERT INTO users (name) VALUES ($1)", params: ["Jane"] },
        { sql: "SELECT COUNT(*) as count FROM users" },
      ];

      const results = await instance.transaction(queries);

      expect(mockConnection.query).toHaveBeenCalledTimes(3);
      expect(results).toEqual(mockResults);
    });

    it("should execute queries without parameters", async () => {
      const mockResult = [{ count: 5 }];

      mockConnection.query.mockResolvedValue(mockResult);

      const queries = [{ sql: "SELECT COUNT(*) as count FROM users" }];

      const results = await instance.transaction(queries);

      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT COUNT(*) as count FROM users",
        [],
      );
      expect(results).toEqual([mockResult]);
    });

    it("should handle mixed queries with and without parameters", async () => {
      const mockResults = [[{ id: 1 }], [{ count: 1 }]];

      mockConnection.query
        .mockResolvedValueOnce(mockResults[0])
        .mockResolvedValueOnce(mockResults[1]);

      const queries = [
        { sql: "INSERT INTO users (name) VALUES ($1)", params: ["John"] },
        { sql: "SELECT COUNT(*) as count FROM users" },
      ];

      const results = await instance.transaction(queries);

      expect(mockConnection.query).toHaveBeenNthCalledWith(
        1,
        "INSERT INTO users (name) VALUES ($1)",
        ["John"],
      );
      expect(mockConnection.query).toHaveBeenNthCalledWith(
        2,
        "SELECT COUNT(*) as count FROM users",
        [],
      );
      expect(results).toEqual(mockResults);
    });

    it("should throw error if any query in transaction fails", async () => {
      mockConnection.query
        .mockResolvedValueOnce([{ id: 1 }])
        .mockRejectedValueOnce(new Error("Constraint violation"));

      const queries = [
        { sql: "INSERT INTO users (name) VALUES ($1)", params: ["John"] },
        { sql: "INSERT INTO users (name) VALUES ($1)", params: ["John"] }, // Duplicate
      ];

      await expect(instance.transaction(queries)).rejects.toThrow(
        "Constraint violation",
      );

      expect(mockConnection.query).toHaveBeenCalledTimes(2);
    });

    it("should handle empty transaction array", async () => {
      const results = await instance.transaction([]);

      expect(mockConnection.query).not.toHaveBeenCalled();
      expect(results).toEqual([]);
    });
  });

  describe("Helper Functions", () => {
    beforeEach(() => {
      // Ensure clean state for helper function tests
      (NeonDBConnection as any).instance = undefined;
    });

    describe("getNeonDB", () => {
      it("should return connection from singleton instance", () => {
        const connection = getNeonDB();

        expect(connection).toBe(mockConnection);
        expect(mockNeon).toHaveBeenCalledWith(
          "postgresql://test:test@localhost/testdb",
        );
      });

      it("should return same connection on multiple calls", () => {
        const connection1 = getNeonDB();
        const connection2 = getNeonDB();

        expect(connection1).toBe(connection2);
        expect(mockNeon).toHaveBeenCalledTimes(1);
      });
    });

    describe("executeQuery", () => {
      it("should execute query without parameters", async () => {
        const mockResult = [{ id: 1, name: "test" }];

        mockConnection.query.mockResolvedValue(mockResult);

        const result = await executeQuery("SELECT * FROM users");

        expect(mockConnection.query).toHaveBeenCalledWith(
          "SELECT * FROM users",
          [],
        );
        expect(result).toEqual(mockResult);
      });

      it("should execute query with parameters", async () => {
        const mockResult = [{ id: 1, name: "John" }];

        mockConnection.query.mockResolvedValue(mockResult);

        const result = await executeQuery("SELECT * FROM users WHERE id = $1", [
          1,
        ]);

        expect(mockConnection.query).toHaveBeenCalledWith(
          "SELECT * FROM users WHERE id = $1",
          [1],
        );
        expect(result).toEqual(mockResult);
      });

      it("should handle query errors", async () => {
        mockConnection.query.mockRejectedValue(new Error("Connection timeout"));

        await expect(executeQuery("SELECT * FROM users")).rejects.toThrow(
          "Connection timeout",
        );
      });
    });

    describe("executeTransaction", () => {
      it("should execute transaction with multiple queries", async () => {
        const mockResults = [[{ id: 1 }], [{ id: 2 }]];

        mockConnection.query
          .mockResolvedValueOnce(mockResults[0])
          .mockResolvedValueOnce(mockResults[1]);

        const queries = [
          { sql: "INSERT INTO users (name) VALUES ($1)", params: ["John"] },
          { sql: "INSERT INTO users (name) VALUES ($1)", params: ["Jane"] },
        ];

        const results = await executeTransaction(queries);

        expect(results).toEqual(mockResults);
        expect(mockConnection.query).toHaveBeenCalledTimes(2);
      });

      it("should handle transaction errors", async () => {
        mockConnection.query.mockRejectedValue(new Error("Transaction failed"));

        const queries = [
          { sql: "INSERT INTO users (name) VALUES ($1)", params: ["John"] },
        ];

        await expect(executeTransaction(queries)).rejects.toThrow(
          "Transaction failed",
        );
      });
    });
  });

  describe("Error Handling and Edge Cases", () => {
    let instance: NeonDBConnection;

    beforeEach(() => {
      instance = NeonDBConnection.getInstance();
    });

    it("should handle network timeout errors", async () => {
      const timeoutError = new Error("Network timeout");

      timeoutError.name = "TimeoutError";
      mockConnection.query.mockRejectedValue(timeoutError);

      await expect(instance.query("SELECT * FROM users")).rejects.toThrow(
        "Network timeout",
      );
    });

    it("should handle connection pool exhaustion", async () => {
      const poolError = new Error("Connection pool exhausted");

      mockConnection.query.mockRejectedValue(poolError);

      await expect(instance.query("SELECT * FROM users")).rejects.toThrow(
        "Connection pool exhausted",
      );
    });

    it("should handle very long query strings", async () => {
      const longQuery =
        "SELECT * FROM users WHERE " +
        "condition OR ".repeat(1000) +
        "final_condition";
      const mockResult: any[] = [];

      mockConnection.query.mockResolvedValue(mockResult);

      const result = await instance.query(longQuery);

      expect(mockConnection.query).toHaveBeenCalledWith(longQuery, []);
      expect(result).toEqual(mockResult);
    });

    it("should handle large parameter arrays", async () => {
      const largeParams = Array.from({ length: 100 }, (_, i) => i);
      const mockResult = [{ count: 100 }];

      mockConnection.query.mockResolvedValue(mockResult);

      const result = await instance.query(
        "SELECT COUNT(*) FROM test WHERE id IN (" +
          largeParams.map((_, i) => `$${i + 1}`).join(",") +
          ")",
        largeParams,
      );

      expect(result).toEqual(mockResult);
    });

    it("should handle special characters in query parameters", async () => {
      const specialChars = ["'", '"', ";", "--", "/*", "*/", "\n", "\t"];
      const mockResult = [{ id: 1 }];

      mockConnection.query.mockResolvedValue(mockResult);

      for (const char of specialChars) {
        const result = await instance.query(
          "INSERT INTO test (value) VALUES ($1)",
          [char],
        );

        expect(result).toEqual(mockResult);
      }
    });
  });

  describe("Performance and Memory", () => {
    it("should reuse connection instance for performance", () => {
      const instance1 = NeonDBConnection.getInstance();
      const instance2 = NeonDBConnection.getInstance();
      const connection1 = instance1.getConnection();
      const connection2 = instance2.getConnection();

      expect(instance1).toBe(instance2);
      expect(connection1).toBe(connection2);
      expect(mockNeon).toHaveBeenCalledTimes(1);
    });

    it("should handle concurrent query execution", async () => {
      const instance = NeonDBConnection.getInstance();

      mockConnection.query
        .mockResolvedValueOnce([{ id: 1 }])
        .mockResolvedValueOnce([{ id: 2 }])
        .mockResolvedValueOnce([{ id: 3 }]);

      const promises = [
        instance.query("SELECT * FROM users WHERE id = $1", [1]),
        instance.query("SELECT * FROM users WHERE id = $1", [2]),
        instance.query("SELECT * FROM users WHERE id = $1", [3]),
      ];

      const results = await Promise.all(promises);

      expect(results).toEqual([[{ id: 1 }], [{ id: 2 }], [{ id: 3 }]]);
      expect(mockConnection.query).toHaveBeenCalledTimes(3);
    });
  });
});
