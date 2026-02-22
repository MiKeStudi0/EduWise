from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


# ---------- Base ----------
class TopicBase(BaseModel):
    roadmap_id: int
    technology_id: int
    module_id: int

    slug: str = Field(..., example="javascript-closures")
    title: str
    description: Optional[str] = None

    examples: Optional[List[Dict]] = None

    image_banner_url: Optional[str] = None
    images: Optional[List[str]] = None
    video_url: Optional[str] = None

    when_to_use: Optional[List[Dict]] = None
    when_to_avoid: Optional[List[Dict]] = None
    problems: Optional[List[Dict]] = None
    mental_models: Optional[List[Dict]] = None
    common_mistakes: Optional[List[Dict]] = None
    bonus_tips: Optional[List[Dict]] = None
    related_topics: Optional[List[str]] = None

    seo_id: Optional[int] = None
    order_index: int = 0
    is_active: bool = True


# ---------- Create ----------
class TopicCreate(TopicBase):
    pass


# ---------- Update ----------
class TopicUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

    examples: Optional[List[Dict]] = None
    image_banner_url: Optional[str] = None
    images: Optional[List[str]] = None
    video_url: Optional[str] = None

    when_to_use: Optional[List[Dict]] = None
    when_to_avoid: Optional[List[Dict]] = None
    problems: Optional[List[Dict]] = None
    mental_models: Optional[List[Dict]] = None
    common_mistakes: Optional[List[Dict]] = None
    bonus_tips: Optional[List[Dict]] = None
    related_topics: Optional[List[str]] = None

    seo_id: Optional[int] = None
    order_index: Optional[int] = None
    is_active: Optional[bool] = None


from app.schemas.sub_topic import SubTopicResponse

# ---------- Response ----------
class TopicResponse(TopicBase):
    id: int
    created_at: datetime
    updated_at: datetime
    sub_topics: List[SubTopicResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True
