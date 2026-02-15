from sqlalchemy.orm import Session
from app.schemas.user import UserCreate
from app.crud.crud_user import crud_user

def register_user(db: Session, user: UserCreate):
    return crud_user.create_user(db, user)
