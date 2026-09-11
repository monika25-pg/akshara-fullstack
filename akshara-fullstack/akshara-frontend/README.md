# Akshara — Frontend (React + Vite)

React client for the Akshara Intelligent Literacy Assistance Platform. Talks to the Django
backend in `../akshara-backend` over its JWT-secured REST API.

## Stack
- React 19 (Vite)
- react-router-dom (routing)
- axios (API client with automatic JWT refresh on 401)
- Plain CSS design system (`src/index.css`) — no UI framework

## Setup

```bash
cd akshara-frontend
npm install
npm run dev      # http://127.0.0.1:5173
```

**The backend must be running first** at `http://127.0.0.1:8000` (see `../akshara-backend/README.md`),
with CORS already configured to allow `http://127.0.0.1:5173` / `http://localhost:5173`.

The API base URL is set in `src/api/client.js` (`API_BASE`) — change it there if your backend
runs elsewhere.

## Structure

```
src/
  api/
    client.js       axios instance + JWT attach/refresh interceptor
    resources.js     grouped API calls (Auth, Learner, Content, Assessment, Progress)
  context/
    AuthContext.jsx  learner session state, register/login/logout
  components/
    Navbar.jsx
    ProtectedRoute.jsx   redirects to /auth if not signed in
  data/
    levels.js        the 4 proficiency levels (display text — source of truth is the backend)
  pages/
    Home.jsx          landing page
    Auth.jsx           register / login (calls /api/auth/register/ and /api/auth/login/)
    Profile.jsx         view/edit preferred language (calls /api/learners/me/)
    Dashboard.jsx        stats, per-lesson progress, recommendations
    Learn.jsx             reading / writing / vocabulary / comprehension / practice, driven by
                          whatever courses & lessons exist in the backend
    Assessment.jsx        takes a live assessment, submits answers, shows the scored result
    Levels.jsx             proficiency-level reference page
```

## How auth works

1. `POST /api/auth/register/` or `/api/auth/login/` returns `{access, refresh, learner}`.
2. `access` + `refresh` are stored in `localStorage`; `learner` seeds `AuthContext`.
3. Every API call attaches `Authorization: Bearer <access>`.
4. On a `401`, the client automatically calls `/api/auth/refresh/` once and retries the original
   request; if that also fails, the session is cleared and the user is treated as logged out.

## Notes

- The Learn page reads whatever `content_type` lessons exist for the active course
  (`reading`, `writing`, `vocabulary`, `comprehension`, `practice`) — it doesn't hardcode content,
  so anything added via `/admin/` or `seed_data` shows up automatically.
- Language switching in Learn picks between **courses**, since content (not just labels) is
  authored per-language in the backend. Seed data currently only includes an English course —
  add a Hindi/Kannada course via `/admin/` to see the toggle in action.
- Verified against a live backend: register → view profile → browse lessons → take assessment →
  score updates proficiency level → mark a lesson complete → recommendation appears on dashboard.
