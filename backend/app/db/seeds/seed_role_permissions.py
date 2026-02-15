from sqlalchemy.orm import Session
from app.models.user_role import UserRole
from app.models.permission import Permission

ROLE_PERMISSION_MAP = {
    "super_admin": "ALL",

    "admin": [
        # Users & roles
        "view_users",
        "update_users",
        "delete_users",
        "assign_role",
        "assign_permission",

        # Roadmaps
        "create_roadmap",
        "update_roadmap",
        "delete_roadmap",
        "publish_roadmap",

        # Courses
        "create_course",
        "update_course",
        "delete_course",
        "publish_course",
        "archive_course",

        # Platform
        "view_analytics",
        "manage_subscriptions",
    ],

    "instructor": [
        # Courses
        "create_course",
        "update_course",
        "publish_course",

        # Content
        "create_content",
        "update_content",
        "delete_content",
        "publish_content",

        # Roadmaps (optional)
        "view_roadmap",
    ],

    "teaching_assistant": [
        "update_course",
        "create_content",
        "update_content",
        "publish_content",
    ],

    "content_reviewer": [
        "view_course",
        "publish_content",
        "publish_course",
    ],

    "moderator": [
        "moderate_comments",
        "delete_comment",
        "ban_user",
    ],

    "student": [
        "view_course",
        "enroll_course",
        "view_progress",
        "create_comment",
    ],
}

def seed_role_permissions(db: Session):
    all_permissions = db.query(Permission).all()

    for role_name, perms in ROLE_PERMISSION_MAP.items():
        role = db.query(UserRole).filter_by(name=role_name).first()
        if not role:
            continue

        if perms == "ALL":
            role.permissions = all_permissions
        else:
            role.permissions = [
                p for p in all_permissions if p.name in perms
            ]

    db.commit()
