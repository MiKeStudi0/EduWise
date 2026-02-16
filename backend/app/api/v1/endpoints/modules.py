from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.module import (
    ModuleCreate,
    ModuleUpdate,
    ModuleResponse,
)
from app.services.module_service import (
    create_module,
    update_module,
    delete_module,
)
from app.crud.crud_module import crud_module

router = APIRouter(prefix="/modules", tags=["Modules"])


# CREATE
@router.post("/", response_model=ModuleResponse)
def create(payload: ModuleCreate, db: Session = Depends(get_db)):
    return create_module(db, payload)


# READ ALL (by technology)
@router.get(
    "/technology/{technology_id}",
    response_model=list[ModuleResponse],
)
def list_by_technology(
    technology_id: int,
    db: Session = Depends(get_db),
):
    return crud_module.get_by_technology(db, technology_id)


# READ ONE (slug-based)
@router.get(
    "/technology/{technology_id}/{slug}",
    response_model=ModuleResponse,
)
def get_by_slug(
    technology_id: int,
    slug: str,
    db: Session = Depends(get_db),
):
    return crud_module.get_by_slug(db, technology_id, slug)


# UPDATE
@router.put("/{module_id}", response_model=ModuleResponse)
def update(
    module_id: int,
    payload: ModuleUpdate,
    db: Session = Depends(get_db),
):
    return update_module(db, module_id, payload)


# DELETE (soft)
@router.delete("/{module_id}")
def delete(module_id: int, db: Session = Depends(get_db)):
    delete_module(db, module_id)
    return {"message": "Module deactivated"}
