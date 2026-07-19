# College Student Information Portal

A full-stack portal for collecting and managing college student information. Teachers manage departments, batches, sections, and bulk-import students via Excel. Students log in and fill in their profile details.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Supabase-compatible)
- **Auth:** JWT (student & teacher roles)
- **Excel:** SheetJS (`xlsx`)

## Project Structure

```
├── backend/          # Express API
├── frontend/         # React app
└── README.md
```

## Setup

### 1. Create PostgreSQL Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open **Project Settings → Database** and copy the connection string.
3. Open the **SQL Editor** and run the contents of `backend/sql/schema.sql`.

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
```

Install and run:

```bash
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies API requests to the backend.

## Default Credentials

| Role    | Username / Register No | Password   |
|---------|------------------------|------------|
| Teacher | `teacher`              | `teacher123` |

Both teacher and students are forced to change their password on first login.

## Student Login Flow

1. **First login:** Register No + Date of Birth (yyyy-mm-dd) → forced password setup.
2. **Subsequent logins:** Register No + Password.

## Teacher Dashboard

1. Select or create **Department** → **Batch** → **Section** (cascading dropdowns).
2. **Upload Excel** with columns `RegisterNo`, `Password`, and optional profile fields.
3. **View/edit/delete** students in the selected section.
4. **Download Section Excel** to export all student data.

## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/student/login` | Public |
| POST | `/api/auth/student/set-password` | Public |
| POST | `/api/auth/teacher/login` | Public |
| POST | `/api/auth/teacher/set-password` | Public |
| GET/POST | `/api/departments` | Teacher |
| GET/POST | `/api/batches?departmentId=` | Teacher |
| GET/POST | `/api/sections?batchId=` | Teacher |
| GET/POST/PUT/DELETE | `/api/students` | Teacher |
| GET/PUT | `/api/students/me` | Student |
| POST | `/api/excel/upload?sectionId=` | Teacher |
| GET | `/api/excel/download?sectionId=` | Teacher |

## Testing Checklist

1. Run `schema.sql` in Supabase SQL editor.
2. Start backend → visit `http://localhost:5000/api/health` (should return `{ "status": "ok" }`).
3. Login as teacher (`teacher` / `teacher123`) → change password.
4. Create a department, batch, and section.
5. Upload an Excel file with student rows.
6. Login as a student with Register No + DOB → set password → fill profile.
