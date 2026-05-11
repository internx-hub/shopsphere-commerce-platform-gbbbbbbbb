from pydantic import BaseModel, Field


class ProductCreate(BaseModel):

    name: str = Field(..., min_length=2)

    price: float = Field(..., gt=0)

    stock_quantity: int = Field(..., ge=0)


class ProductResponse(BaseModel):

    id: int
    name: str
    price: float
    stock_quantity: int

    class Config:
        orm_mode = True