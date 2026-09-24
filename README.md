# CareerForge

CareerForge is a role-based campus placement platform for students, recruiters, and TPO administrators. It uses a React/Vite frontend, Express API, MongoDB persistence, JWT authentication, resume analysis, career guidance, DSA progress, placement drives, and job applications.

## Features

- Student, recruiter, and administrator roles with server-enforced RBAC.
- MongoDB-backed jobs, applications, profiles, placement drives, resume analyses, DSA activity, and roadmaps.
- JWT authentication with account activation, email verification, and password reset links.
- Optional transactional email delivery through Resend; without its credentials, email delivery is safely skipped in local development.
- API request limits, security headers, restricted CORS, request-size limits, and a health endpoint.
- Fixed brand theme: light background `#EFFAFD`, primary `#4A8BDF`, accent `#A0006D`, with a persisted dark-mode toggle.

## Local setup

### 1. Configure MongoDB

Use either a local MongoDB server or a MongoDB Atlas cluster.

```env
# backend/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/careerforge
JWT_SECRET=generate_a_unique_random_secret_of_32_or_more_characters
CLIENT_URL=http://localhost:5173
RECRUITER_REGISTRATION_CODE=your-private-recruiter-code
ADMIN_REGISTRATION_CODE=your-private-admin-code
```

For Atlas, replace `MONGO_URI` with the connection string from Atlas and allow your development IP address in **Network Access**. Never commit `backend/.env`.

### 2. Optional email and AI configuration

```env
# backend/.env
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=CareerForge <noreply@your-verified-domain.com>
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Resend requires a verified sending domain. The app still runs locally without these optional keys; AI features use their existing fallback behavior and email links are not delivered.

### 3. Install and run

In separate terminals:

```bash
# terminal 1: API
cd backend
npm install
npm run dev
```

```bash
# terminal 2: frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`. The API health check is available at `http://localhost:5000/health`.

## MongoDB data

Connect MongoDB Compass to your `MONGO_URI`. The principal collections are `users`, `jobs`, `applications`, `companies`, `resumes`, `roadmaps`, `dsaprogresses`, and `dsasubmissions`.

## Deploy

1. Create a MongoDB Atlas production cluster and database user with only the required database access.
2. Deploy `backend` to a Node.js host (Render, Railway, or similar). Set every value from `backend/.env.example`, set `CLIENT_URL` to your deployed frontend URL, and configure `/health` as the health check.
3. Deploy the repository root as a static Vite app (Vercel, Netlify, or similar). Set `VITE_API_URL` to the deployed backend URL.
4. Update backend `CLIENT_URL` with the exact frontend URL, including `https://`, then verify CORS, registration codes, email links, and role permissions.

## Production checklist

- Use a long, unique `JWT_SECRET`; rotate it if leaked.
- Do not use public recruiter or administrator invitation codes.
- Add your deployed domain to the Resend verified domains list.
- Back up MongoDB Atlas and restrict its network access.
- Keep secrets only in deployment environment variables, never in Git.
