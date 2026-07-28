'use client';

import React, { useState } from 'react';
import {
  Shield,
  UserPlus,
  Activity,
  School,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  X,
  RefreshCw,
  Users,
  Clock,
  Download,
  Filter,
  Eye,
  Trash2,
  Edit3,
  ExternalLink,
  Code,
  Globe,
  FileSpreadsheet,
  Building,
  Calendar,
  Layers,
  Key,
  Database,
  UserCheck
} from 'lucide-react';
import { addActivityLog, setStorageData, KEYS } from '../lib/storage';

export default function AdminDashboard({
  admin,
  teachers,
  students,
  departments,
  batches,
  sections,
  activityLogs,
  onUpdateTeachers,
  onUpdateStudents,
  onUpdateDepartments,
  onUpdateBatches,
  onUpdateSections
}) {
  // 'VIEW_DATABASE' | 'ADD_FACULTY' | 'MANAGE_STRUCTURE' | 'STUDENT_LOGINS' | 'AUDIT_LOGS'
  const [activeTab, setActiveTab] = useState('VIEW_DATABASE');

  // Modals & Search
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [logSearch, setLogSearch] = useState('');
  const [logRoleFilter, setLogRoleFilter] = useState('ALL'); // 'ALL' | 'TEACHER' | 'ADMIN'

  // Student Filter States for Admin
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [studentSearch, setStudentSearch] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);


  // New Department Form State
  const [newDept, setNewDept] = useState({ code: '', name: '' });
  // New Batch Form State
  const [newBatch, setNewBatch] = useState({ id: '', name: '', year: 1 });
  // New Section Bound Form State (Department + Batch + Section Name)
  const [newSection, setNewSection] = useState({
    dept: 'CSE',
    batch: '2024-2028',
    name: ''
  });

  // Admin New Student Account Form State
  const [newAdminStudent, setNewAdminStudent] = useState({
    name: '',
    dob: '',
    regNo: '',
    rollNo: '',
    admnNo: '',
    dept: 'CSE',
    batch: '2024-2028',
    section: 'Sec A',
    gender: 'M',
    studentMobile: '',
    email: '',
    cutoffHsc: '170.0'
  });

  // New Teacher Form State
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    password: 'teacherpassword',
    dept: 'CSE',
    phone: '',
    assignedBatches: ['2024-2028'],
    assignedSections: ['Sec A']
  });

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchBatch = selectedBatch === 'ALL' || s.batch === selectedBatch;
    const matchDept = selectedDept === 'ALL' || s.dept === selectedDept;
    const matchSection = selectedSection === 'ALL' || s.section === selectedSection;
    const matchSearch =
      !studentSearch.trim() ||
      (s.name && s.name.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.regNo && s.regNo.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.admnNo && s.admnNo.toLowerCase().includes(studentSearch.toLowerCase()));
    return matchBatch && matchDept && matchSection && matchSearch;
  });

  // Admin Create New Student in Particular Dept, Batch & Section
  const handleAdminCreateStudentSubmit = (e) => {
    e.preventDefault();
    if (!newAdminStudent.name || !newAdminStudent.dob) {
      alert('Please fill out Student Name and Date of Birth');
      return;
    }

    const regNoClean = newAdminStudent.regNo ? newAdminStudent.regNo.trim().toUpperCase() : `921324104${Math.floor(100 + Math.random() * 800)}`;

    if (newAdminStudent.regNo && students.some((s) => s.regNo === regNoClean)) {
      alert(`Student with Register Number ${regNoClean} already exists!`);
      return;
    }

    const createdStudent = {
      id: `STU-ADM-${Date.now()}`,
      admnNo: newAdminStudent.admnNo || `2024${Math.floor(100 + Math.random() * 800)}`,
      rollNo: newAdminStudent.rollNo || `24104${Math.floor(100 + Math.random() * 800)}`,
      regNo: regNoClean,
      name: newAdminStudent.name.trim().toUpperCase(),
      dob: newAdminStudent.dob,
      gender: newAdminStudent.gender,
      dept: newAdminStudent.dept,
      batch: newAdminStudent.batch,
      section: newAdminStudent.section,
      community: 'BC',
      bloodGroup: 'O+',
      boardingStatus: 'Dayscholar',
      cutoffHsc: newAdminStudent.cutoffHsc || '170.0',
      email: newAdminStudent.email || `${newAdminStudent.name.toLowerCase().replace(/\s+/g, '')}@vsb.ac.in`,
      studentMobile: newAdminStudent.studentMobile || '9442100000',
      cgpa: '8.80',
      attendance: '95.0',
      status: 'Active'
    };

    const updatedList = [createdStudent, ...students];
    onUpdateStudents(updatedList);
    setStorageData(KEYS.STUDENTS, updatedList);

    addActivityLog(
      admin.name || 'Super Administrator',
      'ADMIN',
      'CREATE_STUDENT_ACCOUNT',
      `Admin created new student login for ${createdStudent.name} (Reg: ${createdStudent.regNo}) in ${createdStudent.dept} • ${createdStudent.batch} • ${createdStudent.section}`
    );

    setShowAddStudentModal(false);
    setNewAdminStudent({
      name: '',
      dob: '',
      regNo: '',
      rollNo: '',
      admnNo: '',
      dept: 'CSE',
      batch: '2024-2028',
      section: 'Sec A',
      gender: 'M',
      studentMobile: '',
      email: '',
      cutoffHsc: '170.0'
    });

    alert(`Successfully created student login for ${createdStudent.name} in ${createdStudent.dept} (${createdStudent.batch} - ${createdStudent.section})!`);
  };

  // Admin Export Students to CSV with All 38 Database Fields
  const handleAdminExportCSV = () => {
    const headers = [
      'Admn_no', 'Roll_No', 'RegisterNo', 'Student Name', 'DOB', 'Gender', 'Dept', 'Batch', 'Section',
      'EMIS No', 'Community', 'Caste', 'Blood Group', 'Boarding Status',
      '10th Marks', '12th Marks', 'Cutoff', 'CGPA', 'Attendance %',
      'Parent Name', 'Relation', 'Parent Mobile', 'Student Mobile', 'Email', 'Aadhaar No',
      'Door No / Street', 'Town / Taluk', 'City / District', 'State', 'Pincode',
      '10th Marksheet Link', '12th Marksheet Link', 'Community Certificate Link', 'Aadhaar Card Link',
      'LinkedIn Link', 'LeetCode Link', 'GitHub Link', 'Status'
    ];

    const rows = filteredStudents.map((s) => [
      s.admnNo || '',
      s.rollNo || '',
      s.regNo || '',
      `"${(s.name || '').replace(/"/g, '""')}"`,
      s.dob || '',
      s.gender || '',
      s.dept || '',
      s.batch || '',
      s.section || '',
      s.emisNo || '',
      s.community || '',
      `"${(s.caste || '').replace(/"/g, '""')}"`,
      s.bloodGroup || '',
      s.boardingStatus || '',
      s.marks10th || '',
      s.marks12th || '',
      s.cutoffHsc || '',
      s.cgpa || '',
      s.attendance || '',
      `"${(s.parentName || '').replace(/"/g, '""')}"`,
      s.relation || '',
      s.parentMobile || '',
      s.studentMobile || '',
      s.email || '',
      s.aadhaar || '',
      `"${(s.doorNoStreet || '').replace(/"/g, '""')}"`,
      `"${(s.townTaluk || '').replace(/"/g, '""')}"`,
      `"${(s.cityDistrict || '').replace(/"/g, '""')}"`,
      s.state || '',
      s.pincode || '',
      s.doc10th || '',
      s.doc12th || '',
      s.docCommunity || '',
      s.docAadhaar || '',
      s.linkLinkedin || '',
      s.linkLeetcode || '',
      s.linkGithub || '',
      s.status || 'Active'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vsb_admin_students_master_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Save Student Record
  const handleAdminSaveStudent = (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    const updatedList = students.map((s) => (s.id === editingStudent.id ? editingStudent : s));
    onUpdateStudents(updatedList);
    setStorageData(KEYS.STUDENTS, updatedList);

    addActivityLog(
      admin.name || 'Super Administrator',
      'ADMIN',
      'UPDATE_STUDENT_RECORD',
      `Administrator updated student record for ${editingStudent.name} (${editingStudent.regNo || editingStudent.rollNo})`
    );

    setEditingStudent(null);
  };

  // Delete Student
  const handleAdminDeleteStudent = (studentId, studentName, regNo) => {
    if (confirm(`ADMIN CONFIRMATION: Delete student record for ${studentName} (${regNo || 'N/A'})?`)) {
      const updatedList = students.filter((s) => s.id !== studentId);
      onUpdateStudents(updatedList);
      setStorageData(KEYS.STUDENTS, updatedList);

      addActivityLog(
        admin.name || 'Super Administrator',
        'ADMIN',
        'DELETE_STUDENT_RECORD',
        `Administrator deleted student record for ${studentName} (${regNo || 'N/A'})`
      );
    }
  };

  // Add Department
  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!newDept.code.trim() || !newDept.name.trim()) return;

    const cleanCode = newDept.code.trim().toUpperCase();
    if (departments.some((d) => d.code === cleanCode)) {
      alert(`Department with code ${cleanCode} already exists!`);
      return;
    }

    const created = { id: cleanCode, code: cleanCode, name: newDept.name.trim() };
    const updatedDepts = [...departments, created];
    if (onUpdateDepartments) onUpdateDepartments(updatedDepts);
    setStorageData(KEYS.DEPARTMENTS, updatedDepts);

    addActivityLog(admin.name || 'Super Admin', 'ADMIN', 'CREATE_DEPARTMENT', `Created department: ${cleanCode}`);
    setNewDept({ code: '', name: '' });
    alert(`Department ${cleanCode} created successfully!`);
  };

  // Add Batch
  const handleAddBatch = (e) => {
    e.preventDefault();
    if (!newBatch.id.trim()) return;

    const cleanBatchId = newBatch.id.trim();
    if (batches.some((b) => b.id === cleanBatchId)) {
      alert(`Batch ${cleanBatchId} already exists!`);
      return;
    }

    const created = { id: cleanBatchId, name: `${cleanBatchId} (${newBatch.year || 1} Year)`, year: Number(newBatch.year) || 1 };
    const updatedBatches = [...batches, created];
    if (onUpdateBatches) onUpdateBatches(updatedBatches);
    setStorageData(KEYS.BATCHES, updatedBatches);

    addActivityLog(admin.name || 'Super Admin', 'ADMIN', 'CREATE_BATCH', `Created batch: ${cleanBatchId}`);
    setNewBatch({ id: '', name: '', year: 1 });
    alert(`Batch ${cleanBatchId} created successfully!`);
  };

  // Add Section bound to Dept & Batch
  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSection.name.trim()) return;

    const rawName = newSection.name.trim();
    const cleanSec = rawName.startsWith('Sec') ? rawName : `Sec ${rawName}`;

    if (!sections.includes(cleanSec)) {
      const updatedSections = [...sections, cleanSec];
      if (onUpdateSections) onUpdateSections(updatedSections);
      setStorageData(KEYS.SECTIONS, updatedSections);
    }

    addActivityLog(
      admin.name || 'Super Admin',
      'ADMIN',
      'CREATE_SECTION',
      `Added section ${cleanSec} bound to ${newSection.dept} (${newSection.batch})`
    );

    alert(`Successfully added section ${cleanSec} to ${newSection.dept} (${newSection.batch})!`);
    setNewSection({ ...newSection, name: '' });
  };

  // Create Faculty
  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacher.name.trim() || !newTeacher.email.trim()) return;

    if (teachers.some((t) => t.email.toLowerCase() === newTeacher.email.trim().toLowerCase())) {
      alert(`Faculty account ${newTeacher.email} already exists!`);
      return;
    }

    const createdTeacher = {
      id: `TCH-${Date.now()}`,
      name: newTeacher.name.trim(),
      email: newTeacher.email.trim().toLowerCase(),
      password: newTeacher.password || 'teacherpassword',
      dept: newTeacher.dept,
      phone: newTeacher.phone.trim() || '+91 9443322110',
      assignedBatches: newTeacher.assignedBatches,
      assignedSections: newTeacher.assignedSections,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    const updatedTeachers = [createdTeacher, ...teachers];
    onUpdateTeachers(updatedTeachers);
    setStorageData(KEYS.TEACHERS, updatedTeachers);

    addActivityLog(admin.name || 'Super Admin', 'ADMIN', 'CREATE_TEACHER', `Created faculty login: ${createdTeacher.email}`);
    setShowAddTeacherModal(false);
    setNewTeacher({ name: '', email: '', password: 'teacherpassword', dept: 'CSE', phone: '', assignedBatches: ['2024-2028'], assignedSections: ['Sec A'] });
  };

  // Toggle Teacher Status
  const handleToggleTeacherStatus = (teacherId, currentStatus, teacherName) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const updatedTeachers = teachers.map((t) => (t.id === teacherId ? { ...t, status: newStatus } : t));
    onUpdateTeachers(updatedTeachers);
    setStorageData(KEYS.TEACHERS, updatedTeachers);
  };

  // Change Teacher Password
  const handleAdminChangeTeacherPassword = (teacherId, teacherName) => {
    const currentT = teachers.find((t) => t.id === teacherId);
    const newPass = prompt(`Enter new password for ${teacherName}:`, currentT?.password || 'teacherpassword');
    if (newPass && newPass.trim()) {
      const updatedTeachers = teachers.map((t) => (t.id === teacherId ? { ...t, password: newPass.trim() } : t));
      onUpdateTeachers(updatedTeachers);
      setStorageData(KEYS.TEACHERS, updatedTeachers);
      addActivityLog(
        admin.name || 'Super Admin',
        'ADMIN',
        'UPDATE_TEACHER_PASSWORD',
        `Administrator updated password for faculty ${teacherName}`
      );
      alert(`Password for ${teacherName} updated successfully!`);
    }
  };

  // Delete Teacher
  const handleAdminDeleteTeacher = (teacherId, teacherName) => {
    if (confirm(`ADMIN CONFIRMATION: Are you sure you want to delete faculty account for ${teacherName}?`)) {
      const updatedTeachers = teachers.filter((t) => t.id !== teacherId);
      onUpdateTeachers(updatedTeachers);
      setStorageData(KEYS.TEACHERS, updatedTeachers);
      addActivityLog(
        admin.name || 'Super Admin',
        'ADMIN',
        'DELETE_TEACHER_ACCOUNT',
        `Administrator deleted faculty account for ${teacherName}`
      );
      alert(`Faculty account for ${teacherName} deleted.`);
    }
  };


  // Filtered Logs
  const filteredLogs = activityLogs.filter((log) => {
    const matchRole = logRoleFilter === 'ALL' || log.role === logRoleFilter;
    if (!matchRole) return false;

    if (!logSearch.trim()) return true;
    const q = logSearch.toLowerCase();
    return (
      log.actor.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-slate-900">
      {/* Super Admin Top Welcome Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg ring-4 ring-purple-500/10">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                SUPER ADMINISTRATOR CONSOLE
              </span>
              <span className="text-xs text-slate-500 font-medium font-mono">User: admin</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">VSB Central Administrative Hub</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an administrative module below to view database records, manage faculty, edit structure, or track teacher updates in system activity logs.
            </p>
          </div>
        </div>
      </div>

      {/* 5 PROMINENT ADMIN OPTION CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {/* Option 1: View Database */}
        <button
          onClick={() => setActiveTab('VIEW_DATABASE')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            activeTab === 'VIEW_DATABASE'
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className={`p-2 rounded-xl w-fit ${activeTab === 'VIEW_DATABASE' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">View Database</h3>
            <p className={`text-[10px] mt-0.5 ${activeTab === 'VIEW_DATABASE' ? 'text-blue-100' : 'text-slate-500'}`}>
              Student records & Excel export
            </p>
          </div>
        </button>

        {/* Option 2: Add Faculty */}
        <button
          onClick={() => setActiveTab('ADD_FACULTY')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            activeTab === 'ADD_FACULTY'
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className={`p-2 rounded-xl w-fit ${activeTab === 'ADD_FACULTY' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'}`}>
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Add Faculty</h3>
            <p className={`text-[10px] mt-0.5 ${activeTab === 'ADD_FACULTY' ? 'text-blue-100' : 'text-slate-500'}`}>
              Manage teacher logins ({teachers.length})
            </p>
          </div>
        </button>

        {/* Option 3: Add/Edit Department & Structure */}
        <button
          onClick={() => setActiveTab('MANAGE_STRUCTURE')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            activeTab === 'MANAGE_STRUCTURE'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className={`p-2 rounded-xl w-fit ${activeTab === 'MANAGE_STRUCTURE' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Depts & Batches</h3>
            <p className={`text-[10px] mt-0.5 ${activeTab === 'MANAGE_STRUCTURE' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Add Depts, Batches & Secs
            </p>
          </div>
        </button>

        {/* Option 4: Student Logins */}
        <button
          onClick={() => setActiveTab('STUDENT_LOGINS')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            activeTab === 'STUDENT_LOGINS'
              ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className={`p-2 rounded-xl w-fit ${activeTab === 'STUDENT_LOGINS' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'}`}>
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Student Logins</h3>
            <p className={`text-[10px] mt-0.5 ${activeTab === 'STUDENT_LOGINS' ? 'text-purple-100' : 'text-slate-500'}`}>
              Add student to Dept/Batch
            </p>
          </div>
        </button>

        {/* Option 5: Audit Logs */}
        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
            activeTab === 'AUDIT_LOGS'
              ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className={`p-2 rounded-xl w-fit ${activeTab === 'AUDIT_LOGS' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'}`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm">Audit Logs</h3>
            <p className={`text-[10px] mt-0.5 ${activeTab === 'AUDIT_LOGS' ? 'text-slate-300' : 'text-slate-500'}`}>
              Teacher updates timeline
            </p>
          </div>
        </button>
      </div>

      {/* MODULE 1: VIEW DATABASE & EXCEL EXPORT */}
      {activeTab === 'VIEW_DATABASE' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 w-full md:w-auto flex-1">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="ALL">All Batches</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
                ))}
              </select>

              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="ALL">All Sections</option>
                {sections.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>
            </div>

            <button
              onClick={handleAdminExportCSV}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel/CSV ({filteredStudents.length})</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                System Student Master Directory ({filteredStudents.length} Records)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] uppercase text-slate-600 font-bold tracking-wider">
                    <th className="py-3 px-4">Register No</th>
                    <th className="py-3 px-4">Student Name (SSLC)</th>
                    <th className="py-3 px-4">DOB</th>
                    <th className="py-3 px-4">Dept</th>
                    <th className="py-3 px-4">Batch & Sec</th>
                    <th className="py-3 px-4">Drive Docs</th>
                    <th className="py-3 px-4">Student Mobile</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredStudents.map((st, idx) => (
                    <tr key={`${st.id || 'stu'}-${st.regNo || idx}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{st.regNo || st.rollNo || '-'}</td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 uppercase">{st.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{st.dob}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{st.dept}</td>
                      <td className="py-3 px-4 text-slate-600">{st.batch} • {st.section}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          {st.doc10th && <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded">10th</span>}
                          {st.doc12th && <span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded">12th</span>}
                          {st.docCommunity && <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Comm</span>}
                          {st.docAadhaar && <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.5 rounded">Aadhaar</span>}
                          {!st.doc10th && !st.doc12th && !st.docCommunity && !st.docAadhaar && <span className="text-slate-400 text-[10px]">None</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{st.studentMobile || st.parentMobile || '-'}</td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setViewStudent(st)}
                          title="View All Student Data"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingStudent(st)}
                          title="Edit Student Record"
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAdminDeleteStudent(st.id, st.name, st.regNo)}
                          title="Delete Student Record"
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: ADD / MANAGE FACULTY LOGINS */}
      {activeTab === 'ADD_FACULTY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty Logins ({teachers.length})</h2>
              <p className="text-xs text-slate-500">Create new teacher accounts, change passwords, or remove faculty access.</p>
            </div>
            <button
              onClick={() => setShowAddTeacherModal(true)}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Faculty Login</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teachers.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{t.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">{t.email}</p>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleToggleTeacherStatus(t.id, t.status, t.name)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                        t.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      {t.status}
                    </button>
                    <button
                      onClick={() => handleAdminDeleteTeacher(t.id, t.name)}
                      title="Delete Faculty Account"
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Assigned Dept</p>
                    <p className="font-bold text-slate-800">{t.dept}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Password</p>
                      <p className="font-mono text-slate-700">{t.password || 'teacherpassword'}</p>
                    </div>
                    <button
                      onClick={() => handleAdminChangeTeacherPassword(t.id, t.name)}
                      className="flex items-center space-x-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-purple-200 transition-all cursor-pointer"
                    >
                      <Key className="w-3 h-3" />
                      <span>Change</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* MODULE 3: ADD / EDIT DEPARTMENTS, BATCHES & MATCHING SECTIONS */}
      {activeTab === 'MANAGE_STRUCTURE' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create New Department */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
              <Building className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">1. Add Department</h2>
            </div>

            <form onSubmit={handleAddDepartment} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Department Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CYBER or AI&DS"
                  value={newDept.code}
                  onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Full Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyber Security & Engineering"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                + Create Department
              </button>
            </form>

            <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Existing Departments ({departments.length}):</p>
              <div className="flex flex-wrap gap-1">
                {departments.map((d) => (
                  <span key={d.id} className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                    {d.code}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Create New Academic Batch */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">2. Add Academic Batch</h2>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Batch Year Range *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2025-2029"
                  value={newBatch.id}
                  onChange={(e) => setNewBatch({ ...newBatch, id: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Year of Study</label>
                <select
                  value={newBatch.year}
                  onChange={(e) => setNewBatch({ ...newBatch, year: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                + Create Academic Batch
              </button>
            </form>

            <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Existing Batches ({batches.length}):</p>
              <div className="flex flex-wrap gap-1">
                {batches.map((b) => (
                  <span key={b.id} className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {b.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Add Section Bound to Dept & Batch */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
              <Layers className="w-5 h-5 text-purple-600" />
              <h2 className="text-base font-bold text-slate-900">3. Add Section to Dept & Batch</h2>
            </div>

            <form onSubmit={handleAddSection} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Target Department *</label>
                <select
                  value={newSection.dept}
                  onChange={(e) => setNewSection({ ...newSection, dept: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Target Academic Batch *</label>
                <select
                  value={newSection.batch}
                  onChange={(e) => setNewSection({ ...newSection, batch: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Section Name to Add *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sec E"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add {newSection.name || 'Section'} to {newSection.dept} ({newSection.batch})</span>
              </button>
            </form>

            <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Current Sections ({sections.length}):</p>
              <div className="flex flex-wrap gap-1">
                {sections.map((sec) => (
                  <span key={sec} className="bg-purple-50 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-200">
                    {sec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: STUDENT LOGINS & CREATE NEW STUDENT IN DEPT/BATCH/SECTION */}
      {activeTab === 'STUDENT_LOGINS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Student Logins & Account Creation</h2>
              <p className="text-xs text-slate-500">Students log in using Register Number (Login ID) and Date of Birth (Password).</p>
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Student to Particular Dept / Batch / Sec</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] uppercase text-slate-600 font-bold tracking-wider">
                  <th className="py-3 px-4">Register Number (Login ID)</th>
                  <th className="py-3 px-4">DOB (Login Password)</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Dept & Batch</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4 text-right">Quick Admin Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((st, idx) => (
                  <tr key={`${st.id || 'login'}-${st.regNo || idx}`} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{st.regNo || st.rollNo}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">{st.dob}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 uppercase">{st.name}</td>
                    <td className="py-3 px-4 text-slate-600">{st.dept} • {st.batch}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{st.section}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setEditingStudent(st)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Edit DOB / Name
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULE 5: SYSTEM AUDIT LOGS WITH TEACHER UPDATES FILTER */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty Updates & System Audit Logs</h2>
              <p className="text-xs text-slate-500">Track all updates made by teachers when editing students or batches.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-600">Filter Role:</span>
              <select
                value={logRoleFilter}
                onChange={(e) => setLogRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
              >
                <option value="ALL">All System Activity</option>
                <option value="TEACHER">👩‍🏫 Faculty / Teacher Updates Only</option>
                <option value="ADMIN">🛡️ Admin Actions Only</option>
              </select>

              <input
                type="text"
                placeholder="Search logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No matching activity log entries found.</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className={`p-4 rounded-2xl border text-xs space-y-1 ${
                  log.role === 'TEACHER' ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className={`px-2 py-0.5 rounded ${
                      log.role === 'TEACHER' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {log.actor} ({log.role})
                    </span>
                    <span className="text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="font-extrabold text-slate-900 text-xs mt-1">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ADMIN CREATE NEW STUDENT ACCOUNT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Add Student to Specific Dept, Batch & Section</h3>
              </div>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminCreateStudentSubmit} className="space-y-4">
              {/* Target Dept, Batch & Section Selectors */}
              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                <h4 className="font-bold text-purple-900 text-xs">Assign Department, Batch & Section:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Target Department *</label>
                    <select
                      value={newAdminStudent.dept}
                      onChange={(e) => setNewAdminStudent({ ...newAdminStudent, dept: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Target Academic Batch *</label>
                    <select
                      value={newAdminStudent.batch}
                      onChange={(e) => setNewAdminStudent({ ...newAdminStudent, batch: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                    >
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Target Section *</label>
                    <select
                      value={newAdminStudent.section}
                      onChange={(e) => setNewAdminStudent({ ...newAdminStudent, section: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                    >
                      {sections.map((sec) => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Personal & Login Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Student Full Name (SSLC) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SANGEETHA R"
                    value={newAdminStudent.name}
                    onChange={(e) => setNewAdminStudent({ ...newAdminStudent, name: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Date of Birth (Login Password) *</label>
                  <input
                    type="date"
                    required
                    value={newAdminStudent.dob}
                    onChange={(e) => setNewAdminStudent({ ...newAdminStudent, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Register Number (Login ID)</label>
                  <input
                    type="text"
                    placeholder="e.g. 921324104088"
                    value={newAdminStudent.regNo}
                    onChange={(e) => setNewAdminStudent({ ...newAdminStudent, regNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Student Login</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN VIEW FULL STUDENT DATA MODAL */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base border border-blue-200">
                  {viewStudent.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-blue-200">
                      MASTER STUDENT PROFILE
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-bold">Reg: {viewStudent.regNo || viewStudent.rollNo || 'N/A'}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase mt-0.5">{viewStudent.name}</h3>
                </div>
              </div>
              <button onClick={() => setViewStudent(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic & Batch Overview Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Department</span>
                <p className="font-extrabold text-slate-900 text-sm">{viewStudent.dept || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Batch & Section</span>
                <p className="font-extrabold text-slate-900 text-sm">{viewStudent.batch || '-'} • {viewStudent.section || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">HSC Cutoff</span>
                <p className="font-extrabold text-blue-600 text-sm">{viewStudent.cutoffHsc || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">CGPA / Attendance</span>
                <p className="font-extrabold text-emerald-600 text-sm">{viewStudent.cgpa || '-'} / {viewStudent.attendance ? `${viewStudent.attendance}%` : '-'}</p>
              </div>
            </div>

            {/* Detailed Parameters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section A: Academic Marks & IDs */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Academic Marks & Registration</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-500 text-[10px] font-bold">Register Number:</span> <p className="font-mono font-bold text-slate-900">{viewStudent.regNo || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Roll Number:</span> <p className="font-mono font-bold text-slate-900">{viewStudent.rollNo || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Admission Number:</span> <p className="font-mono text-slate-900">{viewStudent.admnNo || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">10th Marks:</span> <p className="font-bold text-slate-900">{viewStudent.marks10th || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">12th Marks:</span> <p className="font-bold text-slate-900">{viewStudent.marks12th || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">EMIS Number:</span> <p className="font-mono text-slate-900">{viewStudent.emisNo || '-'}</p></div>
                </div>
              </div>

              {/* Section B: Personal & Community */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Personal & Category Details</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-500 text-[10px] font-bold">Date of Birth:</span> <p className="font-mono font-bold text-slate-900">{viewStudent.dob || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Gender:</span> <p className="font-bold text-slate-900">{viewStudent.gender === 'M' ? 'Male' : viewStudent.gender === 'F' ? 'Female' : '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Community:</span> <p className="font-bold text-slate-900">{viewStudent.community || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Caste:</span> <p className="font-bold text-slate-900">{viewStudent.caste || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Blood Group:</span> <p className="font-bold text-slate-900">{viewStudent.bloodGroup || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Boarding Status:</span> <p className="font-bold text-slate-900">{viewStudent.boardingStatus || '-'}</p></div>
                </div>
              </div>

              {/* Section C: Contact & Parent Info */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span>Parent & Contact Information</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-500 text-[10px] font-bold">Parent Name:</span> <p className="font-bold text-slate-900">{viewStudent.parentName || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Parent Mobile:</span> <p className="font-mono font-bold text-slate-900">{viewStudent.parentMobile || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Student Mobile:</span> <p className="font-mono font-bold text-slate-900">{viewStudent.studentMobile || '-'}</p></div>
                  <div><span className="text-slate-500 text-[10px] font-bold">Email ID:</span> <p className="font-mono text-blue-600">{viewStudent.email || '-'}</p></div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500 text-[10px] font-bold">Residential Address:</span>
                  <p className="font-medium text-slate-800">
                    {[viewStudent.doorNoStreet, viewStudent.townTaluk, viewStudent.cityDistrict, viewStudent.state, viewStudent.pincode].filter(Boolean).join(', ') || '-'}
                  </p>
                </div>
              </div>

              {/* Section D: Documents & Portfolios */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-600" />
                  <span>Drive Certificates & Coding Links</span>
                </h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">10th Marksheet:</span>
                    {viewStudent.doc10th ? <a href={viewStudent.doc10th} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">View Drive Link</a> : <span className="text-slate-400">Not Uploaded</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">12th Marksheet:</span>
                    {viewStudent.doc12th ? <a href={viewStudent.doc12th} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">View Drive Link</a> : <span className="text-slate-400">Not Uploaded</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Community Certificate:</span>
                    {viewStudent.docCommunity ? <a href={viewStudent.docCommunity} target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline">View Drive Link</a> : <span className="text-slate-400">Not Uploaded</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Aadhaar Card:</span>
                    {viewStudent.docAadhaar ? <a href={viewStudent.docAadhaar} target="_blank" rel="noreferrer" className="text-purple-600 font-bold hover:underline">View Drive Link</a> : <span className="text-slate-400">Not Uploaded</span>}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Coding Profiles:</span>
                    <div className="flex items-center space-x-2">
                      {viewStudent.linkLinkedin && <a href={viewStudent.linkLinkedin} target="_blank" rel="noreferrer" className="text-blue-600 font-bold">LinkedIn</a>}
                      {viewStudent.linkLeetcode && <a href={viewStudent.linkLeetcode} target="_blank" rel="noreferrer" className="text-amber-600 font-bold">LeetCode</a>}
                      {viewStudent.linkGithub && <a href={viewStudent.linkGithub} target="_blank" rel="noreferrer" className="text-slate-800 font-bold">GitHub</a>}
                      {!viewStudent.linkLinkedin && !viewStudent.linkLeetcode && !viewStudent.linkGithub && <span className="text-slate-400">None</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setViewStudent(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EDIT STUDENT RECORD MODAL (COMPREHENSIVE) */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                  Super Admin Full Record Edit Mode
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1 uppercase">{editingStudent.name}</h3>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminSaveStudent} className="space-y-4">
              {/* Section 1: Basic Identifiers */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase">Basic Identifiers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.name || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Register Number (Login ID)</label>
                    <input
                      type="text"
                      value={editingStudent.regNo || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, regNo: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Date of Birth (Login DOB)</label>
                    <input
                      type="date"
                      value={editingStudent.dob || ''}
                      onChange={(e) => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Department, Batch & Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Department</label>
                  <select
                    value={editingStudent.dept || 'CSE'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, dept: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Academic Batch</label>
                  <select
                    value={editingStudent.batch || '2024-2028'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, batch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Section</label>
                  <select
                    value={editingStudent.section || 'Sec A'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, section: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {sections.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 3: Academic Performance */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">10th Marks</label>
                  <input
                    type="text"
                    value={editingStudent.marks10th || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, marks10th: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">12th Marks</label>
                  <input
                    type="text"
                    value={editingStudent.marks12th || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, marks12th: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">HSC Cutoff</label>
                  <input
                    type="text"
                    value={editingStudent.cutoffHsc || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, cutoffHsc: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">CGPA</label>
                  <input
                    type="text"
                    value={editingStudent.cgpa || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, cgpa: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-600"
                  />
                </div>
              </div>

              {/* Section 4: Contact & Parent Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={editingStudent.parentName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Parent Mobile</label>
                  <input
                    type="text"
                    value={editingStudent.parentMobile || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentMobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Student Mobile</label>
                  <input
                    type="text"
                    value={editingStudent.studentMobile || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentMobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Admin Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* CREATE TEACHER ACCOUNT MODAL */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Create Faculty Login Account</h3>
              </div>
              <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Faculty Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. K. Saravanan"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Email ID (Login Username) *</label>
                <input
                  type="email"
                  required
                  placeholder="faculty@vsb.ac.in"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Login Password *</label>
                <input
                  type="text"
                  required
                  value={newTeacher.password}
                  onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Department</label>
                <select
                  value={newTeacher.dept}
                  onChange={(e) => setNewTeacher({ ...newTeacher, dept: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Create Faculty Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
