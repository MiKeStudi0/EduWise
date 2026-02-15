from sqlalchemy.orm import Session
from app.models.user import User
from app.models.user_role import UserRole
from app.core.security import hash_password
from app.db.seeds.base import exists

USERS = [
    ("superadmin@learnstak.com", "superadmin", "super_admin"),
    ("midhun@learnstak.com", "midhun", "super_admin"),
    ("aswaj@learnstak.com", "aswaj", "super_admin"),
    ("asim@learnstak.com", "asim", "super_admin"),
    ("admin@learnstak.com", "admin", "admin"),
    ("instructor@learnstak.com", "instructor", "instructor"),
    ("student@learnstak.com", "student", "student"),
    ("moderator@learnstak.com", "moderator", "moderator"),
]

DEFAULT_PASSWORD = "Learnstak@5515"

def seed_users(db: Session):
    for email, username, role_name in USERS:
        if exists(db, User, email=email):
            continue

        role = db.query(UserRole).filter_by(name=role_name).first()
        if not role:
            continue

        db.add(
            User(
                email=email,
                username=username,
                hashed_password=hash_password(DEFAULT_PASSWORD),
                role_id=role.id,
                is_active=True,
                is_verified=True,
            )
        )

    db.commit()
