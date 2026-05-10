from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Order
from schemas import OrderCreate, OrderUpdate
import stripe

router = APIRouter(prefix="/orders", tags=["Orders"])

# Stripe Secret Key
stripe.api_key = "YOUR_STRIPE_SECRET_KEY"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CREATE ORDER + PAYMENT INTENT
@router.post("/")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):

    # Create Stripe Payment Intent
    payment_intent = stripe.PaymentIntent.create(
        amount=int(order.amount * 100),  # convert to paisa/cents
        currency="usd",
        payment_method_types=["card"]
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


# LIST ORDERS
@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


# UPDATE ORDER STATUS
@router.put("/{order_id}")
def update_order(
    order_id: int,
    updated_order: OrderUpdate,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = updated_order.status

    db.commit()
    db.refresh(order)

    return {
        "message": "Order updated successfully",
        "order": order
    }