'use client';

import React, { useState } from 'react';
import { Shield, User, Lock, ArrowRight, Info } from 'lucide-react';
import { INITIAL_ADMIN } from '../lib/storage';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (
      (username.trim().toLowerCase() === INITIAL_ADMIN.username || username.trim().toLowerCase() === INITIAL_ADMIN.email) &&
      password === INITIAL_ADMIN.password
    ) {
      onLogin({ ...INITIAL_ADMIN, role: 'ADMIN' });
    } else {
      setError('Invalid Administrator username or password.');
    }
  };

  const handleDemoFill = () => {
    setUsername('admin');
    setPassword('adminpassword');
    setError('');
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 p-6 sm:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">System Admin Portal</h2>
          <p className="text-xs text-slate-500">Super admin management & audit log console</p>
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
            Admin Username or Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none transition-all"
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
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-semibold rounded-xl text-sm shadow-lg shadow-purple-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
        >
          <span>Login to Admin Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-slate-500 font-semibold">
            <Info className="w-3.5 h-3.5 text-purple-600" />
            <span>Admin Demo Account:</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold px-3 py-1 rounded-lg border border-purple-200 transition-colors"
          >
            Auto-fill Admin (admin/adminpassword)
          </button>
        </div>
      </div>
    </div>
  );
}
