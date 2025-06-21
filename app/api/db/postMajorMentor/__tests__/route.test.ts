import { NextRequest } from "next/server";

import { POST } from "../route";

// Mock the database utility
jest.mock("@/lib/db", () => ({
  executeQuery: jest.fn(),
}));

// Mock crypto for UUID generation
jest.mock("crypto", () => ({
  randomUUID: jest.fn(() => "test-uuid-12345"),
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

describe("/api/db/postMajorMentor", () => {
  const mockExecuteQuery = require("@/lib/db").executeQuery;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validRequest = {
    userInputs: {
      favoriteSubject: "Computer Science",
      factors: {
        factor1: { value: "High salary potential", importance: 5 },
        factor2: { value: "Job security", importance: 4 },
        factor3: { value: "Work-life balance", importance: 3 },
      },
      postCollegePlans: "Software engineering",
    },
    generationResponse: JSON.stringify([
      {
        option1: {
          majorTitle: "Computer Science",
          descriptionOfMajor: "Study of computational systems",
          whyThisMajor: "Perfect match for your interests",
        },
      },
      {
        option2: {
          majorTitle: "Software Engineering",
          descriptionOfMajor: "Focus on software development",
          whyThisMajor: "Great for career goals",
        },
      },
    ]),
    starredStates: { 0: true, 1: false },
  };

  describe("POST", () => {
    it("should save major mentor data successfully", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue(validRequest),
      } as unknown as NextRequest;

      // Mock database responses
      mockExecuteQuery
        .mockResolvedValueOnce([]) // DELETE query result
        .mockResolvedValueOnce([{ id: 1 }]) // First INSERT result
        .mockResolvedValueOnce([{ id: 2 }]); // Second INSERT result

      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Verify DELETE query to remove existing records
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("DELETE FROM major_mentor"),
        [
          "Computer Science",
          "High salary potential",
          "Job security",
          "Work-life balance",
        ],
      );

      // Verify INSERT queries for each major
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("INSERT INTO major_mentor"),
        [
          "test-uuid-12345",
          "Computer Science",
          "High salary potential",
          "Job security",
          "Work-life balance",
          5,
          4,
          3,
          "Computer Science",
          "Study of computational systems",
          "Perfect match for your interests",
          true, // starred
        ],
      );

      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("INSERT INTO major_mentor"),
        [
          "test-uuid-12345",
          "Computer Science",
          "High salary potential",
          "Job security",
          "Work-life balance",
          5,
          4,
          3,
          "Software Engineering",
          "Focus on software development",
          "Great for career goals",
          false, // not starred
        ],
      );

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: "Successfully saved 2 major recommendations",
        outputGroupId: "test-uuid-12345",
        insertedIds: [1, 2],
      });
    });

    it("should handle missing userInputs", async () => {
      const invalidRequest = {
        generationResponse: JSON.stringify([]),
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidRequest),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: "Missing required fields: userInputs and generationResponse",
      });
      expect(mockExecuteQuery).not.toHaveBeenCalled();
    });

    it("should handle missing generationResponse", async () => {
      const invalidRequest = {
        userInputs: validRequest.userInputs,
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidRequest),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: "Missing required fields: userInputs and generationResponse",
      });
      expect(mockExecuteQuery).not.toHaveBeenCalled();
    });

    it("should handle invalid JSON in generationResponse", async () => {
      const invalidRequest = {
        ...validRequest,
        generationResponse: "invalid json {",
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(invalidRequest),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: "Invalid JSON in generationResponse",
      });
      expect(mockExecuteQuery).not.toHaveBeenCalled();
    });

    it("should handle empty starredStates", async () => {
      const requestWithoutStars = {
        ...validRequest,
        starredStates: undefined,
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestWithoutStars),
      } as unknown as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ id: 1 }])
        .mockResolvedValueOnce([{ id: 2 }]);

      const response = await POST(mockRequest);
      const responseData = await response.json();

      // Verify that starred is false for both records when no starredStates
      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("INSERT INTO major_mentor"),
        expect.arrayContaining([false]), // starred should be false
      );

      expect(mockExecuteQuery).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("INSERT INTO major_mentor"),
        expect.arrayContaining([false]), // starred should be false
      );

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
    });

    it("should handle database errors", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue(validRequest),
      } as unknown as NextRequest;

      mockExecuteQuery.mockRejectedValue(
        new Error("Database connection failed"),
      );

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: "Internal server error",
      });
    });

    it("should handle empty generation response array", async () => {
      const requestWithEmptyResponse = {
        ...validRequest,
        generationResponse: JSON.stringify([]),
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestWithEmptyResponse),
      } as unknown as NextRequest;

      mockExecuteQuery.mockResolvedValueOnce([]); // DELETE query result

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: "Successfully saved 0 major recommendations",
        outputGroupId: "test-uuid-12345",
        insertedIds: [],
      });

      // Only DELETE should be called, no INSERTs
      expect(mockExecuteQuery).toHaveBeenCalledTimes(1);
    });

    it("should handle malformed JSON request body", async () => {
      const mockRequest = {
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as NextRequest;

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: "Internal server error",
      });
    });

    it("should handle INSERT query returning null result", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue(validRequest),
      } as unknown as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce([]) // DELETE query result
        .mockResolvedValueOnce(null) // First INSERT returns null
        .mockResolvedValueOnce([{ id: 2 }]); // Second INSERT result

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.insertedIds).toEqual([2]); // Only valid IDs included
    });

    it("should generate unique UUID for each request", async () => {
      const mockRandomUUID = require("crypto").randomUUID;
      mockRandomUUID
        .mockReturnValueOnce("uuid-1")
        .mockReturnValueOnce("uuid-2");

      const mockRequest1 = {
        json: jest.fn().mockResolvedValue(validRequest),
      } as unknown as NextRequest;

      const mockRequest2 = {
        json: jest.fn().mockResolvedValue(validRequest),
      } as unknown as NextRequest;

      mockExecuteQuery.mockResolvedValue([{ id: 1 }]);

      await POST(mockRequest1);
      await POST(mockRequest2);

      expect(mockRandomUUID).toHaveBeenCalledTimes(2);
    });

    it("should handle single major recommendation", async () => {
      const singleMajorRequest = {
        ...validRequest,
        generationResponse: JSON.stringify([
          {
            option1: {
              majorTitle: "Data Science",
              descriptionOfMajor: "Analysis of large datasets",
              whyThisMajor: "Growing field with opportunities",
            },
          },
        ]),
        starredStates: { 0: true },
      };

      const mockRequest = {
        json: jest.fn().mockResolvedValue(singleMajorRequest),
      } as unknown as NextRequest;

      mockExecuteQuery
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ id: 1 }]);

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        message: "Successfully saved 1 major recommendations",
        outputGroupId: "test-uuid-12345",
        insertedIds: [1],
      });

      expect(mockExecuteQuery).toHaveBeenCalledTimes(2); // DELETE + 1 INSERT
    });
  });
});
