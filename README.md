# DevQuiz

DevQuiz is a platform for developers to test knowledge, host group challenges, and run AI-generated quizzes and coding rounds.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router, Socket.io client, Monaco Editor
- **Backend**: Node.js, Express, Socket.io, Passport (Google OAuth), JWT
- **Database**: MongoDB (Mongoose)
- **AI**: Gemini API
- **Code Execution**: Piston (via Docker)
- **Tooling**: ESLint, Nodemon

## Core Features

- Google OAuth and email/password authentication
- Create and join groups with invite codes
- AI-generated quizzes, coding rounds, and online assessments
- Real-time rounds, lobbies, and leaderboards with Socket.io
- Code execution sandbox for coding challenges
- Optional local problem catalog override

## Screenshots

![Dashboard](screenshots/1-dashboard.png)
![Group Dashboard](screenshots/2-group-dashboard.png)
![Quiz](screenshots/3-quiz.png)
![Quiz Leaderboard](screenshots/4-quiz-leaderboard.png)
![Quiz Results](screenshots/5-quiz-results.png)

## Challenges Faced and Solution

- **Cross-origin auth cookies**: enforced a CORS allowlist using `CLIENT_URL` and environment-aware cookie settings.
- **AI response reliability**: tightened prompts and cleaned JSON responses before parsing.
- **Problem catalog flexibility**: added an env-based override with fallback paths and caching.

## Quick Setup

1. Clone the repository.
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Configure env files:
   - Copy `backend/.env.example` to `backend/.env` and fill in `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL`.
   - Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` (default `http://localhost:5174`).
5. Optional: start the Piston container for code execution:
   ```bash
   docker compose up -d
   ```
6. Run the app:
   - Backend: `npm run dev` (in `backend`)
   - Frontend: `npm run dev` (in `frontend`)

Default ports: frontend `5173`, backend `5174`.
