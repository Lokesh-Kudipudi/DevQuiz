# Tech Stack Documentation

## Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Socket.io client
- `react-hot-toast`, `react-markdown`, `rehype-highlight`

## Backend
- Node.js + Express
- Socket.io
- Passport (Google OAuth)
- JWT + cookie-based auth
- Mongoose

## Data Layer
- MongoDB

## AI & Content
- Gemini API for quiz/OA/coding content generation
- Local problem catalog (`problems.json`) for coding-topic workflows

## Security / Access Patterns
- HTTP-only auth cookies
- CORS allowlist
- Protected middleware + demo-write restrictions
- Scope-aware authorization for solo vs group content

## Local Development
- Backend: `npm run dev` on `5174`
- Frontend: `npm run dev` on `5173`
- Optional Docker/Piston setup exists in project history/config references
