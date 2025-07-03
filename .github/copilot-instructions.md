## Overview

This is a TypeScript repository that hosts a Next.js application. The React framework is used for building the front-end, and the Next App Router is utilized for routing, server-side rendering, and API routes.

## Code Standards

Please follow these guidelines when contributing:

### Development Flow
- Install Dependencies: `npm install`

### Required Before Each Commit
- Verify no linting errors: `npm run lint`
- Verify tests pass: `npm run test`

## Repository Structure
- `__test__/`: All Next.js tests, written using Jest, with designed to run in the browser and some in the Node.js environment
- `docs/`: All documentation related to the project
- `public/`: Static assets served by Next.js, such as images and fonts
- `app/`: Main application code
  - `api/`: API routes for server-side logic
  - `components/`: Reusable React components
  - `lib/`: Utility functions and libraries
  - `service/`: Service layer for business logic and data fetching
  - `types/`: TypeScript type definitions

### Database
This app uses NeonDB for its database needs. NeonDB connection is found in the /lib/db.ts file.
The database schema is defined in the `schema.sql` file.

## Key Guidelines
1. Follow TypeScript best practices and idiomatic patterns.
2. Use Next.js features effectively, such as server-side rendering and static generation.
3. Use React hooks and functional components where appropriate, following the latest React standards.
3. Maintain existing code structure and organization.
4. Use dependency injection patterns where appropriate.
5. Write unit tests for new functionality.
6. Document public APIs and complex logic. Suggest changes to the `docs/` folder when appropriate.
