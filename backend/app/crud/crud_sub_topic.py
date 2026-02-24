from sqlalchemy.orm import Session
from app.models.sub_topic import SubTopic
from app.schemas.sub_topic import SubTopicCreate, SubTopicUpdate


class CRUDSubTopic:

    def create(self, db: Session, obj_in: SubTopicCreate) -> SubTopic:
        sub_topic = SubTopic(**obj_in.model_dump(exclude_none=True))  # ⭐ changed
        db.add(sub_topic)
        db.commit()
        db.refresh(sub_topic)
        return sub_topic

    def get(self, db: Session, sub_topic_id: int) -> SubTopic | None:
        return db.get(SubTopic, sub_topic_id)

    def get_by_slug(self, db: Session, topic_id: int, slug: str) -> SubTopic | None:
        return (
            db.query(SubTopic)
            .filter(
                SubTopic.topic_id == topic_id,
                SubTopic.slug == slug,
            )
            .first()
        )

    def get_by_topic(self, db: Session, topic_id: int, active_only: bool = True):
        q = db.query(SubTopic).filter(SubTopic.topic_id == topic_id)
        if active_only:
            q = q.filter(SubTopic.is_active.is_(True))
        return q.order_by(SubTopic.order_index).all()

    def update(self, db: Session, db_obj: SubTopic, obj_in: SubTopicUpdate) -> SubTopic:
        data = obj_in.model_dump(exclude_unset=True)

        for field, value in data.items():
            setattr(db_obj, field, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def soft_delete(self, db: Session, db_obj: SubTopic):
        db_obj.is_active = False
        db.commit()


crud_sub_topic = CRUDSubTopic()