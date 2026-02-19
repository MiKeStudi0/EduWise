from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.technology import (
    TechnologyCreate,
    TechnologyUpdate,
    TechnologyResponse,
)
from app.services.technology_service import (
    create_technology,
    update_technology,
    delete_technology,
)
from app.crud.crud_technology import crud_technology

router = APIRouter(prefix="/technologies", tags=["Technologies"])


# CREATE
@router.post("/", response_model=TechnologyResponse)
def create(payload: TechnologyCreate, db: Session = Depends(get_db)):
    return create_technology(db, payload)


# READ ALL (New endpoint)
@router.get(
    "/",
    response_model=list[TechnologyResponse],
)
def list_all(
    db: Session = Depends(get_db)
):
    return crud_technology.get_all(db)


# READ ALL (by roadmap)
@router.get(
    "/roadmap/{roadmap_id}",
    response_model=list[TechnologyResponse],
)
def list_by_roadmap(
    roadmap_id: int, db: Session = Depends(get_db)
):
    return crud_technology.get_by_roadmap(db, roadmap_id)


# READ ONE (slug-based)
@router.get(
    "/roadmap/{roadmap_id}/{slug}",
    response_model=TechnologyResponse,
)
def get_by_slug(
    roadmap_id: int,
    slug: str,
    db: Session = Depends(get_db),
):
    return crud_technology.get_by_slug(db, roadmap_id, slug)


# UPDATE
@router.put("/{tech_id}", response_model=TechnologyResponse)
def update(
    tech_id: int,
    payload: TechnologyUpdate,
    db: Session = Depends(get_db),
):
    return update_technology(db, tech_id, payload)


# DELETE (soft)
@router.delete("/{tech_id}")
def delete(tech_id: int, db: Session = Depends(get_db)):
    delete_technology(db, tech_id)
    return {"message": "Technology deactivated"}
