from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import (
    get_db,
    get_current_user,
    require_permissions,
)
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse,
)
from app.models.user import User
from app.services.user_service import register_user

router = APIRouter()


# =====================================================
# CREATE USER (Public – Signup)
# =====================================================

@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
):
    return register_user(db, payload)


# =====================================================
# READ ALL USERS (Admin only)
# =====================================================

@router.get(
    "/",
    response_model=list[UserResponse],
    dependencies=[Depends(require_permissions("view_users"))],
)
def list_users(
    db: Session = Depends(get_db),
):
    return db.query(User).all()


# =====================================================
# READ ONE USER
# =====================================================

@router.get(
    "/{user_id}",
    response_model=UserResponse,
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")

    # Users can read themselves, admins can read anyone
    if user.id != current_user.id:
        require_permissions("view_users")(current_user)

    return user


# =====================================================
# UPDATE USER (SELF or ADMIN)
# =====================================================

@router.put(
    "/{user_id}",
    response_model=UserResponse,
)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")

    # Permission check
    if user.id != current_user.id:
        require_permissions("update_users")(current_user)

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


# =====================================================
# SOFT DELETE USER (Admin only)
# =====================================================

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permissions("delete_users"))],
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")

    user.is_active = False
    db.commit()
