from sqlalchemy.orm import Session
from app.models.seo_metadata import SeoMetadata
from app.schemas.seo import SeoCreate, SeoUpdate


class CRUDSeo:

    def create(self, db: Session, obj_in: SeoCreate) -> SeoMetadata:
        seo = SeoMetadata(**obj_in.model_dump())
        db.add(seo)
        db.commit()
        db.refresh(seo)
        return seo

    def get(self, db: Session, seo_id: int) -> SeoMetadata | None:
        return db.get(SeoMetadata, seo_id)

    def update(
        self,
        db: Session,
        db_obj: SeoMetadata,
        obj_in: SeoUpdate,
    ) -> SeoMetadata:
        for field, value in obj_in.model_dump(
            exclude_unset=True
        ).items():
            setattr(db_obj, field, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, db_obj: SeoMetadata):
        db.delete(db_obj)
        db.commit()


crud_seo = CRUDSeo()
