# Story Strategist Page Testing Documentation

## Test Overview

This document describes the comprehensive testing setup for the Story Strategist page component, which helps students craft compelling college application stories by exploring their personal experiences, values, and unique perspectives.

## Key Differences from Other Page Tests

The Story Strategist page has **7 input stages** (the most of all flows) and focuses on personal narrative development rather than academic recommendations:

### Input Stages:
1. **Feel Most Like Yourself** - Identity and authentic moments
2. **Hardship/Challenge** - Resilience and growth experiences
3. **Never Get Bored** - Passions and sustained interests
4. **Family Background** - Cultural context and family influence
5. **Proud Achievement** - Accomplishments and impact
6. **Known in 10 Years** - Future aspirations and goals
7. **What Sets You Apart** - Unique perspectives and differentiators

## Test Structure

### Test File: `app/story_strategist/__tests__/page.test.tsx`

#### Component Mocks
All major dependencies are mocked to isolate the component under test:

- `ProductWelcome` - Displays welcome section for Story Strategist
- `PromptReq` - Handles AI story angle generation requests
- `TextInput` - Text input component for all 7 narrative stages
- `EditableCard` - Editable summary cards for completed story elements

#### Test Coverage (Expected: ~88-92% statement coverage)

### Core Functionality Tests

1. **renders the welcome section** ✅
   - Verifies the Story Strategist welcome component displays correctly
   - Checks for proper title: "Story Strategist"
   - Validates subtitle: "Share the pieces of your story that are most important to you."

2. **shows the first question initially** ✅
   - Ensures the component starts with identity question
   - Verifies correct question: "When do you feel most like yourself?"

3. **progresses through all 7 input stages** ✅
   - Tests the complete flow through all 7 personal story stages
   - Verifies stage transitions work correctly for narrative building
   - Simulates realistic student story development:
     - Identity: "When helping others solve problems"
     - Challenge: "Overcoming learning differences in school"
     - Passion: "Learning new technologies and coding"
     - Family: "First generation college student from immigrants"
     - Achievement: "Starting a coding club at my school"
     - Future: "A tech innovator who creates accessible tools"
     - Uniqueness: "My multicultural perspective and resilience"

4. **displays editable cards for previous inputs** ✅
   - Checks that completed stages show narrative summary cards
   - Verifies proper display of personal story elements

5. **allows editing previous inputs** ✅
   - Tests the edit functionality for refining story elements
   - Verifies returning to previous narrative stages works correctly
   - Ensures story data persistence when editing

### AI Generation Tests

6. **generates story recommendations** ✅
   - Tests the AI generation flow for college application story angles
   - Verifies story angle display with diverse narrative options:
     - "Curiosity-Driven Leader"
     - "Empathetic Innovator"
     - "Cultural Bridge-Builder"
   - Checks for proper story angle structure and summaries

7. **saves data to database when generation is complete** ✅
   - Verifies API calls are made to `/api/db/postStoryStrategist` with story data
   - Tests database saving functionality for narrative content
   - Checks request body structure contains all personal story inputs

### Star/Favorites Tests

8. **toggles star states for recommendations** ✅
   - Tests starring/unstarring functionality for story angles
   - Verifies database updates for star changes
   - Checks UI state changes (☆ to ⭐) for narrative recommendations

### Error Handling Tests

9. **handles API errors gracefully** ✅
   - Tests error scenarios with failed API calls during story generation
   - Verifies error logging for story save operations
   - Ensures graceful degradation for narrative processing

10. **handles star toggle errors gracefully** ✅
    - Tests error scenarios specifically for story angle star operations
    - Verifies error logging for story angle favorites
    - Ensures state reversion on API failures

11. **handles invalid JSON response gracefully** ✅
    - Tests malformed story response handling
    - Verifies component displays error message for parsing failures
    - Shows raw response when story parsing fails

### Data Persistence & UI Tests

12. **displays recommendation cards with correct structure** ✅
    - Verifies proper story angle card layout and narrative content
    - Tests multiple story angle recommendations display
    - Checks for required narrative elements:
      - Story angle titles
      - Comprehensive story summaries
      - Actionable narrative guidance
    - Validates specific story content display

13. **maintains user input state when navigating between stages** ✅
    - Tests narrative data persistence across stage navigation
    - Verifies story input values are retained when editing
    - Ensures form state management works for complex narrative flows
    - Tests with realistic personal data

14. **displays proper stage progression labels** ✅
    - Tests that each stage shows the correct narrative question
    - Verifies proper progression through different story elements:
      - Stage 1: Identity/authentic self question
      - Stage 2: Challenge/hardship question
      - Stage 3: Passion/interest question

15. **shows multiple editable cards after completing several stages** ✅
    - Tests that multiple completed narrative stages show multiple summary cards
    - Verifies correct number of story element cards displayed
    - Ensures proper narrative summary display

16. **handles API network errors for story generation** ✅
    - Tests network failure scenarios during story processing
    - Verifies proper error handling for story generation requests
    - Ensures component stability during connection issues

17. **reverts star state on API failure** ✅
    - Tests star state reversion when database update fails
    - Verifies UI consistency when story favorite operations fail
    - Ensures local state matches server state after errors

## Test Data

### Mock Story Angle Recommendations
```json
[
  {
    "option1": {
      "title": "Curiosity-Driven Leader",
      "summary": "Connect your love for asking questions with your accomplishments in drama and sports. This unique intersection can create an engaging hook for your essays, illustrating how curiosity fuels your passion for leadership and innovation."
    }
  },
  {
    "option2": {
      "title": "Empathetic Innovator",
      "summary": "Use your values of helping others with your experience navigating challenges to showcase resilience and empathy in your personal statement. This connection emphasizes your desire to lead and innovate."
    }
  },
  {
    "option3": {
      "title": "Cultural Bridge-Builder",
      "summary": "Leverage your unique family background and multicultural perspective to highlight how you serve as a bridge between different communities and ideas, bringing diverse viewpoints to campus."
    }
  }
]
```

### Test Student Narrative Journey
The tests simulate a realistic first-generation college student's story development:

1. **Identity**: "When helping others solve problems"
2. **Challenge**: "Overcoming learning differences in school"
3. **Passion**: "Learning new technologies and coding"
4. **Family**: "First generation college student from immigrants"
5. **Achievement**: "Starting a coding club at my school"
6. **Future**: "A tech innovator who creates accessible tools"
7. **Uniqueness**: "My multicultural perspective and resilience"

This creates a cohesive narrative about resilience, innovation, and community impact.

## Helper Functions

### `completeAllStages(user)`
Comprehensive utility function that simulates completing all 7 narrative input stages with realistic, interconnected personal story data for a first-generation student passionate about technology and helping others.

## Running Tests

```bash
# Run Story Strategist tests specifically
npm test -- app/story_strategist/__tests__/page.test.tsx

# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

## Coverage Report

Expected coverage: **88-92%** statement coverage

### Typical Uncovered Lines
- Error handling edge cases in star toggle functionality
- Specific JSON parsing error paths
- Network error boundary conditions

## Key Test Features

1. **Complex Multi-Stage Flow Testing**: Most comprehensive testing of 7-stage narrative journey
2. **Personal Story State Management**: Tests complex narrative state across multiple personal stages
3. **Story API Integration**: Tests both story generation and star toggle API calls
4. **Narrative Error Scenarios**: Tests both generation and star toggle error handling
5. **Story Data Validation**: Verifies API calls with correct personal narrative payloads
6. **Personal UI State Testing**: Checks component state changes across narrative stages
7. **Authentic Story Experience**: Tests realistic personal story development interactions

## Comparison with Other Page Tests

| Feature | Major Mentor | School Match | **Story Strategist** |
|---------|--------------|--------------|---------------------|
| **Input Stages** | 3 stages | 5 stages | **7 stages** |
| **Test Count** | 12 tests | 15 tests | **17 tests** |
| **Expected Coverage** | 87.75% | 90.74% | **88-92%** |
| **API Endpoint** | `/api/db/postMajorMentor` | `/api/db/postSchoolMatch` | `/api/db/postStoryStrategist` |
| **Focus Area** | Academic majors | College matching | **Personal narratives** |
| **Unique Tests** | Factor selection | Stage progression | **Network errors, star reversion** |
| **Error Tests** | General API | Separate star toggle | **Network + star reversion** |
| **Complexity** | Medium | High | **Highest** |

## Story-Specific Test Features

1. **Narrative Coherence Testing**: Ensures story elements build upon each other
2. **Personal Data Handling**: Tests sensitive personal information processing
3. **Identity-Based Flow**: Tests progression through identity, challenge, passion, family, achievement, future, and uniqueness
4. **Multicultural Perspective Testing**: Includes diverse family backgrounds and experiences
5. **First-Generation Student Simulation**: Tests realistic first-gen college applicant journey
6. **Story Angle Diversity**: Tests multiple narrative approach recommendations
7. **Personal Growth Tracking**: Tests progression from challenge to achievement to future aspirations

## Best Practices Implemented

1. **Component Isolation**: All dependencies properly mocked for narrative testing
2. **Realistic Personal Data**: Uses authentic personal story elements and experiences
3. **Comprehensive Narrative Flow Testing**: Tests complete 7-stage personal story journey
4. **Error Scenario Coverage**: Tests both story generation and favorites failures
5. **Complex State Management Testing**: Verifies intricate multi-stage personal narrative state
6. **User-Centric Story Testing**: Uses user-event for realistic personal story interactions
7. **Story API Validation**: Verifies correct payloads for personal narrative data
8. **Identity-Sensitive Testing**: Handles personal, family, and cultural information appropriately

The Story Strategist test suite provides the most comprehensive coverage of all flows, with the highest complexity for personal narrative development, ensuring robust validation of the college application story crafting system! 📖✨

## Story Development Focus Areas

- **Identity Exploration**: Tests authentic self-discovery questions
- **Resilience Narratives**: Covers challenge and growth story elements
- **Passion Discovery**: Tests sustained interest and engagement stories
- **Cultural Context**: Includes family background and multicultural perspectives
- **Achievement Framing**: Tests accomplishment presentation and impact
- **Future Visioning**: Covers aspirational and goal-oriented narratives
- **Uniqueness Articulation**: Tests differentiation and special perspective stories

This ensures students can craft compelling, authentic, and strategically effective college application narratives! 🎯
