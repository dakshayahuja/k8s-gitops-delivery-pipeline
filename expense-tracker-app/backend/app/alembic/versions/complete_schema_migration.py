"""complete schema migration

Revision ID: complete_schema
Revises: 0506f9d110c2
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'complete_schema'
down_revision = '0506f9d110c2'
branch_labels = None
depends_on = None

def upgrade():
    # Add date field to expenses table
    op.add_column('expenses', sa.Column('date', sa.DateTime(), nullable=True))
    
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('google_id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('picture', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_google_id'), 'users', ['google_id'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Create user_settings table
    op.create_table('user_settings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('theme', sa.String(), nullable=True),
        sa.Column('currency', sa.String(), nullable=True),
        sa.Column('notifications', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Add user_id column to expenses table
    op.add_column('expenses', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'expenses', 'users', ['user_id'], ['id'])

def downgrade():
    # Remove foreign key from expenses
    op.drop_constraint(None, 'expenses', type_='foreignkey')
    op.drop_column('expenses', 'user_id')
    
    # Drop user_settings table
    op.drop_table('user_settings')
    
    # Drop users table
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_google_id'), table_name='users')
    op.drop_table('users')
    
    # Remove date column from expenses
    op.drop_column('expenses', 'date') 