# 🛒 PRISMA E-Commerce

Full stack e-commerce application built with **PHP (MVC)** backend and **Vanilla JavaScript (SPA)** frontend.

---

## 🚀 Tech Stack

### Backend
- PHP 8+ — no framework, pure MVC
- MySQL — PDO with prepared statements
- Bramus Router — REST API routing
- Monolog — centralized logging
- Sessions — auth + guest support

### Frontend
- Vanilla JavaScript (ES6+ modules)
- Vite — dev server & bundler
- Tailwind CSS — styling
- Custom SPA router
- Component-based architecture

---

## 📦 Features

- 🛍️ Product catalog with categories
- ❤️ Favorites system (optimistic UI)
- 🛒 Full cart: add, remove, update quantity
- 💰 Real-time subtotal, total, VAT calculation
- 👤 Guest & authenticated user support
- 💳 Checkout flow

---

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Backend setup

```bash
cd backend
composer install
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_DATABASE=e_commerce
DB_USERNAME=root
DB_PASSWORD=yourpassword
```

### 3. Database setup

Import the SQL schema into MySQL:

```bash
mysql -u root -p e_commerce < docs/schema.sql
```

### 4. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` with your backend URL:

```env
VITE_API_URL=http://localhost/YOUR_PATH/backend/public/api
```

```bash
npm run dev
```

---

## 🗂️ Project Structure

```
E-Commerce/
├── backend/
│   ├── public/          # Entry point (index.php)
│   ├── routes/          # web.php — all API routes
│   ├── src/
│   │   ├── Controllers/ # HTTP request handlers
│   │   ├── Services/    # Business logic
│   │   ├── Repositories/# Database queries
│   │   └── Core/        # Router, Session, Request, Response
│   ├── .env.example
│   └── composer.json
│
└── frontend/
    ├── src/
    │   └── js/
    │       ├── api/         # API classes (CartApi, ProductApi...)
    │       ├── components/  # UI components
    │       ├── pages/       # Page classes (CartPage, HomePage...)
    │       └── utils/       # Helpers (LoadItemsHandler...)
    └── package.json
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/all` | Get all products |
| GET | `/api/cart/` | Get cart items |
| POST | `/api/cart/:id` | Add item to cart |
| PATCH | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove item |
| POST | `/api/cart/checkout` | Checkout |
| GET | `/api/favorites/all` | Get favorites |
| POST | `/api/favorites/toggle` | Toggle favorite |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/auth/check` | Check auth status |

---

## 📄 License

MIT
