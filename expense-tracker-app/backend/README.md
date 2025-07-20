# Expense Tracker API

This is a simple RESTful API for managing personal expenses.

# API Endpoints

### GET /expenses/
Fetch all expenses.

**Example:**
```bash
http GET http://localhost:8000/expenses/
```

---

### GET /expenses/{id}
Fetch a specific expense by ID.

**Example:**
```bash
http GET http://localhost:8000/expenses/1
```

---

### POST /expenses/
Create a new expense.

**Required fields:**
- `title` (string)
- `amount` (float)
- `category` (string)

**Example:**
```bash
http POST http://localhost:8000/expenses/ title="Udaipur trip" amount=100 category="Travel"
```

---

### PUT /expenses/{id}
Update an existing expense.

**Required fields:**
- `title` (string)
- `amount` (float)
- `category` (string)

**Example:**
```bash
http PUT http://localhost:8000/expenses/2 title="Mumbai Trip" amount=300 category="Travel"
```

---

### DELETE /expenses/{id}
Delete an expense by ID.

**Example:**
```bash
http DELETE http://localhost:8000/expenses/1
```

---
# Alembic Commands

To handle database migrations with Alembic:

### Create a new revision
```bash
alembic revision --autogenerate -m "your message"
```

### Apply migrations
```bash
alembic upgrade head
```

### Roll back the last migration
```bash
alembic downgrade -1
```

Ensure that the `DATABASE_URL` environment variable is set correctly before running these commands:

```bash
export DATABASE_URL=postgresql://postgres:devops123@localhost:5432/expenses
```