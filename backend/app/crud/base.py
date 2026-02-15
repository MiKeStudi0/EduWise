from sqlalchemy.orm import Session

class CRUDBase:
    def __init__(self, model):
        self.model = model

    def create(self, db: Session, obj):
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
