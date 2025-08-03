"""remove notifications column

Revision ID: remove_notifications
Revises: complete_schema
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'remove_notifications'
down_revision = 'complete_schema'
branch_labels = None
depends_on = None

def upgrade():
    # Remove notifications column from user_settings table
    op.drop_column('user_settings', 'notifications')

def downgrade():
    # Add notifications column back to user_settings table
    op.add_column('user_settings', sa.Column('notifications', sa.Boolean(), nullable=True, default=True)) 