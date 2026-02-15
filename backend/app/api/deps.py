from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import decode_access_token


# ======================================================
# Database dependency
# ======================================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ======================================================
# Auth / JWT
# ======================================================

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Extract user from JWT token.
    """
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )

    user_id: int | None = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    user = db.get(User, user_id)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    return user


# ======================================================
# Role-based access control (RBAC)
# ======================================================

def require_roles(*allowed_roles: str):
    """
    Usage:
    Depends(require_roles("admin", "super_admin"))
    """
    def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        role_name = current_user.role.name

        if role_name not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource",
            )

        return current_user

    return role_checker


# ======================================================
# Permission-based access control (Dynamic RBAC)
# ======================================================

def require_permissions(*required_permissions: str):
    """
    Usage:
    Depends(require_permissions("create_roadmap", "publish_roadmap"))
    """
    def permission_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:
        user_permissions = {
            permission.name
            for permission in current_user.role.permissions
        }

        if not set(required_permissions).issubset(user_permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        return current_user

    return permission_checker
