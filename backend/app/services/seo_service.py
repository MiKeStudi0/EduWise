from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.crud.crud_seo import crud_seo
from app.schemas.seo import SeoCreate, SeoUpdate


def create_seo(db: Session, payload: SeoCreate):
    return crud_seo.create(db, payload)


def update_seo(db: Session, seo_id: int, payload: SeoUpdate):
    seo = crud_seo.get(db, seo_id)
    if not seo:
        raise HTTPException(404, "SEO metadata not found")

    return crud_seo.update(db, seo, payload)


def delete_seo(db: Session, seo_id: int):
    seo = crud_seo.get(db, seo_id)
    if not seo:
        raise HTTPException(404, "SEO metadata not found")

    crud_seo.delete(db, seo)
