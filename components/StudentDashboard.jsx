'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  BookOpen,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  ShieldCheck,
  FileText,
  CreditCard,
  Building,
  Heart,
  Home,
  Edit3,
  Link as LinkIcon,
  ExternalLink,
  Upload,
  X,
  Code,
  Globe,
  Share2,
  Check,
  Shield,
  Briefcase,
  School,
  Settings
} from 'lucide-react';
import { addActivityLog } from '../lib/storage';

export default function StudentDashboard({ student, onUpdateProfile }) {
  const [s, setS] = useState(student);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  useEffect(() => {
    setS(student);
  }, [student]);

  const sections = [
    { id: 'personal',   label: 'Personal Info',    icon: User },
    { id: 'contact',    label: 'Contact & Family', icon: Phone },
    { id: 'admission',  label: 'Admission Info',   icon: Shield },
    { id: 'academic',   label: 'Academic Record',  icon: BookOpen },
    { id: 'skills',     label: 'Skills & Links',    icon: Code },
    { id: 'documents',  label: 'Documents (Drive)', icon: FileText },
  ];

  const updateField = (key, val) => {
    setS((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    onUpdateProfile(s);
    setSaved(true);
    addActivityLog(
      s.name,
      'STUDENT',
      'UPDATE_PROFILE',
      `Student ${s.name} (${s.regNo || s.rollNo}) updated their profile fields and document links`
    );
    setTimeout(() => setSaved(false), 2000);
    setEditMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 text-slate-900">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            My Profile & Database Record
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep every field up to date — changes sync directly across portal, faculty view & Excel database.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`btn btn-sm ${editMode ? 'btn-ghost text-slate-700 bg-white border border-slate-300' : 'btn-accent bg-emerald-600 text-white hover:bg-emerald-700 font-bold'}`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{editMode ? 'Cancel Edit' : 'Edit Profile & Links'}</span>
          </button>

          <button
            onClick={handleSave}
            className="btn btn-sm btn-primary bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
          >
            {saved ? (
              <span className="flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1">
                <Upload className="w-4 h-4" />
                <span>Save Changes</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Student Overview Header Card */}
      <div className="glass-strong bg-white/95 text-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200/80 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg ring-4 ring-blue-500/20">
              {s.name ? s.name.charAt(0) : 'S'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Approved ({s.status || 'Active'})</span>
                </span>
                <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {s.boardingStatus || 'Dayscholar'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 uppercase">
                {s.name}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {s.regNo || s.rollNo} • {s.programmeName || 'B.E'} {s.dept || 'CSE'} • Batch {s.batch || '2024-2028'} • {s.section || 'Sec B'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center border-l border-slate-200 pl-6">
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">HSC Cutoff</p>
              <p className="text-base font-extrabold text-emerald-600 font-mono mt-0.5">{s.cutoffHsc || '156.5'}</p>
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Attendance</p>
              <p className="text-base font-extrabold text-blue-600 font-mono mt-0.5">{s.attendance || '94'}%</p>
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">CGPA</p>
              <p className="text-base font-extrabold text-amber-600 font-mono mt-0.5">{s.cgpa || '8.80'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Navigation Sidebar + Right Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Anchor Navigation Sidebar */}
        <aside className="md:col-span-1 sticky top-24">
          <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Profile Navigation
            </div>
            {sections.map((sec) => {
              const IconComp = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(`sec-${sec.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    activeSection === sec.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content Sections */}
        <main className="md:col-span-3 space-y-6">
          {/* SECTION 1: Personal Information */}
          <section id="sec-personal" className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Personal Information</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Basic personal background details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Register Number" value={s.regNo || s.rollNo} locked />
              <Field label="Admission Number" value={s.admnNo || '-'} locked />
              <Field label="Roll Number" value={s.rollNo || '-'} locked />

              <Field label="Full Name (SSLC Capital)" value={s.name} edit={editMode} onChange={(v) => updateField('name', v.toUpperCase())} />
              <Field label="Date of Birth" value={s.dob} edit={editMode} type="date" onChange={(v) => updateField('dob', v)} />
              <Field label="Gender" value={s.gender === 'F' ? 'Female' : 'Male'} edit={editMode} options={['Male', 'Female']} onChange={(v) => updateField('gender', v === 'Female' ? 'F' : 'M')} />

              <Field label="Blood Group" value={s.bloodGroup || 'O+'} edit={editMode} options={['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']} onChange={(v) => updateField('bloodGroup', v)} />
              <Field label="Community" value={s.community || 'BC'} edit={editMode} options={['BC', 'MBC', 'OC', 'SC', 'ST', 'DNC']} onChange={(v) => updateField('community', v)} />
              <Field label="Caste Name" value={s.caste || ''} edit={editMode} onChange={(v) => updateField('caste', v)} />

              <Field label="Religion" value={s.religion || 'Hindu'} edit={editMode} onChange={(v) => updateField('religion', v)} />
              <Field label="Nationality" value={s.nationality || 'Indian'} edit={editMode} onChange={(v) => updateField('nationality', v)} />
              <Field label="Boarding Status" value={s.boardingStatus || 'Dayscholar'} edit={editMode} options={['Dayscholar', 'Hosteller']} onChange={(v) => updateField('boardingStatus', v)} />
            </div>
          </section>

          {/* SECTION 2: Contact & Family */}
          <section id="sec-contact" className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Contact & Family Info</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Phone numbers, emails, and address</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Student Mobile Number" value={s.studentMobile} edit={editMode} onChange={(v) => updateField('studentMobile', v)} />
              <Field label="Parent Mobile Number" value={s.parentMobile} edit={editMode} onChange={(v) => updateField('parentMobile', v)} />
              <Field label="Institution Email" value={s.email} edit={editMode} type="email" onChange={(v) => updateField('email', v)} />
              <Field label="Alternate Email" value={s.alternateEmail || ''} edit={editMode} type="email" onChange={(v) => updateField('alternateEmail', v)} />
              <Field label="Parent / Guardian Name" value={s.parentName || ''} edit={editMode} onChange={(v) => updateField('parentName', v)} />
              <Field label="Parent Relation" value={s.relation || 'Father'} edit={editMode} options={['Father', 'Mother', 'Guardian', 'Husband']} onChange={(v) => updateField('relation', v)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Field label="Door No & Street" value={s.doorNoStreet || ''} edit={editMode} onChange={(v) => updateField('doorNoStreet', v)} />
              <Field label="Town / Taluk" value={s.townTaluk || ''} edit={editMode} onChange={(v) => updateField('townTaluk', v)} />
              <Field label="City / District" value={s.cityDistrict || ''} edit={editMode} onChange={(v) => updateField('cityDistrict', v)} />
              <Field label="State" value={s.state || 'Tamilnadu'} edit={editMode} onChange={(v) => updateField('state', v)} />
              <Field label="Pincode" value={s.pincode || ''} edit={editMode} onChange={(v) => updateField('pincode', v)} />
              <Field label="Aadhaar Card Number" value={s.aadhaar || ''} edit={editMode} onChange={(v) => updateField('aadhaar', v)} />
            </div>
          </section>

          {/* SECTION 3: Admission Info */}
          <section id="sec-admission" className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Admission Info</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Government & college admission details</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Year of Admission" value={s.yearOfAdmission || '2024'} locked />
              <Field label="Mode of Admission" value={s.modeOfAdmission || 'Regular (O)'} edit={editMode} options={['Regular (O)', 'Lateral (L)', 'Transfer (T)', 'Rejoin (R)']} onChange={(v) => updateField('modeOfAdmission', v)} />
              <Field label="Admission Quota" value={s.admissionQuota || '7.5 Quota'} edit={editMode} options={['7.5 Quota', 'Management (M)', 'Counseling (G)', 'Sports (S)', 'Others (O)']} onChange={(v) => updateField('admissionQuota', v)} />
              <Field label="Regulation" value={s.regulation || '2024'} edit={editMode} onChange={(v) => updateField('regulation', v)} />
              <Field label="EMIS Number" value={s.emisNo || '-'} edit={editMode} onChange={(v) => updateField('emisNo', v)} />
              <Field label="Tamil Medium" value={s.tamilMedium === '1' ? 'Yes' : 'No'} edit={editMode} options={['No', 'Yes']} onChange={(v) => updateField('tamilMedium', v === 'Yes' ? '1' : '0')} />
            </div>
          </section>

          {/* SECTION 4: Academic Record */}
          <section id="sec-academic" className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Academic Record</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">10th, 12th marks, cutoff & college progress</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <Field label="10th Total Marks" value={s.marks10th || ''} edit={editMode} onChange={(v) => updateField('marks10th', v)} />
              <Field label="10th Board of Study" value={s.board10th || 'State Board'} edit={editMode} options={['State Board', 'Matric', 'CBSE', 'ICSE']} onChange={(v) => updateField('board10th', v)} />
              <Field label="12th Total Marks" value={s.marks12th || ''} edit={editMode} onChange={(v) => updateField('marks12th', v)} />
              <Field label="HSC Cutoff Score" value={s.cutoffHsc || ''} edit={editMode} onChange={(v) => updateField('cutoffHsc', v)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Field label="Department" value={`${s.programmeName || 'B.E'} - ${s.dept || 'CSE'}`} locked />
              <Field label="Batch" value={s.batch || '2024-2028'} locked />
              <Field label="Section" value={s.section || 'Sec B'} locked />
            </div>
          </section>

          {/* SECTION 5: Skills & Profile Links */}
          <section id="sec-skills" className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Code className="w-4 h-4 text-blue-600" />
                <span>Skills & Social Career Links</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">LinkedIn, LeetCode, GitHub and coding profiles</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="LinkedIn Profile URL" value={s.linkLinkedin || ''} edit={editMode} placeholder="https://linkedin.com/in/username" onChange={(v) => updateField('linkLinkedin', v)} />
              <Field label="LeetCode Profile URL" value={s.linkLeetcode || ''} edit={editMode} placeholder="https://leetcode.com/username" onChange={(v) => updateField('linkLeetcode', v)} />
              <Field label="GitHub Profile URL" value={s.linkGithub || ''} edit={editMode} placeholder="https://github.com/username" onChange={(v) => updateField('linkGithub', v)} />
            </div>
          </section>

          {/* SECTION 6: Documents (Google Drive Links) */}
          <section id="sec-documents" className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Document Uploads (Google Drive Links)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Paste Google Drive / Cloud PDF view links</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="10th Marksheet Drive Link" value={s.doc10th || ''} edit={editMode} placeholder="https://drive.google.com/file/d/..." onChange={(v) => updateField('doc10th', v)} />
              <Field label="12th Marksheet Drive Link" value={s.doc12th || ''} edit={editMode} placeholder="https://drive.google.com/file/d/..." onChange={(v) => updateField('doc12th', v)} />
              <Field label="Community Certificate Link" value={s.docCommunity || ''} edit={editMode} placeholder="https://drive.google.com/file/d/..." onChange={(v) => updateField('docCommunity', v)} />
              <Field label="Aadhaar Card Drive Link" value={s.docAadhaar || ''} edit={editMode} placeholder="https://drive.google.com/file/d/..." onChange={(v) => updateField('docAadhaar', v)} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// Sub-component for individual editable fields
function Field({ label, value, locked, edit, type = 'text', options, placeholder, onChange }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
        {label} {locked && <span className="text-slate-400 font-normal ml-1">• LOCKED</span>}
      </label>
      {edit && !locked ? (
        options ? (
          <select
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
          >
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
            type={type}
            placeholder={placeholder}
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
          />
        )
      ) : (
        <div className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 min-h-[36px] flex items-center truncate">
          {value || <span className="text-slate-400 font-normal">Not provided</span>}
        </div>
      )}
    </div>
  );
}
