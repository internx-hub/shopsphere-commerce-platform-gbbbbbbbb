from sqlalchemy import Column, Integer, String, Float
from database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_name = Column(String, index=True)

    product_name = Column(String, index=True)

    amount = Column(Float)

    status = Column(
        String,
        default="pending",
        index=True
    )

    payment_intent_id = Column(
        String,
        nullable=True,
        index=True
    )