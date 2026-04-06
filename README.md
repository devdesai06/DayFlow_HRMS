# Dayflow HRMS

Premium workspace platform for modern teams. Built with the MERN stack + Socket.io, React Query, and Tailwind.

## Features

- **RBAC & Auth**: Secure JWT (httpOnly), Role-based Access (Super Admin, HR, Employee).
- **Core HR**: Employee management, onboarding.
- **Attendance**: Live timer check-in/out, heatmap visualization.
- **Leave Management**: Granular balance calculation, workflows.
- **Payroll System**: Auto-generation, payslip PDFs dynamically built.
- **Real-Time System**: Socket.io powered push notifications.

## Local Development

### 1. Database & Services
Ensure you have MongoDB running locally or a MongoDB Atlas URI. Create a Cloudinary account for file uploads.

### 2. Install Dependencies
```bash
npm install
npm run install:all
```

### 3. Configure Environment Variables

The repo now includes separate development and production env templates:

- `client/.env.development.example`
- `client/.env.production.example`
- `server/.env.development.example`
- `server/.env.production.example`

For local frontend development, `client/.env.development.local` is already set to the local API and socket URLs.

The backend accepts both the new canonical keys and the older keys already found in some local setups:

- `MONGODB_URI` or `MONGO_URI`
- `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`
- `CLOUDINARY_URL`

### 4. Run The App
```bash
npm run dev
```

This starts the full stack locally:

- API: `http://localhost:5000`
- Frontend: `http://localhost:5173`

The backend env loader now resolves files in this order:

1. `.env`
2. `.env.development` or `.env.production`
3. `.env.local`
4. `.env.development.local` or `.env.production.local`

## Deployment Guide

### Vercel (Frontend)
1. Import the `client/` folder into Vercel.
2. Select **Vite** as the framework.
3. Configure the values from `client/.env.production.example`.
4. The repo includes a `vercel.json` to handle React Router single-page app rewrites correctly. Deploy.

### Render (Backend)
1. Create a new **Web Service** on Render and point it to the `server/` directory.
2. Select **Node** as the environment.
3. Build Command: `npm install`
4. Start Command: `npm start` (or `node server.js`)
5. Configure environment variables matching `server/.env.production.example`.
   - `CLIENT_URL` should be your primary Vercel URL.
   - `CLIENT_URLS` can include multiple comma-separated origins when you want to allow both production and preview/dev frontends.
6. The service requires Node 20 (already enforced via `engines` in `package.json`). Deploy.
