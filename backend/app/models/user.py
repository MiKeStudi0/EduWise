from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.base_mixins import TimestampMixin, ActiveMixin


class User(Base, TimestampMixin, ActiveMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True
    )
    username: Mapped[str] = mapped_column(
        String(50), unique=True, index=True
    )

    hashed_password: Mapped[str]

    role_id: Mapped[int] = mapped_column(
        ForeignKey("user_roles.id", ondelete="RESTRICT")
    )
    subscription_id: Mapped[int | None] = mapped_column(
        ForeignKey("subscriptions.id", ondelete="SET NULL"),
        nullable=True
    )

    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    role = relationship("UserRole", back_populates="users")
    profile = relationship(
        "UserProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
    subscription = relationship("Subscription", back_populates="users")

    def __repr__(self) -> str:
        return f"<User email={self.email}>"
