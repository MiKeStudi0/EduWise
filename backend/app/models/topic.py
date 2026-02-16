from sqlalchemy import String, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.base_mixins import TimestampMixin, OrderableMixin, ActiveMixin

class Topic(Base, TimestampMixin, OrderableMixin, ActiveMixin):
    __tablename__ = "topics"

    id: Mapped[int] = mapped_column(primary_key=True)

    roadmap_id: Mapped[int] = mapped_column(ForeignKey("roadmaps.id", ondelete="CASCADE"))
    technology_id: Mapped[int] = mapped_column(ForeignKey("technologies.id", ondelete="CASCADE"))
    module_id: Mapped[int] = mapped_column(ForeignKey("modules.id", ondelete="CASCADE"))

    slug: Mapped[str] = mapped_column(String(150), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)

    examples: Mapped[list[dict] | None] = mapped_column(JSON)

    image_banner_url: Mapped[str | None] = mapped_column(String(255))
    images: Mapped[list[str] | None] = mapped_column(JSON)
    video_url: Mapped[str | None] = mapped_column(String(255))

    when_to_use: Mapped[list[str] | None] = mapped_column(JSON)
    when_to_avoid: Mapped[list[str] | None] = mapped_column(JSON)
    problems: Mapped[list[str] | None] = mapped_column(JSON)
    mental_models: Mapped[list[str] | None] = mapped_column(JSON)
    common_mistakes: Mapped[list[str] | None] = mapped_column(JSON)
    bonus_tips: Mapped[list[str] | None] = mapped_column(JSON)
    related_topics: Mapped[list[str] | None] = mapped_column(JSON)

    seo_id: Mapped[int | None] = mapped_column(
        ForeignKey("seo_metadata.id", ondelete="SET NULL")
    )

    module = relationship("Module", back_populates="topics")
