from sqlalchemy.orm import Session

from app.crud.crud_user import crud_user
from app.crud.crud_role import crud_role
from app.schemas.user import UserCreate
from app.models.user_profile import UserProfile


def register_user(db: Session, payload: UserCreate):
    """
    Public signup.
    - Assign default role (student)
    - Create empty profile
    - No subscription by default
    """

    default_role = crud_role.get_by_name(db, "student")
    if not default_role:
        raise ValueError("Default role not found")

    user = crud_user.create(
        db,
        email=payload.email,
        username=payload.username,
        password=payload.password,
        role_id=default_role.id,
    )

    # Auto-create profile
    profile = UserProfile(user_id=user.id)
    db.add(profile)
    db.commit()

    return user
