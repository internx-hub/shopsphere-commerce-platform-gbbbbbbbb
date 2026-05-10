from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Header
)

from sqlalchemy.orm import Session
from database import SessionLocal
from models import Order
from schemas import OrderCreate, OrderUpdate

from dotenv import load_dotenv
import stripe
import os

load_dotenv()

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# BASIC AUTH
def verify_admin(x_api_key: str = Header(...)):

    if x_api_key != "admin123":
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )


@router.post("/")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db)
):

    # DUPLICATE ORDER CHECK
    existing_order = db.query(Order).filter(
        Order.customer_name == order.customer_name,
        Order.product_name == order.product_name,
        Order.status == "pending"
    ).first()

    if existing_order:

        raise HTTPException(
            status_code=400,
            detail="Duplicate pending order exists"
        )

    # STRIPE ERROR HANDLING
    try:

        payment_intent = stripe.PaymentIntent.create(
            amount=int(order.amount * 100),
            currency="usd",
            payment_method_types=["card"]
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Stripe Error: {str(e)}"
        )

    new_order = Order(
        customer_name=order.customer_name,
        product_name=order.product_name,
        amount=order.amount,
        payment_intent_id=payment_intent.id
    )

    db.add(new_order)

    db.commit()

    db.refresh(new_order)

    return {
        "message": "Order created successfully",
        "order": new_order,
        "client_secret": payment_intent.client_secret
    }


@router.get("/")
def get_orders(
    db: Session = Depends(get_db),
    _: str = Depends(verify_admin)
):

    return db.query(Order).all()


@router.put("/{order_id}")
def update_order(
    order_id: int,
    updated_order: OrderUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(verify_admin)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:

        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = updated_order.status

    db.commit()

    db.refresh(order)

    return {
        "message": "Order updated successfully",
        "order": order
    }