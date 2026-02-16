from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ---------- Base ----------
class RoadmapBase(BaseModel):
    slug: str = Field(..., example="frontend-developer")
    slug_icon: Optional[str] = None
    title: str
    description: Optional[str] = None
    seo_id: Optional[int] = None
    order_index: int = 0
    is_active: bool = True


# ---------- Create ----------
class RoadmapCreate(RoadmapBase):
    pass


# ---------- Update ----------
class RoadmapUpdate(BaseModel):
    slug: Optional[str] = None
    slug_icon: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    seo_id: Optional[int] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


# ---------- Response ----------
class RoadmapResponse(RoadmapBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
