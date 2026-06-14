# Pipeline — Task Manager Frontend

React + Vite + Tailwind CSS frontend for the SaaS Task Manager (Django + DRF backend).

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Backend

Make sure your Django backend is running on `http://localhost:8000`.
If your backend runs on a different URL, change `BASE_URL` in `src/api/client.js`.

Also make sure `django-cors-headers` allows requests from `http://localhost:5173`
(add it to `CORS_ALLOWED_ORIGINS` in your Django settings).

## Pages

- `/login` — sign in
- `/register` — create account
- `/` — dashboard, list of your workspaces
- `/workspaces/:id` — projects, members, stats, settings (owner only)
- `/workspaces/:id/projects/:id` — kanban board (Todo / In progress / Done)
  - click a task to edit, change status, assign, comment, or delete

## Notes

- JWT access/refresh tokens are stored in localStorage and auto-refreshed on 401.
- "Stats" tab only appears for workspace admins/owners (matches backend permission).
- "Settings" tab (rename/delete workspace) only appears for the workspace owner.
