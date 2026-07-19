# Build Prompt: College Student Information Portal

Copy everything below into Claude Code (or paste into a new Claude chat) to build the project.

---

## PROMPT

Build a full-stack "Student Information Collection Portal" for a college. Use this exact stack:

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (hosted on Supabase, but write plain SQL / node-postgres — no ORM lock-in)
- **Auth:** JWT, two separate roles (student, teacher)
- **Excel handling:** SheetJS (`xlsx` npm package) for bulk import/export
- **Password hashing:** bcrypt

### 1. Roles & Login

**Student login:** Register No + Date of Birth (yyyy-mm-dd). On first login the student is forced to set a new password (store as a hash) before they can log in with DOB again — DOB alone should not remain a permanent credential after first login.

**Teacher login:** username `teacher`, default password `teacher123`, forced password change on first login. Store hashed.

### 2. Data model (relational)

```sql
departments (id, name, code)              -- e.g. CSE, AI&DS, AIML, ECE, EEE, MECH, AGRI
batches (id, department_id, start_year, end_year)   -- e.g. 2024-2028
sections (id, batch_id, name)             -- A, B, C, D
teachers (id, username, password_hash, name, must_change_password)

students (
  id, section_id, register_no UNIQUE, dob,
  password_hash, must_change_password, profile_completed BOOLEAN DEFAULT false,

  -- locked fields (set only by teacher via Excel import, student cannot edit)
  admission_no, programme_name, programme_code, year_of_admission,
  mode_of_admission, admitted_semester, admission_quota, regulation,
  roll_number, student_name,

  -- student-fillable fields
  gender, blood_group, nationality, religion, community, caste,
  physically_challenged BOOLEAN, differently_abled BOOLEAN,
  tenth_board, tenth_marks, twelfth_board, twelfth_marks,
  cutoff_hsc, year_of_passing_hsc,
  diploma_percentage, diploma_programme, preceding_degree_year, preceding_degree_percent, branch_studied,
  parent_name, relation, parent_mobile, student_mobile,
  door_no_street, town_taluk, city_district, state, country, pincode,
  email_institution, email_alternate, aadhaar_number, emis_no,
  boarding_status  -- Dayscholar / Hosteller
)
```

### 3. Teacher dashboard flow (cascading selectors)

1. Select Department from dropdown, or "+ Add Department" (name + code).
2. Once a department is selected, show Batch dropdown scoped to that department, or "+ Add Batch" (asks for start year and end year, e.g. 2024–2028).
3. Once a batch is selected, show Section dropdown scoped to that batch, or "+ Add Section" (single letter, A/B/C/D...).
4. Once a section is selected, show:
   - A student table for that section: view / edit / delete each student's full profile.
   - An "Upload Excel" box: accepts an .xlsx with columns `RegisterNo` and `Password` (plus optionally the locked fields above). Parses each row, hashes the password, and inserts a new student login into the currently selected section. Show a summary of how many rows were added vs skipped (e.g. duplicate register numbers).
   - A "Download Section Excel" button: exports all students in that section with every column (locked + fillable fields) as an .xlsx, matching the structure of a typical college database sheet.

### 4. Student dashboard flow

1. Login with Register No + DOB (or Register No + password after first login).
2. Show a form with:
   - Locked fields displayed as read-only (Name, Register No, Programme, Section, etc.)
   - Fillable fields as editable inputs, grouped into sections: Personal Details, Academic History, Family Details, Address, Contact & IDs.
3. "Save" button updates the student's row and sets `profile_completed = true`.
4. Student can log back in and edit their own filled fields again (but not the locked ones).

### 5. API structure

Build REST endpoints under:
- `/api/auth/student/login`, `/api/auth/student/set-password`
- `/api/auth/teacher/login`, `/api/auth/teacher/set-password`
- `/api/departments` (GET, POST)
- `/api/batches?departmentId=` (GET, POST)
- `/api/sections?batchId=` (GET, POST)
- `/api/students?sectionId=` (GET list, POST create-one, GET/PUT/DELETE by id)
- `/api/students/me` (GET, PUT — for logged-in student to view/update own profile)
- `/api/excel/upload?sectionId=` (POST, multipart file)
- `/api/excel/download?sectionId=` (GET, returns .xlsx file)

Protect teacher-only routes with a `authTeacher` middleware and student-only routes with `authStudent` middleware, both verifying JWT and role claim.

### 6. Folder structure

Use this structure:

```
student-portal/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/{authStudent,authTeacher,upload}.js
│   │   ├── controllers/{authController,departmentController,batchController,sectionController,studentController,excelController}.js
│   │   ├── routes/{authRoutes,departmentRoutes,batchRoutes,sectionRoutes,studentRoutes,excelRoutes}.js
│   │   ├── models/{department,batch,section,student,teacher}.model.js
│   │   ├── utils/{hashPassword,generateToken,excelParser}.js
│   │   ├── app.js
│   │   └── server.js
│   ├── sql/schema.sql
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axiosClient.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/common/{Navbar,ProtectedRoute,Loader}.jsx
│   │   ├── components/student/{StudentLoginForm,StudentDetailsForm}.jsx
│   │   ├── components/teacher/{TeacherLoginForm,DepartmentSelector,BatchSelector,SectionSelector,StudentTable,ExcelUploadBox,ExcelDownloadButton}.jsx
│   │   ├── pages/{LandingPage,StudentLoginPage,StudentDashboardPage,TeacherLoginPage,TeacherDashboardPage}.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

### 7. Build order (do this incrementally, don't dump everything at once)

1. `sql/schema.sql` — full table definitions with constraints and foreign keys, plus a seed insert for the default teacher account.
2. Backend: DB connection, auth middleware, auth controller/routes for both roles (with forced password change logic).
3. Backend: department/batch/section CRUD controllers and routes.
4. Backend: student CRUD + `students/me` endpoints.
5. Backend: Excel upload (bulk login creation) and Excel download (section export) using SheetJS.
6. Frontend: routing, AuthContext, landing page, both login pages.
7. Frontend: teacher dashboard — cascading Department → Batch → Section selectors, student table, Excel upload/download UI.
8. Frontend: student dashboard — the full profile form, grouped by section, with locked fields visibly read-only.
9. README with setup steps: creating the Supabase Postgres DB, running schema.sql, environment variables needed, and how to run frontend + backend locally.

After each step, briefly explain what was built and how to test it before moving to the next step.

---

## How to use this

- **In Claude Code:** paste the whole prompt above as your first message in a new project folder.
- **In a new Claude.ai chat:** paste it and ask Claude to start with step 1 (SQL schema) and go one step at a time so you can follow along and test each part.
