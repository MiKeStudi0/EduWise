from sqlalchemy.orm import Session

def exists(db: Session, model, **filters) -> bool:
    return db.query(model).filter_by(**filters).first() is not None
