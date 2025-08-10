# Expense Tracker Backend

A FastAPI backend for the Expense Tracker application with Google Sign-In authentication and PostgreSQL database.

## Features

- 🔐 Google Sign-In authentication with JWT tokens
- 💾 PostgreSQL database with SQLAlchemy ORM
- 👤 User-specific expense management
- ⚙️ User settings (theme, currency) storage
- 📊 Expense reports and analytics
- 🔄 Database migrations with Alembic

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/expense_tracker

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here

# JWT Configuration
JWT_SECRET=your-secret-key-here
```

### 3. Database Setup

1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE expense_tracker;
   ```
3. Run migrations:
   ```bash
   cd app
   python3 -m alembic upgrade head
   ```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Copy the Client ID and add it to your `.env` file

### 5. Run the Application

```bash
cd app
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/google` - Sign in with Google token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### User Settings
- `GET /api/user-settings` - Get user settings
- `PUT /api/user-settings` - Update user settings

### Expenses
- `GET /api/expenses` - Get user's expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `POST /api/expenses/seed` - Seed sample data

### Reports
- `GET /api/expenses/reports/categories` - Category report
- `GET /api/expenses/reports/monthly` - Monthly report
- `GET /api/expenses/reports/summary` - Summary statistics

## Database Schema

### Users Table
- `id` - Primary key
- `google_id` - Google user ID
- `email` - User email
- `name` - User name
- `picture` - Profile picture URL
- `created_at` - Account creation date
- `updated_at` - Last update date
- `is_active` - Account status

### User Settings Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `theme` - UI theme preference
- `currency` - Currency preference
- `notifications` - Notification settings

### Expenses Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `title` - Expense title
- `amount` - Expense amount
- `category` - Expense category
- `date` - Expense date
- `created_at` - Record creation date
- `updated_at` - Last update date

## Authentication Flow

1. Frontend sends Google ID token to `/auth/google`
2. Backend verifies token with Google
3. Backend creates/updates user record
4. Backend returns JWT token
5. Frontend uses JWT token for authenticated requests

## Security

- JWT tokens for session management
- Google token verification
- User data isolation
- CORS configuration for frontend
- Environment variable configuration

## Development

- FastAPI for API framework
- SQLAlchemy for ORM
- Alembic for migrations
- PostgreSQL for database
- PyJWT for token handling