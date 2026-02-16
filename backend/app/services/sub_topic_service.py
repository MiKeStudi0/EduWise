from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.crud.crud_sub_topic import crud_sub_topic
from app.schemas.sub_topic import SubTopicCreate, SubTopicUpdate


def create_sub_topic(db: Session, payload: SubTopicCreate):
    existing = crud_sub_topic.get_by_slug(
        db, payload.topic_id, payload.slug
    )
    if existing:
        raise HTTPException(
            400,
            "SubTopic with this slug already exists in this topic",
        )

    return crud_sub_topic.create(db, payload)


def update_sub_topic(
    db: Session, sub_topic_id: int, payload: SubTopicUpdate
):
    sub_topic = crud_sub_topic.get(db, sub_topic_id)
    if not sub_topic:
        raise HTTPException(404, "SubTopic not found")

    return crud_sub_topic.update(db, sub_topic, payload)


def delete_sub_topic(db: Session, sub_topic_id: int):
    sub_topic = crud_sub_topic.get(db, sub_topic_id)
    if not sub_topic:
        raise HTTPException(404, "SubTopic not found")

    crud_sub_topic.soft_delete(db, sub_topic)
