'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  Trash2,
  Eye,
  Upload,
  CheckCircle,
  X,
  GraduationCap,
  ExternalLink,
  Code,
  Globe,
  AlertCircle,
  UserPlus,
  Edit3
} from 'lucide-react';
import { addActivityLog, setStorageData, KEYS } from '../lib/storage';

export default function TeacherDashboard({
  teacher,
  students,
  departments,
  batches,
  sections,
  onUpdateStudents
}) {
  // Filters
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');


  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editingTeacherStudent, setEditingTeacherStudent] = useState(null);

  // Form State for Add Student
  const [newStudent, setNewStudent] = useState({
    admnNo: '',
    rollNo: '',
    regNo: '',
    name: '',
    dob: '',
    gender: 'M',
    dept: teacher.dept || 'CSE',
    batch: '2024-2028',
    section: 'Sec B',
    community: 'BC',
    caste: '',
    bloodGroup: 'O+',
    boardingStatus: 'Dayscholar',
    marks10th: '',
    marks12th: '',
    cutoffHsc: '',
    emisNo: '',
    parentName: '',
    relation: 'Father',
    doorNoStreet: '',
    townTaluk: '',
    cityDistrict: '',
    state: 'Tamilnadu',
    pincode: '',
    email: '',
    aadhaar: '',
    parentMobile: '',
    studentMobile: ''
  });

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [csvMessage, setCsvMessage] = useState('');
  const [csvError, setCsvError] = useState('');

  // Filter Logic
  const filteredStudents = students.filter((s) => {
    const matchBatch = selectedBatch === 'ALL' || s.batch === selectedBatch;
    const matchDept = selectedDept === 'ALL' || s.dept === selectedDept;
    const matchSection = selectedSection === 'ALL' || s.section === selectedSection;
    const matchSearch =
      !searchQuery.trim() ||
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.regNo && s.regNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.admnNo && s.admnNo.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchBatch && matchDept && matchSection && matchSearch;
  });

  // Teacher Save Edited Student Handler (Triggers Audit Log with Teacher Name & Batch!)
  const handleTeacherSaveStudent = (e) => {
    e.preventDefault();
    if (!editingTeacherStudent) return;

    const updatedList = students.map((s) => (s.id === editingTeacherStudent.id ? editingTeacherStudent : s));
    onUpdateStudents(updatedList);
    setStorageData(KEYS.STUDENTS, updatedList);

    // EXACT LOG FORMAT requested by user: Teacher Name updates Student Name and Batch
    addActivityLog(
      teacher.name,
      'TEACHER',
      'TEACHER_UPDATE_STUDENT',
      `Faculty ${teacher.name} updated student ${editingTeacherStudent.name} (${editingTeacherStudent.regNo || editingTeacherStudent.rollNo}) in Batch ${editingTeacherStudent.batch} (${editingTeacherStudent.section})`
    );

    alert(`Saved changes for ${editingTeacherStudent.name}! Logged for Admin audit.`);
    setEditingTeacherStudent(null);
  };

  // Add Single Student Handler
  const handleAddStudentSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.dob) {
      alert('Please fill out Student Name and Date of Birth');
      return;
    }

    const regNoClean = newStudent.regNo ? newStudent.regNo.trim().toUpperCase() : `921324104${Math.floor(100 + Math.random() * 800)}`;

    if (newStudent.regNo && students.some((s) => s.regNo === regNoClean)) {
      alert(`Student with Register Number ${regNoClean} already exists!`);
      return;
    }

    const createdStudent = {
      id: `STU-${Date.now()}`,
      admnNo: newStudent.admnNo || `2024${Math.floor(100 + Math.random() * 800)}`,
      rollNo: newStudent.rollNo || `24104${Math.floor(100 + Math.random() * 800)}`,
      regNo: regNoClean,
      name: newStudent.name.trim().toUpperCase(),
      dob: newStudent.dob,
      gender: newStudent.gender,
      dept: newStudent.dept,
      batch: newStudent.batch,
      section: newStudent.section,
      community: newStudent.community,
      caste: newStudent.caste,
      bloodGroup: newStudent.bloodGroup,
      boardingStatus: newStudent.boardingStatus,
      marks10th: newStudent.marks10th,
      marks12th: newStudent.marks12th,
      cutoffHsc: newStudent.cutoffHsc,
      emisNo: newStudent.emisNo,
      parentName: newStudent.parentName,
      relation: newStudent.relation,
      doorNoStreet: newStudent.doorNoStreet,
      townTaluk: newStudent.townTaluk,
      cityDistrict: newStudent.cityDistrict,
      state: newStudent.state,
      pincode: newStudent.pincode,
      email: newStudent.email || `${newStudent.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      aadhaar: newStudent.aadhaar,
      parentMobile: newStudent.parentMobile,
      studentMobile: newStudent.studentMobile,
      cgpa: '8.50',
      attendance: '94.0',
      status: 'Active'
    };

    const updatedList = [createdStudent, ...students];
    onUpdateStudents(updatedList);
    setStorageData(KEYS.STUDENTS, updatedList);

    // EXACT LOG FORMAT: Teacher Name added Student Name in Batch
    addActivityLog(
      teacher.name,
      'TEACHER',
      'TEACHER_ADD_STUDENT',
      `Faculty ${teacher.name} added new student ${createdStudent.name} (${createdStudent.regNo}) to Batch ${createdStudent.batch} (${createdStudent.section})`
    );

    setShowAddModal(false);
    setNewStudent({
      admnNo: '',
      rollNo: '',
      regNo: '',
      name: '',
      dob: '',
      gender: 'M',
      dept: teacher.dept || 'CSE',
      batch: '2024-2028',
      section: 'Sec B',
      community: 'BC',
      caste: '',
      bloodGroup: 'O+',
      boardingStatus: 'Dayscholar',
      marks10th: '',
      marks12th: '',
      cutoffHsc: '',
      emisNo: '',
      parentName: '',
      relation: 'Father',
      doorNoStreet: '',
      townTaluk: '',
      cityDistrict: '',
      state: 'Tamilnadu',
      pincode: '',
      email: '',
      aadhaar: '',
      parentMobile: '',
      studentMobile: ''
    });
  };

  // ROBUST CSV PARSER
  const parseCSVContent = (rawText) => {
    setCsvError('');
    setCsvMessage('');

    if (!rawText || !rawText.trim()) {
      setCsvError('Please select or paste a valid CSV file.');
      return;
    }

    const lines = rawText.trim().split(/\r?\n/);
    let addedCount = 0;
    const newRecords = [];

    lines.forEach((line, index) => {
      if (!line.trim()) return;

      if (line.toLowerCase().includes('admn_no') || line.toLowerCase().includes('registerno')) return;

      const matches = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || line.split(',');
      const clean = matches.map((m) => m.replace(/^"|"$/g, '').trim());

      if (clean.length < 2) return;

      let studentRecord = null;

      if (clean.length >= 15) {
        const admnNo = clean[0] || '';
        const rollNo = clean[13] || '';
        const regNo = clean[14] || clean[13] || `921324104${100 + index}`;
        const name = clean[15] || '';
        if (!name) return;

        const secRaw = clean[16] || 'Sec B';
        const section = secRaw.startsWith('Sec') ? secRaw : `Sec ${secRaw}`;

        studentRecord = {
          id: `STU-CSV-${Date.now()}-${index}`,
          admnNo: admnNo || `2024${500 + index}`,
          rollNo: rollNo || `24104${60 + index}`,
          regNo: regNo.toUpperCase(),
          name: name.toUpperCase(),
          dept: clean[3] || (selectedDept !== 'ALL' ? selectedDept : teacher.dept || 'CSE'),
          batch: selectedBatch !== 'ALL' ? selectedBatch : '2024-2028',
          section: section,
          dob: clean[17] || '2006-01-01',
          gender: clean[18] || 'M',
          tamilMedium: clean[19] || '0',
          board10th: clean[20] || 'State Board',
          marks10th: clean[21] || '',
          board12th: clean[22] || 'State Board',
          marks12th: clean[24] || '',
          cutoffHsc: clean[25] || '',
          passingYearHsc: clean[26] || '2024',
          emisNo: clean[32] || '',
          physicallyChallenged: clean[33] || 'N',
          differentlyAbled: clean[34] || 'N',
          bloodGroup: clean[35] || 'O+',
          nationality: clean[36] || 'Indian',
          religion: clean[37] || 'Hindu',
          community: clean[38] || 'BC',
          caste: clean[39] || '',
          boardingStatus: clean[40] === '1' ? 'Hosteller' : 'Dayscholar',
          parentName: clean[41] || '',
          relation: clean[42] || 'Father',
          doorNoStreet: clean[43] || '',
          townTaluk: clean[44] || '',
          cityDistrict: clean[45] || '',
          state: clean[46] || 'Tamilnadu',
          pincode: clean[48] || '',
          email: clean[50] || clean[49] || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          aadhaar: clean[51] || '',
          parentMobile: clean[52] || '',
          studentMobile: clean[53] || '',
          cgpa: '8.50',
          attendance: '94.0',
          status: 'Active'
        };
      } else {
        const [regNo, name, dob, dept, batch, section] = clean;
        if (!name) return;

        const cleanReg = regNo ? regNo.toUpperCase() : `921324104${100 + index}`;
        studentRecord = {
          id: `STU-CSV-${Date.now()}-${index}`,
          admnNo: `2024${500 + index}`,
          rollNo: `24104${60 + index}`,
          regNo: cleanReg,
          name: name.toUpperCase(),
          dob: dob || '2006-01-01',
          gender: 'M',
          dept: dept || (selectedDept !== 'ALL' ? selectedDept : teacher.dept || 'CSE'),
          batch: batch || (selectedBatch !== 'ALL' ? selectedBatch : '2024-2028'),
          section: section || (selectedSection !== 'ALL' ? selectedSection : 'Sec B'),
          bloodGroup: 'B+',
          boardingStatus: 'Dayscholar',
          email: `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          cgpa: '8.50',
          attendance: '92.0',
          status: 'Active'
        };
      }

      if (studentRecord && !students.some((s) => s.regNo === studentRecord.regNo)) {
        newRecords.push(studentRecord);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      const updatedList = [...newRecords, ...students];
      onUpdateStudents(updatedList);
      setStorageData(KEYS.STUDENTS, updatedList);

      addActivityLog(
        teacher.name,
        'TEACHER',
        'TEACHER_BULK_CSV_IMPORT',
        `Faculty ${teacher.name} bulk imported ${addedCount} student records from CSV file`
      );

      setCsvMessage(`Successfully added ${addedCount} student records to database!`);
      setTimeout(() => {
        setShowCsvModal(false);
        setCsvText('');
        setCsvMessage('');
      }, 1500);
    } else {
      setCsvError('No new unique student records found in CSV file.');
    }
  };

  // CSV File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      setCsvText(content);
      parseCSVContent(content);
    };
    reader.onerror = () => {
      setCsvError('Error reading file. Make sure it is a valid CSV or TXT file.');
    };
    reader.readAsText(file);
  };

  // Complete Export CSV Function with All 38 Student Fields
  const handleExportCSV = () => {
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
    link.setAttribute('download', `vsb_students_master_export_${selectedDept}_${selectedBatch}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  // Delete Student
  const handleDeleteStudent = (studentId, studentName, regNo, batch) => {
    if (confirm(`Delete student record: ${studentName} (${regNo || 'N/A'})?`)) {
      const updatedList = students.filter((s) => s.id !== studentId);
      onUpdateStudents(updatedList);
      setStorageData(KEYS.STUDENTS, updatedList);

      addActivityLog(
        teacher.name,
        'TEACHER',
        'TEACHER_DELETE_STUDENT',
        `Faculty ${teacher.name} deleted student ${studentName} (${regNo || 'N/A'}) in Batch ${batch || '2024-2028'}`
      );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 text-slate-900">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-0.5 rounded-full border border-emerald-200">
              FACULTY PORTAL CONSOLE
            </span>
            <span className="text-xs text-slate-600 font-medium">Faculty: {teacher.name} ({teacher.dept})</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">VSB Student Database Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View student profiles, edit details, upload Drive marksheets & export to Excel/CSV. All edits log for Admin review.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student Entry</span>
          </button>

          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bulk CSV Import</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel/CSV ({filteredStudents.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Control Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Dynamic Batch & Department Filter Controls</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Academic Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Batches</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.code}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Sections</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Search Student Name / Reg No
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Student Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filtered Student Directory ({filteredStudents.length} Records)
            </span>
          </div>

          <div className="text-xs text-slate-500 font-semibold">
            Active Filter: <span className="font-bold text-blue-600">{selectedDept}</span> | Batch:{' '}
            <span className="font-bold text-blue-600">{selectedBatch}</span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No student records found matching filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] uppercase text-slate-600 font-bold tracking-wider">
                  <th className="py-3 px-4">Admn No</th>
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Name (SSLC)</th>
                  <th className="py-3 px-4">DOB</th>
                  <th className="py-3 px-4">Dept</th>
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Uploaded Docs</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4 text-right">Faculty Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStudents.map((st, idx) => (
                  <tr key={`${st.id || 'stu'}-${st.regNo || st.rollNo || idx}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-500">{st.admnNo || '-'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{st.rollNo || '-'}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900 uppercase">{st.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{st.dob}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {st.dept}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{st.section}</td>
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
                        title="View Full Profile & Certificates"
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingTeacherStudent(st)}
                        title="Edit Student Info & Marks"
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(st.id, st.name, st.regNo, st.batch)}
                        title="Delete record"
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
        )}
      </div>

      {/* TEACHER EDIT STUDENT MODAL (COMPREHENSIVE) */}
      {editingTeacherStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  Faculty Full Student Record Edit Mode
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1 uppercase">{editingTeacherStudent.name}</h3>
              </div>
              <button onClick={() => setEditingTeacherStudent(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTeacherSaveStudent} className="space-y-4">
              {/* Section 1: Basic Identifiers */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase">Basic Identifiers</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingTeacherStudent.name || ''}
                      onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, name: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Register Number</label>
                    <input
                      type="text"
                      value={editingTeacherStudent.regNo || ''}
                      onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, regNo: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={editingTeacherStudent.dob || ''}
                      onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, dob: e.target.value })}
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
                    value={editingTeacherStudent.dept || 'CSE'}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, dept: e.target.value })}
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
                    value={editingTeacherStudent.batch || '2024-2028'}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, batch: e.target.value })}
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
                    value={editingTeacherStudent.section || 'Sec A'}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, section: e.target.value })}
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
                    value={editingTeacherStudent.marks10th || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, marks10th: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">12th Marks</label>
                  <input
                    type="text"
                    value={editingTeacherStudent.marks12th || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, marks12th: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">HSC Cutoff</label>
                  <input
                    type="text"
                    value={editingTeacherStudent.cutoffHsc || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, cutoffHsc: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">CGPA</label>
                  <input
                    type="text"
                    value={editingTeacherStudent.cgpa || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, cgpa: e.target.value })}
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
                    value={editingTeacherStudent.parentName || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Parent Mobile</label>
                  <input
                    type="text"
                    value={editingTeacherStudent.parentMobile || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, parentMobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Student Mobile</label>
                  <input
                    type="text"
                    value={editingTeacherStudent.studentMobile || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, studentMobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Drive Certificate Links */}
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-2">
                <h4 className="font-bold text-emerald-900 text-xs uppercase">Drive Certificate & Marksheet Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    placeholder="10th Marksheet Drive Link"
                    value={editingTeacherStudent.doc10th || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, doc10th: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                  />
                  <input
                    type="url"
                    placeholder="12th Marksheet Drive Link"
                    value={editingTeacherStudent.doc12th || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, doc12th: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                  />
                  <input
                    type="url"
                    placeholder="Community Certificate Drive Link"
                    value={editingTeacherStudent.docCommunity || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, docCommunity: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                  />
                  <input
                    type="url"
                    placeholder="Aadhaar Card Drive Link"
                    value={editingTeacherStudent.docAadhaar || ''}
                    onChange={(e) => setEditingTeacherStudent({ ...editingTeacherStudent, docAadhaar: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTeacherStudent(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save Changes & Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SINGLE STUDENT ADD ENTRY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Add New Student Entry</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Student Full Name (SSLC Capital) *</label>
                  <input
                    type="text"
                    required
                    placeholder="KARTHIK S"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Date of Birth (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Register Number</label>
                  <input
                    type="text"
                    placeholder="921324104064"
                    value={newStudent.regNo}
                    onChange={(e) => setNewStudent({ ...newStudent, regNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Roll Number</label>
                  <input
                    type="text"
                    placeholder="24104064"
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Admission Number</label>
                  <input
                    type="text"
                    placeholder="2024940"
                    value={newStudent.admnNo}
                    onChange={(e) => setNewStudent({ ...newStudent, admnNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Department</label>
                  <select
                    value={newStudent.dept}
                    onChange={(e) => setNewStudent({ ...newStudent, dept: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.code}>{d.code} - {d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Batch</label>
                  <select
                    value={newStudent.batch}
                    onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
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
                    value={newStudent.section}
                    onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {sections.map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Gender</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Save Student Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ERROR-FREE BULK CSV IMPORT MODAL */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Bulk CSV Student File Import</h3>
              </div>
              <button
                onClick={() => setShowCsvModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Upload your official VSB Excel CSV file (<code className="bg-slate-100 font-mono text-slate-800 px-1.5 py-0.5 rounded text-[11px]">.csv</code>) or paste raw CSV content below.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
              <Upload className="w-6 h-6 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-slate-800">Choose CSV File from Computer</div>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>

            {csvMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{csvMessage}</span>
              </div>
            )}

            {csvError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); parseCSVContent(csvText); }} className="space-y-3">
              <textarea
                rows={5}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={`2024940,UG,B.E,CSE,2024,O,1,7.5,2024-09-23,,,2024-09-23,2024,24104064,,GOBIKA M,2,2006-12-07,F,0...`}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              ></textarea>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Process & Import CSV</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Student Record Modal (Comprehensive 38-Parameter Profile) */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base border border-emerald-200">
                  {viewStudent.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                      FACULTY STUDENT MASTER PROFILE
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
                  <UserPlus className="w-4 h-4 text-purple-600" />
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
    </div>
  );
}
