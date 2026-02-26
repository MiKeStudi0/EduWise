"""convert topic text fields to TEXT

Revision ID: 0d449cce04ed
Revises: 9f8a1d2c4b77
Create Date: 2026-02-26 21:01:01.999265

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0d449cce04ed'
down_revision: Union[str, None] = '9f8a1d2c4b77'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # ---------- TOPICS ----------
    op.alter_column("topics", "slug",
        existing_type=sa.String(length=150),
        type_=sa.Text()
    )

    op.alter_column("topics", "title",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )

    op.alter_column("topics", "description",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )


def downgrade():
    op.alter_column("topics", "slug",
        existing_type=sa.Text(),
        type_=sa.String(length=150)
    )

    op.alter_column("topics", "title",
        existing_type=sa.Text(),
        type_=sa.String(length=255)
    )

    op.alter_column("topics", "description",
        existing_type=sa.Text(),
        type_=sa.String(length=255)
    )
