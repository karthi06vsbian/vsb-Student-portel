'use client';

import React from 'react';
import { UserCheck, School, LogOut, Shield, User, RotateCcw } from 'lucide-react';
import { resetToSampleData } from '../lib/storage';

export default function Navbar({ activeUser, onLogout, activeTab, onTabChange }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none py-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand Logo & Name */}
        <a href="/" className="flex items-center space-x-3 text-slate-900 no-underline">
          <img src="/vsb-logo.png" alt="VSB Logo" className="w-11 h-11 object-contain filter drop-shadow-md" />
          <div>
            <div className="font-extrabold text-lg tracking-tight text-slate-900 font-display">VSB</div>
            <div className="text-xs text-slate-600 font-medium -mt-0.5">Engineering & Technical Campus</div>
          </div>
        </a>



        {/* Navigation Controls */}
        {activeUser ? (
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2.5 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                {activeUser.role === 'STUDENT' ? <User className="w-3.5 h-3.5" /> : activeUser.role === 'TEACHER' ? <School className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5 text-purple-400" />}
              </div>
              <span className="text-xs font-bold text-white">{activeUser.name || activeUser.regNo || activeUser.username}</span>
            </div>

            <button
              onClick={resetToSampleData}
              title="Reset Demo Data"
              className="text-xs text-slate-400 hover:text-amber-400 p-2 rounded-full hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="flex items-center space-x-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          /* Student / Teacher Top Pill Toggle (Exact match to screenshot) */
          <div className="glass flex items-center p-1 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200/80 shadow-md">
            <button
              onClick={() => onTabChange && onTabChange('STUDENT')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'STUDENT'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => onTabChange && onTabChange('TEACHER')}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'TEACHER'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teacher
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
