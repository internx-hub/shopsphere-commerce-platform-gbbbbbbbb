from fastapi import FastAPI
from database import engine, Base
from routers.orders import router as order_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(order_router)

@app.get("/")
def home():
    return {"message": "Orders API Running"}