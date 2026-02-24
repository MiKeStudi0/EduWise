"""add content column to topic subtopic lesson

Revision ID: 3c2c3f01aa32
Revises: 245e7a2f23b8
Create Date: 2026-02-24 18:53:31.964894

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3c2c3f01aa32'
down_revision: Union[str, None] = '245e7a2f23b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    op.add_column("topics", sa.Column("content", sa.JSON(), nullable=True))
    op.add_column("sub_topics", sa.Column("content", sa.JSON(), nullable=True))
    op.add_column("lessons", sa.Column("content", sa.JSON(), nullable=True))


def downgrade():
    op.drop_column("lessons", "content")
    op.drop_column("sub_topics", "content")
    op.drop_column("topics", "content")