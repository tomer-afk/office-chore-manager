# Office Chore Management App

A full-stack web application for managing and tracking recurring office chores with calendar views, team collaboration, and browser notifications.

## Features

- 📅 **Calendar Views**: Month, Week, Day, and List views for visualizing chores
- 🔄 **Recurring Chores**: Support for daily, weekly, monthly, and custom schedules
- 👥 **Team Management**: Add/remove team members and assign chores
- ✅ **Completion Tracking**: Mark chores as complete with history tracking
- 🔔 **Browser Notifications**: Get notified when chores are due or overdue
- 🎨 **Priority & Color Coding**: Visual organization with priority levels and custom colors
- 📝 **Detailed Notes**: Add descriptions and notes to each chore
- 📱 **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- node-cron (background jobs)

### Frontend
- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS
- react-big-calendar
- Zustand + React Query (state management)

## Project Structure

```
/Users/tomerrubinstein/Claude Project 1/
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── db/          # Database connection & migrations
│   │   ├── models/      # Database models
│   │   ├── middleware/  # Express middleware (auth, validation)
│   │   ├── routes/      # API route definitions
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── jobs/        # Cron jobs
│   │   └── utils/       # Utility functions
│   ├── .env             # Environment variables
│   └── package.json
│
├── frontend/            # React frontend (to be created)
│   └── ...
│
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+ (see installation options below)

### PostgreSQL Installation Options

#### Option 1: Homebrew (macOS)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Option 2: Docker
```bash
docker run -d \\
  --name chore-manager-db \\
  -e POSTGRES_PASSWORD=postgres \\
  -e POSTGRES_DB=chore_manager \\
  -p 5432:5432 \\
  postgres:15
```

#### Option 3: Cloud Service
Use a managed PostgreSQL service like:
- Supabase (https://supabase.com)
- Railway (https://railway.app)
- AWS RDS
- Heroku Postgres

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your database credentials
```

4. Create the database:
```bash
# If using local PostgreSQL
createdb chore_manager

# Or connect to psql and create it
psql -U postgres
CREATE DATABASE chore_manager;
\\q
```

5. Run database migrations:
```bash
npm run migrate:up
```

6. Start the development server:
```bash
npm run dev
```

The backend server will start on http://localhost:5000

### Testing the API

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Test user registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

## Database Schema

The application uses the following main tables:

- **users**: User accounts with authentication
- **teams**: Team/organization grouping
- **team_members**: User-to-team relationships
- **chores**: Main chore data (both templates and instances)
- **chore_completions**: Completion history tracking
- **notifications**: In-app notification history
- **notification_queue**: Pending browser notifications
- **user_notification_preferences**: Notification settings

### Recurring Chores Strategy

The app uses a hybrid approach:
- Recurring chores are stored as templates (`is_template=true`)
- When a recurring instance is completed, the next instance is automatically generated
- A daily cron job ensures no instances are missed
- Supports daily, weekly, monthly, and custom intervals

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token

### Teams (Coming Soon)
- `GET /api/teams` - List user's teams
- `POST /api/teams` - Create new team
- `GET /api/teams/:id/members` - List team members
- `POST /api/teams/:id/members` - Add team member

### Chores (Coming Soon)
- `GET /api/teams/:teamId/chores` - List chores with filters
- `POST /api/teams/:teamId/chores` - Create new chore
- `GET /api/chores/:id` - Get chore details
- `PUT /api/chores/:id` - Update chore
- `DELETE /api/chores/:id` - Delete chore
- `POST /api/chores/:id/complete` - Mark chore complete
- `GET /api/chores/:id/history` - Get completion history

### Notifications (Coming Soon)
- `GET /api/notifications/pending` - Get pending notifications
- `PUT /api/notifications/preferences` - Update notification settings

## Development

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run migrate:up   # Run database migrations
npm run migrate:down # Rollback last migration
```

## Next Steps

The following components still need to be built:

### Backend
- [ ] Team management endpoints and controllers
- [ ] Chore CRUD operations and controllers
- [ ] Recurring chore service implementation
- [ ] Notification system with cron jobs
- [ ] Calendar data aggregation service
- [ ] Input validation middleware
- [ ] Unit and integration tests

### Frontend
- [ ] Initialize React + TypeScript + Vite project
- [ ] Set up Tailwind CSS and routing
- [ ] Build UI component library
- [ ] Implement authentication UI
- [ ] Create calendar views with react-big-calendar
- [ ] Build chore management forms
- [ ] Implement team management UI
- [ ] Add browser notification integration
- [ ] Mobile responsive refinements

## Environment Variables

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/chore_manager
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chore_manager
DB_USER=postgres
DB_PASSWORD=postgres

# Authentication
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=different-secret-key-minimum-32-characters
REFRESH_TOKEN_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

## Security Considerations

- ✅ Passwords are hashed with bcrypt (10 rounds)
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ CORS configured to only allow frontend domain
- ✅ Helmet.js for security headers
- ✅ Rate limiting on API endpoints
- ✅ Parameterized queries to prevent SQL injection
- ✅ Secure and SameSite cookies in production

## License

MIT

## Contributing

This is a private project. For questions or issues, please contact the development team.
