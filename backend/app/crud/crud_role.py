from sqlalchemy.orm import Session
from app.models.user_role import UserRole

class CRUDRole:
    def get_by_name(self, db: Session, name: str):
        return db.query(UserRole).filter(UserRole.name == name).first()

    def create(self, db: Session, role: UserRole):
        db.add(role)
        db.commit()
        db.refresh(role)
        return role

crud_role = CRUDRole()
