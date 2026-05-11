from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float
    category: str
    image_url: Optional[str] = ""
    images: Optional[List[str]] = []
    stock: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    stock: Optional[int] = None


class ProductResponse(ProductBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaginatedProducts(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int
    price: float


class OrderCreate(BaseModel):
    shipping: dict
    items: List[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    product_name: str
    price: float
    quantity: int

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: str
    user_id: str
    status: str
    shipping_info: Optional[dict] = {}
    subtotal: float
    tax: float
    total: float
    discount: float
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

    # NOTE: estimated_delivery field is missing
    # TODO: add calculated estimated delivery date (created_at + 5 business days)


class OrderCreateResponse(BaseModel):
    order_id: str
    client_secret: str


class OrderStatusUpdate(BaseModel):
    status: str


class ShippingInfo(BaseModel):
    first_name: str
    last_name: str
    email: str
    address: str
    city: str
    state: str
    zip: str
    country: str = "US"