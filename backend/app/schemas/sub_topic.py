from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


# ---------- Base ----------
class SubTopicBase(BaseModel):
    roadmap_id: int
    technology_id: int
    module_id: int
    topic_id: int

    slug: str = Field(..., example="closure-inner-scope")
    title: str
    description: Optional[str] = None

    examples: Optional[List[Dict]] = None

    image_banner_url: Optional[str] = None
    images: Optional[List[str]] = None
    video_url: Optional[str] = None

    when_to_use: Optional[List[str]] = None
    when_to_avoid: Optional[List[str]] = None
    problems: Optional[List[str]] = None
    mental_models: Optional[List[str]] = None
    common_mistakes: Optional[List[str]] = None
    bonus_tips: Optional[List[str]] = None
    related_topics: Optional[List[str]] = None

    seo_id: Optional[int] = None
    order_index: int = 0
    is_active: bool = True


# ---------- Create ----------
class SubTopicCreate(SubTopicBase):
    pass


# ---------- Update ----------
class SubTopicUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

    examples: Optional[List[Dict]] = None
    image_banner_url: Optional[str] = None
    images: Optional[List[str]] = None
    video_url: Optional[str] = None

    when_to_use: Optional[List[str]] = None
    when_to_avoid: Optional[List[str]] = None
    problems: Optional[List[str]] = None
    mental_models: Optional[List[str]] = None
    common_mistakes: Optional[List[str]] = None
    bonus_tips: Optional[List[str]] = None
    related_topics: Optional[List[str]] = None

    seo_id: Optional[int] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


# ---------- Response ----------
class SubTopicResponse(SubTopicBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
