'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import AdminLogin from '../../components/AdminLogin';
import AdminDashboard from '../../components/AdminDashboard';
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

export default function AdminPage() {
  const [activeUser, setActiveUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const syncStateFromStorage = () => {
    const storedStudents = getStorageData(KEYS.STUDENTS, INITIAL_STUDENTS);
    const storedTeachers = getStorageData(KEYS.TEACHERS, INITIAL_TEACHERS);
    const storedDepts = getStorageData(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    const storedBatches = getStorageData(KEYS.BATCHES, INITIAL_BATCHES);
    const storedSections = getStorageData(KEYS.SECTIONS, INITIAL_SECTIONS);
    const storedLogs = getStorageData(KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
    const storedSession = getStorageData(KEYS.SESSION, null);

    setStudents(storedStudents);
    setTeachers(storedTeachers);
    setDepartments(storedDepts);
    setBatches(storedBatches);
    setSections(storedSections);
    setActivityLogs(storedLogs);

    if (storedSession && storedSession.role === 'ADMIN') {
      setActiveUser(storedSession);
    }
  };

  useEffect(() => {
    initializePortalStorage();
    syncStateFromStorage();

    const handleStorageChange = () => {
      syncStateFromStorage();
    };

    window.addEventListener('vsb_storage_update', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('vsb_storage_update', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogin = (userData) => {
    setActiveUser(userData);
    setStorageData(KEYS.SESSION, userData);
    syncStateFromStorage();
  };

  const handleLogout = () => {
    setActiveUser(null);
    setStorageData(KEYS.SESSION, null);
    syncStateFromStorage();
  };

  return (
    <div className="min-h-screen bg-[#F0F4FA] text-slate-900 flex flex-col font-sans pt-24 pb-8">
      <Navbar activeUser={activeUser} onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeUser ? (
          <AdminDashboard
            admin={activeUser}
            teachers={teachers}
            students={students}
            departments={departments}
            batches={batches}
            sections={sections}
            activityLogs={activityLogs}
            onUpdateTeachers={(newList) => {
              setTeachers(newList);
              setStorageData(KEYS.TEACHERS, newList);
            }}
            onUpdateStudents={(newList) => {
              setStudents(newList);
              setStorageData(KEYS.STUDENTS, newList);
            }}
            onUpdateDepartments={(newList) => {
              setDepartments(newList);
              setStorageData(KEYS.DEPARTMENTS, newList);
            }}
            onUpdateBatches={(newList) => {
              setBatches(newList);
              setStorageData(KEYS.BATCHES, newList);
            }}
            onUpdateSections={(newList) => {
              setSections(newList);
              setStorageData(KEYS.SECTIONS, newList);
            }}
          />
        ) : (
          <div className="max-w-md mx-auto py-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 border border-purple-200 text-xs font-semibold px-3 py-1 rounded-full">
                🛡️ Secret Administrator URL — /admin
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Super Administrator Sign-in</h1>
              <p className="text-xs text-slate-600">
                Manage student records, faculty login credentials, create new departments/batches/sections, and view system audit logs.
              </p>
            </div>

            <AdminLogin onLogin={handleLogin} />

            <div className="text-center pt-4">
              <a href="/" className="text-xs text-slate-600 hover:text-slate-900 font-bold transition-colors">
                ← Back to Portal Landing Page
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
