"""convert seo metadata fields to TEXT

Revision ID: 8cf676a39821
Revises: 14d860f1bdd2
Create Date: 2026-02-26 21:16:47.426239

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8cf676a39821'
down_revision: Union[str, None] = '14d860f1bdd2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    columns = [
        "meta_title",
        "canonical_url",
        "og_title",
        "og_url",
        "og_site_name",
        "og_image_url",
        "og_image_alt",
        "twitter_title",
        "twitter_image",
    ]

    for col in columns:
        op.alter_column(
            "seo_metadata",
            col,
            existing_type=sa.String(length=255),
            type_=sa.Text()
        )

def downgrade() -> None:
    pass
