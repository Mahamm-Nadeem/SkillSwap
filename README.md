# SkillSwap — Peer-to-Peer Skill Exchange

> **Teach what you know, learn what you want.**  
> A direct, reciprocal knowledge barter platform for creators, students, and professionals to exchange practical skills with zero monetary payments.

---

## 📖 Overview

SkillSwap removes the high financial barriers of private tutoring by pairing learners directly with peer teachers. Users list skills they can teach and skills they wish to learn, negotiate bilateral swaps, schedule time-zone-aware sessions with third-party meeting links, and submit verified mutual reviews.

### ✨ Key Features
- **Profiles & Skill Tags:** List 1–5 offered skills and 1–5 requested skills with proficiency tags (`Beginner`, `Intermediate`, `Advanced`), bio (max 300 chars), and local timezone.
- **Searchable Peer Directory:** Filter directory profiles by skill keyword, proficiency, and exchange compatibility.
- **Swap Requests & Proposals:** Bilateral proposal system with mandatory introductory notes (20–500 chars), acceptance, and decline with optional reasons.
- **Session Scheduling:** Propose, counter-propose, and confirm 30, 45, or 60-minute sessions with external meeting links (Google Meet, Zoom, Teams).
- **Enforced 2-Hour Cancellation Rule:** Prevents late cancellations within 2 hours of scheduled session start time.
- **Calendar Sync (.ics):** Standard iCalendar file generation for one-click export to Google Calendar or Apple Calendar.
- **Post-Session Mutual Feedback:** 1–5 star ratings for punctuality, knowledge sharing, and overall experience, plus optional written reviews and no-show dispute handling.
- **In-App Notifications:** Real-time user alerts for incoming proposals, acceptances, counter-proposals, and feedback.

---

## 📁 Repository Structure

```
SkillSwap/
├── Docs/                               # Specification & Architecture Docs
│   ├── SkillSwap_SRD.md                # System Requirements Document
│   ├── skillswap_product_requirements_document.md # PRD
│   ├── application_flow_documentation.md          # Comprehensive UI/App Flow
│   ├── 02_API_CONTRACT.md              # REST API Endpoint Contract
│   ├── 03_DATA_MODEL.md                # Relational Database Schema
│   ├── 04_TEST_PLAN.md                 # Critical Test Matrix
│   └── VERCEL_DEPLOYMENT_GUIDE.md      # Production Deployment Guide
│
├── frontend/                           # React 19 + Vite Frontend SPA
│   ├── src/                            # Components, Context, Pages, Types
│   ├── index.html                      # HTML Entry
│   ├── package.json                    # Frontend dependencies & scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── vite.config.ts                  # Vite + Tailwind bundler config
│   ├── vercel.json                     # Vercel SPA routing rewrites
│   ├── .env.example                    # Frontend environment template
│   └── .env                            # Active frontend environment (gitignored)
│
├── backend/                            # Django REST Framework Backend API
│   ├── apps/
│   │   ├── users/                      # Custom User model, Auth, Profiles, Directory
│   │   ├── skills/                     # Skills catalog and user skill mappings
│   │   ├── swaps/                      # Swap proposals, Accept/Decline logic
│   │   ├── sessions_app/               # Scheduling, 2h cutoff cancellation, Feedback, ICS
│   │   └── notifications/              # In-app notifications
│   ├── config/                         # Django settings, root URLs, WSGI, ASGI
│   ├── tests/                          # Automated backend test suite (18 tests)
│   ├── manage.py                       # Django CLI utility
│   ├── requirements.txt                # Python dependencies
│   ├── .env.example                    # Backend environment template
│   └── .env                            # Active backend environment (gitignored)
│
├── .gitignore                          # Root gitignore (env, secrets, venv, node_modules)
└── README.md                           # Master Project Documentation
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend:** Python 3.10+, Django 5/6, Django REST Framework (DRF), django-cors-headers
- **Database:** Supabase (PostgreSQL) or local SQLite for development
- **Deployment:** Vercel (Frontend), Render / Railway / Supabase (Backend & DB)

---

## 🚀 Quickstart: Running the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)
- Git

---

### 1. Backend Setup (Django REST Framework)

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows:**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the environment file:
   ```bash
   # Copy the example file if .env is not already present
   cp .env.example .env
   ```
   *(By default, `.env` is configured to run locally with SQLite `db.sqlite3` and `DEBUG=True`.)*

5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

6. Seed initial demonstration data (populates sample users, skills, swap requests, and sessions):
   ```bash
   python manage.py seed_data
   ```

7. Start the Django development server:
   ```bash
   python manage.py runserver 8000
   ```
   The backend API will be running at `http://localhost:8000/api/v1/`.  
   Health check: `http://localhost:8000/api/health/`

---

### 2. Frontend Setup (React + Vite)

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Initialize the environment file:
   ```bash
   cp .env.example .env
   ```
   *(Points `VITE_API_BASE_URL` to `http://localhost:8000/api/v1`)*

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000` (or `http://localhost:5173`).

---

## 🧪 Running Automated Tests

SkillSwap includes an automated test suite covering authentication, 1–5 skills validation, swap proposals, scheduling, the 2-hour cancellation cutoff rule, feedback aggregation, and authorization permissions:

```bash
cd backend
python manage.py test tests
```

Expected output:
```text
Ran 18 tests in ...s
OK
```

---

## 🔑 Demo User Accounts

When the database is seeded using `python manage.py seed_data`, the following test accounts are ready to use:

| User | Email | Password | Offered Skill | Requested Skill |
|---|---|---|---|---|
| **Ayesha Khan** | `ayesha@example.com` | `Password123!` | Conversational English, Essay Writing | Figma, UI Prototyping |
| **Marcus Lee** | `marcus@example.com` | `Password123!` | Figma Basics, Web Design | Spanish, Pronunciation |
| **Elena Rostova** | `elena@example.com` | `Password123!` | Piano Technique, Music Theory | Ableton Live, Audio Mixing |
| **David Kim** | `david@example.com` | `Password123!` | Ableton Live, Audio Mixing | Watercolor Illustration |
| **Priya Patel** | `priya@example.com` | `Password123!` | Watercolor Illustration | Python for Beginners |

---

## 📡 REST API Endpoints Overview

Base path: `/api/v1`

### Authentication & Profiles
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register user account | No |
| `POST` | `/auth/login` | Login and retrieve auth token | No |
| `GET` | `/auth/me` | Current user profile & skills | Yes |
| `POST` | `/profiles/publish` | Complete onboarding & publish profile (1–5 skills) | Yes |
| `PATCH`| `/profiles/me` | Update bio, headline, timezone, avatar | Yes |
| `GET` | `/profiles/directory`| Search & filter public peer directory | No |
| `GET` | `/profiles/{id}` | Public profile card details | No |

### Swaps & Proposals
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/swaps/requests?tab=incoming\|outgoing` | List swap requests | Yes |
| `POST` | `/swaps/requests` | Propose swap (20–500 char note) | Yes |
| `POST` | `/swaps/requests/{id}/accept` | Accept proposal & create session | Recipient |
| `POST` | `/swaps/requests/{id}/decline` | Decline proposal with reason | Recipient |

### Sessions & Scheduling
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/sessions?status=scheduled\|past` | List user sessions | Yes |
| `POST` | `/sessions/{id}/propose-schedule` | Propose meeting date/time/link | Participant |
| `POST` | `/sessions/{id}/confirm-schedule` | Confirm proposed slot | Counterpart |
| `POST` | `/sessions/{id}/cancel` | Cancel session ($\ge 2$ hours notice) | Participant |
| `POST` | `/sessions/{id}/feedback` | Post-session rating & review | Participant |
| `GET` | `/sessions/{id}/export-ics` | Download iCalendar (`.ics`) file | Participant |

### In-App Notifications
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/notifications/` | List user notifications | Yes |
| `POST` | `/notifications/{id}/read` | Mark notification as read | Yes |
| `POST` | `/notifications/read-all` | Mark all notifications read | Yes |

Detailed schema and request/response payloads: [Docs/02_API_CONTRACT.md](file:///c:/Users/Admin/Documents/SkillSwap/Docs/02_API_CONTRACT.md).

---

## 🌐 Production Deployment to Vercel

For a complete step-by-step deployment guide including:
- Configuring Vercel with Root Directory `frontend`
- SPA client-side routing rewrites (`vercel.json`)
- Connecting to Supabase PostgreSQL in production
- Configuring Django CORS headers for Vercel preview domains
- Production security checklists

👉 **Read the [Vercel Deployment Guide](file:///c:/Users/Admin/Documents/SkillSwap/Docs/VERCEL_DEPLOYMENT_GUIDE.md).**

---

## 📄 License
This project is licensed under the MIT License.

