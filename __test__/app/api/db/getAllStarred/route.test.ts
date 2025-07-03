import { NextRequest } from "next/server";

import { GET } from "@/app/api/db/getAllStarred/route";

// Mock the database utility
jest.mock("@/lib/db", () => ({
  executeQuery: jest.fn(),
}));

// Mock Next.js server components
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
    })),
  },
}));

describe("/api/db/getAllStarred", () => {
  const mockExecuteQuery = require("@/lib/db").executeQuery;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSchoolMatches = [
    {
      type: "school_match",
      id: 1,
      title: "Stanford University",
      description: "Top-tier computer science program",
      why_recommendation: "Perfect fit for your goals",
      created_at: "2025-06-21T12:00:00Z",
    },
    {
      type: "school_match",
      id: 2,
      title: "MIT",
      description: "Leading technology institute",
      why_recommendation: "Excellence in engineering",
      created_at: "2025-06-21T11:00:00Z",
    },
  ];

  const mockMajorMentors = [
    {
      type: "major_mentor",
      id: 1,
      title: "Computer Science",
      description: "Study of computational systems",
      why_recommendation: "Matches your interests",
      created_at: "2025-06-21T10:00:00Z",
    },
  ];

  const mockStoryStrategists = [
    {
      type: "story_strategist",
      id: 1,
      title: "Overcoming Challenges",
      description: "Personal growth through adversity",
      why_recommendation: "",
      created_at: "2025-06-21T09:00:00Z",
    },
  ];

  describe("GET", () => {
    it("should fetch all starred items successfully", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce(mockSchoolMatches)
        .mockResolvedValueOnce(mockMajorMentors)
        .mockResolvedValueOnce(mockStoryStrategists);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      // Verify all three queries are executed
      expect(mockExecuteQuery).toHaveBeenCalledTimes(3);

      // Verify school match query
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("FROM school_match_maker"),
        ["test-user-123"],
      );

      // Verify major mentor query
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("FROM major_mentor"),
        ["test-user-123"],
      );

      // Verify story strategist query
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("FROM story_strategist"),
        ["test-user-123"],
      );

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: [
          ...mockSchoolMatches,
          ...mockMajorMentors,
          ...mockStoryStrategists,
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
        count: 4,
        breakdown: {
          school_matches: 2,
          major_mentors: 1,
          story_strategists: 1,
        },
        message: "All starred recommendations fetched successfully",
      });
    });

    it("should handle empty results from all sources", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: [],
        count: 0,
        breakdown: {
          school_matches: 0,
          major_mentors: 0,
          story_strategists: 0,
        },
        message: "All starred recommendations fetched successfully",
      });
    });

    it("should handle null results from database", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: [],
        count: 0,
        breakdown: {
          school_matches: 0,
          major_mentors: 0,
          story_strategists: 0,
        },
        message: "All starred recommendations fetched successfully",
      });
    });

    it("should sort results by created_at in descending order", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      const oldestItem = {
        type: "major_mentor",
        id: 1,
        title: "Oldest",
        description: "Oldest item",
        why_recommendation: "",
        created_at: "2025-06-21T08:00:00Z",
      };

      const newestItem = {
        type: "school_match",
        id: 1,
        title: "Newest",
        description: "Newest item",
        why_recommendation: "",
        created_at: "2025-06-21T15:00:00Z",
      };

      const middleItem = {
        type: "story_strategist",
        id: 1,
        title: "Middle",
        description: "Middle item",
        why_recommendation: "",
        created_at: "2025-06-21T12:00:00Z",
      };

      mockExecuteQuery
        .mockResolvedValueOnce([newestItem])
        .mockResolvedValueOnce([oldestItem])
        .mockResolvedValueOnce([middleItem]);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(responseData.data).toEqual([newestItem, middleItem, oldestItem]);
    });

    it("should handle database errors", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      mockExecuteQuery.mockRejectedValue(
        new Error("Database connection failed"),
      );

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        success: false,
        error: "Failed to fetch starred recommendations",
        details: "Database connection failed",
      });
    });

    it("should handle partial database failures", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce(mockSchoolMatches)
        .mockRejectedValueOnce(new Error("Major mentor query failed"))
        .mockResolvedValueOnce(mockStoryStrategists);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        success: false,
        error: "Failed to fetch starred recommendations",
        details: "Major mentor query failed",
      });
    });

    it("should handle mix of array and non-array results", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce(mockSchoolMatches) // Array
        .mockResolvedValueOnce(null) // Null
        .mockResolvedValueOnce(mockStoryStrategists); // Array

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.breakdown).toEqual({
        school_matches: 2,
        major_mentors: 0, // Null treated as 0
        story_strategists: 1,
      });
    });

    it("should verify correct WHERE clauses for starred filtering", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await GET(mockRequest);

      // Verify each query includes WHERE starred = true
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("WHERE starred = true AND user_id = $1"),
        ["test-user-123"],
      );

      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("WHERE starred = true AND user_id = $1"),
        ["test-user-123"],
      );

      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("WHERE starred = true AND user_id = $1"),
        ["test-user-123"],
      );
    });

    it("should include correct field mappings for each type", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await GET(mockRequest);

      // Verify school match query was called first
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("school_match_maker"),
        ["test-user-123"],
      );
      // Verify major mentor query was called second
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("major_mentor"),
        ["test-user-123"],
      );

      // Verify story strategist query was called third
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("story_strategist"),
        ["test-user-123"],
      );

      // All queries were called with the correct userId
      expect(mockExecuteQuery).toHaveBeenCalledTimes(3);
    });

    it("should handle non-Error objects in catch block", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      mockExecuteQuery.mockRejectedValue("String error message");

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        success: false,
        error: "Failed to fetch starred recommendations",
        details: "Unknown error",
      });
    });

    it("should execute queries concurrently with Promise.all", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getAllStarred?userId=test-user-123",
      } as NextRequest;

      const startTime = Date.now();

      mockExecuteQuery
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
        )
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
        )
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
        );

      await GET(mockRequest);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Should take roughly 100ms (concurrent) rather than 300ms (sequential)
      expect(executionTime).toBeLessThan(200);
      expect(mockExecuteQuery).toHaveBeenCalledTimes(3);
    });
  });
});
