from sqlalchemy.orm import Session
from app.models.technology import Technology
from app.schemas.technology import TechnologyCreate, TechnologyUpdate


class CRUDTechnology:

    def create(self, db: Session, obj_in: TechnologyCreate) -> Technology:
        tech = Technology(**obj_in.model_dump())
        db.add(tech)
        db.commit()
        db.refresh(tech)
        return tech

    def get(self, db: Session, tech_id: int) -> Technology | None:
        return db.get(Technology, tech_id)

    def get_by_slug(
        self, db: Session, roadmap_id: int, slug: str
    ) -> Technology | None:
        return (
            db.query(Technology)
            .filter(
                Technology.roadmap_id == roadmap_id,
                Technology.slug == slug,
            )
            .first()
        )

    def get_by_roadmap(
        self, db: Session, roadmap_id: int, active_only: bool = True
    ):
        q = db.query(Technology).filter(
            Technology.roadmap_id == roadmap_id
        )
        if active_only:
            q = q.filter(Technology.is_active.is_(True))
        return q.order_by(Technology.order_index).all()

    def update(
        self,
        db: Session,
        db_obj: Technology,
        obj_in: TechnologyUpdate,
    ) -> Technology:
        for field, value in obj_in.model_dump(exclude_unset=True).items():
            setattr(db_obj, field, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def soft_delete(self, db: Session, db_obj: Technology):
        db_obj.is_active = False
        db.commit()


crud_technology = CRUDTechnology()
