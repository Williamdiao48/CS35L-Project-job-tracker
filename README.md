# JobTrackr — Client (Frontend)

React + Vite frontend for the **JobTrackr** full-stack job application tracker. Built with React 19, React Router 7, and bundled via rolldown-vite.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Components](#pages--components)
- [Dependencies](#dependencies)
- [Scripts](#scripts)
- [Vite Configuration](#vite-configuration)
- [Environment & Proxy](#environment--proxy)
- [Routing](#routing)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Email Notifications](#email-notifications)
- [Styling](#styling)

---

## Project Overview

The client is a single-page React application that provides:

- User registration and login (JWT-based auth)
- Google OAuth login for quick authentication
- A dashboard for viewing all tracked job applications
- A form for adding new job entries
- Color-coded status badges and card-based job listings
- Automated email notifications 24 hours before application deadlines
- Responsive layout for desktop, tablet, and mobile

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.0 | UI component library |
| React DOM | ^19.2.0 | DOM rendering |
| React Router DOM | ^7.13.0 | Client-side routing |
| Vite (rolldown-vite) | 7.2.5 | Build tool & dev server |
| @vitejs/plugin-react | ^5.1.1 | Babel-based React Fast Refresh |
| ESLint | ^9.39.1 | Code linting |
| eslint-plugin-react-hooks | ^7.0.1 | React Hooks lint rules |
| eslint-plugin-react-refresh | ^0.4.24 | Vite HMR lint rules |
| @types/react | ^19.2.5 | React type definitions |
| @types/react-dom | ^19.2.3 | React DOM type definitions |
| globals | ^16.5.0 | Global variable definitions for ESLint |
| @eslint/js | ^9.39.1 | ESLint JS rule set |

---

## Project Structure

```
client/
├── index.html                  # Entry HTML — mounts #root div
├── vite.config.js              # Vite + proxy configuration
├── eslint.config.js            # ESLint flat config
├── package.json                # Dependencies and scripts
├── src/
│   ├── main.jsx                # React entry — renders App into #root
│   ├── App.jsx                 # Root component with BrowserRouter + Routes
│   ├── App.css                 # Layout and component styles
│   ├── index.css               # Global reset, CSS variables, base styles
│   ├── pages/
│   │   ├── Login.jsx           # /login — username/password login form
│   │   ├── Register.jsx        # /register — new account creation form
│   │   └── Dashboard.jsx       # /dashboard — main job tracker view
│   ├── components/
│   │   ├── DashboardLayout.jsx # Wraps Navbar + page content
│   │   ├── Navbar.jsx          # Top nav bar with navigation and Add Job button
│   │   ├── Sidebar.jsx         # Sidebar placeholder (currently minimal)
│   │   ├── JobForm.jsx         # Form for creating a new job entry
│   │   └── JobList.jsx         # Card-based list of job applications
│   └── assets/
│       └── react.svg
```

---

## Pages & Components

### Pages

#### `Login.jsx` — `/login`
- Username + password form
- Google OAuth login option
- `POST /api/users/login`
- On success: stores `token`, `userId`, `username` in `localStorage`, redirects to `/dashboard`
- On failure: shows inline error; prompts to register if username not found

#### `Register.jsx` — `/register`
- Username, email, and password form
- `POST /api/users/register`
- On success: stores `token` and user info in `localStorage`, redirects to `/dashboard`
- User email is stored and used for deadline notifications

#### `Dashboard.jsx` — `/dashboard`
- Fetches all jobs for the authenticated user on mount (`GET /api/jobs`)
- Passes jobs down to `JobList`
- Renders `JobForm` for adding new jobs
- `onCreated` callback re-fetches the job list after a new job is added
- Uses `useCallback` + `useEffect` for data fetching

### Components

#### `DashboardLayout.jsx`
- Layout shell: renders `<Navbar>` above `{children}`
- CSS classes: `.app-container`, `.main-content`, `.content-wrapper`

#### `Navbar.jsx`
- Black top bar with "Job Tracker" branding
- Navigation buttons: Dashboard, Settings, +Add Job
- Tracks active state per button
- "+Add Job" button triggers the job form display

#### `Sidebar.jsx`
- Placeholder sidebar (Dashboard, Add Job, Settings menu items)
- Not actively used in the current layout

#### `JobForm.jsx`
Full job creation form with the following fields:

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

- Submits via `POST http://localhost:5001/api/jobs` with `Authorization: Bearer <token>`
- Tags are split by comma and trimmed before submission
- Calls `onCreated()` prop after successful submission to refresh the parent list
- Resets form after submission
- If a deadline is set, user will receive email notification 24 hours before

#### `JobList.jsx`
- Renders an empty state with a help message when no jobs exist
- Renders job cards for each entry with:
  - Company name and role
  - Status badge (color-coded: blue/orange/green/red)
  - Location, deadline, salary
  - Outcome (shown only when not Pending)
  - Clickable job URL
  - Tag chips
  - Notes

Status badge colors:
| Status | Background |
|---|---|
| Applied | `#E3F2FD` (blue) |
| Interviewing | `#FFF3E0` (orange) |
| Offer | `#E8F5E9` (green) |
| Rejected | `#FFEBEE` (red) |

---

## Dependencies

### Production (`dependencies`)

```json
"react": "^19.2.0"
"react-dom": "^19.2.0"
"react-router-dom": "^7.13.0"
"@react-oauth/google": "^0.12.1"
```

### Development (`devDependencies`)

```json
"@eslint/js": "^9.39.1"
"@types/react": "^19.2.5"
"@types/react-dom": "^19.2.3"
"@vitejs/plugin-react": "^5.1.1"
"eslint": "^9.39.1"
"eslint-plugin-react-hooks": "^7.0.1"
"eslint-plugin-react-refresh": "^0.4.24"
"globals": "^16.5.0"
"vite": "npm:rolldown-vite@7.2.5"
```

> **Note:** `vite` is aliased to `rolldown-vite@7.2.5` via both `devDependencies` and the `overrides` field. rolldown-vite is an experimental Vite fork using the Rolldown bundler (Rust-based) for improved build performance.

---

## Scripts

Defined in `package.json`:

| Script | Command | Description |
|---|---|---|
| `dev` | `vite` | Start development server with HMR at `http://localhost:5173` |
| `build` | `vite build` | Production build output to `dist/` |
| `preview` | `vite preview` | Serve the production build locally for testing |
| `lint` | `eslint .` | Run ESLint across all source files |

Run any script with:
```bash
npm run <script>
# or
yarn <script>
```

---

## Vite Configuration

**File:** [client/vite.config.js](client/vite.config.js)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})
```

- Uses `@vitejs/plugin-react` (Babel-based Fast Refresh)
- Dev server proxies all `/api/*` requests to the Express backend at `http://localhost:5001`

---

## Environment & Proxy

No `.env` file is required in the `client/` directory. API calls made to `/api/...` during development are automatically proxied to `http://localhost:5001` by Vite's dev server (see [Vite Configuration](#vite-configuration)).

> In production, ensure the backend is reachable and API calls point to the correct origin.

---

## Routing

Defined in [client/src/App.jsx](client/src/App.jsx) using `react-router-dom`:

| Path | Component | Description |
|---|---|---|
| `/` | `Login` | Default route — redirects to login |
| `/login` | `Login` | Login page |
| `/register` | `Register` | Registration page |
| `/dashboard` | `Dashboard` | Main job tracker (requires auth) |

> There is currently no route guard enforcing authentication. Unauthenticated access to `/dashboard` will attempt to fetch jobs and fail silently.

---

## Authentication Flow

### Email / Password Login
1. User submits username and password
2. `POST /api/users/login`
3. Server verifies password using bcrypt
4. Server returns a JWT token
5. Token is stored in localStorage and used for authenticated API requests

### Google OAuth Login
1. User clicks "Sign in with Google"
2. Google Identity Services returns an ID token
3. Client sends token to `POST /api/users/google-login`
4. Backend verifies token using `google-auth-library`
5. If the email does not exist, a new user is automatically created
6. Server returns a JWT token used for authenticated requests

All authenticated API requests include:
Authorization: Bearer <token>

---

## API Integration

All API requests target the backend. In development, Vite proxies `/api/*` to `http://localhost:5001`.

| Method | Endpoint | Auth | Used In |
|---|---|---|---|
| POST | `/api/users/login` | No | `Login.jsx` |
| POST | `/api/users/google-login` | No | `Login.jsx` |
| POST | `/api/users/register` | No | `Register.jsx` |
| GET | `/api/jobs` | Yes (Bearer) | `Dashboard.jsx` |
| POST | `/api/jobs` | Yes (Bearer) | `JobForm.jsx` |
| POST | `/api/notifications/check-deadlines` | Yes (Bearer) | Manual trigger |
| POST | `/api/notifications/test-email` | Yes (Bearer) | Testing |


> `JobForm.jsx` currently calls `http://localhost:5001/api/jobs` directly instead of using the `/api` proxy path. This works in development but may break in other environments.

---

## Email Notifications

### Overview
JobTrackr includes an automated email notification system that sends reminders 24 hours before job application deadlines.

### How It Works
1. When users register, their email is stored in the database
2. When users add a job with a deadline date, it's stored in MongoDB
3. A cron job runs daily at 9:00 AM to check for upcoming deadlines
4. Users receive professional email notifications 24 hours before their deadlines

### Backend Implementation

#### Technologies Used
- **Nodemailer**: Email sending library for Node.js
- **Node-cron**: Task scheduler for automated daily checks
- **Gmail SMTP**: Email delivery service

#### File Structure
```
server/
├── services/
│   └── emailService.js         # Gmail SMTP configuration and email templates
├── utils/
│   └── deadlineChecker.js      # Deadline detection and notification logic
├── routes/
│   └── notificationRoutes.js   # API endpoints for manual testing
└── server.js                    # Cron scheduler configuration
```

#### Testing Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notifications/check-deadlines` | Manually trigger deadline check |
| POST | `/api/notifications/test-email` | Send test email to logged-in user |

## Styling

### `index.css` — Global styles
- CSS custom properties:
  ```css
  --primary-black: #000000
  --primary-white: #ffffff
  --primary-blue: #1a6ed6
  ```
- System font stack for cross-platform consistency
- Global margin/padding reset
- Base styles for `<a>`, `<button>`, `<input>`, `<textarea>`, `<select>`

### `App.css` — Layout & component styles
- Black top navigation bar (`.topbar`) with white text and blue hover states
- Dashboard two-column grid layout: `1fr` (form) + `2fr` (job list)
- Responsive breakpoints:
  - `≤ 1024px` (tablet): stacks form and job list vertically
  - `≤ 640px` (mobile): adjusts padding and font sizes
- Job card styles with box shadow and rounded corners
- Status badge and tag chip styles