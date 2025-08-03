"""add date field to expenses

Revision ID: add_date_field
Revises: 0506f9d110c2
Create Date: 2024-01-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_date_field'
down_revision = '0506f9d110c2'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add date column to expenses table
    op.add_column('expenses', sa.Column('date', sa.DateTime(), nullable=True))

    # Set default value for existing records
    op.execute("UPDATE expenses SET date = created_at WHERE date IS NULL")

    # Make date column not nullable after setting default values
    op.alter_column('expenses', 'date', nullable=False)


def downgrade() -> None:
    # Remove date column
    op.drop_column('expenses', 'date')