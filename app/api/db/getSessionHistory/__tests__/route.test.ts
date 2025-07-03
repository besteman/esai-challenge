import { NextRequest, NextResponse } from "next/server";

// Mock the database utility
jest.mock("@/lib/db", () => ({
  executeQuery: jest.fn(),
}));

// Mock Next.js server APIs
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn(),
  },
}));

// Import the mocked functions
import { executeQuery } from "@/lib/db";

import { GET } from "../route";

const mockExecuteQuery = executeQuery as jest.MockedFunction<
  typeof executeQuery
>;
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

// Mock console.error to test error logging
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("/api/db/getSessionHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();

    // Reset NextResponse.json mock
    mockNextResponse.json = jest.fn((data, init) => {
      return {
        status: init?.status || 200,
        json: async () => data,
      } as any;
    });
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("GET", () => {
    it("should fetch session history successfully", async () => {
      const mockData = [
        {
          output_group: "group-1",
          table_name: "school_match",
          display_name: "School Match Maker",
          display_title: "Stanford University",
          display_description: "Great for computer science",
          created_at: "2024-01-03T00:00:00Z",
        },
        {
          output_group: "group-2",
          table_name: "major_mentor",
          display_name: "Major Mentor",
          display_title: "Computer Science",
          display_description: "Tech-focused major",
          created_at: "2024-01-02T00:00:00Z",
        },
        {
          output_group: "group-3",
          table_name: "story_strategist",
          display_name: "Story Strategist",
          display_title: "Leadership Story",
          display_description: "Story about overcoming challenges",
          created_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSessionHistory?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT DISTINCT"),
        ["test-user-id"],
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
        count: 3,
        message: "Session history fetched successfully",
      });
    });

    it("should return empty array when no session history found", async () => {
      const mockData: any[] = [];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSessionHistory?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        count: 0,
        message: "Session history fetched successfully",
      });
    });

    it("should handle non-array database results", async () => {
      // Database might return a single object instead of array in some cases
      mockExecuteQuery.mockResolvedValue(null as any);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSessionHistory?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        count: 0,
        message: "Session history fetched successfully",
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");

      mockExecuteQuery.mockRejectedValue(dbError);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSessionHistory?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching session history:",
        dbError,
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Failed to fetch session history",
          details: "Database connection failed",
        },
        { status: 500 },
      );
    });

    it("should handle non-Error exceptions", async () => {
      const errorMessage = "Unexpected error";

      mockExecuteQuery.mockRejectedValue(errorMessage);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSessionHistory?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching session history:",
        errorMessage,
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Failed to fetch session history",
          details: "Unknown error",
        },
        { status: 500 },
      );
    });

    it("should verify the complex UNION query structure", async () => {
      const mockData = [
        {
          output_group: "group-1",
          table_name: "school_match",
          display_name: "School Match Maker",
          display_title: "Harvard University",
          display_description: "Prestigious institution",
          created_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSessionHistory?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      // Verify the query contains all expected table unions
      const queryCall = mockExecuteQuery.mock.calls[0][0];

      expect(queryCall).toContain("school_match_maker");
      expect(queryCall).toContain("major_mentor");
      expect(queryCall).toContain("story_strategist");
      expect(queryCall).toContain("UNION ALL");
      expect(queryCall).toContain("WHERE output_group IS NOT NULL");
      expect(queryCall).toContain("GROUP BY output_group");
      expect(queryCall).toContain("ORDER BY created_at DESC");
    });

    it("should return 400 error when userId is not provided", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getSessionHistory",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).not.toHaveBeenCalled();
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: "userId parameter is required", success: false, details: "" },
        { status: 400 },
      );
    });
  });
});
