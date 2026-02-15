from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionCreate, SubscriptionResponse

router = APIRouter()

@router.post("/", response_model=SubscriptionResponse)
def create_subscription(sub: SubscriptionCreate, db: Session = Depends(get_db)):
    db_sub = Subscription(**sub.dict())
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub

@router.get("/", response_model=list[SubscriptionResponse])
def list_subscriptions(db: Session = Depends(get_db)):
    return db.query(Subscription).filter(Subscription.is_active == True).all()

@router.get("/{sub_id}", response_model=SubscriptionResponse)
def get_subscription(sub_id: int, db: Session = Depends(get_db)):
    sub = db.get(Subscription, sub_id)
    if not sub:
        raise HTTPException(404, "Subscription not found")
    return sub

@router.put("/{sub_id}", response_model=SubscriptionResponse)
def update_subscription(sub_id: int, payload: dict, db: Session = Depends(get_db)):
    sub = db.get(Subscription, sub_id)
    if not sub:
        raise HTTPException(404, "Subscription not found")

    for k, v in payload.items():
        setattr(sub, k, v)

    db.commit()
    db.refresh(sub)
    return sub

@router.delete("/{sub_id}")
def delete_subscription(sub_id: int, db: Session = Depends(get_db)):
    sub = db.get(Subscription, sub_id)
    if not sub:
        raise HTTPException(404, "Subscription not found")

    sub.is_active = False
    db.commit()
    return {"message": "Subscription disabled"}
