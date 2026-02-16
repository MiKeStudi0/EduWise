from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ---------- Base ----------
class TechnologyBase(BaseModel):
    roadmap_id: int
    slug: str = Field(..., example="react")
    slug_icon: Optional[str] = None
    title: str
    description: Optional[str] = None
    seo_id: Optional[int] = None
    order_index: int = 0
    is_active: bool = True


# ---------- Create ----------
class TechnologyCreate(TechnologyBase):
    pass


# ---------- Update ----------
class TechnologyUpdate(BaseModel):
    roadmap_id: Optional[int] = None
    slug: Optional[str] = None
    slug_icon: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    seo_id: Optional[int] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


# ---------- Response ----------
class TechnologyResponse(TechnologyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
