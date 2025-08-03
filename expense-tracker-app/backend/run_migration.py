#!/usr/bin/env python3
"""
Script to run database migrations
"""
import subprocess
import sys
import os

def run_migration():
    try:
        # Change to the app directory
        os.chdir('app')

        # Run the migration
        result = subprocess.run(['alembic', 'upgrade', 'head'], capture_output=True, text=True)

        if result.returncode == 0:
            print("✅ Migration completed successfully!")
            print(result.stdout)
        else:
            print("❌ Migration failed!")
            print(result.stderr)
            sys.exit(1)

    except Exception as e:
        print(f"❌ Error running migration: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_migration()