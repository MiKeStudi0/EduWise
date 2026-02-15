from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, require_permissions
from app.schemas.permission import PermissionCreate, PermissionResponse
from app.services.permission_service import create_permission
from app.crud.crud_permission import crud_permission

router = APIRouter()

@router.get("/", response_model=list[PermissionResponse])
def list_permissions(
    db: Session = Depends(get_db),
):
    return crud_permission.get_all(db)

@router.post(
    "/",
    response_model=PermissionResponse,
    dependencies=[Depends(require_permissions("assign_permission"))],
)
def add_permission(
    payload: PermissionCreate,
    db: Session = Depends(get_db),
):
    return create_permission(db, payload)
