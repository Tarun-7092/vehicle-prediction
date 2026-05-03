# VehicleAI — Vehicle Breakdown Prediction System

A full-stack, production-ready application that predicts vehicle breakdowns using real-time sensor data, a machine learning service, and a modern SaaS dashboard.

```
React Frontend  →  Express Backend  →  FastAPI ML Service  →  MongoDB
     :3000              :5000                 :8000
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js 18+, Express.js (ES Modules) |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens), bcryptjs |
| ML Service | FastAPI (external) |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Winston, Morgan |
| API Docs | Swagger / OpenAPI 3.0 |

---

## Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── api/                  axios.js · auth.js · predictions.js
│   │   ├── context/              AuthContext.jsx
│   │   ├── hooks/                usePredictions.js
│   │   ├── routes/               AppRouter.jsx
│   │   ├── layouts/              AppLayout.jsx · AuthLayout.jsx
│   │   ├── components/
│   │   │   ├── layout/           Sidebar.jsx · Topbar.jsx
│   │   │   ├── ui/               Button · GlassCard · StatCard · StatusBadge · Modal · Skeleton
│   │   │   ├── charts/           MonthlyChart · StatusPieChart · ProbabilityGauge
│   │   │   ├── auth/             AuthForm.jsx
│   │   │   └── predictions/      SensorInput.jsx · PredictionResult.jsx
│   │   ├── pages/                Login · Register · Dashboard · Predict · History · Profile · Admin
│   │   ├── utils/                helpers.js
│   │   ├── styles/               index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── backend/
    ├── src/
    │   ├── config/               database.js · swagger.js
    │   ├── controllers/          auth · prediction · analytics · admin
    │   ├── middleware/           auth · errorHandler · validate · notFound
    │   │   └── validators/       auth.validator · prediction.validator
    │   ├── models/               User.model.js · Prediction.model.js
    │   ├── routes/               auth · prediction · analytics · admin
    │   ├── services/             ml.service.js
    │   ├── utils/                ApiResponse · AppError · jwtHelper · logger
    │   └── app.js
    ├── server.js
    ├── package.json
    └── .env.example
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- FastAPI ML service running on port 8000

### 1. Clone & install

```bash
git clone https://github.com/your-org/vehicleai.git
cd vehicleai
```

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vehicle_prediction
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d
ML_SERVICE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:3000
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start all services

```bash
cd backend && npm run dev
```

```bash
cd frontend && npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API Docs | http://localhost:5000/api/docs |
| Health Check | http://localhost:5000/health |
| ML Service | http://localhost:8000 |

---

## Frontend Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Sign in with email and password |
| `/register` | Public | Create a new account |
| `/dashboard` | Auth | Stats overview, charts, recent predictions |
| `/predict` | Auth | Sensor input form + ML result panel |
| `/history` | Auth | Paginated prediction records with filter/sort/delete |
| `/profile` | Auth | Account info, password change, danger zone |
| `/admin` | Admin | User management, all predictions, system stats |

---

## Backend API Reference

All protected endpoints require:

```
Authorization: Bearer <access_token>
```

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | Refresh token |
| GET | `/api/auth/me` | Yes | Get current user |
| PATCH | `/api/auth/update-password` | Yes | Change password |
| POST | `/api/auth/logout` | Yes | Logout |

### Predictions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/predictions` | Yes | Run prediction |
| GET | `/api/predictions` | Yes | List with pagination and filters |
| GET | `/api/predictions/:id` | Yes | Single prediction |
| DELETE | `/api/predictions/:id` | Yes | Delete prediction |

#### Prediction request body

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

#### List query parameters

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number, default 1 |
| `limit` | int | Per page, 1–100, default 10 |
| `status` | string | Normal · Warning · Critical · Failure |
| `minProbability` | float | 0–1 |
| `maxProbability` | float | 0–1 |
| `from` | ISO date | Start date |
| `to` | ISO date | End date |
| `sortBy` | string | createdAt · failure_probability · engine_rpm · status |
| `sortOrder` | string | asc · desc |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/dashboard` | Yes | Summary, breakdown, monthly stats, recent |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | All users paginated |
| DELETE | `/api/admin/users/:id` | Admin | Deactivate user |
| GET | `/api/admin/predictions` | Admin | All predictions paginated |
| GET | `/api/admin/system` | Admin | System stats and ML health |

---

## ML Service Integration

The backend proxies sensor data to the FastAPI ML service.

**Endpoint:** `POST http://localhost:8000/predict`

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

**Response:**
```json
{
  "prediction": 0,
  "failure_probability": 0.12,
  "status": "Normal"
}
```

Accepted status values: `Normal` `Warning` `Critical` `Failure`

The ML client handles connection errors, timeouts, and incomplete responses with appropriate HTTP status codes returned to the frontend.

---

## Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | 2–100 chars |
| `email` | String | Unique, lowercase |
| `password` | String | Bcrypt hashed, never returned |
| `role` | String | user or admin |
| `isActive` | Boolean | False = soft deleted |
| `lastLogin` | Date | Updated on each login |
| `passwordChangedAt` | Date | Invalidates older tokens |

### Prediction

| Field | Type | Notes |
|-------|------|-------|
| `user` | ObjectId | Ref to User |
| `engine_rpm` | Number | 0–10000 |
| `lub_oil_pressure` | Number | >= 0 |
| `fuel_pressure` | Number | >= 0 |
| `coolant_pressure` | Number | >= 0 |
| `lub_oil_temp` | Number | |
| `coolant_temp` | Number | |
| `prediction` | Number | Raw ML output |
| `failure_probability` | Number | 0–1 |
| `status` | String | Normal · Warning · Critical · Failure |
| `notes` | String | Optional, max 500 chars |
| `createdAt` | Date | Auto |

---

## Security

- JWT access tokens (7d) with HTTP-only refresh cookies (30d)
- bcrypt password hashing with 12 rounds
- Helmet HTTP security headers
- Global rate limit: 100 requests per 15 minutes
- Auth route rate limit: 20 requests per 15 minutes
- express-validator on every endpoint
- Role-based access control (user / admin)
- Soft deletes — users deactivated, not hard-deleted
- Password change invalidates all previous tokens

---

## cURL Examples

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"SecurePass1"}'

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"SecurePass1"}'

curl -X POST http://localhost:5000/api/predictions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"engine_rpm":1200,"lub_oil_pressure":3.5,"fuel_pressure":2.8,"coolant_pressure":1.2,"lub_oil_temp":75,"coolant_temp":88}'

curl http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer <token>"

curl http://localhost:5000/health
```

---

## Production Build

```bash
cd frontend && npm run build
```

Output is in `frontend/dist/`. Serve with any static host (Nginx, Vercel, Netlify) and set `VITE_API_URL` to your production backend URL.

```bash
cd backend && NODE_ENV=production npm start
```

---

## License

MIT
