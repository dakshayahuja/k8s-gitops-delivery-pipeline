# Expense Tracker App

A modern expense tracking application built with FastAPI backend and React frontend, featuring dark theme support, comprehensive reports, and settings management.

## 🚀 Quick Start

### Using Docker (Production)
```bash
# Clone and start
git clone https://github.com/dakshayahuja/k8s-gitops-delivery-pipeline.git
cd expense-tracker-app

# Build and start containers
docker compose build --no-cache
docker compose up

# Access the application
# Frontend: http://localhost:80
# Backend API: http://localhost:8000
# Database: localhost:5432
```

### Development with Docker
```bash
# Build with no cache and start containers
docker compose -f docker-compose.dev.yaml build --no-cache && docker compose -f docker-compose.dev.yaml up

# Access the application
# Frontend: http://localhost:5173 (with hot reload)
# Backend API: http://localhost:8000 (with auto-reload)
# Database: localhost:5432
```

### Manual Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
cd app && uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## ✨ Features

### 🎨 **Dark Theme System**
- **Light/Dark Mode Toggle** with persistent preferences
- **Automatic Theme Application** on app load
- **Smooth Transitions** between themes
- **Tailwind CSS Dark Mode** with comprehensive styling

### 📊 **Advanced Reports & Analytics**
- **Summary Dashboard**: Total expenses, count, and average calculations
- **Category Breakdown**: Visual progress bars with percentages
- **Monthly Trends**: 6-month expense analysis with charts
- **Real-time Statistics**: Live updates as you add expenses

### ⚙️ **Settings Management**
- **Theme Selection**: Light/Dark mode preferences
- **Currency Options**: ₹, $, €, £ support
- **Notification Settings**: Toggle for future features
- **Language Preferences**: Ready for internationalization

### 💰 **Expense Management**
- **Add/Edit/Delete** expenses with full CRUD operations
- **Category Organization**: Food, Entertainment, Health, Utilities, Transport, Shopping, Other
- **Date Handling**: Proper date formatting with fallback support
- **Real-time Updates**: Immediate UI refresh after operations
- **Form Validation**: Client and server-side validation

### 📱 **User Experience**
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 🛠️ Tech Stack

### **Backend (FastAPI)**
- **FastAPI**: Modern Python web framework with automatic API docs
- **SQLAlchemy**: ORM for database operations
- **PostgreSQL**: Production-ready database
- **Alembic**: Database migrations and version control
- **Pydantic**: Data validation and serialization

### **Frontend (React)**
- **React 18**: Latest React with hooks and modern patterns
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS with dark mode support
- **Axios**: HTTP client for API communication

### **Database & DevOps**
- **PostgreSQL**: Reliable database with proper indexing
- **Docker**: Containerization for consistent environments
- **Docker Compose**: Multi-service orchestration

## 📚 API Endpoints

### **Core Expense Operations**
- `GET /api/expenses` - Retrieve all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update existing expense
- `DELETE /api/expenses/{id}` - Remove expense
- `POST /api/expenses/seed` - Generate sample data

### **Analytics & Reports**
- `GET /api/expenses/reports/summary` - Get summary statistics
- `GET /api/expenses/reports/categories` - Category breakdown
- `GET /api/expenses/reports/monthly` - Monthly trends

### **Settings Management**
- `GET /api/user-settings` - Retrieve current settings
- `PUT /api/user-settings` - Update user preferences
