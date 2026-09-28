# Production Deployment & Free-Tier Keep-Alive Guide

This guide explains how to deploy **GymGenius AI** on free-tier platforms (such as Render for backend and Vercel/Netlify for frontend) and how all optimizations work together.

---

## 1. Free-Tier Backend Inactivity Solution (Render.com)

Render free-tier web services automatically spin down (sleep) after **15 minutes of inactivity**, causing subsequent requests to take 50+ seconds for a cold start.

To eliminate this, GymGenius provides **3 synchronized layers of protection**:

### Layer A: Built-in Internal Keep-Alive Cron
- Located in `server/utils/keepAlive.js`.
- Runs every **12 minutes** using `node-cron`.
- Pings `https://your-backend.onrender.com/api/health`.
- **How to enable:**
  In your Render Service Dashboard -> **Environment Variables**:
  - Add `SERVER_URL` = `https://your-service-name.onrender.com`
  *(Note: Render also automatically injects `RENDER_EXTERNAL_URL`)*.

### Layer B: Free GitHub Actions 24/7 Keep-Alive Workflow
- Located in `.github/workflows/keep-alive.yml`.
- Executes automatically on GitHub's cloud servers every **14 minutes**.
- Even if Render ever goes to sleep or restarts, GitHub Actions sends an external wake-up ping so your backend is always warm when users open the app.
- **How to configure:**
  1. Push this project to your GitHub repository.
  2. In your repo: **Settings** -> **Secrets and variables** -> **Actions**.
  3. Add secret `BACKEND_URL` with value `https://your-backend.onrender.com`.

### Layer C: Free External Cron (Optional 1-Click Setup)
You can also set up a 100% free external monitor in 60 seconds:
1. Visit [cron-job.org](https://cron-job.org) (free).
2. Create a new cron job:
   - **URL**: `https://your-backend.onrender.com/api/health`
   - **Schedule**: Every 10 minutes.
   - **Method**: GET.

---

## 2. Load Balancing & Multi-User Concurrency

To ensure the server handles multiple simultaneous users smoothly without crashing or choking:

1. **MongoDB Connection Pooling**:
   - `maxPoolSize: 50` allows up to 50 concurrent active database queries.
   - `minPoolSize: 5` maintains 5 warm connections at all times.
2. **Rate Limiting**:
   - General API limiter: 300 requests / 15 minutes per IP.
   - AI Route limiter: 60 requests / 10 minutes per IP (prevents single-user quota exhaustion).
3. **In-Memory AI Caching**:
   - Duplicate AI prompts and workout queries are cached in memory (1 hour TTL) and served in **0 ms**.
4. **Per-Request Timeout with AbortController**:
   - AI requests time out after 7 seconds per model, falling back to instant backup models or high-detail local splits so threads never freeze.

---

## 3. "Remember Me" Feature

- The login screen includes a **"Remember me on this device"** checkbox.
- **When checked**:
  - Persists the authentication token and user profile in `localStorage`.
  - Saves your email address to pre-fill upon return.
  - Generates a 90-day long-lived session.
- **When unchecked**:
  - Session is stored in `sessionStorage` (cleared when browser or tab closes).
  - Generates a 24-hour temporary session.
- **Dual-Mode Auth (Cookies + Bearer Token)**:
  - Supports both `httpOnly` cookies and `Authorization: Bearer <token>` headers.
  - Ensures smooth cross-origin operation when frontend is on Vercel (`.vercel.app`) and backend is on Render (`.onrender.com`).

---

## 4. Environment Variables Checklist

### Backend (`server/.env` on Render)
| Variable | Example Value | Description |
|:---|:---|:---|
| `PORT` | `5000` | Port for Express (Render sets this automatically) |
| `NODE_ENV` | `production` | Production mode |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas database URI |
| `JWT_SECRET` | `your_secret_key` | Secret key for JWT signatures |
| `CLIENT_URL` | `https://your-app.vercel.app` | Frontend URL for CORS |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | OpenRouter API Key |
| `GEMINI_API_KEY` | *(Optional)* | Google Gemini API Key |
| `SERVER_URL` | `https://your-backend.onrender.com` | Target URL for keep-alive cron |

### Frontend (`client/.env` on Vercel / Netlify)
| Variable | Example Value | Description |
|:---|:---|:---|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Backend API base URL |
