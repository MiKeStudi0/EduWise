"""convert topic and subtopic varchar fields to TEXT

Revision ID: b44e31ad6b2d
Revises: 0d449cce04ed
Create Date: 2026-02-26 21:03:01.648815

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b44e31ad6b2d'
down_revision: Union[str, None] = '0d449cce04ed'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "sub_topics", "slug",
        existing_type=sa.String(length=150),
        type_=sa.Text()
    )

    op.alter_column(
        "sub_topics", "title",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )

    op.alter_column(
        "sub_topics", "description",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )

    op.alter_column(
        "sub_topics", "image_banner_url",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )

    op.alter_column(
        "sub_topics", "video_url",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )


def downgrade() -> None:
    op.alter_column("sub_topics", "slug", type_=sa.String(length=150))
    op.alter_column("sub_topics", "title", type_=sa.String(length=255))
    op.alter_column("sub_topics", "description", type_=sa.String(length=255))
    op.alter_column("sub_topics", "image_banner_url", type_=sa.String(length=255))
    op.alter_column("sub_topics", "video_url", type_=sa.String(length=255))