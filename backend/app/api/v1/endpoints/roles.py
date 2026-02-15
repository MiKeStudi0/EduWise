from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, require_permissions
from app.schemas.role_permission import RolePermissionUpdate
from app.schemas.user_role import UserRoleResponse
# from app.services.role_permission_service import update_permissions_for_role
from app.services.role_permission_service import set_permissions_for_role

from app.models.user_role import UserRole
from app.schemas.user_role import UserRoleCreate
router = APIRouter()

@router.post("/", response_model=UserRoleResponse)
def create_role(role: UserRoleCreate, db: Session = Depends(get_db)):
    db_role = UserRole(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

@router.get("/", response_model=list[UserRoleResponse])
def list_roles(db: Session = Depends(get_db)):
    return db.query(UserRole).filter(UserRole.is_active == True).all()

@router.get("/{role_id}", response_model=UserRoleResponse)
def get_role(role_id: int, db: Session = Depends(get_db)):
    role = db.get(UserRole, role_id)
    if not role:
        raise HTTPException(404, "Role not found")
    return role

@router.put("/{role_id}", response_model=UserRoleResponse)
def update_role(role_id: int, payload: dict, db: Session = Depends(get_db)):
    role = db.get(UserRole, role_id)
    if not role:
        raise HTTPException(404, "Role not found")

    for k, v in payload.items():
        setattr(role, k, v)

    db.commit()
    db.refresh(role)
    return role

@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    role = db.get(UserRole, role_id)
    if not role:
        raise HTTPException(404, "Role not found")

    role.is_active = False
    db.commit()
    return {"message": "Role disabled"}
@router.put(
    "/{role_id}/permissions",
    response_model=UserRoleResponse,
    dependencies=[Depends(require_permissions("assign_permission"))],
)
def update_role_permissions(
    role_id: int,
    payload: RolePermissionUpdate,
    db: Session = Depends(get_db),
):
    try:
        return set_permissions_for_role(
            db, role_id, payload.permission_ids
        )
    except ValueError:
        raise HTTPException(404, "Role not found")