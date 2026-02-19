from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.roadmap import Roadmap
from app.models.seo_metadata import SeoMetadata # Assuming this is where your model is
from app.schemas.roadmap import RoadmapCreate, RoadmapUpdate

def create_roadmap(db: Session, payload: RoadmapCreate):
    # 1. Check for duplicate slug
    existing = db.query(Roadmap).filter(Roadmap.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Roadmap with this slug already exists")

    # 2. Extract SEO data
    roadmap_data = payload.model_dump(exclude={"seo"})
    seo_data = payload.seo

    # 3. Create Roadmap Instance
    new_roadmap = Roadmap(**roadmap_data)

    # 4. Handle SEO Relationship
    if seo_data:
        # Create new SEO record and assign it to the relationship
        new_seo = SeoMetadata(**seo_data.model_dump())
        new_roadmap.seo = new_seo

    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)
    return new_roadmap

def update_roadmap(db: Session, roadmap_id: int, payload: RoadmapUpdate):
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    # 1. Separate generic fields and SEO fields
    update_data = payload.model_dump(exclude_unset=True)
    seo_data = update_data.pop("seo", None) # Remove 'seo' from main update dict

    # 2. Update basic Roadmap fields
    for key, value in update_data.items():
        setattr(roadmap, key, value)

    # 3. Update or Create SEO data
    if seo_data is not None:
        if roadmap.seo:
            # Update existing SEO record
            for k, v in seo_data.items():
                setattr(roadmap.seo, k, v)
        else:
            # Create new SEO record if it didn't exist
            new_seo = SeoMetadata(**seo_data)
            roadmap.seo = new_seo

    db.commit()
    db.refresh(roadmap)
    return roadmap


def delete_roadmap(db: Session, roadmap_id: int):
    roadmap = db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    roadmap.is_active = False
    db.commit()
