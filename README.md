# React + Vite

## CareerForge AI setup

The Resume ATS Analyzer and Career Guidance roadmap use Google Gemini from the
backend. Create a free Gemini API key in [Google AI Studio](https://aistudio.google.com/app/apikey)
and put it in `backend/.env`:

```env
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Replace the demo value currently in `backend/.env`; never put this key in the
frontend or commit it. The API is called server-side, and the app falls back to
its local analyzer if Gemini or the backend is unavailable.

Install and run the two apps in separate terminals:

```bash
npm install
cd backend
npm install
npm run dev
```

In another terminal from the project root, run `npm run dev`. Copy
`.env.example` to `.env` if the frontend uses a different backend URL.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
