from sqlalchemy.orm import Session
from app.models.permission import Permission
from app.db.seeds.base import exists

PERMISSIONS = [
    "view_users",
    "update_users",
    "delete_users",
    "assign_role",
    "assign_permission",

    "create_course",
    "update_course",
    "delete_course",
    "publish_course",

    "moderate_comments",
]

def seed_permissions(db: Session):
    for name in PERMISSIONS:
        if not exists(db, Permission, name=name):
            db.add(Permission(name=name))
    db.commit()
