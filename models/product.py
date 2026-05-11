from sqlalchemy import Column, Integer, String, Float
from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    # FIXED: added index
    name = Column(String, index=True, nullable=False)

    price = Column(Float, nullable=False)

    stock_quantity = Column(Integer, nullable=False, default=0)