# API / Integration Documentation

Base URL: `/`

## External Integrations
- Google OAuth (Passport)
- Gemini API (content generation)
- Socket.io (real-time round events)

## Authentication Model
- JWT stored in HTTP-only cookie
- `protect` middleware for private APIs
- `checkNotDemo` middleware for write actions in demo mode
- Optional per-request Gemini key via `x-gemini-api-key`

## Route Inventory

### Auth (`/auth`)
- `GET /google`
- `GET /google/callback`
- `POST /register`
- `POST /login`
- `POST /demo-login`
- `GET /logout`
- `GET /me`

### Groups (`/api/groups`)
- `POST /`
- `POST /join`
- `GET /`
- `GET /:id`
- `DELETE /:id`

### Solo (`/api/solo`)
- `GET /streak`
- `POST /quizzes/generate`
- `GET /quizzes`
- `POST /online-assessments/generate-and-create`
- `GET /online-assessments`
- `POST /coding-rounds`
- `GET /coding-rounds`

### Quizzes (`/api/quizzes`)
- `POST /generate`
- `GET /solo`
- `GET /:id`
- `POST /:id/attempt`
- `GET /:id/results`
- `DELETE /:id`

### Coding Rounds (`/api/coding-rounds`)
- `POST /generate`
- `POST /`
- `GET /topics`
- `GET /:id`
- `PUT /:id/end`
- `DELETE /:id`
- `POST /:id/join`
- `POST /:id/submit`
- `POST /:id/questions`
- `POST /:id/start`
- `PUT /:id/questions/:questionId/start`
- `PUT /:id/questions/:questionId/pause`
- `POST /:id/submit-external`

### Online Assessments (`/api/online-assessments`)
- `POST /generate-and-create`
- `GET /:id`
- `POST /:id/start`
- `POST /:id/submit-section`
- `PUT /:id/end`
- `GET /:id/results`
- `DELETE /:id`

### Leaderboard (`/api/leaderboard`)
- `GET /group/:groupId`

## Notes
- Total route handlers currently defined: **46**.
- Scope-aware authorization is enforced for group vs solo documents.
- Solo streak is computed from quiz attempts, OA section submissions, and passed coding submissions.
