from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.crud.crud_technology import crud_technology
from app.schemas.technology import TechnologyCreate, TechnologyUpdate


def create_technology(db: Session, payload: TechnologyCreate):
    existing = crud_technology.get_by_slug(
        db, payload.roadmap_id, payload.slug
    )
    if existing:
        raise HTTPException(
            400, "Technology with this slug already exists in roadmap"
        )

    return crud_technology.create(db, payload)


def update_technology(
    db: Session, tech_id: int, payload: TechnologyUpdate
):
    tech = crud_technology.get(db, tech_id)
    if not tech:
        raise HTTPException(404, "Technology not found")

    return crud_technology.update(db, tech, payload)


def delete_technology(db: Session, tech_id: int):
    tech = crud_technology.get(db, tech_id)
    if not tech:
        raise HTTPException(404, "Technology not found")

    crud_technology.soft_delete(db, tech)
