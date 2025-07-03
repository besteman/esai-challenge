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
import { POST } from "@/app/api/db/postSchoolMatch/route";

const mockExecuteQuery = executeQuery as jest.MockedFunction<
  typeof executeQuery
>;
const mockRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>;

// Mock console.error to test error logging
const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("/api/db/postSchoolMatch", () => {
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
      userId: "test-user-123",
      userInputs: {
        location: "California",
        locationRequirements: "warm climate",
        futurePlans: "tech career",
        idealCampusExperience: "large campus",
        unweightedGPA: "3.8",
      },
      generationResponse: JSON.stringify([
        {
          option1: {
            collegeName: "Stanford University",
            descriptionOfCollege: "Top tech university",
            whyThisCollege: "Great for computer science",
          },
        },
        {
          option2: {
            collegeName: "UC Berkeley",
            descriptionOfCollege: "Public research university",
            whyThisCollege: "Strong engineering programs",
          },
        },
      ]),
      starredStates: { 0: true, 1: false },
    };

    it("should save school match data successfully", async () => {
      const mockInsertResults = [{ id: 1 }, { id: 2 }];

      mockExecuteQuery
        .mockResolvedValueOnce([]) // DELETE query
        .mockResolvedValueOnce([mockInsertResults[0]]) // First INSERT
        .mockResolvedValueOnce([mockInsertResults[1]]); // Second INSERT

      const mockRequest = {
        json: jest.fn().mockResolvedValue(validRequestBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      // Verify DELETE query was called first
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("DELETE FROM school_match_maker"),
        [
          "test-user-123",
          "California",
          "warm climate",
          "tech career",
          "large campus",
          "3.8",
        ],
      );

      // Verify first INSERT
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("INSERT INTO school_match_maker"),
        [
          testUuid,
          "California",
          "warm climate",
          "tech career",
          "large campus",
          "3.8",
          "Stanford University",
          "Top tech university",
          "Great for computer science",
          true, // starred state for first option
          "test-user-123",
        ],
      );

      // Verify second INSERT
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("INSERT INTO school_match_maker"),
        [
          testUuid,
          "California",
          "warm climate",
          "tech career",
          "large campus",
          "3.8",
          "UC Berkeley",
          "Public research university",
          "Strong engineering programs",
          false, // starred state for second option
          "test-user-123",
        ],
      );

      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Successfully saved 2 school recommendations",
        outputGroupId: testUuid,
        insertedIds: [1, 2],
      });
    });

    it("should handle missing starred states", async () => {
      const requestBodyWithoutStarredStates = {
        ...validRequestBody,
        starredStates: undefined,
      };

      const mockInsertResults = [{ id: 1 }];

      mockExecuteQuery
        .mockResolvedValueOnce([]) // DELETE query
        .mockResolvedValueOnce([mockInsertResults[0]]); // INSERT

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestBodyWithoutStarredStates),
      } as unknown as NextRequest;

      await POST(mockRequest);

      // Verify INSERT with false for starred state (default)
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("INSERT INTO school_match_maker"),
        expect.arrayContaining([false]), // default starred state
      );
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
        {
          error:
            "Missing required fields: userId, userInputs and generationResponse",
        },
        { status: 400 },
      );
      expect(mockExecuteQuery).not.toHaveBeenCalled();
    });

    it("should return 400 for missing generationResponse", async () => {
      const invalidRequestBody = {
        userInputs: validRequestBody.userInputs,
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidRequestBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          error:
            "Missing required fields: userId, userInputs and generationResponse",
        },
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

    it("should handle request.json() parsing errors", async () => {
      const mockRequest = {
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving school match data:",
        expect.any(Error),
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Failed to save school match recommendations",
          details: "Invalid JSON",
        },
        { status: 500 },
      );
    });

    it("should handle database errors during DELETE", async () => {
      const dbError = new Error("Database connection failed");

      mockExecuteQuery.mockRejectedValue(dbError);

      const mockRequest = {
        json: jest.fn().mockResolvedValue(validRequestBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving school match data:",
        dbError,
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Failed to save school match recommendations",
          details: "Database connection failed",
        },
        { status: 500 },
      );
    });

    it("should handle database errors during INSERT", async () => {
      const dbError = new Error("Insert failed");

      mockExecuteQuery
        .mockResolvedValueOnce([]) // DELETE succeeds
        .mockRejectedValue(dbError); // INSERT fails

      const mockRequest = {
        json: jest.fn().mockResolvedValue(validRequestBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving school match data:",
        dbError,
      );
      expect(mockNextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Failed to save school match recommendations",
          details: "Insert failed",
        },
        { status: 500 },
      );
    });

    it("should handle complex generation response with multiple options", async () => {
      const complexGenerationResponse = JSON.stringify([
        {
          option1: {
            collegeName: "Harvard University",
            descriptionOfCollege: "Ivy League institution",
            whyThisCollege: "Prestigious and excellent academics",
          },
        },
        {
          option2: {
            collegeName: "MIT",
            descriptionOfCollege: "Top technical institute",
            whyThisCollege: "Best for engineering and technology",
          },
        },
        {
          option3: {
            collegeName: "Caltech",
            descriptionOfCollege: "Science and technology focused",
            whyThisCollege: "Small class sizes and research opportunities",
          },
        },
      ]);

      const complexRequestBody = {
        ...validRequestBody,
        generationResponse: complexGenerationResponse,
        starredStates: { 0: true, 1: false, 2: true },
      };

      const mockInsertResults = [{ id: 1 }, { id: 2 }, { id: 3 }];

      mockExecuteQuery
        .mockResolvedValueOnce([]) // DELETE query
        .mockResolvedValueOnce([mockInsertResults[0]]) // First INSERT
        .mockResolvedValueOnce([mockInsertResults[1]]) // Second INSERT
        .mockResolvedValueOnce([mockInsertResults[2]]); // Third INSERT

      const mockRequest = {
        json: jest.fn().mockResolvedValue(complexRequestBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(mockExecuteQuery).toHaveBeenCalledTimes(4); // 1 DELETE + 3 INSERTs
      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Successfully saved 3 school recommendations",
        outputGroupId: testUuid,
        insertedIds: [1, 2, 3],
      });
    });

    it("should filter out null insert results", async () => {
      const mockInsertResults = [{ id: 1 }, { id: 3 }];

      mockExecuteQuery
        .mockResolvedValueOnce([]) // DELETE query
        .mockResolvedValueOnce([mockInsertResults[0]]) // First INSERT
        .mockResolvedValueOnce([]) // Second INSERT returns empty
        .mockResolvedValueOnce([mockInsertResults[1]]); // Third INSERT

      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          ...validRequestBody,
          generationResponse: JSON.stringify([
            {
              option1: {
                collegeName: "School 1",
                descriptionOfCollege: "Description 1",
                whyThisCollege: "Reason 1",
              },
            },
            {
              option2: {
                collegeName: "School 2",
                descriptionOfCollege: "Description 2",
                whyThisCollege: "Reason 2",
              },
            },
            {
              option3: {
                collegeName: "School 3",
                descriptionOfCollege: "Description 3",
                whyThisCollege: "Reason 3",
              },
            },
          ]),
        }),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(mockNextResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Successfully saved 3 school recommendations",
        outputGroupId: testUuid,
        insertedIds: [1, 3], // empty result filtered out
      });
    });
  });
});
