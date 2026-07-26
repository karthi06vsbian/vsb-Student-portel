// Mock data for VSB Student Portal — Tamil Nadu context
window.VSB_DATA = (() => {
  const DEPARTMENTS = [
    { code: 'CSE',   name: 'Computer Science & Engineering', hod: 'Dr. Ramesh Kumar M.',    color: '#2563EB' },
    { code: 'IT',    name: 'Information Technology',          hod: 'Dr. Bhuvaneswari S.',    color: '#8B5CF6' },
    { code: 'AIDS',  name: 'AI & Data Science',               hod: 'Dr. Karthikeyan V.',     color: '#EC4899' },
    { code: 'ECE',   name: 'Electronics & Communication',     hod: 'Dr. Palanivel R.',       color: '#10B981' },
    { code: 'EEE',   name: 'Electrical & Electronics',        hod: 'Dr. Meenakshi Sundaram', color: '#F59E0B' },
    { code: 'MECH',  name: 'Mechanical Engineering',          hod: 'Dr. Selvakumar A.',      color: '#EF4444' },
    { code: 'CIVIL', name: 'Civil Engineering',               hod: 'Dr. Kanagaraj T.',       color: '#06B6D4' },
  ];

  const BATCHES = ['2022-2026', '2023-2027', '2024-2028', '2025-2029'];
  const SECTIONS = ['A', 'B', 'C', 'D'];

  const FIRST_NAMES_M = ['Aravind', 'Karthik', 'Dinesh', 'Vignesh', 'Surya', 'Praveen', 'Rahul', 'Sathish', 'Manoj', 'Harish', 'Naveen', 'Bala', 'Gokul', 'Arjun', 'Sanjay', 'Vishnu', 'Prasanth', 'Ganesh', 'Ashwin', 'Ranjith'];
  const FIRST_NAMES_F = ['Priya', 'Divya', 'Kavya', 'Sneha', 'Meena', 'Lakshmi', 'Anitha', 'Deepika', 'Nithya', 'Sowmiya', 'Ramya', 'Janani', 'Keerthana', 'Swathi', 'Bhavana', 'Yamuna', 'Aishwarya', 'Pooja', 'Revathi', 'Mahalakshmi'];
  const LAST_NAMES = ['Kumar', 'Selvam', 'Raj', 'Murugan', 'Krishnan', 'Balaji', 'Subramanian', 'Venkatesh', 'Palani', 'Ramesh', 'Suresh', 'Chandran', 'Kannan', 'Rajesh', 'Prabhu', 'Arun', 'Muthu', 'Nagarajan', 'Elango', 'Shankar'];
  const HOMETOWNS = ['Coimbatore', 'Erode', 'Salem', 'Tirupur', 'Karur', 'Namakkal', 'Pollachi', 'Sathyamangalam', 'Gobichettipalayam', 'Bhavani', 'Palladam', 'Avinashi', 'Mettupalayam', 'Perundurai', 'Dharapuram'];
  const BLOOD = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-'];
  const COMMUNITY = ['BC', 'MBC', 'OC', 'SC', 'ST', 'BCM'];
  const SKILLS_POOL = ['React', 'Node.js', 'Python', 'Java', 'C++', 'Django', 'Firebase', 'MongoDB', 'MySQL', 'PostgreSQL', 'TensorFlow', 'PyTorch', 'AWS', 'Docker', 'Kubernetes', 'Figma', 'Flutter', 'React Native', 'GraphQL', 'Redis'];
  const COMPANIES = ['TCS', 'Infosys', 'Wipro', 'Zoho', 'Freshworks', 'Cognizant', 'HCL', 'Accenture', 'Amazon', 'Microsoft', 'CTS', 'CTS Digital', 'HDFC Bank', 'ICICI Bank'];

  // deterministic pseudo-random
  function seeded(seed) {
    let s = seed;
    return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  }
  const rand = seeded(42);
  const pick = arr => arr[Math.floor(rand() * arr.length)];
  const between = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const money = () => (3.5 + rand() * 12).toFixed(1); // LPA

  function makeStudent(i) {
    const gender = rand() > 0.42 ? 'Male' : 'Female';
    const first = gender === 'Male' ? pick(FIRST_NAMES_M) : pick(FIRST_NAMES_F);
    const last = pick(LAST_NAMES);
    const name = `${first} ${last}`;
    const dept = pick(DEPARTMENTS);
    const batch = pick(BATCHES);
    const section = pick(SECTIONS);
    const startYear = parseInt(batch.split('-')[0]);
    const yearNum = Math.min(4, 2026 - startYear + 1);
    const regNum = `${startYear}${dept.code === 'AIDS' ? 'AD' : dept.code.slice(0, 2)}${String(1000 + i).slice(-3)}`;
    const cgpa = (6 + rand() * 3.8).toFixed(2);
    const arrears = rand() > 0.75 ? between(1, 4) : 0;
    const placed = rand() > 0.55;
    const skills = Array.from({ length: between(3, 7) }, () => pick(SKILLS_POOL)).filter((v, i, a) => a.indexOf(v) === i);
    const profileCompletion = between(45, 100);

    return {
      registerNumber: regNum,
      name,
      gender,
      photo: null, // placeholder
      department: dept.code,
      departmentName: dept.name,
      batch,
      section,
      year: yearNum,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@vsb.edu.in`,
      phone: `+91 9${between(100000000, 999999999)}`,
      dob: `${between(2003, 2006)}-${String(between(1, 12)).padStart(2, '0')}-${String(between(1, 28)).padStart(2, '0')}`,
      bloodGroup: pick(BLOOD),
      community: pick(COMMUNITY),
      hometown: pick(HOMETOWNS),
      address: `${between(1, 200)}, ${pick(['Bharathi', 'Gandhi', 'Kamaraj', 'Nehru', 'Anna'])} Street, ${pick(HOMETOWNS)}, Tamil Nadu`,
      aadhaar: `**** **** ${between(1000, 9999)}`,

      sslc: between(78, 98) + '%',
      hsc: between(72, 96) + '%',
      diploma: rand() > 0.7 ? (7.5 + rand() * 2).toFixed(2) : null,

      cgpa,
      arrears,

      skills,
      languages: ['Tamil', 'English', ...(rand() > 0.6 ? ['Hindi'] : [])],
      internships: between(0, 3),
      projects: between(2, 8),
      hackathons: between(0, 5),
      certificates: between(1, 12),

      linkedin: `linkedin.com/in/${first.toLowerCase()}${last.toLowerCase()}`,
      github: `github.com/${first.toLowerCase()}${between(10, 99)}`,
      leetcode: rand() > 0.4 ? `leetcode.com/${first.toLowerCase()}${last.toLowerCase()}` : null,

      placement: {
        status: placed ? 'Placed' : (rand() > 0.5 ? 'In Process' : 'Not Applied'),
        company: placed ? pick(COMPANIES) : null,
        package: placed ? money() : null,
      },

      transport: pick(['College Bus - Route 12', 'College Bus - Route 7', 'Own Vehicle', 'Public Transport']),
      residence: rand() > 0.55 ? 'Day Scholar' : 'Hosteller',
      emergencyContact: `+91 9${between(100000000, 999999999)}`,
      parentName: `${pick(FIRST_NAMES_M)} ${last}`,
      parentPhone: `+91 9${between(100000000, 999999999)}`,
      parentOccupation: pick(['Farmer', 'Business', 'Government Employee', 'Teacher', 'Engineer', 'Retired', 'Homemaker']),

      profileCompletion,
      approved: rand() > 0.3,
      lastUpdated: `${between(1, 28)} July 2026`,
    };
  }

  const students = Array.from({ length: 42 }, (_, i) => makeStudent(i));

  // Featured hero student
  students[0] = {
    ...students[0],
    registerNumber: '2023CS042',
    name: 'Aravind Selvakumar',
    gender: 'Male',
    department: 'CSE',
    departmentName: 'Computer Science & Engineering',
    batch: '2023-2027',
    section: 'A',
    year: 3,
    email: 'aravind.selvakumar@vsb.edu.in',
    phone: '+91 98765 43210',
    dob: '2005-04-18',
    bloodGroup: 'O+',
    community: 'BC',
    hometown: 'Coimbatore',
    address: '42, Bharathi Street, RS Puram, Coimbatore, Tamil Nadu — 641002',
    aadhaar: '**** **** 4821',
    sslc: '94%', hsc: '89%', diploma: null,
    cgpa: '8.72', arrears: 0,
    skills: ['React', 'Node.js', 'Python', 'Firebase', 'TensorFlow', 'AWS'],
    languages: ['Tamil', 'English', 'Hindi'],
    internships: 2, projects: 6, hackathons: 3, certificates: 8,
    linkedin: 'linkedin.com/in/aravindselvakumar',
    github: 'github.com/aravind-42',
    leetcode: 'leetcode.com/aravind_s',
    placement: { status: 'Placed', company: 'Zoho', package: '9.5' },
    transport: 'College Bus - Route 7',
    residence: 'Day Scholar',
    emergencyContact: '+91 94433 21100',
    parentName: 'Selvakumar R.',
    parentPhone: '+91 94433 21100',
    parentOccupation: 'Business',
    photoDoc: 'aravind_photo.jpg',
    resumeDoc: 'Aravind_Resume_v3.pdf',
    aadhaarDoc: 'aadhaar_scan.pdf',
    sslcDoc: 'sslc.pdf',
    hscDoc: 'hsc.pdf',
    certificatesDoc: 'aws_cloud_practitioner.pdf',
    profileCompletion: 92,
    approved: true,
    lastUpdated: '18 July 2026',
  };

  const teachers = [
    { id: 'T001', username: 'ramesh.m',      name: 'Dr. Ramesh Kumar M.',    department: 'CSE',   role: 'HOD',      email: 'ramesh.m@vsb.edu.in',      lastLogin: '20 Jul 2026, 09:12 AM' },
    { id: 'T002', username: 'bhuvana.s',     name: 'Dr. Bhuvaneswari S.',    department: 'IT',    role: 'HOD',      email: 'bhuvana.s@vsb.edu.in',     lastLogin: '19 Jul 2026, 05:24 PM' },
    { id: 'T003', username: 'karthikeyan.v', name: 'Dr. Karthikeyan V.',     department: 'AIDS',  role: 'HOD',      email: 'karthikeyan.v@vsb.edu.in', lastLogin: '20 Jul 2026, 08:30 AM' },
    { id: 'T004', username: 'palani.r',      name: 'Dr. Palanivel R.',       department: 'ECE',   role: 'HOD',      email: 'palani.r@vsb.edu.in',      lastLogin: '18 Jul 2026, 11:02 AM' },
    { id: 'T005', username: 'divya.k',       name: 'Prof. Divya Krishnan',   department: 'CSE',   role: 'Faculty',  email: 'divya.k@vsb.edu.in',       lastLogin: '20 Jul 2026, 10:45 AM' },
    { id: 'T006', username: 'sathish.p',     name: 'Prof. Sathish Prabhu',   department: 'CSE',   role: 'Faculty',  email: 'sathish.p@vsb.edu.in',     lastLogin: '17 Jul 2026, 02:15 PM' },
    { id: 'T007', username: 'meena.s',       name: 'Prof. Meena Sundari',    department: 'IT',    role: 'Faculty',  email: 'meena.s@vsb.edu.in',       lastLogin: '20 Jul 2026, 09:55 AM' },
    { id: 'T008', username: 'vignesh.a',     name: 'Prof. Vignesh Arun',     department: 'AIDS',  role: 'Faculty',  email: 'vignesh.a@vsb.edu.in',     lastLogin: '19 Jul 2026, 04:11 PM' },
  ];

  const activityLogs = [
    { id: 1, actor: 'admin',       action: 'Bulk imported',   target: '164 students to CSE 2024-2028', time: '2m ago',  color: 'brand' },
    { id: 2, actor: 'ramesh.m',    action: 'Approved',        target: 'Priya Selvam profile',          time: '18m ago', color: 'accent' },
    { id: 3, actor: 'bhuvana.s',   action: 'Downloaded',      target: 'IT_2023-2027_Sec-B.xlsx',       time: '42m ago', color: 'violet' },
    { id: 4, actor: '2023CS042',   action: 'Updated',         target: 'placement details',              time: '1h ago',  color: 'brand' },
    { id: 5, actor: 'admin',       action: 'Added teacher',   target: 'Dr. Karthikeyan V. (AIDS HOD)',  time: '3h ago',  color: 'amber' },
    { id: 6, actor: 'karthikeyan.v', action: 'Rejected',      target: 'Manoj Kumar (incomplete Aadhaar)', time: '5h ago', color: 'rose' },
    { id: 7, actor: 'admin',       action: 'Created batch',   target: '2025-2029',                     time: '1d ago',  color: 'brand' },
    { id: 8, actor: 'palani.r',    action: 'Edited',          target: 'ECE Section C — 3 students',    time: '1d ago',  color: 'accent' },
  ];

  const notifications = [
    { id: 1, title: 'Placement drive — Zoho',     body: 'Registration closes today at 5:00 PM', time: '2h',  unread: true },
    { id: 2, title: 'Profile approved',           body: 'HOD approved your submission',         time: '5h',  unread: true },
    { id: 3, title: 'Semester exam schedule',     body: 'End-sem timetable published',          time: '1d',  unread: false },
    { id: 4, title: 'Certificate verified',       body: 'AWS Cloud Practitioner added',         time: '2d',  unread: false },
  ];

  const batchEmailAuth = { '2022-2026': false, '2023-2027': false, '2024-2028': false, '2025-2029': false };

  // Persistent localStorage retrieval
  let savedStudents = null;
  let savedTeachers = null;
  let savedLogs = null;
  let savedBatchEmail = null;

  try {
    const rawSt = localStorage.getItem('vsb_portal_students');
    if (rawSt) savedStudents = JSON.parse(rawSt);

    const rawT = localStorage.getItem('vsb_portal_teachers');
    if (rawT) savedTeachers = JSON.parse(rawT);

    const rawL = localStorage.getItem('vsb_portal_activity_logs');
    if (rawL) savedLogs = JSON.parse(rawL);

    const rawB = localStorage.getItem('vsb_portal_batch_email_auth');
    if (rawB) savedBatchEmail = JSON.parse(rawB);
  } catch (e) {
    console.warn('localStorage read error:', e);
  }

  const finalStudents = (savedStudents && Array.isArray(savedStudents) && savedStudents.length > 0)
    ? savedStudents
    : students;

  const finalTeachers = (savedTeachers && Array.isArray(savedTeachers) && savedTeachers.length > 0)
    ? savedTeachers
    : teachers;

  const finalLogs = (savedLogs && Array.isArray(savedLogs))
    ? savedLogs
    : activityLogs;

  const finalBatchEmailAuth = (savedBatchEmail && typeof savedBatchEmail === 'object')
    ? savedBatchEmail
    : batchEmailAuth;

  const VSB_OBJ = {
    DEPARTMENTS,
    BATCHES,
    SECTIONS,
    students: finalStudents,
    teachers: finalTeachers,
    activityLogs: finalLogs,
    notifications,
    batchEmailAuth: finalBatchEmailAuth,
    saveToStorage() {
      try {
        localStorage.setItem('vsb_portal_students', JSON.stringify(this.students || []));
        localStorage.setItem('vsb_portal_teachers', JSON.stringify(this.teachers || []));
        localStorage.setItem('vsb_portal_activity_logs', JSON.stringify(this.activityLogs || []));
        localStorage.setItem('vsb_portal_batch_email_auth', JSON.stringify(this.batchEmailAuth || {}));
      } catch (e) {
        console.warn('localStorage save error:', e);
      }
    }
  };

  return VSB_OBJ;
})();
