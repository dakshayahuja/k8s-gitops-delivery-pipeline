# 📚 API Documentation

## Overview

This document provides comprehensive documentation for the Expense Tracker API, showing all implemented endpoints, their functionality, and the overall API architecture.

## 🎯 API Status

The Expense Tracker API provides **complete expense management functionality** with automatic OpenAPI documentation generation. All documented endpoints are implemented and functional in production.

## 🌐 API Endpoints

### Base URL

| Environment | URL | Status |
|-------------|-----|--------|
| **Production** | `https://k8s.dakshayahuja.in/api` | ✅ Active |

### Complete Endpoint Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ping` | GET | Health check endpoint |
| `/api/metrics` | GET | Prometheus metrics |
| `/api/auth/google` | POST | Sign in with Google token |
| `/api/auth/me` | GET | Get current user info |
| `/api/auth/logout` | POST | Logout user |
| `/api/auth/proxy-image` | GET | Proxy external images |
| `/api/expenses/` | GET | List all expenses |
| `/api/expenses/` | POST | Create new expense |
| `/api/expenses/{id}` | GET | Get specific expense |
| `/api/expenses/{id}` | PUT | Update expense |
| `/api/expenses/{id}` | DELETE | Delete expense |
| `/api/expenses/seed` | POST | Seed sample data |
| `/api/expenses/settings` | GET | Get expense settings |
| `/api/expenses/reports/categories` | GET | Category breakdown |
| `/api/user-settings` | GET | Get user settings |
| `/api/user-settings` | PUT | Update user settings |

## 🔐 Authentication

### Authentication Method

- **Type**: JWT (JSON Web Token)
- **Header**: `Authorization: Bearer <token>`
- **Provider**: Google OAuth 2.0
- **Status**: ✅ Fully implemented

### Security Features

- **JWT Validation**: Active on all protected endpoints
- **OAuth Integration**: Google authentication working
- **Token Expiration**: Configurable token lifetime
- **User Isolation**: Data scoped to authenticated user

## 📊 API Features

### 1. Expense Management

#### CRUD Operations

| Feature | Status | Implementation |
|---------|--------|----------------|
| **Create** | ✅ Complete | POST `/api/expenses/` |
| **Read** | ✅ Complete | GET `/api/expenses/` and `/api/expenses/{id}` |
| **Update** | ✅ Complete | PUT `/api/expenses/{id}` |
| **Delete** | ✅ Complete | DELETE `/api/expenses/{id}` |

#### Data Model

```json
{
  "id": "integer",
  "title": "string (required)",
  "amount": "decimal (required)",
  "category": "string (from predefined list)",
  "date": "datetime (required)",
  "created_at": "datetime (auto-generated)"
}
```

#### Query Parameters

- **Pagination**: `skip` and `limit` parameters for expense listing
- **User Scoping**: All expenses are automatically scoped to authenticated user

### 2. Expense Categories

#### Available Categories

| Category | Subcategories |
|----------|---------------|
| **Food** | Groceries, Restaurant, Coffee, Lunch, Dinner, Snacks, Takeout |
| **Entertainment** | Movie Night, Netflix, Concert, Theme Park, Gaming, Books, Music |
| **Health** | Gym Membership, Medical Checkup, Pharmacy, Dental Visit, Vitamins, Fitness |
| **Utilities** | Internet Bill, Phone Bill, Electricity Bill, Water Bill, Gas Bill, Maintenance |
| **Transport** | Uber Ride, Gas Station, Bus Ticket, Train Pass, Car Maintenance, Parking, Taxi |
| **Shopping** | Clothing, Electronics, Home Decor, Books, Accessories, Beauty |
| **Other** | Miscellaneous, Office Supplies, Gift, Donation, Insurance, Taxes |

### 3. Reporting & Analytics

#### Available Reports

| Report Type | Endpoint | Description |
|-------------|----------|-------------|
| **Category Breakdown** | `/api/expenses/reports/categories` | Per-category totals and percentages |
| **Sample Data** | `/api/expenses/seed` | Generate sample expense data for testing |

### 4. User Settings

#### Available Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| **Theme** | String | "light" | UI theme preference |
| **Currency** | String | "₹" | Currency display preference |

### 5. Authentication & User Management

#### Authentication Endpoints

| Endpoint | Purpose | Request Body | Response |
|----------|---------|--------------|----------|
| `/api/auth/google` | Google Sign-In | `{"token": "google_token"}` | JWT token + user info |
| `/api/auth/me` | Get current user | None | User profile data |
| `/api/auth/logout` | Logout | None | Success message |

#### User Profile Data

```json
{
  "id": "integer",
  "email": "string",
  "name": "string",
  "picture": "string (optional)"
}
```

## 🔧 Technical Implementation

### Backend Technology

| Component | Technology | Version | Status |
|-----------|------------|---------|--------|
| **Framework** | FastAPI | Latest | ✅ Active |
| **Database** | PostgreSQL | 15 | ✅ Active |
| **ORM** | SQLAlchemy | Latest | ✅ Active |
| **Authentication** | JWT + OAuth | Latest | ✅ Active |
| **Documentation** | OpenAPI/Swagger | Latest | ✅ Active |
| **Monitoring** | Prometheus | Latest | ✅ Active |

### API Architecture

```
API Structure:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI       │    │   PostgreSQL    │
│   (React)       │◄──►│   Backend       │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • HTTP Requests │    │ • REST API      │    │ • User Data     │
│ • JWT Storage   │    │ • JWT Auth      │    │ • Expenses      │
│ • Error Handling│    │ • Validation    │    │ • Settings      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Database Schema

#### Tables

| Table | Purpose | Records | Status |
|-------|---------|---------|--------|
| **users** | User accounts | Active users | ✅ Active |
| **expenses** | Expense data | All expenses | ✅ Active |
| **user_settings** | User preferences | Per user | ✅ Active |

## 📱 API Usage Examples

### Authentication Flow

1. **Google Sign-In**:
   ```bash
   POST /api/auth/google
   Body: {"token": "google_oauth_token"}
   ```

2. **Use JWT Token**:
   ```bash
   GET /api/expenses/
   Headers: Authorization: Bearer <jwt_token>
   ```

### Expense Operations

1. **Create Expense**:
   ```bash
   POST /api/expenses/
   Body: {
     "title": "Lunch",
     "amount": 15.50,
     "category": "Food",
     "date": "2024-01-15T12:00:00Z"
   }
   ```

2. **Get Expenses**:
   ```bash
   GET /api/expenses/?skip=0&limit=10
   ```

3. **Update Expense**:
   ```bash
   PUT /api/expenses/123
   Body: {"amount": 18.00}
   ```

4. **Delete Expense**:
   ```bash
   DELETE /api/expenses/123
   ```

### User Settings

1. **Get Settings**:
   ```bash
   GET /api/user-settings
   ```

2. **Update Settings**:
   ```bash
   PUT /api/user-settings
   Body: {"theme": "dark", "currency": "$"}
   ```

## 🌐 CORS Configuration

The API is configured with CORS middleware to allow requests from:
- **Production**: `https://k8s.dakshayahuja.in`

## 📊 Monitoring

- **Health Check**: `/api/ping` for basic health monitoring
- **Metrics**: `/api/metrics` for Prometheus monitoring

## 📚 Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **JWT Authentication**: https://jwt.io/
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
