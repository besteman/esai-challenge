# History Page Tests

This directory contains comprehensive tests for the History page (`/app/history/page.tsx`).

## Test Overview

The test suite covers the complete functionality of the History page with **22 test cases** and **97.89% coverage**.

## Test Structure

### Initial Render Tests (3 tests)
- Main heading rendering
- Tab component rendering (My Saved Stuff & Session History)
- Dropdown and initial state display

### Data Fetching Tests (12 tests)

#### Favorites Flow (1 test)
- Fetches and displays starred items from all types
- Shows correct type labels (Major Mentor, School Match, Story Strategist)
- Displays star emojis for favorited items

#### Major Mentor Flow (1 test)
- Fetches and displays major mentor recommendations
- Shows starred/unstarred states with appropriate emoji
- Displays proper field labels and content

#### School Match Flow (1 test)
- Fetches and displays college recommendations
- Shows college-specific field labels
- Handles starred states correctly

#### Story Strategist Flow (1 test)
- Fetches and displays story strategy recommendations
- Shows title and summary content
- Handles starred states correctly

#### Empty States (4 tests)
- Displays appropriate empty state messages for each data type
- Shows helpful text when no data is available

#### Loading States (2 tests)
- Shows loading indicators during data fetch
- Shows session history loading state

#### Error Handling (2 tests)
- API error handling with console error logging
- Network error handling with proper error catching

### Session History Tests (4 tests)
- Initial load button display
- Session history data fetching and display
- Date formatting (MM/DD/YYYY HH:MM AM/PM format)
- Session ID truncation display
- Loading state management
- Error handling for session history

### UI State Management Tests (3 tests)
- Dropdown button text updates when options are selected
- Section headings appear when options are selected
- Type label mapping for starred items

## Mock Strategy

### HeroUI Components
All HeroUI components are mocked with simple div/button equivalents that maintain the same data-testid attributes for reliable testing.

### Fetch API
Global fetch is mocked to simulate API responses with controlled data for predictable test outcomes.

### Console Methods
Console.error is mocked during error tests to verify proper error handling without polluting test output.

## Key Test Patterns

### API Response Testing
```javascript
mockFetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ success: true, data: mockData }),
} as Response);
```

### Error Testing
```javascript
const consoleSpy = jest.spyOn(console, "error").mockImplementation();
// ... test error condition
expect(consoleSpy).toHaveBeenCalledWith("Expected error message");
consoleSpy.mockRestore();
```

### Loading State Testing
```javascript
mockFetch.mockImplementationOnce(() =>
  new Promise((resolve) => setTimeout(() => resolve(response), 100))
);
```

## Coverage Report

- **Statements**: 97.89%
- **Branches**: 89.83%
- **Functions**: 100%
- **Lines**: 97.89%
- **Uncovered Lines**: 105, 147 (minor edge cases in error handling)

## Test Data

The tests use realistic mock data that mirrors the actual API response formats:

- **Starred Items**: Mixed types with proper type labeling
- **Major Mentor**: Academic majors with descriptions and reasoning
- **School Match**: Colleges with detailed descriptions
- **Story Strategist**: Personal narratives with summaries
- **Session History**: UUID-grouped sessions with timestamps

## Running Tests

```bash
# Run all history page tests
npm test app/history/__tests__/page.test.tsx

# Run with coverage
npm test -- --coverage app/history/__tests__/page.test.tsx

# Run in watch mode
npm test -- --watch app/history/__tests__/page.test.tsx
```

## Future Enhancements

Potential areas for additional test coverage:
- Keyboard navigation testing
- Accessibility testing with screen readers
- Performance testing for large datasets
- Integration testing with real API endpoints
- Visual regression testing for UI consistency
