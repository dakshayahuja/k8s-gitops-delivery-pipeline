# Expense Tracker Backend

A FastAPI-based backend service for the Expense Tracker application with PostgreSQL database and Alembic migrations.

## 🛠️ Tech Stack

- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Production-ready database
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migrations
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://postgres:devops123@localhost:5432/expenses

# Run migrations
python run_migration.py

# Start server
uvicorn app.main:app --reload
```

### Using Docker
```bash
# Build and start
docker build -t expense-tracker-backend .
docker run -p 8000:8000 expense-tracker-backend

# Or using docker compose
docker compose up backend
```

## 📚 API Endpoints

### Expense Operations
```bash
# Get all expenses
GET /expenses

# Create expense
POST /expenses
{
    "title": "Groceries",
    "amount": 100.50,
    "category": "Food",
    "date": "2025-08-03T10:00:00"
}

# Get expense by ID
GET /expenses/{id}

# Update expense
PUT /expenses/{id}

# Delete expense
DELETE /expenses/{id}
```

### Reports & Analytics
```bash
# Category-wise report
GET /expenses/reports/categories

# Monthly trends
GET /expenses/reports/monthly?months=6

# Summary statistics
GET /expenses/reports/summary
```

### Settings & Utilities
```bash
# Get settings
GET /expenses/settings

# Update settings
PUT /expenses/settings

# Seed sample data
POST /expenses/seed

# Clear all data
DELETE /expenses/clear
```

## 🗃️ Database Management

### Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# Get migration history
alembic history
```

### Database Schema
```sql
Table: expenses
- id: Integer (Primary Key)
- title: String
- amount: Float
- category: String
- date: DateTime
- created_at: DateTime
- updated_at: DateTime
```

## 🔧 Configuration

### Environment Variables
```bash
# Required
DATABASE_URL=postgresql://postgres:devops123@localhost:5432/expenses

# Optional
DEBUG=True
```

### CORS Configuration
```python
# Currently allows all origins for development
allow_origins=["*"]
```

## 🧪 Testing

```bash
# Run tests
pytest

# Test coverage
pytest --cov=app
```

## 📁 Project Structure
```
backend/
├── app/
│   ├── api/
│   │   └── expense_routes.py
│   ├── crud/
│   │   └── expense_crud.py
│   ├── models/
│   │   └── expense_model.py
│   ├── schemas/
│   │   └── expense_schema.py
│   └── main.py
├── requirements.txt
└── Dockerfile
```