from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    role_id: int
    subscription_id: int | None
    created_at: datetime

    class Config:
        from_attributes = True
