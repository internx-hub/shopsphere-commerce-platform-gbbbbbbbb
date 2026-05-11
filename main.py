from fastapi import FastAPI

from database import Base, engine

from routers.products import router as products_router
from routers.orders import router as orders_router

from models.product import Product
from models.order import Order

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(products_router)
app.include_router(orders_router)


@app.get("/")
def root():
    return {"message": "API Running"}