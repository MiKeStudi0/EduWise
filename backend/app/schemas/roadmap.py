from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# ---------- SEO Schemas ----------
class SeoMetadataBase(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[List[str]] = None
    canonical_url: Optional[str] = None
    robots: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image_url: Optional[str] = None
    twitter_card: Optional[str] = None

class SeoMetadataCreate(SeoMetadataBase):
    pass

class SeoMetadataResponse(SeoMetadataBase):
    id: int
    class Config:
        from_attributes = True

# ---------- Roadmap Schemas ----------

class RoadmapBase(BaseModel):
    slug: str = Field(..., example="frontend-developer")
    slug_icon: Optional[str] = None
    title: str
    description: Optional[str] = None
    order_index: int = 0
    is_active: bool = True

class RoadmapCreate(RoadmapBase):
    # Allow nested SEO data creation
    seo: Optional[SeoMetadataCreate] = None 

class RoadmapUpdate(BaseModel):
    slug: Optional[str] = None
    slug_icon: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None
    # Allow nested SEO data update
    seo: Optional[SeoMetadataCreate] = None 

class RoadmapResponse(RoadmapBase):
    id: int
    seo_id: Optional[int] = None
    # Return the full SEO object
    seo: Optional[SeoMetadataResponse] = None 
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True