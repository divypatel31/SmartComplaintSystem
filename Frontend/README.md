# Smart Complaint System — React Frontend

A modern, dark-themed web UI for the Smart Complaint System built with
**React 18 + Vite + Tailwind CSS**.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## Project Structure

```
smart-complaint-system/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── BACKEND_UPGRADE_GUIDE.md     ← How to connect Spring Boot API
└── src/
    ├── main.jsx                 ← App entry point
    ├── App.jsx                  ← Router + route guards
    ├── index.css                ← Tailwind + global styles
    ├── context/
    │   └── AuthContext.jsx      ← Login state, stored in sessionStorage
    ├── data/
    │   └── mockApi.js           ← Mock API (swap with real fetch() later)
    └── components/
        ├── auth/
        │   ├── LoginPage.jsx    ← Login form with quick-fill dev buttons
        │   └── RegisterPage.jsx ← 2-step registration (credentials → role)
        ├── shared/
        │   ├── DashboardLayout.jsx ← Sidebar + topbar shell
        │   ├── ComplaintCard.jsx   ← Reusable complaint display card
        │   ├── StatCard.jsx        ← Metric summary card
        │   └── Modal.jsx           ← Reusable modal dialog
        └── dashboards/
            ├── UserDashboard.jsx   ← Submit & view own complaints
            ├── AdminDashboard.jsx  ← View all, assign workers
            └── WorkerDashboard.jsx ← View assigned, mark resolved
```

---

## Demo Credentials (Mock Data)

| Role   | Username | Password   | Notes                     |
|--------|----------|------------|---------------------------|
| Admin  | admin    | admin123   | Can assign complaints      |
| User   | alice    | alice123   | Can submit complaints      |
| Worker | charlie  | charlie123 | PLUMBING specialty         |
| Worker | diana    | diana123   | ELECTRICAL specialty       |
| Worker | eve      | eve123     | IT specialty               |

Quick-login buttons are available on the login screen for development.

---

## Routing

| Path        | Access        | Component         |
|-------------|---------------|-------------------|
| /           | Redirect      | → role-based path |
| /login      | Guest only    | LoginPage         |
| /register   | Guest only    | RegisterPage      |
| /user       | USER role     | UserDashboard     |
| /admin      | ADMIN role    | AdminDashboard    |
| /worker     | WORKER role   | WorkerDashboard   |

Route guards redirect unauthenticated users to `/login`.
Authenticated users trying to access `/login` are redirected to their dashboard.

---

## Connecting to Spring Boot

See **BACKEND_UPGRADE_GUIDE.md** for:
- Full Spring Boot project structure
- All model/repository/controller code
- CORS setup
- How to swap mock functions for real `fetch()` calls
- Vite proxy configuration

---

## Tech Stack

- React 18
- React Router v6
- Vite 5
- Tailwind CSS 3
- Google Fonts: Syne + DM Sans + DM Mono
