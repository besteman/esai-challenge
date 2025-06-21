import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

// Mock the database utility
jest.mock("@/lib/db", () => ({
  executeQuery: jest.fn(),
}));

// Mock crypto module
jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
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

import { POST } from "../route";

const mockExecuteQuery = executeQuery as jest.MockedFunction<
  typeof executeQuery
>;
const mockRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

// Mock console.error to test error logging
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("/api/db/postStoryStrategist", () => {
  const testUuid = "550e8400-e29b-41d4-a716-446655440000";

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

    // Mock UUID generation
    mockRandomUUID.mockReturnValue(
      testUuid as `${string}-${string}-${string}-${string}-${string}`,
    );
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("POST", () => {
    const validRequestBody = {
      userInputs: {
        feelMostLikeYourself: "creative",
        hardship: "financial",
        neverGetBored: "learning",
        familyBackground: "immigrant",
        proudAchievement: "scholarship",
        knownIn10Years: "entrepreneur",
        whatSetsYouApart: "determination",
        postCollegePlans: "startup",
      },
      generationResponse: JSON.stringify([
        {
          option1: {
            title: "Creative Entrepreneur Story",
            summary: "A story about perseverance and creativity",
          },
        },
      ]),
      starredStates: { 0: true },
    };

    it("should save story strategist data successfully", async () => {
      const mockInsertResults = [{ id: 1 }];

      mockExecuteQuery
        .mockResolvedValueOnce([]) // DELETE query
        .mockResolvedValueOnce([mockInsertResults[0]]); // INSERT

      const mockRequest = {
        json: jest.fn().mockResolvedValue(validRequestBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledTimes(2);
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Successfully saved 1 story recommendations",
        outputGroupId: testUuid,
        insertedIds: [1],
      });
    });

    it("should return 400 for missing userInputs", async () => {
      const invalidRequestBody = {
        generationResponse: validRequestBody.generationResponse,
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidRequestBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: "Missing required fields: userInputs and generationResponse" },
        { status: 400 },
      );
      expect(mockExecuteQuery).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid JSON in generationResponse", async () => {
      const invalidRequestBody = {
        ...validRequestBody,
        generationResponse: "invalid json",
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidRequestBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: "Invalid JSON in generationResponse" },
        { status: 400 },
      );
      expect(mockExecuteQuery).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");

      mockExecuteQuery.mockRejectedValue(dbError);

      const mockRequest = {
        json: jest.fn().mockResolvedValue(validRequestBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving story strategist data:",
        dbError,
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        { error: "Internal server error" },
        { status: 500 },
      );
    });
  });
});
