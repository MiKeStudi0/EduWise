from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.lesson import (
    LessonCreate,
    LessonUpdate,
    LessonResponse,
)
from app.services.lesson_service import (
    create_lesson,
    update_lesson,
    delete_lesson,
)
from app.crud.crud_lesson import crud_lesson

router = APIRouter(prefix="/lessons", tags=["Lessons"])


# CREATE
@router.post("/", response_model=LessonResponse)
def create(payload: LessonCreate, db: Session = Depends(get_db)):
    return create_lesson(db, payload)


# READ ALL (by sub-topic)
@router.get(
    "/sub-topic/{sub_topic_id}",
    response_model=list[LessonResponse],
)
def list_by_sub_topic(
    sub_topic_id: int,
    db: Session = Depends(get_db),
):
    return crud_lesson.get_by_sub_topic(db, sub_topic_id)


# READ ONE (slug-based)
@router.get(
    "/sub-topic/{sub_topic_id}/{slug}",
    response_model=LessonResponse,
)
def get_by_slug(
    sub_topic_id: int,
    slug: str,
    db: Session = Depends(get_db),
):
    return crud_lesson.get_by_slug(db, sub_topic_id, slug)


# UPDATE
@router.put("/{lesson_id}", response_model=LessonResponse)
def update(
    lesson_id: int,
    payload: LessonUpdate,
    db: Session = Depends(get_db),
):
    return update_lesson(db, lesson_id, payload)


# DELETE (soft)
@router.delete("/{lesson_id}")
def delete(lesson_id: int, db: Session = Depends(get_db)):
    delete_lesson(db, lesson_id)
    return {"message": "Lesson deactivated"}
