from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SeoBase(BaseModel):
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[List[str]] = None

    canonical_url: Optional[str] = None
    robots: Optional[str] = None

    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_type: Optional[str] = None
    og_url: Optional[str] = None
    og_site_name: Optional[str] = None
    og_image_url: Optional[str] = None
    og_image_width: Optional[int] = None
    og_image_height: Optional[int] = None
    og_image_alt: Optional[str] = None

    twitter_card: Optional[str] = None
    twitter_title: Optional[str] = None
    twitter_description: Optional[str] = None
    twitter_image: Optional[str] = None


class SeoCreate(SeoBase):
    pass


class SeoUpdate(SeoBase):
    pass


class SeoResponse(SeoBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
