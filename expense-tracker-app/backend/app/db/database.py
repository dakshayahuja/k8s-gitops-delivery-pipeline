import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set")

MAX_RETRIES = 10
WAIT_SECONDS = 2

for attempt in range(MAX_RETRIES):
    try:
        engine = create_engine(DATABASE_URL)
        engine.connect()  # test connection
        break
    except OperationalError:
        print(f"❌ DB not ready. Retrying in {WAIT_SECONDS} seconds...")
        time.sleep(WAIT_SECONDS)
else:
    raise Exception("❌ Could not connect to DB after retries")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()