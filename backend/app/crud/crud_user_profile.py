from sqlalchemy.orm import Session
from app.models.user_profile import UserProfile

class CRUDUserProfile:
    def create(self, db: Session, profile: UserProfile):
        db.add(profile)
        db.commit()
        db.refresh(profile)
        return profile

    def get_by_user_id(self, db: Session, user_id: int):
        return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

crud_user_profile = CRUDUserProfile()
