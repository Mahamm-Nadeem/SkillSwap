# Vercel Deployment Guide: SkillSwap

This guide provides end-to-end instructions for deploying the **SkillSwap** application to production using **Vercel** for the React frontend, coupled with **Supabase (PostgreSQL)** and a production host for the **Django REST API backend**.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │            User Browser              │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
     ┌────────────────────────┐                     ┌─────────────────────────┐
     │   Frontend on VERCEL   │                     │  Backend REST API (DRF) │
     │  (React + Vite + SPA)  │─── API Requests ───►│ (Render / Railway / VM) │
     │  https://*.vercel.app  │                     │  https://api.yourdomain │
     └────────────────────────┘                     └────────────┬────────────┘
                                                                 │
                                                                 ▼
                                                    ┌─────────────────────────┐
                                                    │   Supabase PostgreSQL   │
                                                    │   (Managed DB + Auth)   │
                                                    └─────────────────────────┘
```

---

## 1. Preparing the Frontend for Vercel

The frontend is located in the `/frontend` directory and is powered by **Vite** and **React 19**.

### 1.1 SPA Routing Configuration (`vercel.json`)
Client-side routing requires all route requests to rewrite to `/index.html` to avoid 404 errors when users refresh deep links (such as `/explore`, `/requests`, `/sessions/1`).

The repository includes [frontend/vercel.json](file:///c:/Users/Admin/Documents/SkillSwap/frontend/vercel.json):
```json
{
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 1.2 Environment Variables for Frontend
Before deploying, ensure you configure the following in the Vercel dashboard:

| Variable | Description | Example Value |
|---|---|---|
| `VITE_API_BASE_URL` | Full URL to your production Django API | `https://api.yourdomain.com/api/v1` |
| `VITE_APP_TITLE` | Application title | `SkillSwap — Peer-to-Peer Skill Exchange` |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini AI API key | `AIzaSy...` |

---

## 2. Deploying the Frontend to Vercel

### Method A: Deploy via Vercel Web Dashboard (Recommended)

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com](https://vercel.com/) and sign in.
3. Click **"Add New..."** $\to$ **"Project"**.
4. Import your `SkillSwap` repository.
5. In the **Configure Project** screen:
   - **Project Name:** `skillswap` (or your preferred name)
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and select `frontend` (crucial: ensure this points to `frontend`!)
   - **Build and Output Settings:**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
6. Expand **Environment Variables** and add:
   ```env
   VITE_API_BASE_URL=https://your-backend-api-url.com/api/v1
   ```
7. Click **"Deploy"**.
8. Once the build finishes, Vercel will provide your live URL: `https://skillswap.vercel.app`.

---

### Method B: Deploy via Vercel CLI

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Authenticate and deploy preview:
   ```bash
   vercel
   ```
4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 3. Database Setup (Supabase PostgreSQL)

SkillSwap uses PostgreSQL for persistence.

1. Go to [supabase.com](https://supabase.com/) and create a new project.
2. Under **Project Settings** $\to$ **Database**, find your connection string:
   - Select **URI** mode.
   - Copy the string format:
     ```
     postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```
3. Note your Supabase project URL and anon public key for optional client-side storage features.

---

## 4. Deploying the Django Backend

Vercel is optimized for static sites and serverless Node/Edge runtimes. For production Django REST Framework backends with relational database connections, deploying to **Render**, **Railway**, **Fly.io**, or **AWS** is recommended.

### Example: Deploying Backend to Render / Railway

1. **Create Web Service** pointing to your repository.
2. Set **Root Directory** to `backend`.
3. Set **Environment**: `Python 3`.
4. **Build Command**:
   ```bash
   pip install -r requirements.txt && python manage.py migrate
   ```
5. **Start Command**:
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
   ```
   *(Note: add `gunicorn` to `requirements.txt` if deploying on Linux containers).*
6. Set **Environment Variables**:
   ```env
   DEBUG=False
   SECRET_KEY=generate-a-strong-random-50-character-string
   ALLOWED_HOSTS=api.yourdomain.com,your-backend.onrender.com
   CORS_ALLOWED_ORIGINS=https://skillswap.vercel.app,https://*.vercel.app
   DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
   ```
7. Run migrations and seed data:
   ```bash
   python manage.py migrate
   python manage.py seed_data
   ```

---

## 5. Configuring CORS & Security

To allow your Vercel frontend to communicate with your backend API:

1. In `backend/.env` (or your backend hosting environment variables), update `CORS_ALLOWED_ORIGINS`:
   ```env
   CORS_ALLOWED_ORIGINS=https://skillswap.vercel.app,https://your-custom-domain.com
   ```
2. In `backend/config/settings.py`, CORS headers are already set up via `django-cors-headers`:
   ```python
   CORS_ALLOW_CREDENTIALS = True
   ```
3. If using Vercel preview branch deployments (e.g. `skillswap-git-branch-team.vercel.app`), add:
   ```python
   CORS_ALLOWED_ORIGIN_REGEXES = [
       r"^https://.*\.vercel\.app$",
   ]
   ```

---

## 6. Post-Deployment Verification Checklist

- [ ] **Frontend Loading:** Access `https://skillswap.vercel.app` and confirm landing page renders.
- [ ] **SPA Direct Refresh:** Navigate to `/explore` and refresh the browser; ensure no 404 occurs.
- [ ] **API Health Check:** Visit `https://api.yourdomain.com/api/health/` and confirm `{"status": "healthy"}`.
- [ ] **Directory Fetch:** Verify that cards on `/explore` display seed users and skill badges from the backend.
- [ ] **User Auth:** Test registration or log in with demo account (`ayesha@example.com` / `Password123!`).
- [ ] **Swap Request:** Send a swap proposal and confirm status `Pending` is created.
- [ ] **Scheduling & Calendar:** Propose a meeting slot and test `.ics` export.
- [ ] **Feedback:** Complete a feedback submission and confirm average rating recalculation.

---

## 7. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **404 Not Found on Page Refresh** | Missing SPA rewrite rule | Verify `frontend/vercel.json` exists with rewrites to `/index.html`. |
| **CORS Error in Browser Console** | Backend does not allow Vercel origin | Add your Vercel deployment URL to `CORS_ALLOWED_ORIGINS` in backend environment settings. |
| **Vercel Build Error: Cannot find package.json** | Root directory incorrect | In Vercel Project Settings, change **Root Directory** from `.` to `frontend`. |
| **500 Internal Server Error on API** | Missing database or migrations | Ensure `DATABASE_URL` is set in backend environment and run `python manage.py migrate`. |
| **Mixed Content Warning** | Frontend is HTTPS, API is HTTP | Ensure backend is served over secure HTTPS (Render/Railway/Vercel provide free SSL automatically). |

