from sqlalchemy import Text, JSON, String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base
from app.models.base_mixins import TimestampMixin


class SeoMetadata(Base, TimestampMixin):
    __tablename__ = "seo_metadata"

    id: Mapped[int] = mapped_column(primary_key=True)

    # Core SEO
    meta_title: Mapped[str | None] = mapped_column(Text)
    meta_description: Mapped[str | None] = mapped_column(Text)
    keywords: Mapped[list[str] | None] = mapped_column(JSON)

    canonical_url: Mapped[str | None] = mapped_column(Text)
    robots: Mapped[str | None] = mapped_column(String(50))  # small enum → ok

    # Open Graph
    og_title: Mapped[str | None] = mapped_column(Text)
    og_description: Mapped[str | None] = mapped_column(Text)
    og_type: Mapped[str | None] = mapped_column(String(50))
    og_url: Mapped[str | None] = mapped_column(Text)
    og_site_name: Mapped[str | None] = mapped_column(Text)
    og_image_url: Mapped[str | None] = mapped_column(Text)
    og_image_width: Mapped[int | None]
    og_image_height: Mapped[int | None]
    og_image_alt: Mapped[str | None] = mapped_column(Text)

    # Twitter
    twitter_card: Mapped[str | None] = mapped_column(String(50))
    twitter_title: Mapped[str | None] = mapped_column(Text)
    twitter_description: Mapped[str | None] = mapped_column(Text)
    twitter_image: Mapped[str | None] = mapped_column(Text)