# Placement Management System (PMS)

A full-stack placement-management application that supports student resume upload/preview/removal, role-based dashboards (student, faculty, TPO, admin), and standard placement workflows.

This README mirrors the structure of your provided example and documents the repo layout, technologies used, how the application flows, environment configuration, migration scripts, and notes about recent ATS-related removals.

## Table of contents

- Project overview
- Tech stack (detailed)
- Application flow (step-by-step)
- Key features & tools
- How it works (presentation script)
- Setup instructions
- File structure
- Environment variables
- Backend API (important endpoints)
- Data model & migrations (ATS removal)
- Troubleshooting & FAQs
- Contribution
- Credits

## Project overview

Placement Management System (PMS) helps colleges manage student placements and related workflows. It provides:

- Secure student authentication and role-based access (student, faculty, TPO, admin)
- Resume upload, preview (open in new tab), and deletion
- Dashboard views for different roles with basic KPIs and management operations
- Email/notification utilities for OTPs and password resets

The repository contains a Node/Express backend that uses Mongoose (MongoDB) and a React + TypeScript frontend built with Vite.


## Repo structure

Top-level folders:

- `backend/` — Express server, routes, Mongoose models, file uploads, migration scripts, utilities and backups
  - `server.js` — main server and schema definitions used in production
  - `server_old.js`, `server_alt.js` — legacy/alternate server files (left for archival)
  - `scripts/` — migration and maintenance scripts (e.g., `remove_ats_fields.js`, `unset_student_fields.js`)
  - `uploads/` — stored resume files and generated JSON artifacts
  - `controllers/`, `models/`, `utils/` — modular server code

- `frontend/` — React + TypeScript (Vite) SPA
  - `src/pages/` — routed pages (Login, Dashboard, ResumeSkillAnalysis, etc.)
  - `src/components/` — shared UI components
  - `src/lib/` — client helpers for API, auth, validation

Other files:

- `README.md` — this file
- `frontend/package.json`, `backend/package.json` — per-app dependencies and scripts


## Tech stack (detailed)

### Backend
- Node.js, Express
- Mongoose (MongoDB) for persistent storage
- Busboy / multipart handling for file uploads
- Utilities: `pdf-parse`, `tesseract.js` (used previously for parsing/resume processing in optional flows)

### Frontend
- React + TypeScript
- Vite for dev server and bundling
- Tailwind CSS / custom components (project uses shared UI primitives)

### Data & storage
- MongoDB — primary database (`MONGODB_URI`, default `mongodb://127.0.0.1:27017/pmsdb`)
- Filesystem storage for uploaded resumes (`backend/uploads/`)

### Dev tools
- npm, Node LTS, VS Code recommended



## Application flow (step-by-step)

This mirrors the example structure and maps to how features are implemented in this repo.

1. Landing / Login (frontend)
  - Tech: React + TypeScript
  - Purpose: Entry point where users log in or sign up. Routes to role-specific dashboards after authentication.

2. Student dashboard & resume upload
  - Tech: React pages + backend `POST /api/students/upload-resume`
  - Purpose: Students upload resumes using a multipart form. The backend stores the file and saves metadata on the student document.

3. Resume preview
  - Tech: Backend serves binary file (`GET /api/students/resume?email=...`), frontend opens it in a new tab as a blob.
  - Important: The response is binary (PDF/DOCX), not JSON.

4. Resume deletion
  - Tech: `DELETE /api/students/resume?email=...`
  - Purpose: Deletes underlying file and removes resume metadata from the DB.

5. Dashboards & role actions
  - Tech: React pages for TPO/Faculty/Admin, backend routes for user and student CRUD.
  - Purpose: View KPIs, manage student records, export data.

6. Scoring / ATS (disabled)
  - Previously there was a scoring flow and a `GenerateATSScore` UI. These have been removed/disabled. Scoring endpoints now return 410.



## Key features & tools

- Resume upload and preview (binary-safe)
- Role-based dashboards (student, faculty, TPO, admin)
- Email utilities (OTP, password reset) via `backend/utils/sendEmail.js`
- Migration scripts for DB cleanup under `backend/scripts/`

## How it works (presentation script)

Use this short script when presenting the project. It follows the same structure as your example:

1. Introduction
  - "This is the Placement Management System — a web app to manage student placements, upload and preview resumes, and give role-specific dashboards for faculty, TPOs, and admins."

2. Login & Landing
  - "Users begin at the login page (React). After authenticating they'll see a dashboard appropriate to their role."

3. Student Resume Flow
  - "Students upload resumes through the dashboard. The backend stores the file and metadata in MongoDB. Students can preview the resume in a new tab and delete it if needed."

4. Admin/TPO Views
  - "Admins and TPOs can view student lists, search for resumes by email, and manage records."

5. ATS removal note
  - "ATS scoring was previously part of the system. Per the current repo state, scoring endpoints and UI components have been removed or disabled; migration scripts exist to clean historic ATS data."

6. Conclusion
  - "PMS uses modern Node + React tooling to provide a lightweight placement-management solution that is easy to run locally and extend.",

## Setup instructions

1. Backend (powershell):

```powershell
cd backend
npm install
# create a .env file if needed (see Environment Variables below)
node server.js
```

2. Frontend (powershell):

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal.

## File structure

- `backend/`
  - `server.js`, `server_old.js`, `server_alt.js` — server entry points and legacy copies
  - `controllers/` — auth, student controllers
  - `scripts/` — migration scripts (`remove_ats_fields.js`, `unset_student_fields.js`)
  - `uploads/` — stored resume files and artifacts
  - `utils/` — helpers like `sendEmail.js`, `validation.js`

- `frontend/`
  - `src/pages/` — main pages including `ResumeSkillAnalysis.tsx`
  - `src/components/` — UI components
  - `src/lib/` — API helpers and validation

## Environment variables

Create a `.env` in `backend/` with values similar to:

```ini
MONGODB_URI=mongodb://127.0.0.1:27017/pmsdb
PORT=3000
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=example_user
EMAIL_PASS=example_pass
EMAIL_FROM="PMS <no-reply@example.com>"
```

## Backend API (important endpoints)

- POST `/api/students/upload-resume` — upload resume multipart/form-data `file` with student identification (header or session)
- GET `/api/students/resume?email={email}` — serve student resume binary for preview (open in new tab)
- DELETE `/api/students/resume?email={email}` — delete resume file and unset metadata

Disabled/removed endpoints:
- Any ATS scoring endpoints now return HTTP 410. The frontend no longer calls ATS scoring.

## Data model & migrations (ATS removal)

Background
- Student documents previously stored ATS-derived fields such as `ats_metrics`, `suggested_roles`, `extracted_skills`, `projects`, `experience`, and `certifications`.

Current state
- The active Mongoose schema in `backend/server.js` no longer declares these fields. That prevents new writes.
- Migration scripts in `backend/scripts/` will unset the fields in existing documents. Backups are stored in `backend/scripts/backups/`.

Run migrations (example):

```powershell
cd backend
node scripts/remove_ats_fields.js
node scripts/unset_student_fields.js
```

Always backup your DB before running destructive scripts.

## Troubleshooting & FAQs

Q: "Preview opens as JSON or shows parse errors"
A: Ensure the frontend treats the response as binary. The resume GET endpoint streams a file; do not call `res.json()` on the response.

Q: "I still see ATS data in the repo"
A: Backup JSON files and legacy server files still contain historical ATS outputs. If you want them removed, specify whether to archive (rename `.bak`) or delete them permanently.

Q: "Can you run migration scripts for me?"
A: I can run them if you confirm and provide the intended MongoDB URI or allow use of the repo's default. I will report matched/modified counts.

## Contribution

- Fork, create a feature branch, and open a PR. For DB-affecting changes include a migration script and a rollback plan.

## Credits

- Project owner and contributors: Harshita and team

---

If you'd like the README to be word-for-word as your uploaded example, I can copy its sections verbatim; tell me if you prefer an exact copy or the version above (which is adapted to this repo).

## Environment variables

You can create a `.env` file in `backend/` with the following variables (defaults are provided in code where possible):

- MONGODB_URI - MongoDB connection string (default: `mongodb://127.0.0.1:27017/pmsdb`)
- PORT - port the backend listens on (default inside `server.js`)
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS - SMTP settings for outgoing mail
- EMAIL_FROM - friendly from address

Example `.env` (do not commit to git):

```ini
MONGODB_URI=mongodb://127.0.0.1:27017/pmsdb
PORT=3000
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=example_user
EMAIL_PASS=example_pass
EMAIL_FROM="PMS <no-reply@example.com>"
```

## Backend API — important endpoints and contracts

This section lists the most used endpoints and their expected inputs/outputs. Replace host and port as applicable.

Authentication
- The app uses session or token-based auth (see `backend/server.js` and `controllers/auth.js`). Provide credentials via the frontend login flow.

Resume endpoints (student-facing)
- POST /api/students/upload-resume
  - Description: Uploads a resume file for a student
  - Auth: student identity must be provided (email header `X-Student-Email` or via authenticated session)
  - Form field: `file` (multipart/form-data)
  - Response: JSON { message: 'Resume uploaded successfully', resumeStoredName: '...' }

- GET /api/students/resume?email={email}
  - Description: Returns the student's resume file as binary content for preview (Content-Type: application/pdf or appropriate)
  - Query: email (student email)
  - Response: Binary file stream (no JSON)

- DELETE /api/students/resume?email={email}
  - Description: Deletes stored resume file and unsets resume metadata fields in the student document
  - Response: JSON { message: 'Resume removed successfully' }

Note: The frontend expects the GET resume response to be binary and will open it in a new tab. If you see JSON parse errors when requesting resume, ensure your client is not calling res.json() on the response.

Disabled endpoints
- Any previously available ATS scoring or import endpoints now return HTTP 410 (Gone). They are intentionally disabled to prevent scoring workflows from running.

Other useful endpoints
- Authentication routes (login/signup/password reset) — see `backend/controllers/auth.js`.

## Data model notes and migrations

Data model
- Student documents previously included ATS-derived fields such as `ats_metrics`, `suggested_roles`, `extracted_skills`, `projects`, `experience`, and `certifications`.
- After the schema update these fields were removed from the active Mongoose schema to prevent new writes.

Migration scripts
- Non-destructive scripts exist under `backend/scripts/` to unset ATS fields on existing documents. They will report matched/modified counts when run.

Common migration commands (run from project root):

```powershell
cd backend
# install deps if needed
npm install

# example: run a script that unsets ATS fields
node scripts/remove_ats_fields.js

# another script if present
node scripts/unset_student_fields.js
```

Important: Always backup your database before running migration scripts in production. There are backup JSON files in `backend/scripts/backups/` for offline inspection.

## Running tests & linting
- There are no formal tests included by default. Add tests and test runner configs as needed.
- Linting: run `npm run lint` in frontend/backend if configured (project may not include eslint scripts by default).

## Troubleshooting and FAQs

Q: I get "Invalid ID format" when previewing a resume
A: This often happens when a route that expects an ID parameter is matched instead of the explicit `/api/students/resume` path. Ensure you call the explicit `GET /api/students/resume?email=...` endpoint and that the backend contains the resume route before any parameterized routes.

Q: I see "Unexpected token '%'" when removing a resume
A: That error occurs when the client tries to parse binary PDF content as JSON. The resume GET endpoint serves binary data; the client must treat it as a blob and not call `res.json()` on it.

Q: How do I permanently remove ATS data?
A: First run the migration scripts to unset ATS fields. Then, if you want backups removed, list files under `backend/scripts/backups/` and delete them after confirming you no longer need them.

If you want, I can run the migration scripts for you and report matched/modified counts — I will ask for explicit confirmation before modifying your DB.

## Contribution guidelines

- Fork the repository and create feature branches for changes
- Keep changes focused and create small PRs
- For database-impacting changes (migrations) provide scripts and a clear rollback or backup plan

If you'd like me to prepare PRs to remove leftover ATS references, rename legacy files, or delete backups, say which actions you want and I'll prepare safe patches.

## License

This repository does not currently include a license file. Add a `LICENSE` file if you want to make the project open source. Recommended: MIT for permissive use.

## Authors / Contact

- Primary repository owner: see GitHub (Placement-Management-System)
- For direct changes, open issues or tell me here which follow-ups you want me to perform.

---

If you'd like this README adjusted to exactly match your local example file, upload it here or paste its contents and I'll adapt the wording and structure precisely.
