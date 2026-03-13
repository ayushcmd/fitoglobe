# FitoGlobe Backend

Node.js + Express + PostgreSQL + Prisma

## Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
# Edit .env with your values (DB, JWT secret, Google OAuth, email)
```

### 3. Setup database
Make sure PostgreSQL is running, then:
```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

### 4. Run server
```bash
npm run dev        # development (auto-restart)
npm start          # production
```

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/signup | Register with email |
| POST | /api/auth/login | Login with email |
| GET  | /api/auth/google | Google OAuth redirect |
| GET  | /api/auth/google/callback | Google OAuth callback |
| POST | /api/auth/forgot-password | Send reset email |
| POST | /api/auth/reset-password | Reset with token |
| GET  | /api/auth/me | Get current user (protected) |

### User
| Method | Route | Description |
|--------|-------|-------------|
| PUT | /api/user/onboarding | Save country, metrics, goal |
| PUT | /api/user/profile | Update profile |
| GET | /api/user/stats | Get user stats |

### Workouts
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/workouts | Get workout sessions |
| POST | /api/workouts | Log a workout session |
| DELETE | /api/workouts/:id | Delete a session |
| GET  | /api/workouts/exercises | Get exercise library |

### Nutrition
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/nutrition?date=YYYY-MM-DD | Get daily logs |
| POST | /api/nutrition | Add food log |
| DELETE | /api/nutrition/:id | Delete log |
| GET  | /api/nutrition/weekly | Get 7-day summary |

### Progress
| Method | Route | Description |
|--------|-------|-------------|
| GET  | /api/progress | Get progress logs |
| POST | /api/progress | Add weigh-in |

### AI Coach
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/ai/chat | Chat with AI coach |
| GET  | /api/ai/conversations | Get chat history |

---

## Authentication
All protected routes require header:
```
Authorization: Bearer <your_jwt_token>
```

## Google OAuth Setup
1. Go to https://console.cloud.google.com
2. Create project → Credentials → OAuth 2.0 Client IDs
3. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Copy Client ID and Secret to .env
