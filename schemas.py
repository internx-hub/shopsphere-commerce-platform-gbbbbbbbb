from pydantic import BaseModel

class OrderCreate(BaseModel):
    customer_name: str
    product_name: str
    amount: float

class OrderUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    product_name: str
    amount: float
    status: str
    payment_intent_id: str | None

    class Config:
        orm_mode = True