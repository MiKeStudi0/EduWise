from pydantic import BaseModel

class RolePermissionUpdate(BaseModel):
    permission_ids: list[int]


class RolePermissionResponse(BaseModel):
    role_id: int
    permission_ids: list[int]
