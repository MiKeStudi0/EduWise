from sqlalchemy.orm import Session
from app.models.user_role import UserRole
from app.db.seeds.base import exists

ROLES = [
    ("super_admin", "Platform owner"),
    ("admin", "Platform admin"),
    ("instructor", "Course creator"),
    ("student", "Learner"),
    ("moderator", "Community manager"),
    ("teaching_assistant", "Instructor helper"),
    ("content_reviewer", "Quality control"),
]

def seed_roles(db: Session):
    for name, desc in ROLES:
        if not exists(db, UserRole, name=name):
            db.add(UserRole(name=name, description=desc))
    db.commit()
