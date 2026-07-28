'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StudentLogin from '../components/StudentLogin';
import TeacherLogin from '../components/TeacherLogin';
import StudentDashboard from '../components/StudentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import AdminDashboard from '../components/AdminDashboard';
import {
  initializePortalStorage,
  getStorageData,
  setStorageData,
  KEYS
} from '../lib/storage';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_DEPARTMENTS,
  INITIAL_BATCHES,
  INITIAL_SECTIONS,
  INITIAL_ACTIVITY_LOGS
} from '../lib/initialData';

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Core Data States
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Active User & Nav Tab State ('STUDENT' default in front)
  const [activeUser, setActiveUser] = useState(null);
  const [activeTab, setActiveTab] = useState('STUDENT');

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

    // If currently logged in as a student, update activeUser with newest student record
    if (storedSession && storedSession.role === 'STUDENT') {
      const freshStudent = storedStudents.find(
        (s) => s.regNo === storedSession.regNo || s.id === storedSession.id
      );
      if (freshStudent) {
        setActiveUser({ ...freshStudent, role: 'STUDENT' });
      } else {
        setActiveUser(storedSession);
      }
    } else if (storedSession) {
      setActiveUser(storedSession);
    }
  };

  const syncFromCloud = async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.students) && json.students.length > 0) {
          const storedStudents = getStorageData(KEYS.STUDENTS, []);
          if (json.students.length >= storedStudents.length || storedStudents.length === 0) {
            setStudents(json.students);
            localStorage.setItem(KEYS.STUDENTS, JSON.stringify(json.students));
          }
        }
      }
    } catch (e) {
      // Gracefully fallback to localStorage
    }
  };



  useEffect(() => {
    initializePortalStorage();
    syncStateFromStorage();
    syncFromCloud();
    setIsInitialized(true);

    // Poll central cloud database every 3 seconds for live multi-window & multi-device sync
    const pollInterval = setInterval(syncFromCloud, 3000);

    // Listen for custom internal storage events & browser cross-tab storage events
    const handleStorageChange = () => {
      syncStateFromStorage();
    };

    window.addEventListener('vsb_storage_update', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    // Setup BroadcastChannel for 100% reliable cross-tab live synchronization
    let channel = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('vsb_portal_channel');
        channel.onmessage = (event) => {
          if (event.data && event.data.type === 'vsb_storage_update') {
            syncStateFromStorage();
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('vsb_storage_update', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
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

  // Student Profile Self-Edit Save Handler
  const handleUpdateStudentProfile = (updatedStudent) => {
    const updatedList = students.map((s) => (s.id === updatedStudent.id || s.regNo === updatedStudent.regNo ? updatedStudent : s));
    setStudents(updatedList);
    setActiveUser({ ...updatedStudent, role: 'STUDENT' });
    setStorageData(KEYS.STUDENTS, updatedList);
    setStorageData(KEYS.SESSION, { ...updatedStudent, role: 'STUDENT' });
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F0F4FA] flex items-center justify-center text-slate-800 font-sans">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold">Loading VSB Student Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FA] text-slate-900 flex flex-col font-sans pt-24 pb-8 relative overflow-hidden">
      {/* Soft Ambient Radial Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl"></div>
      </div>

      {/* Top Navbar */}
      <Navbar
        activeUser={activeUser}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center">
        {activeUser ? (
          <div className="w-full">
            {activeUser.role === 'STUDENT' && (
              <StudentDashboard
                student={activeUser}
                onUpdateProfile={handleUpdateStudentProfile}
              />
            )}

            {activeUser.role === 'TEACHER' && (
              <TeacherDashboard
                teacher={activeUser}
                students={students}
                departments={departments}
                batches={batches}
                sections={sections}
                onUpdateStudents={(newList) => {
                  setStudents(newList);
                  setStorageData(KEYS.STUDENTS, newList);
                }}
              />
            )}

            {activeUser.role === 'ADMIN' && (
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
            )}
          </div>
        ) : (
          <div className="w-full">
            {activeTab === 'STUDENT' ? (
              <StudentLogin
                onLogin={handleLogin}
                students={students}
                onSwitchToTeacher={() => setActiveTab('TEACHER')}
              />
            ) : (
              <div className="max-w-md mx-auto py-8">
                <TeacherLogin onLogin={handleLogin} teachers={teachers} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-500 pt-8">
        <p>© 2026 VSB Engineering College. All rights reserved.</p>
      </footer>
    </div>
  );
}
