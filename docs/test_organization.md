# Test Organization

## Overview

This project uses Jest for testing. All tests are centrally located in the `__test__` directory at the root level of the project, mirroring the main application structure.

## Test Structure

The test directory structure mirrors the main application structure:

```
__test__/
├── app/                                # Tests for app/ routes and pages
│   ├── page.test.tsx                   # Tests for the main page
│   ├── history/                        # Tests for history page
│   ├── major_mentor/                   # Tests for major_mentor page
│   ├── school_match/                   # Tests for school_match page
│   ├── story_strategist/               # Tests for story_strategist page
│   └── api/                            # Tests for API routes
│       ├── completion/                 # Tests for completion API
│       └── db/                         # Tests for database API routes
│           ├── getAllStarred/          # Tests for getAllStarred endpoint
│           ├── getMajorMentor/         # Tests for getMajorMentor endpoint
│           ├── getSchoolMatch/         # Tests for getSchoolMatch endpoint
│           ├── getSessionHistory/      # Tests for getSessionHistory endpoint
│           ├── getStoryStrategist/     # Tests for getStoryStrategist endpoint
│           ├── postMajorMentor/        # Tests for postMajorMentor endpoint
│           ├── postSchoolMatch/        # Tests for postSchoolMatch endpoint
│           └── postStoryStrategist/    # Tests for postStoryStrategist endpoint
├── components/                         # Tests for components
│   └── question/                       # Tests for question components
├── lib/                                # Tests for lib utilities
└── types/                              # Tests for TypeScript types
```

## Running Tests

Tests can be run with the following commands:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Writing New Tests

When adding new tests, follow these guidelines:

1. Place tests in the appropriate subdirectory under `__test__/` that mirrors the application structure
2. Name test files with the `.test.ts` or `.test.tsx` extension
3. Follow existing patterns for mocking dependencies and testing functionality
4. Use descriptive test names that clearly explain what is being tested

For example, to add a test for a new component at `components/newComponent.tsx`, create a corresponding test file at `__test__/components/newComponent.test.tsx`.
