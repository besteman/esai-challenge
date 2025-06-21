import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import Home from "@/app/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the site config
jest.mock("@/config/site", () => ({
  siteConfig: {
    name: "ESAI Awesomeness",
    description: "Helping the next generation of learners",
  },
}));

// Mock the primitives
jest.mock("@/components/primitives", () => ({
  title: jest.fn(() => "mock-title-class"),
  subtitle: jest.fn(() => "mock-subtitle-class"),
}));

// Mock the ProductCard component
jest.mock("@/components/productCards", () => ({
  ProductCard: ({ title, description, href }: any) => (
    <div data-href={href} data-testid="product-card">
      <h4 data-testid="card-title">{title}</h4>
      <p data-testid="card-description">{description}</p>
    </div>
  ),
}));

describe("Home Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      pathname: "/",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Render", () => {
    it("renders the main heading with site name", () => {
      render(<Home />);

      expect(screen.getByText("ESAI Awesomeness")).toBeInTheDocument();
    });

    it("renders the site description", () => {
      render(<Home />);

      expect(
        screen.getByText("Helping the next generation of learners"),
      ).toBeInTheDocument();
    });

    it("applies correct CSS classes to heading", () => {
      render(<Home />);

      const heading = screen.getByText("ESAI Awesomeness");

      expect(heading).toHaveClass("mock-title-class");
    });

    it("applies correct CSS classes to description", () => {
      render(<Home />);

      const description = screen.getByText(
        "Helping the next generation of learners",
      );

      expect(description).toHaveClass("mock-subtitle-class");
    });
  });

  describe("Product Cards", () => {
    it("renders all three product cards", () => {
      render(<Home />);

      const productCards = screen.getAllByTestId("product-card");

      expect(productCards).toHaveLength(3);
    });

    it("renders School Match Maker card with correct content", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");
      const schoolCard = cards.find(
        (card) => card.getAttribute("data-href") === "/school_match",
      );

      expect(schoolCard).toBeInTheDocument();
      expect(screen.getByText("School Match Maker")).toBeInTheDocument();
      expect(
        screen.getByText("Lets see where the sorting hat puts you."),
      ).toBeInTheDocument();
    });

    it("renders Major Mentor card with correct content", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");
      const majorCard = cards.find(
        (card) => card.getAttribute("data-href") === "/major_mentor",
      );

      expect(majorCard).toBeInTheDocument();
      expect(screen.getByText("Major Mentor")).toBeInTheDocument();
      expect(
        screen.getByText("What is your major? Lets find out together!"),
      ).toBeInTheDocument();
    });

    it("renders Story Strategist card with correct content", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");
      const storyCard = cards.find(
        (card) => card.getAttribute("data-href") === "/story_strategist",
      );

      expect(storyCard).toBeInTheDocument();
      expect(screen.getByText("Story Strategist")).toBeInTheDocument();
      expect(screen.getByText("What is your story?")).toBeInTheDocument();
    });

    it("has correct href attributes for navigation", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");

      expect(cards[0]).toHaveAttribute("data-href", "/school_match");
      expect(cards[1]).toHaveAttribute("data-href", "/major_mentor");
      expect(cards[2]).toHaveAttribute("data-href", "/story_strategist");
    });
  });

  describe("Layout and Structure", () => {
    it("has proper section structure with correct classes", () => {
      render(<Home />);

      const section = screen.getByText("ESAI Awesomeness").closest("section");

      expect(section).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "gap-4",
        "py-8",
        "md:py-10",
      );
    });

    it("has proper text container structure", () => {
      render(<Home />);

      const textContainer = screen.getByText("ESAI Awesomeness").closest("div");

      expect(textContainer).toHaveClass(
        "inline-block",
        "max-w-xl",
        "text-center",
        "justify-center",
      );
    });

    it("has proper cards container structure", () => {
      render(<Home />);

      // The cards container is the parent div that holds all product cards
      const cardsContainer =
        screen.getAllByTestId("product-card")[0].parentElement;

      expect(cardsContainer).toHaveClass(
        "flex",
        "flex-row",
        "gap-4",
        "justify-center",
        "items-start",
        "flex-wrap",
      );
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<Home />);

      const mainHeading = screen.getByText("ESAI Awesomeness");

      expect(mainHeading.tagName).toBe("H1");
    });

    it("has descriptive text for each product card", () => {
      render(<Home />);

      const cardTitles = screen.getAllByTestId("card-title");
      const cardDescriptions = screen.getAllByTestId("card-description");

      expect(cardTitles).toHaveLength(3);
      expect(cardDescriptions).toHaveLength(3);

      cardTitles.forEach((title) => {
        expect(title.textContent).toBeTruthy();
      });

      cardDescriptions.forEach((description) => {
        expect(description.textContent).toBeTruthy();
      });
    });
  });

  describe("Content Validation", () => {
    it("displays all expected navigation targets", () => {
      render(<Home />);

      const expectedRoutes = [
        "/school_match",
        "/major_mentor",
        "/story_strategist",
      ];
      const cards = screen.getAllByTestId("product-card");

      expectedRoutes.forEach((route) => {
        const cardWithRoute = cards.find(
          (card) => card.getAttribute("data-href") === route,
        );

        expect(cardWithRoute).toBeInTheDocument();
      });
    });

    it("has unique titles for each product card", () => {
      render(<Home />);

      const titles = screen
        .getAllByTestId("card-title")
        .map((el) => el.textContent);
      const uniqueTitles = new Set(titles);

      expect(uniqueTitles.size).toBe(titles.length);
      expect(uniqueTitles).toEqual(
        new Set(["School Match Maker", "Major Mentor", "Story Strategist"]),
      );
    });

    it("has unique descriptions for each product card", () => {
      render(<Home />);

      const descriptions = screen
        .getAllByTestId("card-description")
        .map((el) => el.textContent);
      const uniqueDescriptions = new Set(descriptions);

      expect(uniqueDescriptions.size).toBe(descriptions.length);
      expect(uniqueDescriptions).toEqual(
        new Set([
          "Lets see where the sorting hat puts you.",
          "What is your major? Lets find out together!",
          "What is your story?",
        ]),
      );
    });
  });

  describe("Component Integration", () => {
    it("calls title primitive function", () => {
      const { title } = require("@/components/primitives");

      render(<Home />);

      expect(title).toHaveBeenCalled();
    });

    it("calls subtitle primitive function", () => {
      const { subtitle } = require("@/components/primitives");

      render(<Home />);

      expect(subtitle).toHaveBeenCalled();
    });

    it("renders ProductCard components with correct props", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");

      expect(cards).toHaveLength(3);

      const expectedCards = [
        {
          title: "School Match Maker",
          description: "Lets see where the sorting hat puts you.",
          href: "/school_match",
        },
        {
          title: "Major Mentor",
          description: "What is your major? Lets find out together!",
          href: "/major_mentor",
        },
        {
          title: "Story Strategist",
          description: "What is your story?",
          href: "/story_strategist",
        },
      ];

      expectedCards.forEach((expectedCard, index) => {
        const card = cards[index];

        expect(card).toHaveAttribute("data-href", expectedCard.href);
        expect(screen.getByText(expectedCard.title)).toBeInTheDocument();
        expect(screen.getByText(expectedCard.description)).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("renders without crashing when config is missing", () => {
      expect(() => render(<Home />)).not.toThrow();
    });

    it("handles primitive function errors gracefully", () => {
      expect(() => render(<Home />)).not.toThrow();
    });
  });
});
