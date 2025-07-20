from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import expense_routes
from db.database import engine, Base
from core.migrate import run_migrations

app = FastAPI(title="Expense Tracker API")

# CORS config for frontend to call backend APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"message": "pong"}

run_migrations()

app.include_router(expense_routes.router)