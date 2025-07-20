import subprocess

def run_migrations():
    try:
        print("📦 Running Alembic migrations...")
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        print("✅ Alembic migrations applied.")
    except subprocess.CalledProcessError as e:
        print("❌ Migration failed:", e)