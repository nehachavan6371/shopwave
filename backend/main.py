from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import User, Product, Order, OrderItem, CartItem
from app.database import Base
from app.routers import auth, products, cart, orders
from app.config import settings

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ShopWave API",
    description="Full-stack E-Commerce REST API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)


@app.get("/")
def root():
    return {"message": "ShopWave API is running 🚀", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
