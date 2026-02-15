from sqlalchemy.orm import Session
from app.models.permission import Permission

DEFAULT_PERMISSIONS = [
    ("create_roadmap", "Create new roadmap"),
    ("update_roadmap", "Update existing roadmap"),
    ("delete_roadmap", "Delete roadmap"),
    ("publish_roadmap", "Publish roadmap"),
    ("view_users", "View users"),
    ("ban_user", "Ban users"),
    ("assign_role", "Assign roles"),
    ("review_content", "Review content"),
]

def seed_permissions(db: Session):
    for name, desc in DEFAULT_PERMISSIONS:
        exists = db.query(Permission).filter_by(name=name).first()
        if not exists:
            db.add(Permission(name=name, description=desc))
    db.commit()
