from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.crud.crud_module import crud_module
from app.schemas.module import ModuleCreate, ModuleUpdate


def create_module(db: Session, payload: ModuleCreate):
    existing = crud_module.get_by_slug(
        db, payload.technology_id, payload.slug
    )
    if existing:
        raise HTTPException(
            400,
            "Module with this slug already exists in this technology",
        )

    return crud_module.create(db, payload)


def update_module(
    db: Session, module_id: int, payload: ModuleUpdate
):
    module = crud_module.get(db, module_id)
    if not module:
        raise HTTPException(404, "Module not found")

    return crud_module.update(db, module, payload)


def delete_module(db: Session, module_id: int):
    module = crud_module.get(db, module_id)
    if not module:
        raise HTTPException(404, "Module not found")

    crud_module.soft_delete(db, module)
