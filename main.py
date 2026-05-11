# main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
import models
import schemas
from routers.products import router as products_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Products CRUD API")

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import update

import models
import schemas

from database import SessionLocal, engine

# CREATE TABLES
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# ---------------- DATABASE DEPENDENCY ----------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.include_router(products_router)

@app.post("/api/orders", response_model=schemas.OrderResponse, status_code=201)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(
        models.Product.id == order.product_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")


# ---------------- PRODUCT APIs ----------------

@app.post("/api/products", response_model=schemas.ProductResponse, status_code=201)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    new_product = models.Product(
        name=product.name,
        price=product.price,
        stock_quantity=product.stock_quantity
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@app.get("/api/products/{product_id}", response_model=schemas.ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


# ---------------- ORDER APIs ----------------

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

    # ---------------- ATOMIC STOCK UPDATE ----------------
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

    new_order = models.Order(product_id=order.product_id, quantity=order.quantity)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order

@app.get("/")
def root():
    return {"message": "API running"}

    # NO STOCK AVAILABLE
    if updated_rows == 0:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Insufficient stock"
        )

    # CREATE ORDER
    new_order = models.Order(
        product_id=order.product_id,
        quantity=order.quantity
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order
