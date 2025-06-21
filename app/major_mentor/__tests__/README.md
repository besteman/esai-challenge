# Major Mentor Page Testing Documentation

## Test Overview

This document describes the comprehensive testing setup for the Major Mentor page component.

## Test Setup

### Dependencies Installed
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers for DOM testing
- `@testing-library/user-event` - User interaction simulation
- `jest` - JavaScript testing framework
- `jest-environment-jsdom` - DOM environment for Jest
- `babel-jest` - Babel transformer for Jest
- `@babel/preset-env` - Modern JavaScript support
- `@babel/preset-react` - React JSX support
- `@babel/preset-typescript` - TypeScript support

### Configuration Files

#### `jest.config.ts`
- Configured for `jsdom` test environment
- Set up module name mapping for path aliases (`@/`)
- Configured Babel transformation for TypeScript and React
- Setup file configuration for global mocks

#### `jest.setup.ts`
- Global mocks for `fetch`, `next/navigation`, `IntersectionObserver`, `ResizeObserver`
- Jest DOM matchers import

#### `babel.config.js`
- Babel presets for Node.js, React, and TypeScript
- Configured for Jest test environment

## Test Structure

### Test File: `app/major_mentor/__tests__/page.test.tsx`

#### Component Mocks
All major dependencies are mocked to isolate the component under test:

- `ProductWelcome` - Displays welcome section
- `PromptReq` - Handles AI generation requests
- `TextInput` - Text input component
- `FactorSelector` - Factor selection component
- `EditableCard` - Editable summary cards
- `FactorsCard` - Factors summary card

#### Test Coverage (87.75% statement coverage)

### Core Functionality Tests

1. **renders the welcome section** ✅
   - Verifies the welcome component displays correctly
   - Checks for proper title and subtitle text

2. **shows the first question (favorite subject) initially** ✅
   - Ensures the component starts with the first input stage
   - Verifies correct question text is displayed

3. **progresses through all input stages** ✅
   - Tests the complete flow through all 4 stages
   - Verifies stage transitions work correctly
   - Simulates user input at each stage

4. **displays editable cards for previous inputs** ✅
   - Checks that completed stages show summary cards
   - Verifies proper display of user input data

5. **allows editing previous inputs** ✅
   - Tests the edit functionality
   - Verifies returning to previous stages works
   - Ensures data persistence when editing

### AI Generation Tests

6. **generates major recommendations** ✅
   - Tests the AI generation flow
   - Verifies recommendation display
   - Checks for proper recommendation structure

7. **saves data to database when generation is complete** ✅
   - Verifies API calls are made with correct data
   - Tests database saving functionality
   - Checks request body structure

### Star/Favorites Tests

8. **toggles star states for recommendations** ✅
   - Tests starring/unstarring functionality
   - Verifies database updates for star changes
   - Checks UI state changes

### Error Handling Tests

9. **handles API errors gracefully** ✅
   - Tests error scenarios with failed API calls
   - Verifies error logging
   - Ensures graceful degradation

10. **handles invalid JSON response gracefully** ✅
    - Tests malformed response handling
    - Verifies error display (simplified test)

### Data Persistence Tests

11. **displays recommendation cards with correct structure** ✅
    - Verifies proper card layout and content
    - Tests multiple recommendations display
    - Checks for required UI elements

12. **maintains user input state when navigating between stages** ✅
    - Tests data persistence across stage navigation
    - Verifies input values are retained when editing
    - Ensures form state management works correctly

## Test Utilities

### Helper Functions

#### `completeAllStages(user)`
Utility function that simulates completing all input stages:
1. Enters favorite subject ("Mathematics")
2. Selects factors with importance ratings
3. Enters post-college plans ("Graduate school")
4. Reaches the generation stage

### Mock Data
- **Mock API Response**: Returns success with proper structure
- **Mock Generation Response**: Returns JSON with sample major recommendations
- **Mock User Inputs**: Provides realistic test data for all form fields

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- app/major_mentor/__tests__/page.test.tsx

# Run tests with coverage
npm test -- --coverage
```

## Coverage Report

Current coverage: **87.75%** statement coverage

### Uncovered Lines
- Line 120: Star toggle error handling edge case
- Lines 127-129: Error state reversion logic
- Lines 159-166: JSON parsing error display logic
- Line 323: Specific error handling path

## Best Practices Implemented

1. **Component Isolation**: All dependencies are mocked
2. **User-Centric Testing**: Uses user-event for realistic interactions
3. **Async Testing**: Proper handling of async operations with waitFor
4. **Error Scenarios**: Tests both happy path and error conditions
5. **Data Validation**: Verifies API calls and data structures
6. **UI State Testing**: Checks component state changes
7. **Accessibility**: Uses semantic queries where possible

## Future Enhancements

1. **Visual Regression Tests**: Add screenshot testing
2. **Integration Tests**: Test with actual API endpoints
3. **Performance Tests**: Add performance benchmarks
4. **Accessibility Tests**: Add a11y testing with jest-axe
5. **E2E Tests**: Add Playwright or Cypress tests for full flow
