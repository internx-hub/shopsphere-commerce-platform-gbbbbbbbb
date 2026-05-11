# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
import models
import schemas
from routers.products import router as products_router

# CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Products CRUD API")

# DATABASE DEPENDENCY
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# REGISTER ROUTES
app.include_router(products_router)

# ORDER APIs
@app.post("/api/orders", response_model=schemas.OrderResponse, status_code=201)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db)
):
    # CHECK PRODUCT EXISTS
    product = db.query(models.Product).filter(
        models.Product.id == order.product_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # ATOMIC STOCK UPDATE
    updated_rows = (
        db.query(models.Product)
        .filter(
            models.Product.id == order.product_id,
            models.Product.stock_quantity >= order.quantity
        )
        .update({
            models.Product.stock_quantity:
            models.Product.stock_quantity - order.quantity
        })
    )
    if updated_rows == 0:
        db.rollback()
        raise HTTPException(status_code=409, detail="Insufficient stock")

    new_order = models.Order(
        product_id=order.product_id,
        quantity=order.quantity
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@app.get("/")
def root():
    return {"message": "API running"}
