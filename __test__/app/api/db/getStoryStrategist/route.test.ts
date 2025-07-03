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
import { GET } from "@/app/api/db/getStoryStrategist/route";

const mockExecuteQuery = executeQuery as jest.MockedFunction<
  typeof executeQuery
>;
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

// Mock console.error to test error logging
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("/api/db/getStoryStrategist", () => {
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
    it("should fetch all story strategist recommendations successfully", async () => {
      const mockData = [
        {
          id: 1,
          output_group: "group-1",
          feelMostLikeYourself: "creative",
          hardship: "financial",
          never_get_bored: "learning",
          family_background: "immigrant",
          proud_achievement: "scholarship",
          known_in_10_years: "entrepreneur",
          what_sets_you_apart: "determination",
          post_college_plans: "startup",
          title: "Creative Entrepreneur Story",
          summary: "A story about perseverance and creativity",
          starred: false,
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          output_group: "group-2",
          feelMostLikeYourself: "analytical",
          hardship: "health",
          never_get_bored: "problem-solving",
          family_background: "academic",
          proud_achievement: "research",
          known_in_10_years: "scientist",
          what_sets_you_apart: "persistence",
          post_college_plans: "phd",
          title: "Research Scientist Story",
          summary: "A story about analytical thinking and research",
          starred: true,
          created_at: "2024-01-02T00:00:00Z",
        },
      ];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM story_strategist WHERE user_id = $1 ORDER BY created_at DESC",
        ["test-user-id"],
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
        count: 2,
        message: "Story strategist recommendations fetched successfully",
      });
    });

    it("should fetch starred story strategist recommendations only", async () => {
      const mockData = [
        {
          id: 2,
          output_group: "group-2",
          feelMostLikeYourself: "analytical",
          hardship: "health",
          never_get_bored: "problem-solving",
          family_background: "academic",
          proud_achievement: "research",
          known_in_10_years: "scientist",
          what_sets_you_apart: "persistence",
          post_college_plans: "phd",
          title: "Research Scientist Story",
          summary: "A story about analytical thinking and research",
          starred: true,
          created_at: "2024-01-02T00:00:00Z",
        },
      ];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist?userId=test-user-id&starred=true",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM story_strategist WHERE user_id = $1 WHERE starred = $1 ORDER BY created_at DESC",
        ["test-user-id", true],
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
        count: 1,
        message: "Story strategist recommendations fetched successfully",
      });
    });

    it("should fetch non-starred story strategist recommendations only", async () => {
      const mockData = [
        {
          id: 1,
          output_group: "group-1",
          feelMostLikeYourself: "creative",
          hardship: "financial",
          never_get_bored: "learning",
          family_background: "immigrant",
          proud_achievement: "scholarship",
          known_in_10_years: "entrepreneur",
          what_sets_you_apart: "determination",
          post_college_plans: "startup",
          title: "Creative Entrepreneur Story",
          summary: "A story about perseverance and creativity",
          starred: false,
          created_at: "2024-01-01T00:00:00Z",
        },
      ];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist?userId=test-user-id&starred=false",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM story_strategist WHERE user_id = $1 WHERE starred = $1 ORDER BY created_at DESC",
        ["test-user-id", false],
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
        count: 1,
        message: "Story strategist recommendations fetched successfully",
      });
    });

    it("should return empty array when no data is found", async () => {
      const mockData: any[] = [];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM story_strategist WHERE user_id = $1 ORDER BY created_at DESC",
        ["test-user-id"],
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        count: 0,
        message: "Story strategist recommendations fetched successfully",
      });
    });

    it("should handle non-array database results", async () => {
      // Database might return a single object instead of array in some cases
      mockExecuteQuery.mockResolvedValue(null as any);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        count: 0,
        message: "Story strategist recommendations fetched successfully",
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");

      mockExecuteQuery.mockRejectedValue(dbError);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching story strategist data:",
        dbError,
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Failed to fetch story strategist recommendations",
          details: "Database connection failed",
        },
        { status: 500 },
      );
    });

    it("should handle non-Error exceptions", async () => {
      const errorMessage = "Unexpected error";

      mockExecuteQuery.mockRejectedValue(errorMessage);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist?userId=test-user-id",
      } as NextRequest;

      await GET(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching story strategist data:",
        errorMessage,
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Failed to fetch story strategist recommendations",
          details: "Unknown error",
        },
        { status: 500 },
      );
    });

    it("should handle URL with multiple query parameters", async () => {
      const mockData: any[] = [];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist?userId=test-user-id&starred=true&other=param",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM story_strategist WHERE user_id = $1 WHERE starred = $1 ORDER BY created_at DESC",
        ["test-user-id", true],
      );
    });

    it("should handle empty starred parameter", async () => {
      const mockData: any[] = [];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist?userId=test-user-id&starred=",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM story_strategist WHERE user_id = $1 WHERE starred = $1 ORDER BY created_at DESC",
        ["test-user-id", false],
      );
    });

    it("should return 400 error when userId is not provided", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getStoryStrategist",
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
