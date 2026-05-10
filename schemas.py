from pydantic import BaseModel, Field

class OrderCreate(BaseModel):

    customer_name: str = Field(
        min_length=2,
        max_length=50
    )

    product_name: str = Field(
        min_length=2,
        max_length=100
    )

    amount: float = Field(gt=0)


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