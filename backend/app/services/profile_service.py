from sqlalchemy.orm import Session
from app.models.user_profile import UserProfile
from app.schemas.user_profile import UserProfileCreate
from app.crud.crud_user_profile import crud_user_profile

def create_profile(db: Session, user_id: int, profile: UserProfileCreate):
    db_profile = UserProfile(user_id=user_id, **profile.dict())
    return crud_user_profile.create(db, db_profile)
