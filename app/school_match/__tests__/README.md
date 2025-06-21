# School Match Page Testing Documentation

## Test Overview

This document describes the comprehensive testing setup for the School Match page component, which helps students find colleges based on their preferences and academic profile.

## Key Differences from Major Mentor Tests

The School Match page has **5 input stages** instead of 3, and uses different field types:

### Input Stages:
1. **Location** - State/country preference
2. **Location Requirements** - Specific location needs
3. **Future Plans** - Career/academic goals
4. **Ideal Campus Experience** - Campus preferences
5. **Unweighted GPA** - Academic profile

## Test Structure

### Test File: `app/school_match/__tests__/page.test.tsx`

#### Component Mocks
All major dependencies are mocked to isolate the component under test:

- `ProductWelcome` - Displays welcome section for School Match Maker
- `PromptReq` - Handles AI college recommendation requests
- `TextInput` - Text input component for all 5 stages
- `EditableCard` - Editable summary cards for completed stages

#### Test Coverage (90.74% statement coverage)

### Core Functionality Tests

1. **renders the welcome section** ✅
   - Verifies the School Match Maker welcome component displays correctly
   - Checks for proper title: "School Match Maker"
   - Validates subtitle: "Congrats on beginning the process of finding your dream school."

2. **shows the first question (location) initially** ✅
   - Ensures the component starts with location input
   - Verifies correct question: "If you live in the United States, what state do you live in?"

3. **progresses through all 5 input stages** ✅
   - Tests the complete flow through all 5 stages
   - Verifies stage transitions work correctly
   - Simulates realistic user input at each stage:
     - Location: "California"
     - Location Requirements: "Close to tech companies"
     - Future Plans: "Software engineering career"
     - Campus Experience: "Large campus with research opportunities"
     - GPA: "3.8"

4. **displays editable cards for previous inputs** ✅
   - Checks that completed stages show summary cards
   - Verifies proper display of user input data

5. **allows editing previous inputs** ✅
   - Tests the edit functionality for going back to previous stages
   - Verifies returning to previous stages works correctly
   - Ensures data persistence when editing

### AI Generation Tests

6. **generates college recommendations** ✅
   - Tests the AI generation flow for college recommendations
   - Verifies recommendation display with sample colleges:
     - "University of California, Los Angeles"
     - "Stanford University"
   - Checks for proper recommendation structure

7. **saves data to database when generation is complete** ✅
   - Verifies API calls are made to `/api/db/postSchoolMatch` with correct data
   - Tests database saving functionality
   - Checks request body structure contains user inputs

### Star/Favorites Tests

8. **toggles star states for recommendations** ✅
   - Tests starring/unstarring functionality for college recommendations
   - Verifies database updates for star changes
   - Checks UI state changes (☆ to ⭐)

### Error Handling Tests

9. **handles API errors gracefully** ✅
   - Tests error scenarios with failed API calls during generation
   - Verifies error logging for save operations
   - Ensures graceful degradation

10. **handles star toggle errors gracefully** ✅
    - Tests error scenarios specifically for star toggle operations
    - Verifies error logging for star updates
    - Ensures state reversion on API failures

11. **handles invalid JSON response gracefully** ✅
    - Tests malformed response handling (simplified test)
    - Verifies component doesn't crash on invalid data

### Data Persistence & UI Tests

12. **displays recommendation cards with correct structure** ✅
    - Verifies proper card layout and content
    - Tests multiple college recommendations display
    - Checks for required UI elements:
      - "Description of College" sections
      - "Why This College:" sections
    - Validates specific content display

13. **maintains user input state when navigating between stages** ✅
    - Tests data persistence across stage navigation
    - Verifies input values are retained when editing
    - Ensures form state management works correctly
    - Tests with realistic data: "Florida" location

14. **displays proper stage progression labels** ✅
    - Tests that each stage shows the correct question text
    - Verifies proper progression through different questions:
      - Stage 1: Location question
      - Stage 2: Location requirements question
      - Stage 3: Future plans question

15. **shows all editable cards after completing multiple stages** ✅
    - Tests that multiple completed stages show multiple editable cards
    - Verifies correct number of cards displayed (3 cards after 3 stages)
    - Ensures proper summary display

## Test Data

### Mock College Recommendations
```json
[
  {
    "option1": {
      "collegeName": "University of California, Los Angeles",
      "descriptionOfCollege": "A prestigious public research university in Los Angeles.",
      "whyThisCollege": "Perfect for your career goals and academic interests."
    }
  },
  {
    "option2": {
      "collegeName": "Stanford University",
      "descriptionOfCollege": "A leading private research university in California.",
      "whyThisCollege": "Excellent for technology and innovation-focused students."
    }
  }
]
```

### Test User Journey
The tests simulate a realistic student looking for tech-focused colleges in California:

1. **Location**: "California"
2. **Location Requirements**: "Close to tech companies"
3. **Future Plans**: "Software engineering career"
4. **Campus Experience**: "Large campus with research opportunities"
5. **GPA**: "3.8"

## Helper Functions

### `completeAllStages(user)`
Comprehensive utility function that simulates completing all 5 input stages with realistic data for a student interested in tech careers in California.

## Running Tests

```bash
# Run School Match tests specifically
npm test -- app/school_match/__tests__/page.test.tsx

# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

## Coverage Report

Current coverage: **90.74%** statement coverage

### Uncovered Lines
- Lines 127-148: Star toggle error handling edge cases
- Line 337: Specific error handling path

## Key Test Features

1. **Multi-Stage Flow Testing**: Comprehensive testing of 5-stage user journey
2. **State Management**: Tests complex state across multiple stages
3. **API Integration**: Tests both generation and star toggle API calls
4. **Error Scenarios**: Tests both generation and star toggle error handling
5. **Data Validation**: Verifies API calls with correct college-specific payloads
6. **UI State Testing**: Checks component state changes across stages
7. **User Experience**: Tests realistic user interactions and data persistence

## Comparison with Major Mentor Tests

| Feature | Major Mentor | School Match |
|---------|--------------|--------------|
| **Input Stages** | 3 stages | **5 stages** |
| **Test Count** | 12 tests | **15 tests** |
| **Coverage** | 87.75% | **90.74%** |
| **API Endpoint** | `/api/db/postMajorMentor` | `/api/db/postSchoolMatch` |
| **Unique Tests** | Factor selection | Stage progression labels, multiple cards |
| **Error Tests** | General API errors | **Separate star toggle errors** |

## Best Practices Implemented

1. **Component Isolation**: All dependencies properly mocked
2. **Realistic Data**: Uses actual college names and realistic user inputs
3. **Comprehensive Flow Testing**: Tests complete 5-stage user journey
4. **Error Scenario Coverage**: Tests both generation and star toggle failures
5. **State Management Testing**: Verifies complex multi-stage state handling
6. **User-Centric Testing**: Uses user-event for realistic interactions
7. **API Validation**: Verifies correct payloads for college-specific data

The School Match test suite provides even more comprehensive coverage than the Major Mentor tests, with additional stages and more complex user flows, ensuring robust validation of the college recommendation system! 🎯
