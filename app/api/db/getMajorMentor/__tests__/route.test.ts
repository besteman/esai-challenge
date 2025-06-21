import { NextRequest } from "next/server";

import { GET } from "../route";

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

describe("/api/db/getMajorMentor", () => {
  const mockExecuteQuery = require("@/lib/db").executeQuery;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMajorMentorData = [
    {
      id: 1,
      output_group: "test-uuid-1",
      favorite_subject: "Computer Science",
      factor_one: "High salary",
      factor_two: "Job security",
      factor_three: "Work-life balance",
      factor_one_importance: 5,
      factor_two_importance: 4,
      factor_three_importance: 3,
      major_title: "Computer Science",
      description_of_major: "Study of computational systems",
      why_this_major: "Perfect match for your interests",
      starred: true,
      created_at: "2025-06-21T10:00:00Z",
    },
    {
      id: 2,
      output_group: "test-uuid-1",
      favorite_subject: "Computer Science",
      factor_one: "High salary",
      factor_two: "Job security",
      factor_three: "Work-life balance",
      factor_one_importance: 5,
      factor_two_importance: 4,
      factor_three_importance: 3,
      major_title: "Software Engineering",
      description_of_major: "Focus on software development",
      why_this_major: "Great for career goals",
      starred: false,
      created_at: "2025-06-21T10:00:00Z",
    },
  ];

  describe("GET", () => {
    it("should fetch all major mentor data successfully", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor",
      } as NextRequest;

      mockExecuteQuery.mockResolvedValue(mockMajorMentorData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM major_mentor ORDER BY created_at DESC",
        [],
      );

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: mockMajorMentorData,
        count: 2,
        message: "Major mentor recommendations fetched successfully",
      });
    });

    it("should filter by starred=true", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor?starred=true",
      } as NextRequest;

      const starredData = [mockMajorMentorData[0]]; // Only starred item

      mockExecuteQuery.mockResolvedValue(starredData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM major_mentor WHERE starred = $1 ORDER BY created_at DESC",
        [true],
      );

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: starredData,
        count: 1,
        message: "Major mentor recommendations fetched successfully",
      });
    });

    it("should filter by starred=false", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor?starred=false",
      } as NextRequest;

      const unstarredData = [mockMajorMentorData[1]]; // Only unstarred item

      mockExecuteQuery.mockResolvedValue(unstarredData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM major_mentor WHERE starred = $1 ORDER BY created_at DESC",
        [false],
      );

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: unstarredData,
        count: 1,
        message: "Major mentor recommendations fetched successfully",
      });
    });

    it("should handle empty results", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor",
      } as NextRequest;

      mockExecuteQuery.mockResolvedValue([]);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: [],
        count: 0,
        message: "Major mentor recommendations fetched successfully",
      });
    });

    it("should handle non-array database results", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor",
      } as NextRequest;

      mockExecuteQuery.mockResolvedValue(null);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        data: [],
        count: 0,
        message: "Major mentor recommendations fetched successfully",
      });
    });

    it("should handle database errors", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor",
      } as NextRequest;

      mockExecuteQuery.mockRejectedValue(
        new Error("Database connection failed"),
      );

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        success: false,
        error: "Failed to fetch major mentor recommendations",
        details: "Database connection failed",
      });
    });

    it("should handle invalid starred parameter values", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor?starred=invalid",
      } as NextRequest;

      mockExecuteQuery.mockResolvedValue(mockMajorMentorData);

      const response = await GET(mockRequest);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const responseData = await response.json();

      // Should treat 'invalid' as falsy, so starred = false
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM major_mentor WHERE starred = $1 ORDER BY created_at DESC",
        [false],
      );

      expect(response.status).toBe(200);
    });

    it("should handle multiple query parameters", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor?starred=true&other=value",
      } as NextRequest;

      mockExecuteQuery.mockResolvedValue([mockMajorMentorData[0]]);

      const response = await GET(mockRequest);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const responseData = await response.json();

      // Should only process starred parameter, ignore others
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM major_mentor WHERE starred = $1 ORDER BY created_at DESC",
        [true],
      );

      expect(response.status).toBe(200);
    });

    it("should handle undefined database error", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor",
      } as NextRequest;

      mockExecuteQuery.mockRejectedValue(
        "String error instead of Error object",
      );

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        success: false,
        error: "Failed to fetch major mentor recommendations",
        details: "Unknown error",
      });
    });

    it("should maintain proper ordering by created_at DESC", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor",
      } as NextRequest;

      const orderedData = [
        { ...mockMajorMentorData[1], created_at: "2025-06-21T12:00:00Z" }, // Newer
        { ...mockMajorMentorData[0], created_at: "2025-06-21T10:00:00Z" }, // Older
      ];

      mockExecuteQuery.mockResolvedValue(orderedData);

      const response = await GET(mockRequest);
      const responseData = await response.json();

      expect(mockExecuteQuery).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY created_at DESC"),
        [],
      );

      expect(responseData.data).toEqual(orderedData);
    });

    it("should handle starred parameter with null value", async () => {
      const mockRequest = {
        url: "http://localhost:3000/api/db/getMajorMentor?starred=",
      } as NextRequest;

      mockExecuteQuery.mockResolvedValue(mockMajorMentorData);

      const response = await GET(mockRequest);

      // Empty string should be treated as falsy
      expect(mockExecuteQuery).toHaveBeenCalledWith(
        "SELECT * FROM major_mentor WHERE starred = $1 ORDER BY created_at DESC",
        [false],
      );

      expect(response.status).toBe(200);
    });
  });
});
