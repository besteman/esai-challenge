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

describe("/api/db/getSchoolMatch", () => {
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
    it("should fetch all school match recommendations successfully", async () => {
      const mockData = [
        {
          id: 1,
          output_group: "group-1",
          location: "California",
          location_requirements: "warm climate",
          future_plans: "tech career",
          ideal_campus_experience: "large campus",
          unweighted_gpa: "3.8",
          college_name: "Stanford University",
          description_of_college: "Top tech university",
          why_this_college: "Great for computer science",
          starred: false,
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          output_group: "group-2",
          location: "Massachusetts",
          location_requirements: "prestigious",
          future_plans: "research",
          ideal_campus_experience: "small campus",
          unweighted_gpa: "4.0",
          college_name: "MIT",
          description_of_college: "Top research university",
          why_this_college: "Best for engineering",
          starred: true,
          created_at: "2024-01-02T00:00:00Z",
        },
      ];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSchoolMatch",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM school_match_maker ORDER BY created_at DESC",
        [],
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
        count: 2,
        message: "School match recommendations fetched successfully",
      });
    });

    it("should fetch starred school match recommendations only", async () => {
      const mockData = [
        {
          id: 2,
          output_group: "group-2",
          location: "Massachusetts",
          location_requirements: "prestigious",
          future_plans: "research",
          ideal_campus_experience: "small campus",
          unweighted_gpa: "4.0",
          college_name: "MIT",
          description_of_college: "Top research university",
          why_this_college: "Best for engineering",
          starred: true,
          created_at: "2024-01-02T00:00:00Z",
        },
      ];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSchoolMatch?starred=true",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM school_match_maker WHERE starred = $1 ORDER BY created_at DESC",
        [true],
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
        count: 1,
        message: "School match recommendations fetched successfully",
      });
    });

    it("should return empty array when no data is found", async () => {
      const mockData: any[] = [];

      mockExecuteQuery.mockResolvedValue(mockData);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSchoolMatch",
      } as NextRequest;

      await GET(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM school_match_maker ORDER BY created_at DESC",
        [],
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        count: 0,
        message: "School match recommendations fetched successfully",
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");

      mockExecuteQuery.mockRejectedValue(dbError);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSchoolMatch",
      } as NextRequest;

      await GET(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching school match data:",
        dbError,
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Failed to fetch school match recommendations",
          details: "Database connection failed",
        },
        { status: 500 },
      );
    });

    it("should handle non-Error exceptions", async () => {
      const errorMessage = "Unexpected error";

      mockExecuteQuery.mockRejectedValue(errorMessage);

      const mockRequest = {
        url: "http://localhost:3000/api/db/getSchoolMatch",
      } as NextRequest;

      await GET(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching school match data:",
        errorMessage,
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Failed to fetch school match recommendations",
          details: "Unknown error",
        },
        { status: 500 },
      );
    });
  });
});
