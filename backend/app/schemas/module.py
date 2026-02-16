from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ---------- Base ----------
class ModuleBase(BaseModel):
    roadmap_id: int
    technology_id: int
    slug: str = Field(..., example="core-concepts")
    title: str
    description: Optional[str] = None
    seo_id: Optional[int] = None
    order_index: int = 0
    is_active: bool = True


# ---------- Create ----------
class ModuleCreate(ModuleBase):
    pass


# ---------- Update ----------
class ModuleUpdate(BaseModel):
    roadmap_id: Optional[int] = None
    technology_id: Optional[int] = None
    slug: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    seo_id: Optional[int] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


# ---------- Response ----------
class ModuleResponse(ModuleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
