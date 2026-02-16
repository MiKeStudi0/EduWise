from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.sub_topic import (
    SubTopicCreate,
    SubTopicUpdate,
    SubTopicResponse,
)
from app.services.sub_topic_service import (
    create_sub_topic,
    update_sub_topic,
    delete_sub_topic,
)
from app.crud.crud_sub_topic import crud_sub_topic

router = APIRouter(prefix="/sub-topics", tags=["SubTopics"])


# CREATE
@router.post("/", response_model=SubTopicResponse)
def create(payload: SubTopicCreate, db: Session = Depends(get_db)):
    return create_sub_topic(db, payload)


# READ ALL (by topic)
@router.get(
    "/topic/{topic_id}",
    response_model=list[SubTopicResponse],
)
def list_by_topic(
    topic_id: int,
    db: Session = Depends(get_db),
):
    return crud_sub_topic.get_by_topic(db, topic_id)


# READ ONE (slug-based)
@router.get(
    "/topic/{topic_id}/{slug}",
    response_model=SubTopicResponse,
)
def get_by_slug(
    topic_id: int,
    slug: str,
    db: Session = Depends(get_db),
):
    return crud_sub_topic.get_by_slug(db, topic_id, slug)


# UPDATE
@router.put("/{sub_topic_id}", response_model=SubTopicResponse)
def update(
    sub_topic_id: int,
    payload: SubTopicUpdate,
    db: Session = Depends(get_db),
):
    return update_sub_topic(db, sub_topic_id, payload)


# DELETE (soft)
@router.delete("/{sub_topic_id}")
def delete(sub_topic_id: int, db: Session = Depends(get_db)):
    delete_sub_topic(db, sub_topic_id)
    return {"message": "SubTopic deactivated"}
