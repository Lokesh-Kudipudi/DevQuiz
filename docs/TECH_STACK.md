# Tech Stack Doc

## Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Socket.io client
- Monaco Editor (editor integration used in coding flows)

## Backend
- Node.js + Express
- Socket.io
- Passport (Google OAuth)
- JWT auth
- Mongoose

## Database
- MongoDB

## Hosting / Deployment Target
- Not specified in the repo; intended for local development via `npm run dev` for both frontend and backend.

## Constraints
- No hard constraint files defined beyond environment variables in `.env` files.
- Uses Gemini API key from `x-gemini-api-key` header or allowlist.
