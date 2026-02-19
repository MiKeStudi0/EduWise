from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ---------- SEO Schema (Mirroring Roadmap) ----------
class SeoSchema(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[list[str]] = None
    canonical_url: Optional[str] = None
    robots: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image_url: Optional[str] = None
    twitter_card: Optional[str] = None

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
    seo: Optional[SeoSchema] = None


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
    seo: Optional[SeoSchema] = None


# ---------- Response ----------
class TechnologyResponse(TechnologyBase):
    id: int
    created_at: datetime
    updated_at: datetime
    seo: Optional[SeoSchema] = None

    class Config:
        from_attributes = True
