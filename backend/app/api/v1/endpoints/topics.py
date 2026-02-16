from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.topic import (
    TopicCreate,
    TopicUpdate,
    TopicResponse,
)
from app.services.topic_service import (
    create_topic,
    update_topic,
    delete_topic,
)
from app.crud.crud_topic import crud_topic

router = APIRouter(prefix="/topics", tags=["Topics"])


# CREATE
@router.post("/", response_model=TopicResponse)
def create(payload: TopicCreate, db: Session = Depends(get_db)):
    return create_topic(db, payload)


# READ ALL (by module)
@router.get(
    "/module/{module_id}",
    response_model=list[TopicResponse],
)
def list_by_module(
    module_id: int,
    db: Session = Depends(get_db),
):
    return crud_topic.get_by_module(db, module_id)


# READ ONE (slug-based)
@router.get(
    "/module/{module_id}/{slug}",
    response_model=TopicResponse,
)
def get_by_slug(
    module_id: int,
    slug: str,
    db: Session = Depends(get_db),
):
    return crud_topic.get_by_slug(db, module_id, slug)


# UPDATE
@router.put("/{topic_id}", response_model=TopicResponse)
def update(
    topic_id: int,
    payload: TopicUpdate,
    db: Session = Depends(get_db),
):
    return update_topic(db, topic_id, payload)


# DELETE (soft)
@router.delete("/{topic_id}")
def delete(topic_id: int, db: Session = Depends(get_db)):
    delete_topic(db, topic_id)
    return {"message": "Topic deactivated"}
