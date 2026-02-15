from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password

class CRUDUser:
    def create(self, db: Session, *, email, username, password, role_id):
        user = User(
            email=email,
            username=username,
            hashed_password=hash_password(password),
            role_id=role_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_all(self, db: Session):
        return db.query(User).all()

crud_user = CRUDUser()
