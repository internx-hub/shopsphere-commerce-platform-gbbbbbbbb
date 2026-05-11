from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session

from database import SessionLocal
from models.product import Product
from schemas.product import ProductCreate, ProductResponse

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------
# GET PRODUCTS (paginated)
# ---------------------------------------------------

@router.get("/", response_model=list[ProductResponse])
def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
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
# GET PRODUCT BY ID
# ---------------------------------------------------

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# ---------------------------------------------------
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
    try:
        new_product = Product(
            name=product.name,
            description=product.description,
            price=product.price,
            stock_quantity=product.stock_quantity
        )

        db.add(new_product)
        db.commit()
        db.refresh(new_product)

        return new_product

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create product")


# ---------------------------------------------------
# UPDATE PRODUCT (admin only)
# ---------------------------------------------------

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product: ProductCreate,
    admin: str | None = Header(default=None),
    db: Session = Depends(get_db)
):
    # Admin header check
    if admin != "true":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    existing = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        existing.name = product.name
        existing.description = product.description
        existing.price = product.price
        existing.stock_quantity = product.stock_quantity

        db.commit()
        db.refresh(existing)

        return existing

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update product")


# ---------------------------------------------------
# DELETE PRODUCT (admin only)
# ---------------------------------------------------

@router.delete("/{product_id}", status_code=204)
def delete_product(
    product_id: int,
    admin: str | None = Header(default=None),
    db: Session = Depends(get_db)
):
    if admin != "true":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    existing = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not existing:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        db.delete(existing)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete product")