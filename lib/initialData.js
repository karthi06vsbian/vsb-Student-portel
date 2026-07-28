export const INITIAL_DEPARTMENTS = [
  { id: "CSE", name: "Computer Science and Engineering", code: "CSE" },
  { id: "ECE", name: "Electronics and Communication Engineering", code: "ECE" },
  { id: "EEE", name: "Electrical and Electronics Engineering", code: "EEE" },
  { id: "MECH", name: "Mechanical Engineering", code: "MECH" },
  { id: "IT", name: "Information Technology", code: "IT" },
  { id: "AIDS", name: "Artificial Intelligence and Data Science", code: "AI&DS" },
  { id: "CIVIL", name: "Civil Engineering", code: "CIVIL" }
];

export const INITIAL_BATCHES = [
  { id: "2024-2028", name: "2024 - 2028 (1st Year)", year: 1 },
  { id: "2023-2027", name: "2023 - 2027 (2nd Year)", year: 2 },
  { id: "2022-2026", name: "2022 - 2026 (3rd Year)", year: 3 },
  { id: "2021-2025", name: "2021 - 2025 (4th Year)", year: 4 }
];

export const INITIAL_SECTIONS = ["Sec A", "Sec B", "Sec C", "Sec D"];

export const INITIAL_STUDENTS = [];


export const INITIAL_TEACHERS = [
  {
    id: "TCH-001",
    name: "Dr. K. Saravanan",
    email: "teacher", // Primary demo login
    password: "teacherpassword",
    dept: "CSE",
    phone: "+91 98421 88301",
    assignedBatches: ["2024-2028", "2023-2027", "2022-2026", "2021-2025"],
    assignedSections: ["Sec A", "Sec B", "Sec C", "Sec D"],
    status: "Active"
  },
  {
    id: "TCH-002",
    name: "Prof. M. Malathi",
    email: "malathi.cse@vsb.ac.in",
    password: "teacherpassword",
    dept: "CSE",
    phone: "+91 94432 11092",
    assignedBatches: ["2024-2028", "2023-2027"],
    assignedSections: ["Sec A", "Sec B"],
    status: "Active"
  },
  {
    id: "TCH-003",
    name: "Dr. P. Rajasekar",
    email: "rajasekar.ece@vsb.ac.in",
    password: "teacherpassword",
    dept: "ECE",
    phone: "+91 98941 22334",
    assignedBatches: ["2024-2028", "2023-2027"],
    assignedSections: ["Sec C", "Sec D"],
    status: "Active"
  }
];

export const INITIAL_ADMIN = {
  username: "admin",
  password: "admin",
  name: "VSB Super Administrator",
  role: "ADMIN"
};

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: "LOG-1001",
    actor: "VSB System Administrator",
    role: "ADMIN",
    action: "SYSTEM_INITIALIZE",
    details: "Initialized portal with 4 academic batches (2024-2028, 2023-2027, 2022-2026, 2021-2025) & 4 sections (Sec A, B, C, D) per batch",
    timestamp: "2026-07-28T05:54:00.000Z"
  }
];
