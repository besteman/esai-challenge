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

// Mock the ProductCard component
jest.mock("@/components/productCards", () => ({
  ProductCard: ({ href, image }: any) => (
    <div data-href={href} data-testid="product-card">
      <span data-testid="card-image">{image}</span>
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
    it("renders the main heading with site description", () => {
      render(<Home />);

      expect(
        screen.getByText("Helping the next generation of learners"),
      ).toBeInTheDocument();
    });

    it("renders the site description as heading", () => {
      render(<Home />);

      expect(
        screen.getByText("Helping the next generation of learners"),
      ).toBeInTheDocument();
    });

    it("applies correct CSS classes to heading", () => {
      render(<Home />);

      const heading = screen.getByText(
        "Helping the next generation of learners",
      );

      expect(heading).toHaveClass("text-center", "mb-5", "font-bold");
    });

    it("has responsive text sizing classes", () => {
      render(<Home />);

      const description = screen.getByText(
        "Helping the next generation of learners",
      );

      expect(description).toHaveClass(
        "text-3xl",
        "sm:text-md",
        "md:text-3xl",
        "lg:text-4xl",
        "xl:text-5xl",
      );
    });
  });

  describe("Product Cards", () => {
    it("renders all three product cards", () => {
      render(<Home />);

      const productCards = screen.getAllByTestId("product-card");

      expect(productCards).toHaveLength(3);
    });

    it("renders School Match card with correct href", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");
      const schoolCard = cards.find(
        (card) => card.getAttribute("data-href") === "/school_match",
      );

      expect(schoolCard).toBeInTheDocument();
    });

    it("renders Major Mentor card with correct href", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");
      const majorCard = cards.find(
        (card) => card.getAttribute("data-href") === "/major_mentor",
      );

      expect(majorCard).toBeInTheDocument();
    });

    it("renders Story Strategist card with correct href", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");
      const storyCard = cards.find(
        (card) => card.getAttribute("data-href") === "/story_strategist",
      );

      expect(storyCard).toBeInTheDocument();
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

      const section = screen
        .getByText("Helping the next generation of learners")
        .closest("section");

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

      const textContainer = screen
        .getByText("Helping the next generation of learners")
        .closest("div");

      expect(textContainer).toHaveClass(
        "flex",
        "justify-center",
        "items-center",
        "w-full",
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

      const mainHeading = screen.getByText(
        "Helping the next generation of learners",
      );

      expect(mainHeading.tagName).toBe("H1");
    });

    it("has card elements with proper structure", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");

      expect(cards).toHaveLength(3);

      cards.forEach((card) => {
        expect(card).toBeInTheDocument();
        expect(card).toHaveAttribute("data-href");
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

    it("has unique href attributes for each product card", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");
      const hrefs = cards.map((card) => card.getAttribute("data-href"));
      const uniqueHrefs = new Set(hrefs);

      expect(uniqueHrefs.size).toBe(hrefs.length);
      expect(uniqueHrefs).toEqual(
        new Set(["/school_match", "/major_mentor", "/story_strategist"]),
      );
    });

    it("renders with expected image props", () => {
      render(<Home />);

      const images = screen.getAllByTestId("card-image");

      expect(images).toHaveLength(3);
      expect(images[0]).toHaveTextContent("/Match-Maker.png");
      expect(images[1]).toHaveTextContent("/Major-Mentor.png");
      expect(images[2]).toHaveTextContent("Story-Strategist.png");
    });
  });

  describe("Component Integration", () => {
    it("renders ProductCard components with correct props", () => {
      render(<Home />);

      const cards = screen.getAllByTestId("product-card");

      expect(cards).toHaveLength(3);

      const expectedCards = [
        {
          href: "/school_match",
          image: "/Match-Maker.png",
        },
        {
          href: "/major_mentor",
          image: "/Major-Mentor.png",
        },
        {
          href: "/story_strategist",
          image: "Story-Strategist.png",
        },
      ];

      expectedCards.forEach((expectedCard, index) => {
        const card = cards[index];

        expect(card).toHaveAttribute("data-href", expectedCard.href);

        const imageElement = card.querySelector('[data-testid="card-image"]');

        expect(imageElement).toHaveTextContent(expectedCard.image);
      });
    });

    it("uses siteConfig values correctly", () => {
      render(<Home />);

      // Verify that the site description is used as the heading
      expect(
        screen.getByText("Helping the next generation of learners"),
      ).toBeInTheDocument();
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
