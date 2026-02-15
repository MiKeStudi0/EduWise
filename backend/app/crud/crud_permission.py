from sqlalchemy.orm import Session
from app.models.permission import Permission

class CRUDPermission:
    def get_all(self, db: Session):
        return db.query(Permission).all()

    def get_by_name(self, db: Session, name: str):
        return db.query(Permission).filter(Permission.name == name).first()

    def create(self, db: Session, permission: Permission):
        db.add(permission)
        db.commit()
        db.refresh(permission)
        return permission

crud_permission = CRUDPermission()
