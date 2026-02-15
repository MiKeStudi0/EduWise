from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password
from app.schemas.user import UserCreate
from app.crud.base import CRUDBase

class CRUDUser(CRUDBase):
    def create_user(self, db: Session, user: UserCreate):
        db_user = User(
            email=user.email,
            username=user.username,
            hashed_password=hash_password(user.password)
        )
        return self.create(db, db_user)

crud_user = CRUDUser(User)
