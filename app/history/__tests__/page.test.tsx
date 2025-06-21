import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import History from "@/app/history/page";

// Mock the HeroUI components
jest.mock("@heroui/tabs", () => ({
  Tabs: ({ children, ...props }: any) => (
    <div data-testid="tabs" {...props}>
      {children}
    </div>
  ),
  Tab: ({ children, title, ...props }: any) => (
    <div
      data-testid={`tab-${title.toLowerCase().replace(/\s+/g, "-")}`}
      {...props}
    >
      <button
        data-testid={`tab-button-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {title}
      </button>
      <div
        data-testid={`tab-content-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {children}
      </div>
    </div>
  ),
}));

jest.mock("@heroui/card", () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardBody: ({ children, ...props }: any) => (
    <div data-testid="card-body" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@heroui/dropdown", () => ({
  Dropdown: ({ children, ...props }: any) => (
    <div data-testid="dropdown" {...props}>
      {children}
    </div>
  ),
  DropdownTrigger: ({ children, ...props }: any) => (
    <div data-testid="dropdown-trigger" {...props}>
      {children}
    </div>
  ),
  DropdownMenu: ({ _children, onAction, ...props }: any) => (
    <div data-testid="dropdown-menu" {...props}>
      <button
        data-testid="dropdown-favorites"
        onClick={() => onAction("favorites")}
      >
        Favorites
      </button>
      <button
        data-testid="dropdown-major-mentor"
        onClick={() => onAction("major_mentor")}
      >
        Major Mentor
      </button>
      <button
        data-testid="dropdown-school-match"
        onClick={() => onAction("school_match")}
      >
        School Match Maker
      </button>
      <button
        data-testid="dropdown-story-strategist"
        onClick={() => onAction("story_strategist")}
      >
        Story Strategies
      </button>
    </div>
  ),
  DropdownItem: ({ children, ...props }: any) => (
    <div data-testid="dropdown-item" {...props}>
      {children}
    </div>
  ),
}));

jest.mock("@heroui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button data-testid="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe("History Page", () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the main heading", () => {
    render(<History />);

    expect(screen.getByText("History")).toBeInTheDocument();
  });

  it("renders tabs for My Saved Stuff and Session History", () => {
    render(<History />);

    expect(screen.getByTestId("tab-my-saved-stuff")).toBeInTheDocument();
    expect(screen.getByTestId("tab-session-history")).toBeInTheDocument();
    expect(screen.getByTestId("tab-button-my-saved-stuff")).toBeInTheDocument();
    expect(
      screen.getByTestId("tab-button-session-history"),
    ).toBeInTheDocument();
  });

  it("shows dropdown and initial message in My Saved Stuff tab", () => {
    render(<History />);

    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    expect(screen.getByText("Select an option")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select an option from the dropdown to view your saved items.",
      ),
    ).toBeInTheDocument();
  });

  it("fetches and displays favorites when selected", async () => {
    const mockStarredData = [
      {
        type: "major_mentor",
        id: 1,
        title: "Computer Science",
        description: "A field focused on algorithms and programming",
        why_recommendation: "Great for logical thinkers",
        created_at: "2024-01-01T10:00:00Z",
      },
      {
        type: "school_match",
        id: 2,
        title: "Stanford University",
        description: "Top-tier research university",
        why_recommendation: "Excellent for tech careers",
        created_at: "2024-01-02T15:30:00Z",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockStarredData }),
    } as Response);

    render(<History />);

    const favoritesOption = screen.getByTestId("dropdown-favorites");

    fireEvent.click(favoritesOption);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/db/getAllStarred");
    });

    await waitFor(() => {
      expect(screen.getByText("Computer Science")).toBeInTheDocument();
      expect(screen.getByText("Stanford University")).toBeInTheDocument();
      expect(screen.getAllByText("Major Mentor")).toHaveLength(2); // Button and type label
      expect(screen.getByText("School Match")).toBeInTheDocument();
      expect(screen.getAllByText("⭐")).toHaveLength(2);
    });
  });

  it("fetches and displays major mentor items when selected", async () => {
    const mockMajorMentorData = [
      {
        id: 1,
        major_title: "Engineering",
        description_of_major: "Applied sciences and mathematics",
        why_this_major: "Problem-solving oriented",
        starred: true,
        created_at: "2024-01-01T10:00:00Z",
      },
      {
        id: 2,
        major_title: "Psychology",
        description_of_major: "Study of human behavior",
        why_this_major: "Great for understanding people",
        starred: false,
        created_at: "2024-01-02T10:00:00Z",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockMajorMentorData }),
    } as Response);

    render(<History />);

    const majorMentorOption = screen.getByTestId("dropdown-major-mentor");

    fireEvent.click(majorMentorOption);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/db/getMajorMentor");
    });

    await waitFor(() => {
      expect(screen.getByText("Engineering")).toBeInTheDocument();
      expect(screen.getByText("Psychology")).toBeInTheDocument();
      expect(
        screen.getByText("Applied sciences and mathematics"),
      ).toBeInTheDocument();
      expect(screen.getByText("Problem-solving oriented")).toBeInTheDocument();
      expect(screen.getByText("⭐")).toBeInTheDocument();
      expect(screen.getByText("☆")).toBeInTheDocument();
    });
  });

  it("fetches and displays school match items when selected", async () => {
    const mockSchoolMatchData = [
      {
        id: 1,
        college_name: "MIT",
        description_of_college: "Leading technology institute",
        why_this_college: "Best for STEM fields",
        starred: true,
        created_at: "2024-01-01T10:00:00Z",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockSchoolMatchData }),
    } as Response);

    render(<History />);

    const schoolMatchOption = screen.getByTestId("dropdown-school-match");

    fireEvent.click(schoolMatchOption);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/db/getSchoolMatch");
    });

    await waitFor(() => {
      expect(screen.getByText("MIT")).toBeInTheDocument();
      expect(
        screen.getByText("Leading technology institute"),
      ).toBeInTheDocument();
      expect(screen.getByText("Best for STEM fields")).toBeInTheDocument();
      expect(screen.getByText("Description of College")).toBeInTheDocument();
      expect(screen.getByText("Why This College")).toBeInTheDocument();
    });
  });

  it("fetches and displays story strategist items when selected", async () => {
    const mockStoryStrategistData = [
      {
        id: 1,
        title: "Leadership Journey",
        summary: "Your path to becoming a strong leader through challenges",
        starred: true,
        created_at: "2024-01-01T10:00:00Z",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockStoryStrategistData }),
    } as Response);

    render(<History />);

    const storyStrategistOption = screen.getByTestId(
      "dropdown-story-strategist",
    );

    fireEvent.click(storyStrategistOption);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/db/getStoryStrategist");
    });

    await waitFor(() => {
      expect(screen.getByText("Leadership Journey")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Your path to becoming a strong leader through challenges",
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state while fetching data", async () => {
    // Mock a slow response
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ success: true, data: [] }),
            } as Response);
          }, 100);
        }),
    );

    render(<History />);

    const favoritesOption = screen.getByTestId("dropdown-favorites");

    fireEvent.click(favoritesOption);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    } as Response);

    render(<History />);

    const favoritesOption = screen.getByTestId("dropdown-favorites");

    fireEvent.click(favoritesOption);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch favorites data");
    });

    consoleSpy.mockRestore();
  });

  it("handles network errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<History />);

    const favoritesOption = screen.getByTestId("dropdown-favorites");

    fireEvent.click(favoritesOption);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching favorites data:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("shows empty state messages when no data is found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    render(<History />);

    const favoritesOption = screen.getByTestId("dropdown-favorites");

    fireEvent.click(favoritesOption);

    await waitFor(() => {
      expect(screen.getByText("No starred items found.")).toBeInTheDocument();
    });
  });

  it("shows empty state for major mentor when no data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    render(<History />);

    const majorMentorOption = screen.getByTestId("dropdown-major-mentor");

    fireEvent.click(majorMentorOption);

    await waitFor(() => {
      expect(
        screen.getByText("No major mentor recommendations found."),
      ).toBeInTheDocument();
    });
  });

  it("shows empty state for school match when no data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    render(<History />);

    const schoolMatchOption = screen.getByTestId("dropdown-school-match");

    fireEvent.click(schoolMatchOption);

    await waitFor(() => {
      expect(
        screen.getByText("No school match recommendations found."),
      ).toBeInTheDocument();
    });
  });

  it("shows empty state for story strategist when no data", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    render(<History />);

    const storyStrategistOption = screen.getByTestId(
      "dropdown-story-strategist",
    );

    fireEvent.click(storyStrategistOption);

    await waitFor(() => {
      expect(
        screen.getByText("No story strategist recommendations found."),
      ).toBeInTheDocument();
    });
  });

  it("fetches session history when button is clicked", async () => {
    const mockSessionHistoryData = [
      {
        output_group: "12345678-abcd-efgh-ijkl-123456789012",
        table_name: "major_mentor",
        display_name: "Major Mentor Session",
        display_title: "Computer Science Recommendation",
        display_description:
          "AI-generated major recommendation based on your interests",
        created_at: "2024-01-01T10:00:00Z",
      },
      {
        output_group: "87654321-dcba-hgfe-lkji-210987654321",
        table_name: "school_match",
        display_name: "School Match Session",
        display_title: "Stanford University",
        display_description: "College recommendation matching your criteria",
        created_at: "2024-01-02T15:30:00Z",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockSessionHistoryData }),
    } as Response);

    render(<History />);

    // Click on Session History tab content area to trigger
    const sessionHistoryTab = screen.getByTestId("tab-content-session-history");
    const loadButton = screen.getByText("Load Session History");

    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/db/getSessionHistory");
    });

    await waitFor(() => {
      expect(screen.getByText("Major Mentor Session")).toBeInTheDocument();
      expect(screen.getByText("School Match Session")).toBeInTheDocument();
      expect(
        screen.getByText("Computer Science Recommendation"),
      ).toBeInTheDocument();
      expect(screen.getByText("Stanford University")).toBeInTheDocument();
      expect(screen.getByText("Session ID: 12345678...")).toBeInTheDocument();
      expect(screen.getByText("Session ID: 87654321...")).toBeInTheDocument();
    });
  });

  it("shows loading state for session history", async () => {
    // Mock a slow response
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({ success: true, data: [] }),
            } as Response);
          }, 100);
        }),
    );

    render(<History />);

    const loadButton = screen.getByText("Load Session History");

    fireEvent.click(loadButton);

    expect(screen.getByText("Loading session history...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.queryByText("Loading session history..."),
      ).not.toBeInTheDocument();
    });
  });

  it("handles session history API errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    } as Response);

    render(<History />);

    const loadButton = screen.getByText("Load Session History");

    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch session history",
      );
    });

    consoleSpy.mockRestore();
  });

  it("handles session history network errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<History />);

    const loadButton = screen.getByText("Load Session History");

    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching session history:",
        expect.any(Error),
      );
    });

    consoleSpy.mockRestore();
  });

  it("formats dates correctly", async () => {
    const mockSessionHistoryData = [
      {
        output_group: "12345678-abcd-efgh-ijkl-123456789012",
        table_name: "major_mentor",
        display_name: "Test Session",
        display_title: "Test Title",
        display_description: "Test Description",
        created_at: "2024-06-15T14:30:00Z",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockSessionHistoryData }),
    } as Response);

    render(<History />);

    const loadButton = screen.getByText("Load Session History");

    fireEvent.click(loadButton);

    await waitFor(() => {
      // The exact format depends on timezone, but we can check for basic format
      expect(screen.getByText(/06\/15\/2024/)).toBeInTheDocument();
      expect(screen.getByText(/PM|AM/)).toBeInTheDocument();
    });
  });

  it("updates dropdown button text when option is selected", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    render(<History />);

    // Initially shows "Select an option"
    expect(screen.getByText("Select an option")).toBeInTheDocument();

    const favoritesOption = screen.getByTestId("dropdown-favorites");

    fireEvent.click(favoritesOption);

    await waitFor(() => {
      expect(screen.getAllByText("Favorites")).toHaveLength(3); // Button, dropdown item, and heading
      expect(screen.queryByText("Select an option")).not.toBeInTheDocument();
    });
  });

  it("shows section heading when option is selected", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    render(<History />);

    const majorMentorOption = screen.getByTestId("dropdown-major-mentor");

    fireEvent.click(majorMentorOption);

    await waitFor(() => {
      // Should show the section heading
      expect(screen.getAllByText("Major Mentor")).toHaveLength(3); // Button, dropdown item, and heading
    });
  });

  it("displays correct type labels for starred items", async () => {
    const mockStarredData = [
      {
        type: "story_strategist",
        id: 1,
        title: "Test Story",
        description: "Test description",
        why_recommendation: "Test recommendation",
        created_at: "2024-01-01T10:00:00Z",
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockStarredData }),
    } as Response);

    render(<History />);

    const favoritesOption = screen.getByTestId("dropdown-favorites");

    fireEvent.click(favoritesOption);

    await waitFor(() => {
      expect(screen.getByText("Story Strategist")).toBeInTheDocument();
    });
  });
});
