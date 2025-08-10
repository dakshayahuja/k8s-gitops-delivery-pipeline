from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import expense_routes, auth_routes, user_settings_routes
from db.database import engine, Base
from core.migrate import run_migrations
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(title="Expense Tracker API")

# Add Prometheus instrumentation
Instrumentator().instrument(app).expose(app, endpoint="/metrics")

# CORS config for frontend to call backend APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://k8s.dakshayahuja.in"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/ping")
def ping():
    return {"message": "pong"}

run_migrations()

app.include_router(auth_routes.router, prefix="/api/auth")
app.include_router(user_settings_routes.router, prefix="/api/user-settings")
app.include_router(expense_routes.router, prefix="/api/expenses")
