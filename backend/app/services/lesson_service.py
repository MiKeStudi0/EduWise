from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.crud.crud_lesson import crud_lesson
from app.schemas.lesson import LessonCreate, LessonUpdate


def create_lesson(db: Session, payload: LessonCreate):
    existing = crud_lesson.get_by_slug(
        db, payload.sub_topic_id, payload.slug
    )
    if existing:
        raise HTTPException(
            400,
            "Lesson with this slug already exists in this sub-topic",
        )

    return crud_lesson.create(db, payload)


def update_lesson(
    db: Session, lesson_id: int, payload: LessonUpdate
):
    lesson = crud_lesson.get(db, lesson_id)
    if not lesson:
        raise HTTPException(404, "Lesson not found")

    return crud_lesson.update(db, lesson, payload)


def delete_lesson(db: Session, lesson_id: int):
    lesson = crud_lesson.get(db, lesson_id)
    if not lesson:
        raise HTTPException(404, "Lesson not found")

    crud_lesson.soft_delete(db, lesson)
