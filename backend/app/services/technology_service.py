from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.technology import Technology
from app.models.seo_metadata import SeoMetadata
from app.schemas.technology import TechnologyCreate, TechnologyUpdate


def create_technology(db: Session, payload: TechnologyCreate):
    # 1. Check for duplicate slug within the specific roadmap
    existing = db.query(Technology).filter(
        Technology.roadmap_id == payload.roadmap_id,
        Technology.slug == payload.slug
    ).first()
    
    if existing:
        raise HTTPException(
            400, "Technology with this slug already exists in roadmap"
        )

    # 2. Extract SEO data
    tech_data = payload.model_dump(exclude={"seo"})
    seo_data = payload.seo

    # 3. Create Technology Instance
    new_tech = Technology(**tech_data)

    # 4. Handle SEO Relationship
    if seo_data:
        new_seo = SeoMetadata(**seo_data.model_dump())
        new_tech.seo = new_seo

    db.add(new_tech)
    db.commit()
    db.refresh(new_tech)
    return new_tech


def update_technology(db: Session, tech_id: int, payload: TechnologyUpdate):
    tech = db.query(Technology).filter(Technology.id == tech_id).first()
    if not tech:
        raise HTTPException(404, "Technology not found")

    # 1. Separate generic fields and SEO fields
    update_data = payload.model_dump(exclude_unset=True)
    seo_data = update_data.pop("seo", None)

    # 2. Update basic Technology fields
    for key, value in update_data.items():
        setattr(tech, key, value)

    # 3. Update or Create SEO data
    if seo_data is not None:
        if tech.seo:
            for k, v in seo_data.items():
                setattr(tech.seo, k, v)
        else:
            new_seo = SeoMetadata(**seo_data)
            tech.seo = new_seo

    db.commit()
    db.refresh(tech)
    return tech


def delete_technology(db: Session, tech_id: int):
    tech = db.query(Technology).filter(Technology.id == tech_id).first()
    if not tech:
        raise HTTPException(404, "Technology not found")

    tech.is_active = False
    db.commit()
