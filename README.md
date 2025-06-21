# ESAI Awesomeness - College Application Assistant

> *Helping the next generation of learners*

A comprehensive Next.js web application that provides AI-powered recommendations for college applications, including major selection, school matching, and personal story development.

## 🎯 Overview

ESAI Awesomeness is a modern, full-stack college application assistant that leverages artificial intelligence to help students make informed decisions about their academic future. The platform provides three core recommendation engines:

- **🎓 Major Mentor**: AI-powered academic major recommendations based on interests and career goals
- **🏫 School Match**: Intelligent college matching using location preferences, academic profile, and personal criteria
- **📝 Story Strategist**: Personal narrative development assistance for compelling college application essays

## ✨ Features

### Core Recommendation Engines
- **Multi-stage Input Forms**: Intuitive step-by-step data collection
- **AI-Powered Analysis**: OpenAI integration for intelligent recommendations
- **Personalized Results**: Tailored suggestions based on user inputs
- **Star/Favorites System**: Save and organize preferred recommendations
- **Historical Data**: View and manage past recommendations

### Technical Features
- **Responsive Design**: Modern UI using HeroUI components
- **Real-time Processing**: Streaming AI responses
- **Database Persistence**: NeonDB for scalable data storage
- **Full API Coverage**: RESTful endpoints for all operations
- **Comprehensive Testing**: 198 tests with 95%+ coverage

## 🚀 Getting Started

### Prerequisites
- Node.js 18.3.1 or higher
- npm or yarn package manager
- NeonDB database instance
- OpenAI API access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd challenge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:
   ```env
   DATABASE_URL=your_neon_database_url
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Database Setup**
   - Create tables for: `major_mentor`, `school_match`, `story_strategist`, `session_history`
   - Each table should include fields for user inputs, AI outputs, and metadata

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 15.3.1 with App Router
- **UI Library**: HeroUI (modern React components)
- **Styling**: Tailwind CSS with custom themes
- **State Management**: React hooks and context
- **Animations**: Framer Motion

### Backend Stack
- **API Routes**: Next.js API routes with TypeScript
- **Database**: NeonDB (serverless PostgreSQL)
- **AI Integration**: OpenAI SDK with streaming support
- **Validation**: Zod for type-safe data validation

### Project Structure
```
app/
├── api/                    # API routes
│   ├── completion/        # AI completion endpoint
│   └── db/                # Database operations
│       ├── getAllStarred/     # Fetch starred items
│       ├── getMajorMentor/    # Major recommendations
│       ├── getSchoolMatch/    # School recommendations
│       ├── getStoryStrategist/ # Story recommendations
│       ├── getSessionHistory/ # Historical data
│       ├── postMajorMentor/   # Save major data
│       ├── postSchoolMatch/   # Save school data
│       └── postStoryStrategist/ # Save story data
├── major_mentor/          # Major recommendation flow
├── school_match/          # School matching flow
├── story_strategist/      # Story development flow
├── history/               # Data management interface
└── __tests__/             # Test suites
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server (uses SWC)
npm run dev:turbo    # Start development server with Turbopack (faster builds)
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint with auto-fix
npm run test         # Run Jest test suite

# Testing
npm test -- --watch # Run tests in watch mode
npm test -- --coverage # Run tests with coverage report
```

### Development Options

This project supports two development modes:

1. **Standard Development** (`npm run dev`):
   - Uses Next.js SWC compiler for fast builds
   - Compatible with all Next.js features including fonts
   - Recommended for most development

2. **Turbopack Development** (`npm run dev:turbo`):
   - Experimental faster build times and hot reloading
   - Cutting-edge Next.js bundler for enhanced performance
   - Use when you want maximum speed

### Testing Strategy

The project includes comprehensive testing with **198 tests** across **15 test suites**:

- **Frontend Tests**: Component rendering, user interactions, state management
- **API Tests**: Endpoint functionality, error handling, database integration
- **Database Tests**: Connection management, query execution, transaction handling

**Coverage Metrics:**
- Statement Coverage: 95.29%
- Branch Coverage: 90.32%
- Function Coverage: 87.5%

### Code Quality

- **ESLint**: Configured with Next.js, TypeScript, and React best practices
- **Prettier**: Consistent code formatting
- **TypeScript**: Full type safety across the application
- **Jest**: Unit and integration testing framework

## 📱 Usage

### Major Mentor Flow
1. Select favorite academic subject
2. Define future career plans
3. Choose important factors (salary, work-life balance, etc.)
4. Rate factor importance (1-5 scale)
5. Receive AI-generated major recommendations

### School Match Flow
1. Choose preferred location/region
2. Define location requirements (proximity to cities, etc.)
3. Specify future plans and goals
4. Describe ideal campus experience
5. Provide GPA and academic profile
6. Get personalized school recommendations

### Story Strategist Flow
1. **Identity**: Define personal identity and background
2. **Challenge**: Describe overcome challenges
3. **Passion**: Identify core interests and motivations
4. **Family**: Explain family influence and background
5. **Achievement**: Highlight significant accomplishments
6. **Future**: Outline goals and aspirations
7. **Uniqueness**: Articulate what makes you unique
8. Receive structured essay guidance and themes

## 🔌 API Reference

### Core Endpoints

#### AI Completion
```http
POST /api/completion
Content-Type: application/json

{
  "prompt": "string",
  "context": "major_mentor | school_match | story_strategist"
}
```

#### Data Retrieval
```http
GET /api/db/getMajorMentor?starred=true
GET /api/db/getSchoolMatch?starred=false
GET /api/db/getStoryStrategist
GET /api/db/getAllStarred
GET /api/db/getSessionHistory
```

#### Data Storage
```http
POST /api/db/postMajorMentor
POST /api/db/postSchoolMatch
POST /api/db/postStoryStrategist

Content-Type: application/json
{
  "outputGroup": "uuid",
  "starred": boolean,
  // ... specific fields per endpoint
}
```

### Response Format
```json
{
  "success": true,
  "data": [...],
  "count": number,
  "message": "Operation completed successfully"
}
```

## 🗄️ Database Schema

### Core Tables
- **major_mentor**: Academic major recommendations and user preferences
- **school_match**: College matching data and preferences
- **story_strategist**: Personal narrative development data
- **session_history**: Historical session tracking

### Common Fields
- `id`: Primary key (auto-increment)
- `output_group`: UUID for grouping related recommendations
- `starred`: Boolean for favorites functionality
- `created_at`: Timestamp for chronological ordering

## 🎨 Design System

### Theme Support
- Light/Dark mode with next-themes
- Custom color schemes via HeroUI theming
- Consistent component design language

### Key Components
- **ProductCard**: Feature showcase cards
- **Question Components**: Multi-stage form inputs
- **Editable Cards**: Result display and editing
- **Navigation**: Responsive navbar with theme switching

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm test app/api
npm test app/major_mentor

# Run with coverage
npm test -- --coverage
```

### Test Categories
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and database integration
- **User Journey Tests**: Complete workflow validation
- **Error Handling Tests**: Edge cases and failure scenarios

## 🚀 Deployment

### Environment Variables
```env
# Required
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Build Process
```bash
npm run build
npm run start
```

### Database Migration
Ensure your NeonDB instance has the required tables with proper schemas for each recommendation type.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Maintain consistent code formatting
- Update documentation as needed

## 📊 Performance

- **Fast Development**: Turbopack for rapid rebuilds
- **Optimized Build**: Next.js production optimizations
- **Efficient Testing**: 198 tests complete in ~6.8 seconds
- **Database**: Serverless NeonDB for scalable performance

## 🔒 Security

- Environment variable protection
- Input validation with Zod
- SQL injection prevention via parameterized queries
- Type-safe API endpoints

## 📄 License

This project is private and proprietary.

## 🙋 Support

For questions or issues:
1. Check the test documentation in `TEST_SUMMARY.md`
2. Review API endpoint tests for usage examples
3. Examine component tests for implementation patterns

---

**Built with ❤️ for the next generation of learners**
