'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import TeacherLogin from '../../components/TeacherLogin';
import TeacherDashboard from '../../components/TeacherDashboard';
import {
  initializePortalStorage,
  getStorageData,
  setStorageData,
  KEYS
} from '../../lib/storage';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_DEPARTMENTS,
  INITIAL_BATCHES,
  INITIAL_SECTIONS,
  INITIAL_ACTIVITY_LOGS
} from '../../lib/initialData';

export default function TeacherPage() {
  const [activeUser, setActiveUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    initializePortalStorage();

    const storedStudents = getStorageData(KEYS.STUDENTS, INITIAL_STUDENTS);
    const storedTeachers = getStorageData(KEYS.TEACHERS, INITIAL_TEACHERS);
    const storedDepts = getStorageData(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    const storedBatches = getStorageData(KEYS.BATCHES, INITIAL_BATCHES);
    const storedSession = getStorageData(KEYS.SESSION, null);

    setStudents(storedStudents);
    setTeachers(storedTeachers);
    setDepartments(storedDepts);
    setBatches(storedBatches);
    setSections(INITIAL_SECTIONS);

    if (storedSession && storedSession.role === 'TEACHER') {
      setActiveUser(storedSession);
    }
  }, []);

  const handleLogin = (userData) => {
    setActiveUser(userData);
    setStorageData(KEYS.SESSION, userData);
  };

  const handleLogout = () => {
    setActiveUser(null);
    setStorageData(KEYS.SESSION, null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar activeUser={activeUser} onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeUser ? (
          <TeacherDashboard
            teacher={activeUser}
            students={students}
            departments={departments}
            batches={batches}
            sections={sections}
            onUpdateStudents={(newList) => {
              setStudents(newList);
            }}
          />
        ) : (
          <div className="max-w-md mx-auto py-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                👨‍🏫 Access URL — /teacher
              </div>
              <h1 className="text-2xl font-extrabold text-white">Faculty Portal Sign-in</h1>
              <p className="text-xs text-slate-400">
                Log in to view batch-wise, department-wise, and section-wise student records.
              </p>
            </div>

            <TeacherLogin onLogin={handleLogin} teachers={teachers} />

            <div className="text-center pt-4">
              <a href="/" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                ← Back to Portal Home
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
