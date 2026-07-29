'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

export default function MascotAnimationModal({
  isOpen,
  type = 'success', // 'success' | 'error'
  studentName = 'Student',
  message = '',
  onClose,
  onComplete
}) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOpen) return;

    if (type === 'success') {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, type, onComplete]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border ${
          isSuccess ? 'border-emerald-200/80' : 'border-rose-200/80'
        } relative overflow-hidden text-center transition-all transform ${
          isSuccess ? 'animate-mascot-pop' : 'animate-mascot-shake'
        }`}
      >
        {/* Background glow behind mascot */}
        <div
          className={`absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-2xl pointer-events-none -z-0 ${
            isSuccess ? 'bg-emerald-400/25' : 'bg-rose-400/25'
          }`}
        ></div>

        {/* Floating Sparkles for Success */}
        {isSuccess && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-6 left-8 text-amber-400 animate-bounce">✨</div>
            <div className="absolute top-10 right-8 text-emerald-400 animate-bounce delay-150">🎉</div>
            <div className="absolute bottom-16 left-12 text-blue-400 animate-pulse">⭐</div>
            <div className="absolute bottom-20 right-10 text-yellow-500 animate-bounce delay-300">🌟</div>
          </div>
        )}

        {/* MASCOT ANIMATION GRAPHIC */}
        <div className="relative z-10 mx-auto w-48 h-48 flex items-center justify-center mb-4">
          {isSuccess ? (
            /* LITTLE BEAR WITH THUMBS UP */
            <div className="relative w-full h-full flex items-center justify-center animate-mascot-bounce">
              <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-xl">
                {/* Bear Ears */}
                <g className="animate-ear-left">
                  <circle cx="55" cy="55" r="24" fill="#8B5A2B" />
                  <circle cx="55" cy="55" r="14" fill="#F4A460" />
                </g>
                <g className="animate-ear-right">
                  <circle cx="145" cy="55" r="24" fill="#8B5A2B" />
                  <circle cx="145" cy="55" r="14" fill="#F4A460" />
                </g>

                {/* Bear Body */}
                <ellipse cx="100" cy="155" rx="55" ry="40" fill="#A0522D" />
                <ellipse cx="100" cy="158" rx="36" ry="26" fill="#F4A460" />

                {/* Bear Head */}
                <circle cx="100" cy="100" r="50" fill="#A0522D" />

                {/* Bear Snout & Nose */}
                <ellipse cx="100" cy="112" rx="22" ry="16" fill="#F5DEB3" />
                <ellipse cx="100" cy="104" rx="9" ry="6" fill="#3D2314" />

                {/* Smile */}
                <path
                  d="M 92 115 Q 100 124 108 115"
                  fill="none"
                  stroke="#3D2314"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Blushing Cheeks */}
                <circle cx="72" cy="110" r="7" fill="#FF8C8C" opacity="0.75" />
                <circle cx="128" cy="110" r="7" fill="#FF8C8C" opacity="0.75" />

                {/* Cheerful Eyes with Sparkle Highlights */}
                <g className="animate-eye-blink">
                  <circle cx="78" cy="90" r="6" fill="#22150C" />
                  <circle cx="76" cy="88" r="2.2" fill="#FFFFFF" />
                  <circle cx="122" cy="90" r="6" fill="#22150C" />
                  <circle cx="120" cy="88" r="2.2" fill="#FFFFFF" />
                </g>

                {/* Left Paw Resting */}
                <circle cx="58" cy="148" r="12" fill="#8B5A2B" />
              </svg>

              {/* Animated Thumbs Up Paw (Overlayed on Right Side) */}
              <div className="absolute -right-1 bottom-4 animate-thumbs-up z-20">
                <div className="relative flex items-center justify-center">
                  {/* Glowing Pulse Ring behind Thumbs Up */}
                  <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30"></div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg border-2 border-white text-3xl">
                    👍
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PANDA WITH THUMBS DOWN */
            <div className="relative w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-xl">
                {/* Panda Ears */}
                <g className="animate-ear-left">
                  <circle cx="55" cy="55" r="24" fill="#1E293B" />
                  <circle cx="55" cy="55" r="12" fill="#334155" />
                </g>
                <g className="animate-ear-right">
                  <circle cx="145" cy="55" r="24" fill="#1E293B" />
                  <circle cx="145" cy="55" r="12" fill="#334155" />
                </g>

                {/* Panda Body */}
                <ellipse cx="100" cy="155" rx="55" ry="40" fill="#1E293B" />
                <ellipse cx="100" cy="158" rx="36" ry="26" fill="#F8FAFC" />

                {/* Panda White Head */}
                <circle cx="100" cy="100" r="50" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />

                {/* Iconic Black Eye Patches */}
                <ellipse cx="74" cy="92" rx="14" ry="17" fill="#1E293B" transform="rotate(-15 74 92)" />
                <ellipse cx="126" cy="92" rx="14" ry="17" fill="#1E293B" transform="rotate(15 126 92)" />

                {/* Sad Drooping Eyes */}
                <g>
                  <circle cx="76" cy="94" r="4.5" fill="#FFFFFF" />
                  <circle cx="76" cy="95" r="2" fill="#0F172A" />
                  <circle cx="124" cy="94" r="4.5" fill="#FFFFFF" />
                  <circle cx="124" cy="95" r="2" fill="#0F172A" />
                </g>

                {/* Sad Eyebrows */}
                <path d="M 62 76 Q 74 84 84 80" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                <path d="M 138 76 Q 126 84 116 80" fill="none" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

                {/* Panda Snout & Nose */}
                <ellipse cx="100" cy="112" rx="18" ry="13" fill="#F1F5F9" />
                <ellipse cx="100" cy="106" rx="8" ry="5.5" fill="#0F172A" />

                {/* Sad Downturned Mouth */}
                <path
                  d="M 92 122 Q 100 114 108 122"
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Sweat Drop / Apology tear */}
                <path d="M 142 95 Q 146 102 142 106 Q 138 102 142 95 Z" fill="#38BDF8" opacity="0.9" />

                {/* Left Paw */}
                <circle cx="58" cy="148" r="12" fill="#1E293B" />
              </svg>

              {/* Animated Thumbs Down Badge */}
              <div className="absolute -right-1 bottom-4 animate-thumbs-down z-20">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg border-2 border-white text-3xl">
                    👎
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TITLE & DESCRIPTION */}
        <div className="relative z-10 space-y-2">
          {isSuccess ? (
            <>
              <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Little Bear Approved!</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Login Successful!
              </h3>
              <p className="text-sm text-slate-600 font-medium max-w-sm mx-auto">
                Welcome back, <span className="text-emerald-700 font-bold">{studentName}</span>! Redirecting you to your student dashboard...
              </p>

              {/* Auto Redirect Progress Bar */}
              <div className="mt-4 pt-2">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium mt-1 px-1">
                  <span>Opening Student Page...</span>
                  <span className="font-bold text-emerald-600">{countdown}s</span>
                </div>
              </div>

              <button
                onClick={onComplete}
                className="w-full mt-4 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <span>Enter Student Portal Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className="inline-flex items-center space-x-1.5 bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Panda Says Invalid!</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Access Denied
              </h3>
              <p className="text-sm text-slate-600 font-medium max-w-sm mx-auto">
                {message || 'Incorrect Register Number or Date of Birth entered. Please verify your details and try again.'}
              </p>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Login Again</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
