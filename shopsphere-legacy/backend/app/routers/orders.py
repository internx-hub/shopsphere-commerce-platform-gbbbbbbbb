from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import uuid
import stripe
import os

from app.database import get_db
from app.models import Order, OrderItem, Product
from app.schemas import (
    OrderCreate,
    OrderResponse,
    OrderCreateResponse,
    OrderStatusUpdate,
)
from app.services.inventory import check_stock, decrement_stock

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_dummy")


@router.get("", response_model=list[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
):
    # BUG: Returns ALL orders regardless of who is logged in
    # TODO: Filter by current user's ID from JWT token
    # Should use: Depends(get_current_user) and filter by user_id

    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, db: Session = Depends(get_db)):
    # BUG: No user check - any authenticated user can see any order
    # TODO: verify order belongs to current user

    try:
        uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid order ID")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return OrderResponse.model_validate(order)


@router.post("", response_model=OrderCreateResponse, status_code=201)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
):
    # NOTE: No auth dependency - user_id is not being extracted from token
    # TODO: Add Depends(get_current_user) and use user["user_id"]

    user_id = "00000000-0000-0000-0000-000000000000"  # Placeholder

    # Validate stock for all items
    for item in order_data.items:
        check_stock(db, item.product_id, item.quantity)

    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in order_data.items)
    tax = round(subtotal * 0.08, 2)
    total = round(subtotal + tax, 2)

    # Create Stripe payment intent
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=int(total * 100),
            currency="usd",
            metadata={"user_id": str(user_id)},
        )
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Create order
    order = Order(
        user_id=user_id,
        status="pending",
        shipping_info=order_data.shipping.model_dump() if hasattr(order_data.shipping, 'model_dump') else order_data.shipping,
        stripe_payment_intent=payment_intent.id,
        subtotal=subtotal,
        tax=tax,
        total=total,
    )
    db.add(order)
    db.flush()

    # Create order items and decrement stock
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            product_name=product.name,
            price=item.price,
            quantity=item.quantity,
        )
        db.add(order_item)
        decrement_stock(db, item.product_id, item.quantity)

    db.commit()
    db.refresh(order)

    return OrderCreateResponse(
        order_id=str(order.id),
        client_secret=payment_intent.client_secret,
    )


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    # BUG: No admin check - any user can update order status
    # TODO: add Depends(require_admin)

    valid_statuses = ["pending", "paid", "processing", "shipped", "delivered"]
    if status_update.status not in valid_statuses:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid status. Must be one of: {valid_statuses}",
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = status_update.status
    db.commit()
    db.refresh(order)

    return OrderResponse.model_validate(order)


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    # NOTE: Signature verification is placeholder only
    # TODO: use stripe.Webhook.construct_event with STRIPE_WEBHOOK_SECRET

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    try:
        if webhook_secret:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        else:
            # In development without secret, parse raw body
            import json
            event = json.loads(payload)
    except (stripe.error.SignatureVerificationError, Exception) as e:
        raise HTTPException(status_code=400, detail=str(e))

    if event.get("type") == "payment_intent.succeeded":
        payment_intent_id = event["data"]["object"]["id"]
        order = db.query(Order).filter(
            Order.stripe_payment_intent == payment_intent_id
        ).first()

        if order:
            order.status = "paid"
            db.commit()

            # TODO: Send confirmation email
            # from app.services.email import send_order_confirmation
            # await send_order_confirmation(order)

    return {"status": "received"}