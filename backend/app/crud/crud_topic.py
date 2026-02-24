from sqlalchemy.orm import Session, selectinload
from app.models.topic import Topic
from app.schemas.topic import TopicCreate, TopicUpdate


class CRUDTopic:

    def create(self, db: Session, obj_in: TopicCreate) -> Topic:
        topic = Topic(**obj_in.model_dump(exclude_none=True))  # ⭐ changed
        db.add(topic)
        db.commit()
        db.refresh(topic)
        return topic

    def get(self, db: Session, topic_id: int) -> Topic | None:
        return db.get(Topic, topic_id)

    def get_by_slug(self, db: Session, module_id: int, slug: str) -> Topic | None:
        return (
            db.query(Topic)
            .filter(
                Topic.module_id == module_id,
                Topic.slug == slug,
            )
            .first()
        )

    def get_by_module(self, db: Session, module_id: int, active_only: bool = True):
        q = db.query(Topic).options(selectinload(Topic.sub_topics)).filter(
            Topic.module_id == module_id
        )
        if active_only:
            q = q.filter(Topic.is_active.is_(True))
        return q.order_by(Topic.order_index).all()

    def update(self, db: Session, db_obj: Topic, obj_in: TopicUpdate) -> Topic:
        data = obj_in.model_dump(exclude_unset=True)

        for field, value in data.items():
            setattr(db_obj, field, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def soft_delete(self, db: Session, db_obj: Topic):
        db_obj.is_active = False
        db.commit()


crud_topic = CRUDTopic()