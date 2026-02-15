from sqlalchemy.orm import Session
from app.models.user_role import UserRole
from app.models.permission import Permission

def get_permissions_for_role(db: Session, role_id: int) -> list[Permission]:
    role = db.get(UserRole, role_id)
    if not role:
        raise ValueError("Role not found")

    return role.permissions


def set_permissions_for_role(
    db: Session,
    role_id: int,
    permission_ids: list[int],
) -> UserRole:
    role = db.get(UserRole, role_id)
    if not role:
        raise ValueError("Role not found")

    permissions = (
        db.query(Permission)
        .filter(Permission.id.in_(permission_ids))
        .all()
    )

    role.permissions = permissions
    db.commit()
    db.refresh(role)

    return role
