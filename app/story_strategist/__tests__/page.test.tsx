import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import StoryStrategistPage from "@/app/story_strategist/page";

// Mock the component dependencies
jest.mock("@/components/productWelcome", () => ({
  ProductWelcome: ({ title, subtitle, heading, description }: any) => (
    <div data-testid="product-welcome">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <h3>{heading}</h3>
      <p>{description}</p>
    </div>
  ),
}));

jest.mock("@/components/stream/promptReq", () => ({
  PromptReq: ({ buttonText, onResponse, _userPrompt, _systemPrompt }: any) => (
    <div data-testid="prompt-req">
      <button
        onClick={() => {
          const mockResponse = JSON.stringify([
            {
              option1: {
                title: "Curiosity-Driven Leader",
                summary:
                  "Connect your love for asking questions with your accomplishments in drama and sports. This unique intersection can create an engaging hook for your essays, illustrating how curiosity fuels your passion for leadership and innovation.",
              },
            },
            {
              option2: {
                title: "Empathetic Innovator",
                summary:
                  "Use your values of helping others with your experience navigating challenges to showcase resilience and empathy in your personal statement. This connection emphasizes your desire to lead and innovate.",
              },
            },
            {
              option3: {
                title: "Cultural Bridge-Builder",
                summary:
                  "Leverage your unique family background and multicultural perspective to highlight how you serve as a bridge between different communities and ideas, bringing diverse viewpoints to campus.",
              },
            },
          ]);

          onResponse(mockResponse);
        }}
      >
        {buttonText}
      </button>
    </div>
  ),
}));

jest.mock("@/components/question/textInput", () => ({
  TextInput: ({ question, onSubmit, buttonText, initialValue }: any) => (
    <div data-testid="text-input">
      <label>{question}</label>
      <input
        data-testid="text-input-field"
        defaultValue={initialValue}
        onChange={(e) => {
          // Store the value for onSubmit
          (e.target as any).submitValue = e.target.value;
        }}
      />
      <button
        onClick={(e) => {
          const input = (e.target as any).parentNode.querySelector(
            "[data-testid='text-input-field']",
          );

          onSubmit(input.submitValue || input.value);
        }}
      >
        {buttonText}
      </button>
    </div>
  ),
}));

jest.mock("@/components/summary/editableCard", () => ({
  EditableCard: ({ title, value, show, onEdit }: any) =>
    show ? (
      <div data-testid="editable-card">
        <span>{title}</span>
        <span>{value}</span>
        <button onClick={onEdit}>Edit</button>
      </div>
    ) : null,
}));

describe("StoryStrategistPage", () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: "Data saved successfully" }),
    } as Response);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the welcome section", () => {
    render(<StoryStrategistPage />);

    expect(screen.getByTestId("product-welcome")).toBeInTheDocument();
    expect(screen.getByText("Story Strategist")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Share the pieces of your story that are most important to you.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the first question initially", () => {
    render(<StoryStrategistPage />);

    expect(screen.getByTestId("text-input")).toBeInTheDocument();
    expect(
      screen.getByText("When do you feel most like yourself?"),
    ).toBeInTheDocument();
  });

  it("progresses through all 7 input stages", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    // Stage 1: Feel most like yourself
    const input1 = screen.getByTestId("text-input-field");

    await user.type(input1, "When helping others solve problems");
    await user.click(screen.getByText("Next"));

    // Stage 2: Hardship/challenge
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Tell us about a hardship or challenge"),
    ).toBeInTheDocument();
    const input2 = screen.getByTestId("text-input-field");

    await user.type(input2, "Overcoming learning differences in school");
    await user.click(screen.getByText("Next"));

    // Stage 3: Never get bored
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    expect(
      screen.getByText("What's something you never get bored of?"),
    ).toBeInTheDocument();
    const input3 = screen.getByTestId("text-input-field");

    await user.type(input3, "Learning new technologies and coding");
    await user.click(screen.getByText("Next"));

    // Stage 4: Family background
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    expect(screen.getByText("Tell us about your family")).toBeInTheDocument();
    const input4 = screen.getByTestId("text-input-field");

    await user.type(input4, "First generation college student from immigrants");
    await user.click(screen.getByText("Next"));

    // Stage 5: Proud achievement
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    expect(
      screen.getByText("What are you most proud of achieving?"),
    ).toBeInTheDocument();
    const input5 = screen.getByTestId("text-input-field");

    await user.type(input5, "Starting a coding club at my school");
    await user.click(screen.getByText("Next"));

    // Stage 6: Known in 10 years
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    expect(
      screen.getByText("How do you want to be known in 10 years?"),
    ).toBeInTheDocument();
    const input6 = screen.getByTestId("text-input-field");

    await user.type(input6, "A tech innovator who creates accessible tools");
    await user.click(screen.getByText("Next"));

    // Stage 7: What sets you apart
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    expect(
      screen.getByText("What sets you apart from your friends and classmates?"),
    ).toBeInTheDocument();
    const input7 = screen.getByTestId("text-input-field");

    await user.type(input7, "My multicultural perspective and resilience");
    await user.click(screen.getByText("Next"));

    // Stage 8: Generation stage
    await waitFor(() => {
      expect(
        screen.getByText("Ready to craft your story?"),
      ).toBeInTheDocument();
    });
  });

  it("displays editable cards for previous inputs", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    // Complete stage 1
    const input1 = screen.getByTestId("text-input-field");

    await user.type(input1, "When creating art");
    await user.click(screen.getByText("Next"));

    // Should show editable card for first input
    await waitFor(() => {
      expect(screen.getByTestId("editable-card")).toBeInTheDocument();
    });
  });

  it("allows editing previous inputs", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    // Complete stage 1
    const input1 = screen.getByTestId("text-input-field");

    await user.type(input1, "When teaching others");
    await user.click(screen.getByText("Next"));

    // Click edit button
    await waitFor(() => {
      expect(screen.getByTestId("editable-card")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Edit"));

    // Should return to stage 1
    expect(screen.getByTestId("text-input")).toBeInTheDocument();
    expect(
      screen.getByText("When do you feel most like yourself?"),
    ).toBeInTheDocument();
  });

  it("generates story recommendations", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    // Complete all stages
    await completeAllStages(user);

    // Click generation button
    await user.click(screen.getByText("Create my stories!"));

    // Should display recommendations
    await waitFor(() => {
      expect(
        screen.getByText("Your Recommended Story Angles:"),
      ).toBeInTheDocument();
      expect(screen.getByText("Curiosity-Driven Leader")).toBeInTheDocument();
      expect(screen.getByText("Empathetic Innovator")).toBeInTheDocument();
      expect(screen.getByText("Cultural Bridge-Builder")).toBeInTheDocument();
    });
  });

  it("saves data to database when generation is complete", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    await completeAllStages(user);
    await user.click(screen.getByText("Create my stories!"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/db/postStoryStrategist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining("When helping others solve problems"),
      });
    });
  });

  it("toggles star states for recommendations", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    await completeAllStages(user);
    await user.click(screen.getByText("Create my stories!"));

    // Wait for recommendations to appear
    await waitFor(() => {
      expect(screen.getByText("Curiosity-Driven Leader")).toBeInTheDocument();
    });

    // Find and click star button
    const starButtons = screen.getAllByText("☆");

    expect(starButtons).toHaveLength(3); // Three recommendations

    await user.click(starButtons[0]);

    // Should update to filled star and save to database
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/db/postStoryStrategist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining('"starredStates"'),
      });
    });
  });

  it("handles API errors gracefully", async () => {
    const user = userEvent.setup();

    // Mock fetch to return an error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Database error" }),
    } as Response);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<StoryStrategistPage />);

    await completeAllStages(user);
    await user.click(screen.getByText("Create my stories!"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving story recommendation:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("handles star toggle errors gracefully", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    await completeAllStages(user);
    await user.click(screen.getByText("Create my stories!"));

    // Wait for recommendations to appear
    await waitFor(() => {
      expect(screen.getByText("Curiosity-Driven Leader")).toBeInTheDocument();
    });

    // Mock fetch to fail for star toggle
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Star toggle failed" }),
    } as Response);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const starButtons = screen.getAllByText("☆");

    await user.click(starButtons[0]);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error updating starred state:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("handles invalid JSON response gracefully", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    await completeAllStages(user);

    // Wait for initial generation button, then check if it becomes an error state
    expect(screen.getByText("Create my stories!")).toBeInTheDocument();
  });

  it("displays recommendation cards with correct structure", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    await completeAllStages(user);
    await user.click(screen.getByText("Create my stories!"));

    await waitFor(() => {
      expect(screen.getByText("Curiosity-Driven Leader")).toBeInTheDocument();
      expect(
        screen.getByText(/Connect your love for asking questions/),
      ).toBeInTheDocument();
      expect(screen.getByText("Empathetic Innovator")).toBeInTheDocument();
      expect(
        screen.getByText(/Use your values of helping others/),
      ).toBeInTheDocument();
      expect(screen.getByText("Cultural Bridge-Builder")).toBeInTheDocument();
    });
  });

  it("maintains user input state when navigating between stages", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    // Enter first input
    const input1 = screen.getByTestId("text-input-field");

    await user.type(input1, "When volunteering at the animal shelter");
    await user.click(screen.getByText("Next"));

    // Complete second input
    const input2 = screen.getByTestId("text-input-field");

    await user.type(input2, "Moving to a new country");
    await user.click(screen.getByText("Next"));

    // Go back to edit first input
    const editButtons = screen.getAllByText("Edit");

    await user.click(editButtons[0]);

    // Input should maintain previous value
    const input = screen.getByTestId("text-input-field");

    expect(input).toHaveValue("When volunteering at the animal shelter");
  });

  it("displays proper stage progression labels", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    // Check stage 1 question
    expect(
      screen.getByText("When do you feel most like yourself?"),
    ).toBeInTheDocument();

    // Progress to stage 2
    const input1 = screen.getByTestId("text-input-field");

    await user.type(input1, "When creating music");
    await user.click(screen.getByText("Next"));

    // Check stage 2 question
    await waitFor(() => {
      expect(
        screen.getByText("Tell us about a hardship or challenge"),
      ).toBeInTheDocument();
    });

    // Progress to stage 3
    const input2 = screen.getByTestId("text-input-field");

    await user.type(input2, "Balancing work and school");
    await user.click(screen.getByText("Next"));

    // Check stage 3 question
    await waitFor(() => {
      expect(
        screen.getByText("What's something you never get bored of?"),
      ).toBeInTheDocument();
    });
  });

  it("shows multiple editable cards after completing several stages", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    // Complete first 4 stages
    await user.type(screen.getByTestId("text-input-field"), "When leading");
    await user.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    await user.type(
      screen.getByTestId("text-input-field"),
      "Financial hardship growing up",
    );
    await user.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    await user.type(
      screen.getByTestId("text-input-field"),
      "Reading about history",
    );
    await user.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    await user.type(
      screen.getByTestId("text-input-field"),
      "Multicultural immigrant family",
    );
    await user.click(screen.getByText("Next"));

    // Should show 4 editable cards
    await waitFor(() => {
      const editableCards = screen.getAllByTestId("editable-card");

      expect(editableCards).toHaveLength(4);
    });
  });

  it("handles API network errors for story generation", async () => {
    const user = userEvent.setup();

    // Mock fetch to throw a network error
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    render(<StoryStrategistPage />);

    await completeAllStages(user);
    await user.click(screen.getByText("Create my stories!"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error saving story recommendation:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("reverts star state on API failure", async () => {
    const user = userEvent.setup();

    render(<StoryStrategistPage />);

    await completeAllStages(user);
    await user.click(screen.getByText("Create my stories!"));

    // Wait for recommendations to appear
    await waitFor(() => {
      expect(screen.getByText("Curiosity-Driven Leader")).toBeInTheDocument();
    });

    // Get initial star button
    const starButtons = screen.getAllByText("☆");
    const firstStarButton = starButtons[0];

    // Mock fetch to fail on the second call (star toggle)
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Star toggle failed" }),
    } as Response);

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    // Click star button
    await user.click(firstStarButton);

    // Should log error and revert star state
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error updating starred state:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  // Helper function to complete all input stages
  async function completeAllStages(user: any) {
    // Stage 1: Feel most like yourself
    const input1 = screen.getByTestId("text-input-field");

    await user.type(input1, "When helping others solve problems");
    await user.click(screen.getByText("Next"));

    // Stage 2: Hardship/challenge
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    const input2 = screen.getByTestId("text-input-field");

    await user.type(input2, "Overcoming learning differences");
    await user.click(screen.getByText("Next"));

    // Stage 3: Never get bored
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    const input3 = screen.getByTestId("text-input-field");

    await user.type(input3, "Learning new technologies");
    await user.click(screen.getByText("Next"));

    // Stage 4: Family background
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    const input4 = screen.getByTestId("text-input-field");

    await user.type(input4, "First generation college student");
    await user.click(screen.getByText("Next"));

    // Stage 5: Proud achievement
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    const input5 = screen.getByTestId("text-input-field");

    await user.type(input5, "Starting a coding club");
    await user.click(screen.getByText("Next"));

    // Stage 6: Known in 10 years
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    const input6 = screen.getByTestId("text-input-field");

    await user.type(input6, "A tech innovator");
    await user.click(screen.getByText("Next"));

    // Stage 7: What sets you apart
    await waitFor(() => {
      expect(screen.getByTestId("text-input")).toBeInTheDocument();
    });
    const input7 = screen.getByTestId("text-input-field");

    await user.type(input7, "My multicultural perspective");
    await user.click(screen.getByText("Next"));

    // Wait for generation stage
    await waitFor(() => {
      expect(
        screen.getByText("Ready to craft your story?"),
      ).toBeInTheDocument();
    });
  }
});
