# main.py

from fastapi import FastAPI

from database import Base, engine
from routers.products import router as products_router

# CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Products CRUD API"
)

# REGISTER ROUTES
app.include_router(products_router)


@app.get("/")
def root():
    return {"message": "API running"}