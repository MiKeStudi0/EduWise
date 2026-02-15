from sqlalchemy.orm import Session
from app.models.permission import Permission
from app.schemas.permission import PermissionCreate
from app.crud.crud_permission import crud_permission

def create_permission(db: Session, data: PermissionCreate):
    exists = crud_permission.get_by_name(db, data.name)
    if exists:
        return exists

    permission = Permission(**data.dict())
    return crud_permission.create(db, permission)
