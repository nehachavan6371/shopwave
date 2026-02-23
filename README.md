# 🛍️ ShopWave — Full-Stack E-Commerce Store

A production-ready e-commerce application built with **React**, **FastAPI**, and **PostgreSQL**, deployable on **Render**.

---

## 📸 Features

- **Product Catalog** — Browse, filter by category, search by name, filter by price range
- **Product Detail** — Full product page with rating, stock info, and quantity selector
- **Authentication** — JWT-based register/login with protected routes
- **Shopping Cart** — Add, update quantities, remove items (persisted to DB per user)
- **Checkout** — Address form → place order → stock auto-deducted
- **Order History** — View all past orders with expandable detail panels
- **Admin Dashboard** — Full CRUD for products, order status management
- **Seed Data** — 12 demo products + admin/user accounts pre-loaded

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, Lucide Icons |
| Backend | FastAPI, SQLAlchemy ORM, Alembic |
| Database | PostgreSQL |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Deployment | Render (backend + frontend + DB) |
| Build Tool | Vite |

---

## 🚀 Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (running locally)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/shopwave.git
cd shopwave
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set your DATABASE_URL:
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/ecommerce
```

Create the PostgreSQL database:
```sql
CREATE DATABASE ecommerce;
```

Seed the database:
```bash
python seed.py
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# .env.local content:
# VITE_API_URL=http://localhost:8000/api

# Start dev server
npm run dev
```

Frontend available at: http://localhost:5173

---

### 4. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shop.com | admin123 |
| User  | user@shop.com  | user123  |

---

## ☁️ Deploy on Render

### Option A: Using render.yaml (Recommended)

1. Push this repository to GitHub
2. Log in to [render.com](https://render.com)
3. Click **New → Blueprint**
4. Connect your repository
5. Render will detect `render.yaml` and create:
   - PostgreSQL database
   - Backend web service
   - Frontend static site
6. Wait ~5 minutes for the first deploy
7. The seed script runs automatically on backend start

### Option B: Manual Setup

**Database:**
1. Render → New → PostgreSQL → Name: `shopwave-db` → Free plan → Create

**Backend:**
1. Render → New → Web Service
2. Connect repo, set Root Directory: `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `bash start.sh`
5. Environment variables:
   - `DATABASE_URL` = (from your Render PostgreSQL Internal URL)
   - `SECRET_KEY` = (any long random string)
   - `FRONTEND_URL` = https://your-frontend.onrender.com

**Frontend:**
1. Render → New → Static Site
2. Connect repo, set Root Directory: `frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Environment variable:
   - `VITE_API_URL` = https://your-backend.onrender.com/api
6. Add Redirect/Rewrite rule: `/* → /index.html` (for SPA routing)

---

## 📁 Project Structure

```
shopwave/
├── render.yaml              # Render deployment config
├── .gitignore
│
├── backend/
│   ├── main.py              # FastAPI app + CORS + routes
│   ├── seed.py              # Database seeder
│   ├── requirements.txt
│   ├── start.sh             # Render start script (seed + uvicorn)
│   ├── .env.example
│   └── app/
│       ├── config.py        # Settings (pydantic-settings)
│       ├── database.py      # SQLAlchemy engine + session
│       ├── auth.py          # JWT + password hashing
│       ├── models/
│       │   ├── user.py
│       │   ├── product.py
│       │   ├── order.py
│       │   └── cart.py
│       ├── schemas/
│       │   └── __init__.py  # Pydantic schemas
│       └── routers/
│           ├── auth.py      # /api/auth/*
│           ├── products.py  # /api/products/*
│           ├── cart.py      # /api/cart/*
│           └── orders.py    # /api/orders/*
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    ├── .env.example
    └── src/
        ├── main.jsx
        ├── App.jsx          # Routes + providers
        ├── index.css        # Global styles + design tokens
        ├── api/
        │   └── index.js     # Axios instance + all API calls
        ├── context/
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── ProductCard.jsx
        └── pages/
            ├── Home.jsx
            ├── Products.jsx
            ├── ProductDetail.jsx
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── Orders.jsx
            ├── Login.jsx
            ├── Register.jsx
            └── AdminDashboard.jsx
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | — |
| POST | /api/auth/login | Login + get JWT | — |
| GET | /api/auth/me | Get current user | ✅ |
| GET | /api/products | List products (filters) | — |
| GET | /api/products/categories | Get all categories | — |
| GET | /api/products/{id} | Product detail | — |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/{id} | Update product | Admin |
| DELETE | /api/products/{id} | Soft-delete product | Admin |
| GET | /api/cart | Get user cart | ✅ |
| POST | /api/cart | Add to cart | ✅ |
| PUT | /api/cart/{id} | Update quantity | ✅ |
| DELETE | /api/cart/{id} | Remove item | ✅ |
| DELETE | /api/cart | Clear cart | ✅ |
| POST | /api/orders | Place order | ✅ |
| GET | /api/orders | My orders | ✅ |
| GET | /api/orders/{id} | Order detail | ✅ |
| GET | /api/orders/admin/all | All orders | Admin |
| PATCH | /api/orders/{id}/status | Update status | Admin |

---

## ⚠️ Assumptions & Limitations

- **Payments**: This is a demo — no real payment gateway (Stripe, etc.) is integrated. Orders are placed without payment processing.
- **Images**: Product images use Unsplash URLs. In production, replace with an image upload service (S3, Cloudinary).
- **Email**: No email confirmation or order notification emails are sent.
- **Search**: Uses SQL ILIKE (case-insensitive substring). For production, Elasticsearch or pg_trgm would be better.
- **Render Free Tier**: The free PostgreSQL database on Render expires after 90 days. Services may spin down after inactivity (cold starts ~30s).
- **CORS**: Currently set to `allow_origins=["*"]` for development. In production, restrict to your frontend domain.
- **Admin creation**: Admin accounts are created only via seed script. No UI for promoting users to admin.

---

## 🛠️ Development Notes

- Backend auto-creates all tables on startup (`Base.metadata.create_all`)
- Seed script is idempotent — safe to run multiple times
- Frontend uses Vite proxy in dev mode (no CORS issues locally)
- JWT tokens expire after 24 hours
- Soft delete is used for products (`is_active = False`)
