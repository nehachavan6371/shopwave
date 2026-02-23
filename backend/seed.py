"""Seed the database with sample products and an admin user."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import User, Product
from app.database import Base
from app.auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Admin user
if not db.query(User).filter(User.email == "admin@shop.com").first():
    admin = User(
        email="admin@shop.com",
        full_name="Admin User",
        hashed_password=get_password_hash("admin123"),
        is_admin=True,
    )
    db.add(admin)

# Demo user
if not db.query(User).filter(User.email == "user@shop.com").first():
    user = User(
        email="user@shop.com",
        full_name="Demo User",
        hashed_password=get_password_hash("user123"),
    )
    db.add(user)

# Products
products = [
    {
        "name": "Premium Wireless Headphones",
        "description": "Studio-quality sound with active noise cancellation. 30-hour battery life, ultra-comfortable over-ear design.",
        "price": 249.99,
        "original_price": 349.99,
        "stock": 50,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        "is_featured": True,
        "rating": 4.8,
        "reviews_count": 1240,
    },
    {
        "name": "Minimalist Leather Watch",
        "description": "Handcrafted Italian leather strap with sapphire crystal face. Water-resistant to 50m.",
        "price": 189.00,
        "original_price": 220.00,
        "stock": 30,
        "category": "Accessories",
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        "is_featured": True,
        "rating": 4.6,
        "reviews_count": 870,
    },
    {
        "name": "Mechanical Keyboard Pro",
        "description": "Tactile brown switches, RGB backlighting, aluminum frame. Perfect for coding and gaming.",
        "price": 129.99,
        "original_price": 159.99,
        "stock": 75,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600",
        "is_featured": False,
        "rating": 4.7,
        "reviews_count": 560,
    },
    {
        "name": "Linen Button-Down Shirt",
        "description": "100% organic linen, relaxed fit. Breathable and sustainable fabric, perfect for any season.",
        "price": 79.00,
        "original_price": None,
        "stock": 120,
        "category": "Clothing",
        "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
        "is_featured": True,
        "rating": 4.4,
        "reviews_count": 320,
    },
    {
        "name": "Portable Espresso Maker",
        "description": "Barista-quality espresso anywhere. No electricity needed, 8-bar pressure extraction.",
        "price": 89.99,
        "original_price": 109.99,
        "stock": 40,
        "category": "Kitchen",
        "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
        "is_featured": False,
        "rating": 4.5,
        "reviews_count": 450,
    },
    {
        "name": "Yoga Mat Premium",
        "description": "6mm thick non-slip natural rubber, alignment lines printed, comes with carrying strap.",
        "price": 68.00,
        "original_price": 85.00,
        "stock": 90,
        "category": "Sports",
        "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
        "is_featured": False,
        "rating": 4.9,
        "reviews_count": 210,
    },
    {
        "name": "Ceramic Desk Planter Set",
        "description": "Set of 3 handmade ceramic planters with drainage holes. Minimalist matte finish.",
        "price": 45.00,
        "original_price": None,
        "stock": 60,
        "category": "Home",
        "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600",
        "is_featured": True,
        "rating": 4.3,
        "reviews_count": 180,
    },
    {
        "name": "Ultralight Running Shoes",
        "description": "Carbon fiber plate, 4mm drop, breathable mesh upper. Race-day ready.",
        "price": 159.99,
        "original_price": 199.99,
        "stock": 45,
        "category": "Sports",
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        "is_featured": False,
        "rating": 4.6,
        "reviews_count": 720,
    },
    {
        "name": "Smart Water Bottle",
        "description": "Tracks hydration, LED reminder, keeps drinks cold 24h / hot 12h. App connected.",
        "price": 55.00,
        "original_price": 75.00,
        "stock": 80,
        "category": "Sports",
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600",
        "is_featured": False,
        "rating": 4.2,
        "reviews_count": 390,
    },
    {
        "name": "Merino Wool Beanie",
        "description": "Extra fine 17.5 micron merino wool. Lightweight, warm, and itch-free.",
        "price": 38.00,
        "original_price": None,
        "stock": 150,
        "category": "Clothing",
        "image_url": "https://images.unsplash.com/photo-1510598969022-c4c6c5d05769?w=600",
        "is_featured": False,
        "rating": 4.7,
        "reviews_count": 260,
    },
    {
        "name": "4K Webcam Ultra",
        "description": "4K/30fps, auto-focus, low-light correction, built-in noise-cancelling mic.",
        "price": 119.00,
        "original_price": 149.00,
        "stock": 35,
        "category": "Electronics",
        "image_url": "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600",
        "is_featured": False,
        "rating": 4.5,
        "reviews_count": 480,
    },
    {
        "name": "Artisan Coffee Blend",
        "description": "Single-origin Ethiopian Yirgacheffe, medium roast. Notes of blueberry and jasmine.",
        "price": 22.00,
        "original_price": None,
        "stock": 200,
        "category": "Kitchen",
        "image_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600",
        "is_featured": True,
        "rating": 4.9,
        "reviews_count": 950,
    },
]

if db.query(Product).count() == 0:
    for p in products:
        db.add(Product(**p))

db.commit()
db.close()
print("✅ Database seeded successfully!")
print("   Admin: admin@shop.com / admin123")
print("   User:  user@shop.com  / user123")
