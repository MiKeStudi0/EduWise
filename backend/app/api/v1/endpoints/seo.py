from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.seo import SeoCreate, SeoUpdate, SeoResponse
from app.services.seo_service import (
    create_seo,
    update_seo,
    delete_seo,
)
from app.crud.crud_seo import crud_seo

router = APIRouter(prefix="/seo", tags=["SEO"])


# CREATE
@router.post("/", response_model=SeoResponse)
def create(payload: SeoCreate, db: Session = Depends(get_db)):
    return create_seo(db, payload)


# READ
@router.get("/{seo_id}", response_model=SeoResponse)
def get(seo_id: int, db: Session = Depends(get_db)):
    return crud_seo.get(db, seo_id)


# UPDATE
@router.put("/{seo_id}", response_model=SeoResponse)
def update(
    seo_id: int,
    payload: SeoUpdate,
    db: Session = Depends(get_db),
):
    return update_seo(db, seo_id, payload)


# DELETE
@router.delete("/{seo_id}")
def delete(seo_id: int, db: Session = Depends(get_db)):
    delete_seo(db, seo_id)
    return {"message": "SEO metadata deleted"}
