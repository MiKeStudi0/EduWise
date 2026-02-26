from sqlalchemy import String, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base_mixins import TimestampMixin, OrderableMixin, ActiveMixin
from app.models.sub_topic import SubTopic


class Topic(Base, TimestampMixin, OrderableMixin, ActiveMixin):
    __tablename__ = "topics"

    # Primary key
    id: Mapped[int] = mapped_column(primary_key=True)

    # Relations
    roadmap_id: Mapped[int] = mapped_column(
        ForeignKey("roadmaps.id", ondelete="CASCADE")
    )
    technology_id: Mapped[int] = mapped_column(
        ForeignKey("technologies.id", ondelete="CASCADE")
    )
    module_id: Mapped[int] = mapped_column(
        ForeignKey("modules.id", ondelete="CASCADE")
    )

    # Basic info
    slug: Mapped[str] = mapped_column(Text, index=True)
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)

    # ⭐ MAIN RICH CONTENT (paragraphs, highlight, lists, tables, code)
    content: Mapped[list[dict] | None] = mapped_column(JSON)

    # Examples (structured)
    examples: Mapped[list[dict] | None] = mapped_column(JSON)

    # Media
    image_banner_url: Mapped[str | None] = mapped_column(Text)
    images: Mapped[list[str] | None] = mapped_column(JSON)
    video_url: Mapped[str | None] = mapped_column(Text)

    # Learning helper sections
    when_to_use: Mapped[list[dict] | None] = mapped_column(JSON)
    when_to_avoid: Mapped[list[dict] | None] = mapped_column(JSON)
    problems: Mapped[list[dict] | None] = mapped_column(JSON)
    mental_models: Mapped[list[dict] | None] = mapped_column(JSON)
    common_mistakes: Mapped[list[dict] | None] = mapped_column(JSON)
    bonus_tips: Mapped[list[dict] | None] = mapped_column(JSON)
    related_topics: Mapped[list[str] | None] = mapped_column(JSON)

    # SEO
    seo_id: Mapped[int | None] = mapped_column(
        ForeignKey("seo_metadata.id", ondelete="SET NULL")
    )

    # Relationships
    module = relationship("Module", back_populates="topics")

    sub_topics: Mapped[list["SubTopic"]] = relationship(
        "SubTopic",
        back_populates="topic",
        cascade="all, delete-orphan"
    )

    # JSON compatibility aliases (keep DB columns unchanged)
    @property
    def what_it_solves(self) -> list[dict] | None:
        return self.problems

    @what_it_solves.setter
    def what_it_solves(self, value: list[dict] | None) -> None:
        self.problems = value

    @property
    def conceptual_understanding(self) -> list[dict] | None:
        return self.mental_models

    @conceptual_understanding.setter
    def conceptual_understanding(self, value: list[dict] | None) -> None:
        self.mental_models = value
