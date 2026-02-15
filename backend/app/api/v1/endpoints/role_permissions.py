from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_permissions
from app.schemas.role_permission import (
    RolePermissionUpdate,
    RolePermissionResponse,
)
from app.services.role_permission_service import (
    get_permissions_for_role,
    set_permissions_for_role,
)

router = APIRouter()


# 🔹 Get permissions of a role (for checkbox UI)
@router.get(
    "/roles/{role_id}/permissions",
    response_model=RolePermissionResponse,
    dependencies=[Depends(require_permissions("assign_permission"))],
)
def list_role_permissions(
    role_id: int,
    db: Session = Depends(get_db),
):
    try:
        permissions = get_permissions_for_role(db, role_id)
        return {
            "role_id": role_id,
            "permission_ids": [p.id for p in permissions],
        }
    except ValueError:
        raise HTTPException(status_code=404, detail="Role not found")


# 🔹 Replace permissions of a role (checkbox save)
@router.put(
    "/roles/{role_id}/permissions",
    response_model=RolePermissionResponse,
    dependencies=[Depends(require_permissions("assign_permission"))],
)
def update_role_permissions(
    role_id: int,
    payload: RolePermissionUpdate,
    db: Session = Depends(get_db),
):
    try:
        role = set_permissions_for_role(
            db, role_id, payload.permission_ids
        )
        return {
            "role_id": role.id,
            "permission_ids": [p.id for p in role.permissions],
        }
    except ValueError:
        raise HTTPException(status_code=404, detail="Role not found")
