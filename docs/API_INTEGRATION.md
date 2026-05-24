# API / Integration Doc

## External Services
- Google OAuth (Passport)
- Google Gemini API (AI-generated quizzes, coding questions, assessments)
- Socket.io (real-time lobbies and leaderboards)

## Auth Method
- JWT stored in an HTTP-only cookie
- Google OAuth for social login
- Local email/password with bcrypt
- Gemini API key read from request header `x-gemini-api-key` or via server allowlist

## Key Endpoints
Base URL: `/`

### Auth
- `GET /auth/google`
- `GET /auth/google/callback`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/demo-login`
- `GET /auth/logout`
- `GET /auth/me`

### Groups
- `POST /api/groups`
- `POST /api/groups/join`
- `GET /api/groups`
- `GET /api/groups/:id`
- `DELETE /api/groups/:id`

### Quizzes
- `POST /api/quizzes/generate`
- `GET /api/quizzes/:id`
- `POST /api/quizzes/:id/attempt`
- `GET /api/quizzes/:id/results`
- `DELETE /api/quizzes/:id`

### Coding Rounds
- `POST /api/coding-rounds/generate`
- `POST /api/coding-rounds`
- `GET /api/coding-rounds/topics`
- `GET /api/coding-rounds/:id`
- `PUT /api/coding-rounds/:id/end`
- `DELETE /api/coding-rounds/:id`
- `POST /api/coding-rounds/:id/join`
- `POST /api/coding-rounds/:id/submit`
- `POST /api/coding-rounds/:id/questions`
- `POST /api/coding-rounds/:id/start`
- `PUT /api/coding-rounds/:id/questions/:questionId/start`
- `PUT /api/coding-rounds/:id/questions/:questionId/pause`
- `POST /api/coding-rounds/:id/submit-external`

### Online Assessments
- `POST /api/online-assessments/generate-and-create`
- `GET /api/online-assessments/:id`
- `POST /api/online-assessments/:id/start`
- `POST /api/online-assessments/:id/submit-section`
- `PUT /api/online-assessments/:id/end`
- `GET /api/online-assessments/:id/results`
- `DELETE /api/online-assessments/:id`

### Leaderboard
- `GET /api/leaderboard/group/:groupId`
