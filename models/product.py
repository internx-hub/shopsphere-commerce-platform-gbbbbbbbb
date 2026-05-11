from sqlalchemy import Column, Integer, String, Float, Text
# models/product.py

from sqlalchemy import Column, Integer, String, Float
from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, index=True, nullable=False)

    description = Column(Text, nullable=True)

    price = Column(Float, nullable=False)

    stock_quantity = Column(Integer, nullable=False, default=0)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
