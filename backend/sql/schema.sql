-- Student Information Portal Schema

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  start_year INTEGER NOT NULL,
  end_year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (department_id, start_year, end_year)
);

CREATE TABLE IF NOT EXISTS sections (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  name VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (batch_id, name)
);

CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL DEFAULT 'Teacher',
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  register_no VARCHAR(50) NOT NULL UNIQUE,
  dob DATE NOT NULL,
  password_hash VARCHAR(255),
  must_change_password BOOLEAN NOT NULL DEFAULT true,
  profile_completed BOOLEAN NOT NULL DEFAULT false,

  -- locked fields (teacher/Excel only)
  admission_no VARCHAR(50),
  academic_level VARCHAR(50),
  programme_name VARCHAR(255),
  programme_code VARCHAR(50),
  year_of_admission INTEGER,
  mode_of_admission VARCHAR(100),
  admitted_semester VARCHAR(50),
  admission_quota VARCHAR(100),
  date_of_admission DATE,
  application_no VARCHAR(100),
  dote_reference_no VARCHAR(100),
  doj DATE,
  regulation VARCHAR(50),
  roll_number VARCHAR(50),
  student_name VARCHAR(255),
  class_section VARCHAR(50),

  -- student-fillable fields
  gender VARCHAR(20),
  tamil_medium BOOLEAN DEFAULT false,
  blood_group VARCHAR(10),
  nationality VARCHAR(100),
  religion VARCHAR(100),
  community VARCHAR(100),
  caste VARCHAR(100),
  physically_challenged BOOLEAN DEFAULT false,
  differently_abled BOOLEAN DEFAULT false,
  tenth_board VARCHAR(100),
  tenth_marks VARCHAR(50),
  twelfth_board VARCHAR(100),
  qualifying_exam_hsc VARCHAR(100),
  twelfth_marks VARCHAR(50),
  cutoff_hsc VARCHAR(50),
  year_of_passing_hsc INTEGER,
  diploma_percentage VARCHAR(50),
  diploma_programme VARCHAR(255),
  preceding_degree_year INTEGER,
  preceding_degree_percent VARCHAR(50),
  branch_studied VARCHAR(255),
  parent_name VARCHAR(255),
  relation VARCHAR(50),
  parent_mobile VARCHAR(20),
  student_mobile VARCHAR(20),
  door_no_street TEXT,
  town_taluk VARCHAR(255),
  city_district VARCHAR(255),
  state VARCHAR(100),
  country VARCHAR(100),
  pincode VARCHAR(20),
  email_institution VARCHAR(255),
  email_alternate VARCHAR(255),
  aadhaar_number VARCHAR(20),
  emis_no VARCHAR(50),
  boarding_status VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batches_department ON batches(department_id);
CREATE INDEX IF NOT EXISTS idx_sections_batch ON sections(batch_id);
CREATE INDEX IF NOT EXISTS idx_students_section ON students(section_id);
CREATE INDEX IF NOT EXISTS idx_students_register ON students(register_no);

-- Default teacher: username=teacher, password=teacher123 (must change on first login)
-- bcrypt hash of 'teacher123' with 10 rounds
INSERT INTO teachers (username, password_hash, name, must_change_password)
VALUES (
  'teacher',
  '$2b$10$Jzudah2XsQcm4nPnjCYpAOgCIJfRA2jrzQkD9FicD98YX91sg.MB.',
  'Default Teacher',
  true
)
ON CONFLICT (username) DO NOTHING;
