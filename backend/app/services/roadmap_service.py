from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.crud.crud_roadmap import crud_roadmap
from app.schemas.roadmap import RoadmapCreate, RoadmapUpdate


def create_roadmap(db: Session, payload: RoadmapCreate):
    existing = crud_roadmap.get_by_slug(db, payload.slug)
    if existing:
        raise HTTPException(400, "Roadmap with this slug already exists")

    return crud_roadmap.create(db, payload)


def update_roadmap(db: Session, roadmap_id: int, payload: RoadmapUpdate):
    roadmap = crud_roadmap.get(db, roadmap_id)
    if not roadmap:
        raise HTTPException(404, "Roadmap not found")

    return crud_roadmap.update(db, roadmap, payload)


def delete_roadmap(db: Session, roadmap_id: int):
    roadmap = crud_roadmap.get(db, roadmap_id)
    if not roadmap:
        raise HTTPException(404, "Roadmap not found")

    crud_roadmap.soft_delete(db, roadmap)
