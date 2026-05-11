# routers/products.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import SessionLocal
from models.product import Product
from schemas.product import ProductCreate, ProductResponse

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


# -----------------------------
# DATABASE DEPENDENCY
# -----------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------
# GET /api/products
# LIST PRODUCTS WITH PAGINATION
# ---------------------------------------------------

@router.get("/", response_model=list[ProductResponse])
def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):

    skip = (page - 1) * limit

    products = (
        db.query(Product)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return products


# ---------------------------------------------------
# POST /api/products
# CREATE PRODUCT
# ---------------------------------------------------

@router.post(
    "/",
    response_model=ProductResponse,
    status_code=201
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product