from sqlalchemy.orm import Session
from app.models.permission import Permission
from app.models.user_role import UserRole

class CRUDRolePermission:
    def update_role_permissions(
        self,
        db: Session,
        role: UserRole,
        permission_ids: list[int]
    ):
        role.permissions = (
            db.query(Permission)
            .filter(Permission.id.in_(permission_ids))
            .all()
        )
        db.commit()
        db.refresh(role)
        return role

crud_role_permission = CRUDRolePermission()
