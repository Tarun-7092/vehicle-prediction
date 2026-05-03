# Vehicle Breakdown Prediction — Backend API

A production-ready REST API for predicting vehicle breakdowns using sensor data and a FastAPI ML service.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ (ES Modules) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Password Hashing | bcryptjs |
| ML Integration | Axios → FastAPI |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Winston + Morgan |
| Docs | Swagger (OpenAPI 3.0) |

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB connection
│   │   └── swagger.js          # OpenAPI spec config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── prediction.controller.js
│   │   ├── analytics.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT protect + restrictTo
│   │   ├── errorHandler.js      # Centralized error handler
│   │   ├── notFound.js
│   │   ├── validate.middleware.js
│   │   └── validators/
│   │       ├── auth.validator.js
│   │       └── prediction.validator.js
│   ├── models/
│   │   ├── User.model.js
│   │   └── Prediction.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── prediction.routes.js
│   │   ├── analytics.routes.js
│   │   └── admin.routes.js
│   ├── services/
│   │   └── ml.service.js       # FastAPI integration
│   ├── utils/
│   │   ├── ApiResponse.js       # Standardized response helpers
│   │   ├── AppError.js          # Custom error class
│   │   ├── jwtHelper.js         # Token sign/verify
│   │   └── logger.js            # Winston logger
│   └── app.js                   # Express app bootstrap
├── server.js                    # Entry point
├── package.json
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Fill in your values in .env
```

**Required environment variables:**

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vehicle_prediction
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d
ML_SERVICE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:3000
BCRYPT_ROUNDS=12
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Start Production Server

```bash
npm start
```

---

## 📖 API Reference

Interactive docs available at: `http://localhost:5000/api/docs`

### Authentication

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

---

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | Refresh access token |
| GET | `/api/auth/me` | Yes | Get current user |
| PATCH | `/api/auth/update-password` | Yes | Change password |
| POST | `/api/auth/logout` | Yes | Logout |

---

### Prediction Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/predictions` | Yes | Create prediction |
| GET | `/api/predictions` | Yes | List user predictions |
| GET | `/api/predictions/:id` | Yes | Get single prediction |
| DELETE | `/api/predictions/:id` | Yes | Delete prediction |

#### Create Prediction — Request Body

```json
{
  "engine_rpm": 1200,
  "lub_oil_pressure": 3.5,
  "fuel_pressure": 2.8,
  "coolant_pressure": 1.2,
  "lub_oil_temp": 75,
  "coolant_temp": 88,
  "notes": "Routine check"
}
```

#### List Predictions — Query Params

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (1–100, default: 10) |
| `status` | string | Filter: Normal, Warning, Critical, Failure |
| `minProbability` | float | Min failure probability (0–1) |
| `maxProbability` | float | Max failure probability (0–1) |
| `from` | ISO date | Start date filter |
| `to` | ISO date | End date filter |
| `sortBy` | string | createdAt, failure_probability, engine_rpm, status |
| `sortOrder` | string | asc or desc |

---

### Analytics Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/dashboard` | Yes | Dashboard stats |

Dashboard response includes:
- `summary` — totals, failure count, avg probability, failure rate
- `statusBreakdown` — count per status
- `monthlyStats` — last 12 months breakdown
- `recentPredictions` — 5 most recent

---

### Admin Endpoints (admin role required)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | All users (paginated) |
| DELETE | `/api/admin/users/:id` | Admin | Deactivate user |
| GET | `/api/admin/predictions` | Admin | All predictions (paginated) |
| GET | `/api/admin/system` | Admin | System stats + ML health |

---

## 🔌 ML Service Integration

The backend calls your FastAPI ML service:

**POST** `http://localhost:8000/predict`

**Request:**
```json
{
  "engine_rpm": 1200,
  "lub_oil_pressure": 3.5,
  "fuel_pressure": 2.8,
  "coolant_pressure": 1.2,
  "lub_oil_temp": 75,
  "coolant_temp": 88
}
```

**Expected Response:**
```json
{
  "prediction": 0,
  "failure_probability": 0.12,
  "status": "Normal"
}
```

Status values accepted: `Normal`, `Warning`, `Critical`, `Failure`

---

## 🔒 Security Features

- **Helmet** — HTTP security headers
- **Rate limiting** — 100 req/15min globally; 20 req/15min on auth routes
- **JWT** — Short-lived access tokens (7d) + HTTP-only refresh cookie (30d)
- **bcrypt** — Password hashing (12 rounds)
- **Input sanitization** — express-validator on all endpoints
- **Role-based access** — `user` and `admin` roles
- **Soft deletes** — Users are deactivated, not hard-deleted

---

## 🗄️ Data Models

### User
```
name, email, password (hashed), role (user|admin),
isActive, lastLogin, passwordChangedAt, createdAt, updatedAt
```

### Prediction
```
user (ref), engine_rpm, lub_oil_pressure, fuel_pressure,
coolant_pressure, lub_oil_temp, coolant_temp,
prediction, failure_probability, status, notes,
createdAt, updatedAt
```

---

## 📋 Health Check

```
GET /health
```

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

---

## 🧪 Example cURL Requests

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"SecurePass1"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"SecurePass1"}'

# Create Prediction
curl -X POST http://localhost:5000/api/predictions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "engine_rpm": 1200,
    "lub_oil_pressure": 3.5,
    "fuel_pressure": 2.8,
    "coolant_pressure": 1.2,
    "lub_oil_temp": 75,
    "coolant_temp": 88
  }'

# Dashboard
curl http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer <token>"
```