'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StudentLogin from '../../components/StudentLogin';
import StudentDashboard from '../../components/StudentDashboard';
import {
  initializePortalStorage,
  getStorageData,
  setStorageData,
  KEYS
} from '../../lib/storage';
import { INITIAL_STUDENTS } from '../../lib/initialData';

export default function StudentPage() {
  const [activeUser, setActiveUser] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    initializePortalStorage();
    const storedStudents = getStorageData(KEYS.STUDENTS, INITIAL_STUDENTS);
    const storedSession = getStorageData(KEYS.SESSION, null);

    setStudents(storedStudents);

    if (storedSession && storedSession.role === 'STUDENT') {
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
          <StudentDashboard student={activeUser} />
        ) : (
          <div className="max-w-md mx-auto py-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                🎓 Access URL — /student
              </div>
              <h1 className="text-2xl font-extrabold text-white">Student Portal Sign-in</h1>
              <p className="text-xs text-slate-400">
                Log in with your Register Number and Date of Birth.
              </p>
            </div>

            <StudentLogin onLogin={handleLogin} students={students} />

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
