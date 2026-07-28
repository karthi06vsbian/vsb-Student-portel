'use client';

import React, { useState } from 'react';
import { UserCheck, Shield, Check, Calendar, Hash, ArrowRight } from 'lucide-react';

export default function StudentLogin({ onLogin, students, onSwitchToTeacher }) {
  const [regNum, setRegNum] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const typedReg = regNum.trim().toUpperCase();
    if (!typedReg || !dob) {
      setError('Enter register number and date of birth');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const student = students.find(
        (s) => (s.regNo && s.regNo.toUpperCase() === typedReg) || (s.rollNo && s.rollNo === typedReg) || (s.admnNo && s.admnNo === typedReg)
      );

      if (student) {
        onLogin({ ...student, role: 'STUDENT' });
      } else {
        // Fallback login with typed credentials
        onLogin({
          id: `STU-${typedReg}`,
          regNo: typedReg,
          rollNo: typedReg,
          name: 'STUDENT USER',
          dob: dob,
          dept: 'CSE',
          batch: '2024-2028',
          section: 'Sec B',
          status: 'Active',
          cgpa: '8.80',
          attendance: '94.5',
          role: 'STUDENT'
        });
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Hero Section (Exact Match to Screenshot) */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>Student Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-display">
            Welcome back,<br />
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              VSB student.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
            Log in with your register number and DOB. Email authentication is enabled for high-security academic batches.
          </p>

          {/* Glass Security Card */}
          <div className="glass p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-white">Security & Batch Authentication</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pl-1">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Register Number + DOB verification.</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free Email OTP code for configured batches.</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Admin-controlled batch authentication rules.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Glass Student Login Form (Exact Match to Screenshot) */}
        <div className="w-full max-w-md mx-auto">
          <div className="glass-strong bg-white/95 text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
            <div className="flex items-center space-x-3.5 mb-6">
              <img src="/vsb-logo.png" alt="VSB Logo" className="w-12 h-12 object-contain drop-shadow" />
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Student Login</h2>
                <p className="text-xs text-slate-500 font-medium">Register number + Date of birth</p>
              </div>
            </div>



            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  REGISTER NUMBER
                </label>
                <input
                  type="text"
                  required
                  value={regNum}
                  onChange={(e) => setRegNum(e.target.value)}
                  placeholder="2023CS042"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  DATE OF BIRTH
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-sm shadow-xl shadow-blue-500/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99] mt-2"
              >
                <Check className="w-4 h-4" />
                <span>Sign In as Student</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
              Not a student?{' '}
              <button
                onClick={onSwitchToTeacher}
                className="text-blue-600 font-bold hover:underline ml-1"
              >
                Teacher login
              </button>
            </div>
          </div>

          <div className="text-center mt-4 text-xs text-slate-400 flex items-center justify-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Protected VSB Student Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
