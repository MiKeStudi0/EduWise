from sqlalchemy.orm import Session
from app.models.module import Module
from app.schemas.module import ModuleCreate, ModuleUpdate


class CRUDModule:

    def create(self, db: Session, obj_in: ModuleCreate) -> Module:
        module = Module(**obj_in.model_dump())
        db.add(module)
        db.commit()
        db.refresh(module)
        return module

    def get(self, db: Session, module_id: int) -> Module | None:
        return db.get(Module, module_id)

    def get_by_slug(
        self,
        db: Session,
        technology_id: int,
        slug: str,
    ) -> Module | None:
        return (
            db.query(Module)
            .filter(
                Module.technology_id == technology_id,
                Module.slug == slug,
            )
            .first()
        )

    def get_by_technology(
        self,
        db: Session,
        technology_id: int,
        active_only: bool = True,
    ):
        q = db.query(Module).filter(
            Module.technology_id == technology_id
        )
        if active_only:
            q = q.filter(Module.is_active.is_(True))
        return q.order_by(Module.order_index).all()

    def update(
        self,
        db: Session,
        db_obj: Module,
        obj_in: ModuleUpdate,
    ) -> Module:
        for field, value in obj_in.model_dump(
            exclude_unset=True
        ).items():
            setattr(db_obj, field, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def soft_delete(self, db: Session, db_obj: Module):
        db_obj.is_active = False
        db.commit()


crud_module = CRUDModule()
