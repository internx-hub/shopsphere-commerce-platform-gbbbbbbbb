# schemas.py

from pydantic import BaseModel, Field


# ---------------- PRODUCT ----------------

class ProductCreate(BaseModel):
    name: str
    price: float

    # VALIDATION
    stock_quantity: int = Field(..., ge=0)


class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    stock_quantity: int

    class Config:
        orm_mode = True


# ---------------- ORDER ----------------

class OrderCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class OrderResponse(BaseModel):
    id: int
    product_id: int
    quantity: int

    class Config:
        orm_mode = True