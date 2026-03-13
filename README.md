<div align="center">

<img src="frontend/public/logo.png" alt="FitoGlobe Logo" width="80" height="80" style="border-radius:16px"/>

# FitoGlobe

**AI-powered fitness & nutrition tracker — built for the world**

[![Live](https://img.shields.io/badge/Live-fitoglobe.vercel.app-C8FF00?style=flat-square&logo=vercel&logoColor=black)](https://fitoglobe.vercel.app)



</div>

---

## What is FitoGlobe?

FitoGlobe is a multilingual AI fitness companion that helps users track workouts, log nutrition, monitor progress, and get personalized coaching — all in one sleek dark-mode app.

Built with a mobile-first design, it supports 4 languages and auto-detects units based on your country.

---

## Features

**Fitness Tracking**
- Log workouts with sets, reps, weight and calorie estimates
- Full exercise library with muscle group filters
- Day streak tracking and activity heatmap

**Nutrition**
- Log meals across breakfast, lunch, dinner, snacks
- AI macro calculator — just type a food name
- Daily calorie goal with live progress rings

**AI Features**
- Fito Chat — GROQ-powered fitness chatbot
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
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| AI | GROQ API (llama-3.3-70b + llama-4-scout vision) |
| Auth | JWT + Passport.js + Google OAuth |
| Deployment | Vercel (frontend) + Render (backend + DB) |
| i18n | i18next (EN / ES / JA / KO) |

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

## Deployment

| Service | Platform 
|---------|----------
| Frontend | Vercel 
| Backend | Render 
| Database | Render PostgreSQL

**Note:** Free tier on Render spins down after inactivity — first request may take ~50 seconds.

---

## Environment Variables (Production)

**Render (Backend):**
```
DATABASE_URL
JWT_SECRET
GROQ_API_KEY
FRONTEND_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL
NODE_ENV=production
PORT=5000
```

**Vercel (Frontend):**
```
VITE_API_URL=https://fitoglobe-backend.onrender.com
```

---

## Roadmap

- [x] Core workout & nutrition tracking
- [x] AI macro calculator
- [x] Food scan via GROQ Vision
- [x] Fito Chat (AI fitness chatbot)
- [x] Multilingual support (EN/ES/JA/KO)
- [x] Google OAuth
- [x] PWA support
- [ ] Play Store deployment via Bubblewrap TWA
- [ ] Voice meal logging
- [ ] AI meal planner

---

<div align="center">
  <sub>Built with ◆ by Ayush - India</sub>
</div>
