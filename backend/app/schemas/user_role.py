from pydantic import BaseModel
from .permission import PermissionResponse
class UserRoleBase(BaseModel):
    name: str
    description: str | None = None

class UserRoleCreate(UserRoleBase):
    pass


class UserRoleResponse(UserRoleBase):
    id: int
    is_active: bool
    permissions: list[PermissionResponse] = []

    class Config:
        from_attributes = True

