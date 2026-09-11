# Akshara — Backend (Django + DRF + JWT + SQLite)

Backend for the AI-based Intelligent Literacy Assistance Platform for Neo-Learners.
Tested and verified end-to-end (register → login → content → assessment → progress → recommendation).

## Stack
- Python / Django 6.1
- Django REST Framework
- SimpleJWT (access + refresh tokens)
- SQLite (default Django DB, zero setup)
- django-cors-headers (so the React dev server on :5173 can call the API)

## Setup

```bash
cd akshara-backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py seed_data      # creates demo languages, a course, 4 lessons, 1 placement assessment
python manage.py createsuperuser  # optional, for /admin/

python manage.py runserver      # http://127.0.0.1:8000
```

Admin site: http://127.0.0.1:8000/admin/

## Database design (11 entities)

| Entity | Purpose |
|---|---|
| `Language` | Languages content can be authored/consumed in |
| `Learner` | One-to-one with Django's `User` — holds age, preferred language, proficiency level |
| `Course` | A collection of lessons for a language + starting level |
| `Lesson` | A reading / writing / vocabulary / comprehension / practice unit inside a course |
| `Topic` | A skill-area tag under a lesson (used to scope assessments) |
| `Assessment` | A placement test or lesson quiz tied to a topic |
| `Question` | A prompt belonging to an assessment |
| `Answer` | An option belonging to a question (`is_correct` never exposed to learners) |
| `AssessmentResult` | A learner's score + assigned level for one assessment attempt |
| `LearningProgress` | Per-learner, per-lesson completion percentage / status |
| `Recommendation` | System-generated "what to do next" for a learner |

See `core/models.py` for exact fields; `python manage.py seed_data` populates a working example of every entity except `Recommendation` (which is generated automatically once a lesson is completed).

## Proficiency levels (agreed scale, used everywhere)

1. **Pre-Literate / Beginner** — letter recognition, sound-symbol matching, pencil control
2. **Emerging Reader** — sight words, simple word reading, copying text
3. **Developing Reader** — sentence reading, guided writing, basic comprehension
4. **Functionally Proficient** — fluent reading/writing for everyday and work tasks

`Assessment.submit` maps score → level: **≥85% → 4, ≥65% → 3, ≥40% → 2, else → 1**, and updates the learner's `proficiency_level` automatically.

## API reference

Base URL: `http://127.0.0.1:8000/api/`

### Auth
| Method | Endpoint | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/auth/register/` | none | `full_name, email, password, age?, preferred_language?, proficiency_level?` | Creates `User` + `Learner`, returns `{access, refresh, learner}` |
| POST | `/auth/login/` | none | `username` (= email), `password` | Returns `{access, refresh, learner}` |
| POST | `/auth/refresh/` | none | `refresh` | Returns a new `access` token |
| GET/PATCH | `/learners/me/` | Bearer | — | Read or update the signed-in learner's profile |

### Content (read for any authenticated learner, write for staff only)
- `GET /languages/`, `GET /courses/`, `GET /lessons/`, `GET /topics/`
- `GET /lessons/?course=<id>&content_type=reading`

### Assessment
- `GET /assessments/` — list, includes nested questions + answer options (no correct-answer flag)
- `POST /assessments/<id>/submit/` — body `{"answers": {"<question_id>": "<answer_id>", ...}}` → scores, creates `AssessmentResult`, updates learner level
- `GET /results/me/` — the learner's assessment history

### Progress & recommendations
- `GET /progress/me/` — learner's per-lesson progress
- `POST /progress/update/` — body `{"lesson": "<id>", "percent_complete": 40}`; auto-creates a `Recommendation` for the next lesson in sequence when a lesson hits 100%
- `GET /recommendations/me/` — learner's current recommendations

All authenticated requests need `Authorization: Bearer <access_token>`.

## Verified test run

```
POST /api/auth/register/         -> 201, returns JWT pair + learner profile
POST /api/auth/login/            -> 200, returns JWT pair
GET  /api/learners/me/           -> 200, learner profile
GET  /api/courses/ /lessons/     -> 200, seeded content
GET  /api/assessments/           -> 200, 3 MCQ questions, no is_correct leaked
POST /api/assessments/<id>/submit/  -> 200, {correct:3, total:3, score:100.0, level_assigned:4}
GET  /api/learners/me/           -> 200, proficiency_level now 4
POST /api/progress/update/       -> 200, status "completed"
GET  /api/recommendations/me/    -> 200, next lesson auto-recommended
```
