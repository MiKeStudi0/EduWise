from pydantic import BaseModel

class UserProfileBase(BaseModel):
    full_name: str | None = None
    avatar_url: str | None = None
    phone: str | None = None
    bio: str | None = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: int

    class Config:
        from_attributes = True
