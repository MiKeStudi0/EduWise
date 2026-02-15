from sqlalchemy.orm import Session
from app.models.subscription import Subscription

class CRUDSubscription:
    def create(self, db: Session, sub: Subscription):
        db.add(sub)
        db.commit()
        db.refresh(sub)
        return sub

    def get_all(self, db: Session):
        return db.query(Subscription).filter(Subscription.is_active == True).all()

crud_subscription = CRUDSubscription()
