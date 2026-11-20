<div align="center">

<img src="frontend/public/logo.png" alt="FitoGlobe Logo" width="80" height="80" style="border-radius:16px"/>

# FitoGlobe

**AI-powered fitness & nutrition tracker — built for the world**

[![Live](https://img.shields.io/badge/Live-fitoglobe.vercel.app-C8FF00?style=flat-square&logo=vercel&logoColor=black)](https://fitoglobe.vercel.app)

<div align="center">
  <img src="https://img.shields.io/badge/%20Best%20on%20Mobile-Open%20in%20phone%20browser%20for%20app--like%20feel-FF3CAC?style=for-the-badge&logoColor=white"/>
</div>

</div>

---

## Try it

Open the [live FitoGlobe app](https://fitoglobe.vercel.app). The interface is designed for mobile browsers, but also works on desktop.

## What is FitoGlobe?

FitoGlobe is a multilingual AI fitness companion that helps users track workouts, log nutrition, monitor progress, and get personalized coaching — all in one sleek dark-mode app.

Built with a mobile-first design, it supports 4 languages and auto-detects units based on your country.

---

## Features

**Fitness Tracking**
- Log workouts with sets, reps, and calorie estimates
- Full exercise library with muscle group filters
- Per-exercise stopwatch with lap tracking
- Day streak tracking and activity heatmap

**Nutrition**
- Log meals across breakfast, lunch, dinner, snacks
- AI macro calculator — just type a food name
- Daily calorie goal with live progress rings

**AI Features**
- Fito Chat — Groq-powered fitness chatbot
- Food Scanner — scan any food photo for instant nutrition info
- AI Coach — personalized coaching conversations

**Progress**
- Weight tracking with BMI calculator
- Target weight goal with progress visualization
- Badges & achievements system
- Monthly breakdown and weekly heatmap

**Global-ready**
- English, Spanish, Japanese, Korean
- Auto-detects kg/cm vs lbs/ft based on country
- Country-specific diet plan suggestions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Custom CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| AI | Groq API (llama-3.3-70b + llama-4-scout vision) |
| Auth | JWT + Passport.js + Google OAuth |
| Deployment | Vercel (frontend) + Render (backend) + Supabase (DB) |

---

## Run locally

FitoGlobe has two separate Node.js applications: a React/Vite frontend and an Express/Prisma backend.

### Prerequisites

- Node.js and npm
- A PostgreSQL database reachable from your local machine
- API credentials for optional integrations such as Groq and Google OAuth

### 1. Clone the project

```bash
git clone https://github.com/ayushcmd/fitoglobe.git
cd fitoglobe
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file using the backend environment variable reference below. Supply your own database connection string and a strong `JWT_SECRET`; never commit the `.env` file.

```bash
npm run build
npm run db:migrate
npm run dev
```

The `build` script generates the Prisma client, `db:migrate` applies development migrations, and `dev` runs the API with nodemon. Database migrations need a configured PostgreSQL connection.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create a `frontend/.env` file with a `VITE_API_URL` pointing to your running backend (see the frontend variable reference below), then start Vite:

```bash
npm run dev
```

Open the local URL printed by Vite. The frontend also provides `npm run build`, `npm run lint`, and `npm run preview` scripts.

> Some AI, authentication, and nutrition features require working backend services and third-party credentials; running the frontend alone will not enable them.

---

## Project Structure

```
fitoglobe/
├── frontend/
│   ├── public/
│   │   ├── logo.png
│   │   └── manifest.json
│   └── src/
│       ├── App.jsx          # Main app (all screens)
│       └── services/
│           ├── api.js       # Axios instance
│           ├── services.js  # All service calls
│           └── auth.service.js
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   └── src/
│       ├── server.js
│       ├── config/
│       │   ├── db.js
│       │   └── passport.js
│       ├── controllers/
│       ├── routes/
│       └── middleware/
└── README.md
```

---

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase (PostgreSQL) |

---

## Environment Variables

Keep credentials in local environment files or your hosting provider's secret manager. Do not commit API keys, database credentials, or JWT secrets.

For local development, set `NODE_ENV=development` rather than the production value shown below.


**Render (Backend):**
```
DATABASE_URL
DIRECT_URL
JWT_SECRET
JWT_EXPIRES_IN=7d
GROQ_API_KEY
FRONTEND_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
NODE_ENV=production
PORT=5000
```

**Vercel (Frontend):**
```dotenv
VITE_API_URL=https://fitoglobe-backend-ko63.onrender.com
```

For local development, replace that deployment URL with the address where your backend is running. The configured port and host determine the correct URL.

---

## Contributing

Contributions and documentation improvements are welcome. Create a descriptive branch, make a focused change, run relevant checks (for frontend changes, `npm run lint` and `npm run build` in `frontend/`), and open a pull request explaining what changed and how it was tested.

If you discover a security issue, avoid posting private keys or exploit details in a public issue.

---

## Roadmap

- [x] Core workout & nutrition tracking
- [x] AI macro calculator
- [x] Food scan via Groq Vision
- [x] Fito Chat (AI fitness chatbot)
- [x] Multilingual support (EN/ES/JA/KO)
- [x] Google OAuth
- [x] Migrated to Render + Supabase (zero cold starts)


---

<div align="center">
  <sub>Built with ◆ by Ayush — India</sub>
</div>