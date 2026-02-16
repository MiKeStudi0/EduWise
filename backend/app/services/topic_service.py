from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.crud.crud_topic import crud_topic
from app.schemas.topic import TopicCreate, TopicUpdate


def create_topic(db: Session, payload: TopicCreate):
    existing = crud_topic.get_by_slug(
        db, payload.module_id, payload.slug
    )
    if existing:
        raise HTTPException(
            400,
            "Topic with this slug already exists in this module",
        )

    return crud_topic.create(db, payload)


def update_topic(
    db: Session, topic_id: int, payload: TopicUpdate
):
    topic = crud_topic.get(db, topic_id)
    if not topic:
        raise HTTPException(404, "Topic not found")

    return crud_topic.update(db, topic, payload)


def delete_topic(db: Session, topic_id: int):
    topic = crud_topic.get(db, topic_id)
    if not topic:
        raise HTTPException(404, "Topic not found")

    crud_topic.soft_delete(db, topic)
