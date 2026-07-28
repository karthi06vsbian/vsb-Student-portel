'use client';

import React, { useState } from 'react';
import { School, Mail, Lock, ArrowRight, Info } from 'lucide-react';

export default function TeacherLogin({ onLogin, teachers }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const teacher = teachers.find(
      (t) => t.email.toLowerCase() === email.trim().toLowerCase() && t.password === password
    );

    if (teacher) {
      if (teacher.status === 'Inactive') {
        setError('This teacher account is deactivated. Contact System Admin.');
        return;
      }
      onLogin({ ...teacher, role: 'TEACHER' });
    } else {
      setError('Invalid teacher email or password.');
    }
  };

  const handleDemoFill = (tEmail, tPass) => {
    setEmail(tEmail);
    setPassword(tPass);
    setError('');
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <img src="/vsb-logo.png" alt="VSB Logo" className="w-12 h-12 object-contain drop-shadow" />
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty / Teacher Portal</h2>
          <p className="text-xs text-slate-500">Manage batch & department student records</p>
        </div>
      </div>


      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center space-x-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Faculty Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. vijayakumar.cse@vsb.ac.in"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
        >
          <span>Login to Teacher Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

