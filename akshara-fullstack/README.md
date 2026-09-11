# Akshara — AI-Based Intelligent Literacy Assistance Platform for Neo-Learners

Full-stack implementation using the requested tech stack:

| Layer | Tech |
|---|---|
| Backend | Python, Django, Django REST Framework |
| Frontend | JavaScript (React.js) |
| UI structure/styling | HTML + CSS (hand-written design system, no framework) |
| Database | SQLite |
| Auth | JWT (djangorestframework-simplejwt) |

Two independent projects:

```
akshara-backend/    Django + DRF API, JWT auth, SQLite, all 11 planned entities
akshara-frontend/   React (Vite) client consuming that API
```

## Quick start

**Terminal 1 — backend**
```bash
cd akshara-backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver          # http://127.0.0.1:8000
```

**Terminal 2 — frontend**
```bash
cd akshara-frontend
npm install
npm run dev                          # http://127.0.0.1:5173
```

Open `http://127.0.0.1:5173`, register a learner, and go through: profile → learn → assessment →
dashboard. Everything you see is live data from the Django API — nothing is hardcoded in the UI.

## What's implemented

**1. Learner registration and profile**
- Registration, JWT login/authentication, learner profile (name, age, email)
- Preferred language field, basic learner info, proficiency-level field

**2. Database (SQLite via Django ORM)** — all 11 entities: `Learner`, `Language`, `Course`,
`Lesson`, `Topic`, `Assessment`, `Question`, `Answer`, `AssessmentResult`, `LearningProgress`,
`Recommendation`. See `akshara-backend/README.md` for the full field-level schema.

**3. Learning content structure** — Reading content, Writing exercises, Vocabulary,
Comprehension exercises, Practice activities, all modeled as `Lesson.content_type` and
authored per `Course.language` for multilingual support.

**4. Proficiency levels** (agreed scale) —
1. Pre-Literate / Beginner
2. Emerging Reader
3. Developing Reader
4. Functionally Proficient

An assessment submission scores the learner and updates this level automatically
(`≥85%→4, ≥65%→3, ≥40%→2, else→1`).

## Verified

The full flow was exercised against live, running instances of both servers (not just code
review): register → JWT login → browse courses/lessons → take the seeded placement assessment →
score computed server-side → proficiency level updated → mark a lesson complete → a
`Recommendation` is auto-generated and shows up on the dashboard. CORS between the two dev
servers and DRF's paginated response shape were both checked explicitly.

## What's out of scope for this prototype

- No production deployment config (WSGI/ASGI server, HTTPS, env-based secrets)
- No AI/ML-driven recommendation model yet — `Recommendation` generation is a simple
  "next lesson in sequence" rule; swapping in a real model only touches
  `core/views.py::UpdateProgressView`
- Only English course content is seeded; Hindi/Kannada `Language` rows exist and the frontend
  already supports switching between courses per language once more courses are added
