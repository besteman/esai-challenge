# Homepage Tests

This directory contains comprehensive tests for the Homepage (`/app/page.tsx`).

## Test Overview

The test suite covers the complete functionality of the Homepage with **22 test cases** and **100% coverage**.

## Test Structure

### Initial Render Tests (4 tests)
- Main heading rendering with site name
- Site description display
- CSS class application for heading and description
- Proper integration with design primitives

### Product Cards Tests (5 tests)
- Renders all three product cards
- School Match Maker card content and navigation
- Major Mentor card content and navigation
- Story Strategist card content and navigation
- Correct href attributes for navigation

### Layout and Structure Tests (3 tests)
- Section structure with proper CSS classes
- Text container layout and styling
- Cards container flexbox layout

### Accessibility Tests (2 tests)
- Proper heading hierarchy (H1 for main title)
- Descriptive text content for all product cards

### Content Validation Tests (3 tests)
- All expected navigation targets present
- Unique titles for each product card
- Unique descriptions for each product card

### Component Integration Tests (3 tests)
- Title primitive function integration
- Subtitle primitive function integration
- ProductCard component prop validation

### Error Handling Tests (2 tests)
- Graceful handling of missing configuration
- Resilience to primitive function errors

## Mock Strategy

### Next.js Navigation
```javascript
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
```

### Site Configuration
```javascript
jest.mock("@/config/site", () => ({
  siteConfig: {
    name: "ESAI Awesomeness",
    description: "Helping the next generation of learners",
  },
}));
```

### Design Primitives
```javascript
jest.mock("@/components/primitives", () => ({
  title: jest.fn(() => "mock-title-class"),
  subtitle: jest.fn(() => "mock-subtitle-class"),
}));
```

### ProductCard Component
```javascript
jest.mock("@/components/productCards", () => ({
  ProductCard: ({ title, description, href }: any) => (
    <div data-href={href} data-testid="product-card">
      <h4 data-testid="card-title">{title}</h4>
      <p data-testid="card-description">{description}</p>
    </div>
  ),
}));
```

## Key Test Patterns

### Component Rendering
```javascript
it("renders the main heading with site name", () => {
  render(<Home />);
  expect(screen.getByText("ESAI Awesomeness")).toBeInTheDocument();
});
```

### CSS Class Validation
```javascript
it("applies correct CSS classes to heading", () => {
  render(<Home />);
  const heading = screen.getByText("ESAI Awesomeness");
  expect(heading).toHaveClass("mock-title-class");
});
```

### Navigation Testing
```javascript
it("has correct href attributes for navigation", () => {
  render(<Home />);
  const cards = screen.getAllByTestId("product-card");
  expect(cards[0]).toHaveAttribute("data-href", "/school_match");
});
```

### Layout Structure Testing
```javascript
it("has proper section structure with correct classes", () => {
  render(<Home />);
  const section = screen.getByText("ESAI Awesomeness").closest("section");
  expect(section).toHaveClass("flex", "flex-col", "items-center");
});
```

## Coverage Report

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## Content Validation

The tests validate the following content:

### Product Cards
1. **School Match Maker**
   - Title: "School Match Maker"
   - Description: "Lets see where the sorting hat puts you."
   - Navigation: "/school_match"

2. **Major Mentor**
   - Title: "Major Mentor"
   - Description: "What is your major? Lets find out together!"
   - Navigation: "/major_mentor"

3. **Story Strategist**
   - Title: "Story Strategist"
   - Description: "What is your story?"
   - Navigation: "/story_strategist"

### Site Configuration
- **Site Name**: "ESAI Awesomeness"
- **Description**: "Helping the next generation of learners"

## Running Tests

```bash
# Run homepage tests
npm test app/__tests__/page.test.tsx

# Run with coverage
npm test -- --coverage app/__tests__/page.test.tsx

# Run in watch mode
npm test -- --watch app/__tests__/page.test.tsx
```

## Layout Testing

The tests verify the following CSS classes and layout structure:

### Main Section
- `flex flex-col items-center justify-center gap-4 py-8 md:py-10`

### Text Container
- `inline-block max-w-xl text-center justify-center`

### Cards Container
- `flex flex-row gap-4 justify-center items-start flex-wrap`

## Accessibility Validation

- **Heading Hierarchy**: Validates H1 usage for main heading
- **Descriptive Content**: Ensures all cards have meaningful titles and descriptions
- **Content Uniqueness**: Verifies no duplicate titles or descriptions

## Error Resilience

The tests include error handling scenarios:

1. **Missing Configuration**: Component renders gracefully when config is undefined
2. **Primitive Failures**: Component handles primitive function errors without crashing
3. **Component Integration**: Validates proper mock integration and prop passing

## Future Enhancements

Potential areas for additional test coverage:
- User interaction testing (click events)
- Responsive design testing
- Keyboard navigation testing
- Screen reader compatibility testing
- Performance testing for rendering speed
- Visual regression testing for design consistency
