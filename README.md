# ExpenseFlow 

![ExpenseFlow Hero](frontend/src/assets/hero.png) <!-- Ensure you have a hero image or remove this if not present -->

ExpenseFlow is a modern, full-stack Personal Finance Management (PFM) application built with the MERN stack. It transforms raw transactions into actionable insights, featuring complex MongoDB aggregations for real-time reporting, budget tracking, and beautiful Recharts analytics.

## ✨ Features

- **Live Analytics Dashboard**: View savings rates, total income, and detailed breakdowns powered by native MongoDB `$group` and `$lookup` aggregations.
- **Smart Budgets**: Track spending limits visually. Health bars automatically update to *Healthy*, *Warning*, or *Exceeded*.
- **Interactive Transactions Drawer**: Seamlessly create and edit transactions without losing context using a premium slide-over drawer.
- **Reports & Exports**: Filter data chronologically, generate Native UI-printable PDFs, and export standard CSV spreadsheets instantly.
- **Dark Mode Optimization**: A sleek, custom glassmorphism design that fully supports system light/dark mode out of the box.

## 🛠️ Tech Stack

**Frontend**
- **React 19** + **Vite**
- **Tailwind CSS 4** (with custom CSS tokens and glassmorphism utilities)
- **React Query** (for aggressive client-side caching & refetching)
- **Zod & React Hook Form** (for strict input validation)
- **Recharts** (for Donut and Area visualizations)

**Backend**
- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Tokens for secure authentication)

## 📂 Folder Structure

```
expenseflow/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route logic & aggregations
│   │   ├── middlewares/   # JWT verification & Error handlers
│   │   ├── models/        # Mongoose Schemas (User, Transaction, Budget)
│   │   ├── routes/        # Express API endpoints
│   │   └── server.ts      # App Entrypoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI (Cards, Drawers, Modals)
│   │   ├── pages/         # Dashboard, Budgets, Reports, etc.
│   │   ├── services/      # Axios configurations
│   │   └── store/         # Zustand global state (Auth, UI)
│   └── vite.config.ts
└── README.md
```

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/expenseflow.git
cd expenseflow
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expenseflow
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```
Start the Vite development server:
```bash
npm run dev
```

## ☁️ Deployment Guide

This application is explicitly architected to deploy easily to modern cloud providers.

### Frontend (Vercel)
1. Import the repository into Vercel.
2. Set the **Framework Preset** to `Vite`.
3. Set the **Root Directory** to `frontend`.
4. Add Environment Variable: `VITE_API_URL = <YOUR_RAILWAY_URL>/api/v1`
5. Deploy.

### Backend (Railway)
1. Create a new Railway project and connect your GitHub repo.
2. Set the **Root Directory** to `/backend`.
3. Railway will automatically detect the `start` and `build` scripts in `package.json` (`node dist/server.js` and `npx tsc`).
4. Add your Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).
5. Deploy.

### Database (MongoDB Atlas)
1. Create a free shared cluster on MongoDB Atlas.
2. In Network Access, whitelist `0.0.0.0/0` (or Railway's static IPs).
3. Copy the Connection String into the Railway `MONGO_URI` environment variable.

## 👥 Demo Account
A built-in seeder isn't required. You can instantly create an account via the `/register` page and start logging transactions. Alternatively, the application exposes a `/api/v1/auth/demo` endpoint which can be wired to a "Login as Demo User" button if needed for portfolio previews.
