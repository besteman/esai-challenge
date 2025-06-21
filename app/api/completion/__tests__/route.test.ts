import { POST } from "../route";

// Mock the AI SDK
jest.mock("ai", () => ({
  generateText: jest.fn(),
}));

jest.mock("@ai-sdk/openai", () => ({
  openai: jest.fn(),
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

describe("/api/completion", () => {
  const mockGenerateText = require("ai").generateText;
  const mockOpenai = require("@ai-sdk/openai").openai;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOpenai.mockReturnValue("mocked-model");
  });

  describe("POST", () => {
    it("should generate text successfully with valid input", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          prompt: "What is machine learning?",
          system: "You are a helpful AI assistant.",
        }),
      } as unknown as Request;

      const mockGeneratedText =
        "Machine learning is a subset of artificial intelligence...";

      mockGenerateText.mockResolvedValue({ text: mockGeneratedText });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(mockGenerateText).toHaveBeenCalledWith({
        model: "mocked-model",
        system: "You are a helpful AI assistant.",
        prompt: "What is machine learning?",
      });

      expect(responseData).toEqual({
        text: mockGeneratedText,
      });
    });

    it("should handle empty prompt", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          prompt: "",
          system: "You are a helpful AI assistant.",
        }),
      } as unknown as Request;

      const mockGeneratedText = "I need more information to help you.";

      mockGenerateText.mockResolvedValue({ text: mockGeneratedText });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(mockGenerateText).toHaveBeenCalledWith({
        model: "mocked-model",
        system: "You are a helpful AI assistant.",
        prompt: "",
      });

      expect(responseData).toEqual({
        text: mockGeneratedText,
      });
    });

    it("should handle empty system message", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          prompt: "What is AI?",
          system: "",
        }),
      } as unknown as Request;

      const mockGeneratedText = "AI stands for artificial intelligence...";

      mockGenerateText.mockResolvedValue({ text: mockGeneratedText });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(mockGenerateText).toHaveBeenCalledWith({
        model: "mocked-model",
        system: "",
        prompt: "What is AI?",
      });

      expect(responseData).toEqual({
        text: mockGeneratedText,
      });
    });

    it("should handle AI generation errors", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          prompt: "What is machine learning?",
          system: "You are a helpful AI assistant.",
        }),
      } as unknown as Request;

      mockGenerateText.mockRejectedValue(new Error("AI service unavailable"));

      await expect(POST(mockRequest)).rejects.toThrow("AI service unavailable");

      expect(mockGenerateText).toHaveBeenCalledWith({
        model: "mocked-model",
        system: "You are a helpful AI assistant.",
        prompt: "What is machine learning?",
      });
    });

    it("should handle invalid JSON in request", async () => {
      const mockRequest = {
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
      } as unknown as Request;

      await expect(POST(mockRequest)).rejects.toThrow("Invalid JSON");

      expect(mockGenerateText).not.toHaveBeenCalled();
    });

    it("should handle missing prompt field", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          system: "You are a helpful AI assistant.",
        }),
      } as unknown as Request;

      const mockGeneratedText = "I need a prompt to respond to.";

      mockGenerateText.mockResolvedValue({ text: mockGeneratedText });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(mockGenerateText).toHaveBeenCalledWith({
        model: "mocked-model",
        system: "You are a helpful AI assistant.",
        prompt: undefined,
      });

      expect(responseData).toEqual({
        text: mockGeneratedText,
      });
    });

    it("should handle missing system field", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          prompt: "What is AI?",
        }),
      } as unknown as Request;

      const mockGeneratedText = "AI stands for artificial intelligence...";

      mockGenerateText.mockResolvedValue({ text: mockGeneratedText });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(mockGenerateText).toHaveBeenCalledWith({
        model: "mocked-model",
        system: undefined,
        prompt: "What is AI?",
      });

      expect(responseData).toEqual({
        text: mockGeneratedText,
      });
    });

    it("should use correct OpenAI model", async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          prompt: "Test prompt",
          system: "Test system",
        }),
      } as unknown as Request;

      mockGenerateText.mockResolvedValue({ text: "Test response" });

      await POST(mockRequest);

      expect(mockOpenai).toHaveBeenCalledWith("gpt-4.1-nano");
      expect(mockGenerateText).toHaveBeenCalledWith({
        model: "mocked-model",
        system: "Test system",
        prompt: "Test prompt",
      });
    });

    it("should handle long prompts", async () => {
      const longPrompt = "A".repeat(10000);
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          prompt: longPrompt,
          system: "You are a helpful AI assistant.",
        }),
      } as unknown as Request;

      const mockGeneratedText = "Response to long prompt";

      mockGenerateText.mockResolvedValue({ text: mockGeneratedText });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(mockGenerateText).toHaveBeenCalledWith({
        model: "mocked-model",
        system: "You are a helpful AI assistant.",
        prompt: longPrompt,
      });

      expect(responseData).toEqual({
        text: mockGeneratedText,
      });
    });

    it("should handle special characters in prompt", async () => {
      const specialPrompt =
        "What about \"quotes\" and 'apostrophes' and \nnewlines\t?";
      const mockRequest = {
        json: jest.fn().mockResolvedValue({
          prompt: specialPrompt,
          system: "You are a helpful AI assistant.",
        }),
      } as unknown as Request;

      const mockGeneratedText = "Response handling special characters";

      mockGenerateText.mockResolvedValue({ text: mockGeneratedText });

      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(mockGenerateText).toHaveBeenCalledWith({
        model: "mocked-model",
        system: "You are a helpful AI assistant.",
        prompt: specialPrompt,
      });

      expect(responseData).toEqual({
        text: mockGeneratedText,
      });
    });
  });
});
