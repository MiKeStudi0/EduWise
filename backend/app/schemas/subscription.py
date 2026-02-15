from pydantic import BaseModel

class SubscriptionBase(BaseModel):
    name: str
    price: int
    duration_days: int

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionResponse(SubscriptionBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
