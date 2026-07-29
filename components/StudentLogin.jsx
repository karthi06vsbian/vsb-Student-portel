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

      if (!student) {
        setError('Access Denied: Register Number not found in database. Student account must be created by Admin/Faculty first.');
        setLoading(false);
        return;
      }

      // Verify DOB matches database record
      if (student.dob && student.dob.trim() !== dob.trim()) {
        setError('Access Denied: Incorrect Date of Birth entered. Please verify your DOB.');
        setLoading(false);
        return;
      }

      // Successful verified login
      onLogin({ ...student, role: 'STUDENT' });
      setLoading(false);
    }, 300);
  };


  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Hero Section */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <UserCheck className="w-4 h-4 text-blue-700" />
            <span>Student Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
            Welcome back,<br />
            <span className="text-blue-700">
              VSB student.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-medium">
            Log in with your register number and DOB. Email authentication is enabled for high-security academic batches.
          </p>

          {/* Welcome Student Graphic Card */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-white/90 shadow-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
            {/* Student Boy Portrait */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-blue-600/30">
              <img
                src="/student-welcome.jpg"
                alt="VSB College Student Karthikeyan A"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                VERIFIED ID
              </span>
            </div>

            {/* Student ID Card Badging Info */}
            <div className="flex-1 space-y-2 text-left">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-[11px] font-extrabold text-blue-700 uppercase tracking-widest">
                  VSB STUDENT IDENTIFICATION
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">KARTHIKEYAN A</h3>
                <p className="text-xs font-semibold text-slate-500">Dept of Computer Science & Engg (CSE)</p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg">
                  🎓 Batch: 2024 - 2028
                </span>
                <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-lg">
                  👔 Black Shirt & White Pant
                </span>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white/80 p-5 rounded-2xl border border-slate-200/90 backdrop-blur-md shadow-md space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200">
                <Shield className="w-4 h-4 text-blue-700" />
              </div>
              <span className="text-sm font-bold text-slate-900">Security & Batch Authentication</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 font-medium pl-1">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Register Number + DOB verification.</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free Email OTP code for configured batches.</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
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
