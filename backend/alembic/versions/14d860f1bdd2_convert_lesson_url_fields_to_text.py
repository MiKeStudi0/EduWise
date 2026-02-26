"""convert lesson url fields to TEXT

Revision ID: 14d860f1bdd2
Revises: b44e31ad6b2d
Create Date: 2026-02-26 21:06:52.624769

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '14d860f1bdd2'
down_revision: Union[str, None] = 'b44e31ad6b2d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "lessons",
        "title",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )
    op.alter_column(
        "lessons",
        "description",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )
    op.alter_column(
        "lessons",
        "image_banner_url",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )

    op.alter_column(
        "lessons",
        "video_url",
        existing_type=sa.String(length=255),
        type_=sa.Text()
    )

def downgrade():
    op.alter_column("lessons", "title", type_=sa.String(length=255))
    op.alter_column("lessons", "description", type_=sa.String(length=255))
    op.alter_column("lessons", "image_banner_url", type_=sa.String(length=255))
    op.alter_column("lessons", "video_url", type_=sa.String(length=255))