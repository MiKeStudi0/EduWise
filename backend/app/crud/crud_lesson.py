from sqlalchemy.orm import Session
from app.models.lesson import Lesson
from app.schemas.lesson import LessonCreate, LessonUpdate


class CRUDLesson:

    def create(self, db: Session, obj_in: LessonCreate) -> Lesson:
        lesson = Lesson(**obj_in.model_dump())
        db.add(lesson)
        db.commit()
        db.refresh(lesson)
        return lesson

    def get(self, db: Session, lesson_id: int) -> Lesson | None:
        return db.get(Lesson, lesson_id)

    def get_by_slug(
        self,
        db: Session,
        sub_topic_id: int,
        slug: str,
    ) -> Lesson | None:
        return (
            db.query(Lesson)
            .filter(
                Lesson.sub_topic_id == sub_topic_id,
                Lesson.slug == slug,
            )
            .first()
        )

    def get_by_sub_topic(
        self,
        db: Session,
        sub_topic_id: int,
        active_only: bool = True,
    ):
        q = db.query(Lesson).filter(
            Lesson.sub_topic_id == sub_topic_id
        )
        if active_only:
            q = q.filter(Lesson.is_active.is_(True))
        return q.order_by(Lesson.order_index).all()

    def update(
        self,
        db: Session,
        db_obj: Lesson,
        obj_in: LessonUpdate,
    ) -> Lesson:
        for field, value in obj_in.model_dump(
            exclude_unset=True
        ).items():
            setattr(db_obj, field, value)

        db.commit()
        db.refresh(db_obj)
        return db_obj

    def soft_delete(self, db: Session, db_obj: Lesson):
        db_obj.is_active = False
        db.commit()


crud_lesson = CRUDLesson()
