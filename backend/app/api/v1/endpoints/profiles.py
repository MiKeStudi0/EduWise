from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.user_profile import UserProfile
from app.schemas.user_profile import UserProfileCreate, UserProfileResponse

router = APIRouter()

@router.post("/{user_id}", response_model=UserProfileResponse)
def create_profile(user_id: int, profile: UserProfileCreate, db: Session = Depends(get_db)):
    db_profile = UserProfile(user_id=user_id, **profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@router.get("/{user_id}", response_model=UserProfileResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")
    return profile

@router.put("/{user_id}", response_model=UserProfileResponse)
def update_profile(user_id: int, payload: dict, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")

    for k, v in payload.items():
        setattr(profile, k, v)

    db.commit()
    db.refresh(profile)
    return profile

@router.delete("/{user_id}")
def delete_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(404, "Profile not found")

    db.delete(profile)
    db.commit()
    return {"message": "Profile deleted"}
