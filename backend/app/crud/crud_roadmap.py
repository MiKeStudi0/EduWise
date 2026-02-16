from sqlalchemy.orm import Session
from app.models.roadmap import Roadmap
from app.schemas.roadmap import RoadmapCreate, RoadmapUpdate


class CRUDRoadmap:

    def create(self, db: Session, obj_in: RoadmapCreate) -> Roadmap:
        roadmap = Roadmap(**obj_in.model_dump())
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)
        return roadmap

    def get(self, db: Session, roadmap_id: int) -> Roadmap | None:
        return db.get(Roadmap, roadmap_id)

    def get_by_slug(self, db: Session, slug: str) -> Roadmap | None:
        return db.query(Roadmap).filter(Roadmap.slug == slug).first()

    def get_all(self, db: Session, active_only: bool = True):
        q = db.query(Roadmap)
        if active_only:
            q = q.filter(Roadmap.is_active.is_(True))
        return q.order_by(Roadmap.order_index).all()

    def update(
        self,
        db: Session,
        db_obj: Roadmap,
        obj_in: RoadmapUpdate
    ) -> Roadmap:
        for field, value in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, field, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def soft_delete(self, db: Session, db_obj: Roadmap):
        db_obj.is_active = False
        db.commit()


crud_roadmap = CRUDRoadmap()
