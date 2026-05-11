from typing import Optional
from pydantic import BaseModel, Field


class ProductCreate(BaseModel):

    name: str = Field(..., min_length=2)

    description: Optional[str] = Field(None, max_length=1000)

    price: float = Field(..., gt=0)

    stock_quantity: int = Field(..., ge=0)


class ProductResponse(BaseModel):

    id: int
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: int
# schemas/product.py

from pydantic import BaseModel, Field


# -----------------------------
# CREATE PRODUCT SCHEMA
# -----------------------------

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: str | None = None
    price: float = Field(..., gt=0)


# -----------------------------
# RESPONSE SCHEMA
# -----------------------------

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: float

    class Config:
        orm_mode = True