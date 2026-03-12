# JobTrackr

A full-stack MERN job application tracker. Built with React 19, React Router 7, Express, MongoDB, and Node.js.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Components](#pages--components)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Routing](#routing)
- [Authentication Flow](#authentication-flow)
- [API Reference](#api-reference)
- [Email Notifications](#email-notifications)
- [Styling](#styling)

---

## Project Overview

JobTrackr is a single-page React application with an Express/MongoDB backend that provides:

- User registration and login (JWT-based auth)
- Google OAuth login for quick authentication
- Protected routes — unauthenticated users are redirected to `/login`
- A dashboard for viewing, filtering, editing, and deleting tracked job applications
- Inline status dropdown on each job card (Interested → Applied → Interviewing → Offer → Rejected)
- Deadline warning badges on cards with upcoming due dates
- A job marketplace aggregating listings from Adzuna, Reed, and SerpAPI (Google Jobs)
- A form for adding or editing job entries with timezone-safe date handling
- Automated email notifications sent the day before application deadlines

---

## Tech Stack

### Frontend (`client/`)

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.0 | UI component library |
| React DOM | ^19.2.0 | DOM rendering |
| React Router DOM | ^7.13.0 | Client-side routing |
| Vite (rolldown-vite) | 7.2.5 | Build tool & dev server |
| @vitejs/plugin-react | ^5.1.1 | Babel-based React Fast Refresh |
| @react-oauth/google | ^0.12.1 | Google OAuth integration |

### Backend (`server/`)

| Technology | Purpose |
|---|---|
| Express | HTTP server and API routing |
| Mongoose | MongoDB ODM |
| JSON Web Tokens (jsonwebtoken) | Authentication tokens |
| bcrypt | Password hashing |
| Nodemailer | Email sending via Gmail SMTP |
| node-cron | Scheduled deadline checker |
| SerpAPI | Google Jobs search results |
| google-auth-library | Google OAuth token verification |
| dotenv | Environment variable loading |

---

## Project Structure

```
job-tracker/
├── .env                            # Environment variables (not committed)
├── client/
│   ├── index.html
│   ├── vite.config.js              # Vite + /api proxy configuration
│   ├── package.json
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # BrowserRouter + Routes
│       ├── App.css                 # Layout and component styles
│       ├── index.css               # Global reset and CSS variables
│       ├── pages/
│       │   ├── Login.jsx           # /login — username/password + Google OAuth
│       │   ├── Register.jsx        # /register — new account creation
│       │   ├── Dashboard.jsx       # /dashboard — main job tracker view
│       │   └── Marketplace.jsx     # /marketplace — job search page
│       └── components/
│           ├── ProtectedRoute.jsx  # Redirects unauthenticated users to /login
│           ├── DashboardLayout.jsx # Wraps Navbar + page content
│           ├── Navbar.jsx          # Top nav: Dashboard, Marketplace, + Add Job, Logout
│           ├── JobForm.jsx         # Add / edit job entry form
│           ├── JobList.jsx         # Card-based job list with filters
│           ├── JobMarketplace.jsx  # SerpAPI job search and import UI
│           └── Sidebar.jsx         # Sidebar placeholder (minimal)
└── server/
    ├── server.js                   # Express app, MongoDB connection, cron scheduler
    ├── middleware/
    │   └── authMiddleware.js       # JWT verification — populates req.user
    ├── models/
    │   ├── jobModel.js             # Job schema
    │   └── userModel.js            # User schema
    ├── routes/
    │   ├── userRoutes.js           # /api/users — login, register, google-login
    │   ├── jobRoutes.js            # /api/jobs — CRUD operations
    │   └── notificationRoutes.js   # /api/notifications — manual email triggers
    ├── services/
    │   ├── emailService.js         # Gmail SMTP email templates
    │   └── jobService.js           # SerpAPI Google Jobs integration
    └── utils/
        └── deadlineChecker.js      # Queries jobs due tomorrow and sends reminders
```

---

## Pages & Components

### Pages

#### `Login.jsx` — `/login`
- Username + password form with inline error messages (no popups)
- Google OAuth login option via `@react-oauth/google`
- `POST /api/users/login`
- On success: stores `token`, `userId`, `username` in `localStorage`, navigates to `/dashboard`
- On failure: displays inline error; if username not found, prompts user to register
- Internal links use React Router `<Link>` (no full page reload)

#### `Register.jsx` — `/register`
- Username, email, and password form
- `POST /api/users/register`
- On success: stores `token` and user info in `localStorage`, navigates to `/dashboard`
- Email is stored and used for deadline reminder notifications
- Internal links use React Router `<Link>`

#### `Dashboard.jsx` — `/dashboard`
- Fetches all jobs for the authenticated user on mount (`GET /api/jobs`)
- Search bar and status filter dropdown for narrowing results
- Renders `JobList` with filtered jobs
- Opens `JobForm` in add mode (via "+ Add Job" in navbar) or edit mode (via Edit button on card)
- `onCreated` / `onUpdated` callbacks re-fetch the job list after changes

#### `Marketplace.jsx` — `/marketplace`
- Renders `JobMarketplace` component
- Allows users to search job listings aggregated from Adzuna, Reed, and SerpAPI (Google Jobs) and add them directly to their tracker

### Components

#### `ProtectedRoute.jsx`
- Wraps auth-required routes (`/dashboard`, `/marketplace`)
- Redirects to `/login` if no token is found in `localStorage`

#### `DashboardLayout.jsx`
- Layout shell: renders `<Navbar>` above `{children}`

#### `Navbar.jsx`
- Black top bar with "Job Tracker" branding on the left (flexbox layout)
- Navigation buttons: Dashboard, Marketplace, + Add Job, Logout
- Active tab highlighted; syncs with current route via `useLocation`
- Logout clears `localStorage` and navigates to `/login`

#### `JobForm.jsx`
Full job entry form supporting both **add** and **edit** modes:

| Field | Type | Required |
|---|---|---|
| Company | Text input | Yes |
| Job Role | Text input | Yes |
| Application Status | Dropdown | No (default: Applied) |
| Location | Text input | No |
| Application Deadline | Date picker | No |
| Outcome | Dropdown | No (default: Pending) |
| Tags | Comma-separated text | No |
| Job URL | Text input | No |
| Salary | Text input | No |
| Notes | Textarea | No |

Status options: `Interested`, `Applied`, `Interviewing`, `Offer`, `Rejected`
Outcome options: `Pending`, `Accepted`, `Rejected`

- Submits via `POST /api/jobs` (add) or `PUT /api/jobs/:id` (edit)
- Date input values are appended with `T00:00:00` before submission so dates are stored as local midnight (avoiding UTC off-by-one-day display issues)
- Tags are split by comma and trimmed before submission
- Resets form after successful submission

#### `JobList.jsx`
- Empty state UI when no jobs exist or no filters match
- Renders a card per job with:
  - Company name and role
  - Inline status `<select>` dropdown (color-coded) — changes saved immediately via `PUT /api/jobs/:id`
  - Location, deadline, salary, outcome, job URL link, tag chips, notes
  - **Edit** button — opens `JobForm` in edit mode
  - **Delete** button — calls `DELETE /api/jobs/:id` and refreshes list
  - **Deadline warning badge** — shown on `Interested` jobs with deadlines within 7 days:
    - Overdue → red "Overdue"
    - 0 days → red "Due today"
    - 1–3 days → orange "Due in N day(s)"
    - 4–7 days → blue "Due in N days"

#### `JobMarketplace.jsx`
- Search interface that queries `GET /api/jobs/discover` with a job title and optional location
- Aggregates results from Adzuna, Reed (UK-focused), and SerpAPI (Google Jobs)
- Displays external job listings with title, company, location, and description
- "Add to Tracker" button imports a listing directly into the user's job list

---

## Scripts

### Client

Run from `client/`:

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start dev server with HMR at `http://localhost:5050` |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Serve the production build locally |
| `lint` | `eslint .` | Run ESLint |

### Server

Run from `server/`:

```bash
node server.js          # start the server
nodemon server.js       # start with auto-reload (requires nodemon dev dependency)
```

---

## Environment Variables

All environment variables live in a single `.env` file at the **project root** (one level above `client/` and `server/`). The server loads it with `dotenv.config({ path: '../.env' })` when run from the `server/` directory.

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `SerpApi_API_KEY` | SerpAPI key for Google Jobs search |
| `ADZUNA_APP_ID` | Adzuna application ID for job search |
| `ADZUNA_API_KEY` | Adzuna API key for job search |
| `Reed_API_KEY` | Reed API key for job search |
| `GMAIL_USER` | Gmail address for sending notifications |
| `GMAIL_APP_PASSWORD` | Gmail App Password (16 characters, not your regular password) |
| `PORT` | Optional — server port (defaults to `5001`) |

> **Gmail setup:** App Passwords require 2-Step Verification to be enabled on the Gmail account. Generate one at myaccount.google.com → Security → App passwords.

No `.env` file is needed in `client/`. API calls to `/api/*` are proxied to the backend by Vite during development.

---

## Routing

Defined in [client/src/App.jsx](client/src/App.jsx):

| Path | Component | Auth Required |
|---|---|---|
| `/` | `Login` | No |
| `/login` | `Login` | No |
| `/register` | `Register` | No |
| `/dashboard` | `Dashboard` | Yes (ProtectedRoute) |
| `/marketplace` | `Marketplace` | Yes (ProtectedRoute) |

`ProtectedRoute` checks for a token in `localStorage` and redirects to `/login` if absent.

---

## Authentication Flow

### Email / Password Login
1. User submits username and password
2. `POST /api/users/login`
3. Server verifies password using bcrypt, returns a signed JWT
4. Client stores `token`, `userId`, `username` in `localStorage`
5. All subsequent API requests include `Authorization: Bearer <token>`

### Google OAuth Login
1. User clicks "Sign in with Google"
2. Google Identity Services returns an ID token
3. Client sends token to `POST /api/users/google-login`
4. Server verifies token using `google-auth-library`
5. If email does not exist in DB, a new user is created automatically
6. Server returns a JWT used for all subsequent requests

### Auth Middleware
All protected API routes pass through `authMiddleware`, which:
- Extracts the Bearer token from the `Authorization` header
- Verifies it using `jwt.verify`
- Populates `req.user` with the decoded payload
- Returns `401` if the token is missing or invalid

---

## API Reference

All requests in development go to `/api/*` — proxied by Vite to `http://localhost:5001`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | No | Create a new account |
| POST | `/api/users/login` | No | Login with username + password |
| POST | `/api/users/google-login` | No | Login or register via Google OAuth |
| GET | `/api/jobs` | Yes | Get all jobs for the logged-in user (supports `?search=`, `?status=`, `?sort=` query params) |
| GET | `/api/jobs/discover` | Yes | Search external job APIs (Adzuna, Reed, SerpAPI) — accepts `?title=` and `?location=` |
| POST | `/api/jobs` | Yes | Create a new job entry |
| PUT | `/api/jobs/:id` | Yes | Update a job (any field, including status) |
| DELETE | `/api/jobs/:id` | Yes | Delete a job |
| POST | `/api/notifications/check-deadlines` | Yes | Manually trigger the deadline checker |
| POST | `/api/notifications/test-email` | Yes | Send a test email to the logged-in user |

---

## Email Notifications

### Overview
JobTrackr sends automated email reminders the day before a job application deadline.

### How It Works
1. When a user registers, their email is stored in MongoDB
2. When a job is created with a deadline, the date is stored as local midnight
3. A cron job runs daily at **9:00 AM** (server local time)
4. The checker queries for jobs with `dueDate` falling within tomorrow (midnight to midnight)
5. A reminder email is sent to the job owner for each match

### Why Tomorrow (Not "24 Hours From Now")
Since deadlines have no time component — they are always stored at midnight of the chosen day — the checker targets jobs due specifically **tomorrow**. This ensures consistent behavior: the email always arrives the morning before the deadline, regardless of what time the cron fires.

### Email Service Implementation
The nodemailer transporter is created lazily (inside a `getTransporter()` function) rather than at module load time. This is required because the project uses ES modules — all `import` statements are hoisted and resolved before any code runs, including before `dotenv.config()` is called. Creating the transporter lazily ensures environment variables are populated when the transporter is first used.

### Setup Requirements
- `GMAIL_USER` and `GMAIL_APP_PASSWORD` must be set in `.env`
- The Gmail account must have 2-Step Verification enabled
- `GMAIL_APP_PASSWORD` must be a Gmail App Password, not the account password

### Testing Endpoints
```bash
# Manually trigger the deadline checker
curl -X POST http://localhost:5001/api/notifications/check-deadlines \
  -H "Authorization: Bearer <token>"

# Send a test email to verify Gmail credentials
curl -X POST http://localhost:5001/api/notifications/test-email \
  -H "Authorization: Bearer <token>"
```

---

## Styling

### `index.css` — Global styles
- CSS custom properties: `--primary-black`, `--primary-white`, `--primary-blue`
- System font stack
- Global margin/padding reset
- Base styles for `<a>`, `<button>`, `<input>`, `<textarea>`, `<select>`

### `App.css` — Layout & component styles
- `.topbar`: black navigation bar using flexbox — `topbar-left` (branding) pushes `topbar-nav` (buttons) to the right via `margin-right: auto`
- Dashboard two-column grid: `1fr` (form) + `2fr` (job list)
- Responsive breakpoints:
  - `≤ 1024px` (tablet): stacks form and job list vertically
  - `≤ 640px` (mobile): adjusts padding and font sizes
- Job card styles with box shadow and rounded corners
- Status badge colors:

| Status | Color |
|---|---|
| Interested | Gray |
| Applied | Blue (`#dbeafe`) |
| Interviewing | Orange (`#fef3c7`) |
| Offer | Green (`#dcfce7`) |
| Rejected | Red (`#fee2e2`) |
