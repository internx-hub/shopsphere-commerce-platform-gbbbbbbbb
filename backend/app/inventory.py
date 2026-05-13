from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models import Product


def check_stock(db: Session, product_id: str, qty: int):
    """Check if enough stock is available. Raises 409 if not."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")

    if product.stock < qty:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Insufficient stock",
                "available": product.stock,
                "requested": qty,
            },
        )

    return product


def decrement_stock(db: Session, product_id: str, qty: int):
    """Atomically decrement stock for a product."""
    product = db.query(Product).filter(Product.id == product_id).with_for_update().first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")

    if product.stock < qty:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Insufficient stock",
                "available": product.stock,
                "requested": qty,
            },
        )

    product.stock -= qty
    db.flush()


def restore_stock(db: Session, product_id: str, qty: int):
    """Restore stock (e.g., after payment failure)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if product:
        product.stock += qty
        db.flush()