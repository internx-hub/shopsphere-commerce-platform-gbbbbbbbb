from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
import uuid

from app.database import get_db
from app.models import Product
from app.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    PaginatedProducts,
)

router = APIRouter()


@router.get("", response_model=PaginatedProducts)
def list_products(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    if category:
        query = query.filter(Product.category == category)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Product.name.ilike(search_pattern),
                Product.description.ilike(search_pattern),
            )
        )

    total = query.count()
    products = query.offset((page - 1) * limit).limit(limit).all()

    return PaginatedProducts(
        items=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    try:
        uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid product ID format")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return ProductResponse.model_validate(product)


@router.post("", response_model=ProductResponse, status_code=201)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
):
    # NOTE: No auth check here - security issue
    # TODO: add Depends(require_admin) once auth middleware is ready

    if product.stock < 0:
        raise HTTPException(status_code=422, detail="Stock cannot be negative")

    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return ProductResponse.model_validate(db_product)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product: ProductUpdate,
    db: Session = Depends(get_db),
):
    # NOTE: No auth check here - security issue
    # TODO: add Depends(require_admin)

    try:
        uuid.UUID(product_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid product ID format")

    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)

    return ProductResponse.model_validate(db_product)