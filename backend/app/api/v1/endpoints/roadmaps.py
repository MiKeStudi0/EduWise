from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.roadmap import (
    RoadmapCreate,
    RoadmapUpdate,
    RoadmapResponse,
)
from app.services.roadmap_service import (
    create_roadmap,
    update_roadmap,
    delete_roadmap,
)
from app.crud.crud_roadmap import crud_roadmap

router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])


# CREATE
@router.post("/", response_model=RoadmapResponse)
def create(payload: RoadmapCreate, db: Session = Depends(get_db)):
    return create_roadmap(db, payload)


# READ ALL
@router.get("/", response_model=list[RoadmapResponse])
def list_all(db: Session = Depends(get_db)):
    return crud_roadmap.get_all(db)


# READ ONE (by slug – frontend friendly)
@router.get("/{slug}", response_model=RoadmapResponse)
def get_by_slug(slug: str, db: Session = Depends(get_db)):
    return crud_roadmap.get_by_slug(db, slug)


# UPDATE
@router.put("/{roadmap_id}", response_model=RoadmapResponse)
def update(
    roadmap_id: int,
    payload: RoadmapUpdate,
    db: Session = Depends(get_db),
):
    return update_roadmap(db, roadmap_id, payload)


# DELETE (soft)
@router.delete("/{roadmap_id}")
def delete(roadmap_id: int, db: Session = Depends(get_db)):
    delete_roadmap(db, roadmap_id)
    return {"message": "Roadmap deactivated"}
