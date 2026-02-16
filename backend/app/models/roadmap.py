from sqlalchemy import String, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.base_mixins import TimestampMixin, OrderableMixin, ActiveMixin

class Roadmap(Base, TimestampMixin, OrderableMixin, ActiveMixin):
    __tablename__ = "roadmaps"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    slug_icon: Mapped[str | None] = mapped_column(String(255))
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)

    seo_id: Mapped[int | None] = mapped_column(
        ForeignKey("seo_metadata.id", ondelete="SET NULL")
    )

    seo = relationship("SeoMetadata")
    technologies = relationship("Technology", back_populates="roadmap")
