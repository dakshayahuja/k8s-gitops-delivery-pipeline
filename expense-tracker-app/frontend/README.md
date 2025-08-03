# Expense Tracker Frontend

A modern React application for tracking personal expenses with Google Sign-In authentication.

## Features

- 🔐 Google Sign-In authentication
- 💰 Track expenses with categories
- 📊 Expense reports and analytics
- 🌙 Dark/Light theme support
- 💱 Multiple currency support
- 📱 Responsive design

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Google OAuth Configuration
# Get this from Google Cloud Console: https://console.cloud.google.com/
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your domain to the authorized origins (e.g., `http://localhost:5173`)
6. Copy the Client ID and add it to your `.env` file

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Backend Setup

Make sure the backend is running and the database is properly configured. The backend should be running on `http://localhost:8000` (or update the `VITE_API_URL` accordingly).

## Authentication Flow

1. Users click "Sign in with Google"
2. Google OAuth popup appears
3. User authenticates with Google
4. Backend verifies the Google token
5. Backend creates/updates user record
6. Backend returns JWT token
7. Frontend stores JWT token and uses it for API calls

## User Data

- All expenses are associated with the authenticated user
- User settings (theme, currency) are stored per user
- Data is isolated between users

## Development

- Built with React 18
- Uses Vite for fast development
- Tailwind CSS for styling
- Axios for API calls
