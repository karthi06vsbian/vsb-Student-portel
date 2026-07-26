// Student Login — Register number + Date of birth + Batch Email OTP Verification
function StudentLogin({ onNavigate }) {
  const [regNum, setRegNum] = useState('2023CS042');
  const [dob, setDob] = useState('2005-04-18');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP Verification state
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp'
  const [pendingStudent, setPendingStudent] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [step, timer]);

  const maskEmail = (email) => {
    if (!email) return 's***t@vsb.edu.in';
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  const sendOtp = (student) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPendingStudent(student);
    setUserOtp('');
    setTimer(30);
    setStep('otp');
  };

  async function login() {
    setError('');
    const typedReg = regNum.trim().toUpperCase();
    if (!typedReg || !dob) {
      setError('Enter register number and date of birth');
      return;
    }
    setLoading(true);
    try {
      const student = await window.VSB_API.loginStudent(typedReg, dob);
      setLoading(false);

      // Check if student batch requires Email OTP Authentication
      const requiresEmailAuth = window.VSB_DATA.batchEmailAuth && window.VSB_DATA.batchEmailAuth[student.batch] === true;

      if (requiresEmailAuth) {
        sendOtp(student);
      } else {
        // Direct login if email auth is disabled for this batch
        window.VSB_DATA.currentStudentRegNum = student.registerNumber;
        window.VSB_DATA.currentUserRole = 'student';
        onNavigate('/student');
      }
    } catch (err) {
      setError('Invalid register/roll number or date of birth');
      setLoading(false);
    }
  }

  const verifyOtp = () => {
    setError('');
    if (userOtp.trim() === generatedOtp) {
      window.VSB_DATA.currentStudentRegNum = pendingStudent.registerNumber;
      window.VSB_DATA.currentUserRole = 'student';
      onNavigate('/student');
    } else {
      setError('Invalid verification code. Please check the code and try again.');
    }
  };

  return (
    <div className="screen-enter" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '120px 20px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1100, width: '100%', alignItems: 'center' }} className="login-grid">
        <div style={{ position: 'relative' }} className="login-illus">
          <div className="chip chip-brand mb-4"><Icon name="student" size={14} /> Student Portal</div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }} className="mb-4">
            Welcome back,<br /><span className="grad-text">VSB student.</span>
          </h1>
          <p className="mb-6" style={{ fontSize: '1.05rem' }}>
            Log in with your register number and DOB. Email authentication is enabled for high-security academic batches.
          </p>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'color-mix(in oklab, var(--brand-primary) 14%, transparent)', color: 'var(--brand-primary)', display: 'grid', placeItems: 'center' }}>
                <Icon name="shield" size={16} />
              </div>
              <div className="text-sm font-semibold">Security & Batch Authentication</div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li className="flex items-center gap-2"><Icon name="check" size={14} style={{ color: 'var(--accent)' }} /> Register Number + DOB verification.</li>
              <li className="flex items-center gap-2"><Icon name="check" size={14} style={{ color: 'var(--accent)' }} /> Free Email OTP code for configured batches.</li>
              <li className="flex items-center gap-2"><Icon name="check" size={14} style={{ color: 'var(--accent)' }} /> Admin-controlled batch authentication rules.</li>
            </ul>
          </GlassCard>
        </div>

        <div style={{ maxWidth: 460, width: '100%', margin: '0 auto' }}>
          <GlassCard strong className="p-8">
            {step === 'credentials' ? (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #2563EB, #60A5FA)', color: 'white', display: 'grid', placeItems: 'center' }}>
                    <Icon name="student" size={22} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem' }}>Student Login</div>
                    <div className="text-xs text-subtle">Register number + Date of birth</div>
                  </div>
                </div>

                <div className="glass-inner p-3 mb-5" style={{ borderRadius: 12, border: '1px dashed var(--brand-primary)' }}>
                  <div className="text-xs font-semibold" style={{ color: 'var(--brand-primary)' }}>Default Demo Student Logins:</div>
                  <div className="text-xs text-subtle mt-1">Register #: <strong className="mono">2023CS042</strong> · DOB: <strong className="mono">2005-04-18</strong></div>
                  <div className="text-xs text-subtle">Or use any imported Reg #: <strong className="mono">24104064</strong>, <strong className="mono">24104066</strong></div>
                </div>

                <label className="field-label">Register Number</label>
                <input className="input" value={regNum} onChange={e => setRegNum(e.target.value)} placeholder="2023CS042" />

                <label className="field-label mt-4">Date of Birth</label>
                <input className="input" type="date" value={dob} onChange={e => setDob(e.target.value)} />

                {error && <div className="chip chip-rose mt-4" style={{ width: '100%', justifyContent: 'center' }}>{error}</div>}

                <button className="btn btn-primary w-full mt-6" onClick={login} disabled={loading}>
                  {loading ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : <><Icon name="check" size={16} /> Sign In as Student (2023CS042)</>}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #10B981, #34D399)', color: 'white', display: 'grid', placeItems: 'center' }}>
                    <Icon name="shield" size={22} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem' }}>Email Verification</div>
                    <div className="text-xs text-subtle">Batch {pendingStudent?.batch} Security Enabled</div>
                  </div>
                </div>

                <div className="glass-inner p-4 mb-4" style={{ borderRadius: 12 }}>
                  <div className="text-xs text-muted mb-1">Verification Code Sent To:</div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--brand-primary)' }}>{maskEmail(pendingStudent?.email)}</div>
                  <div className="text-xs text-subtle mt-1">Student: {pendingStudent?.name} ({pendingStudent?.registerNumber})</div>
                </div>

                {/* Free Demo OTP Dispatch Banner */}
                <div className="p-3 mb-4 flex items-center justify-between gap-2" style={{ background: 'color-mix(in oklab, var(--accent) 12%, transparent)', borderRadius: 10, border: '1px dashed var(--accent)' }}>
                  <div className="text-xs">
                    <span className="font-semibold" style={{ color: 'var(--accent)' }}>Free Webmail Dispatch:</span>
                    <div>Your OTP code is <strong className="mono" style={{ fontSize: '1rem', color: 'var(--brand-primary)', marginLeft: 4 }}>{generatedOtp}</strong></div>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setUserOtp(generatedOtp)}>Auto-Fill Code</button>
                </div>

                <label className="field-label">Enter 6-Digit OTP Code</label>
                <input
                  className="input mono text-center"
                  style={{ fontSize: '1.4rem', letterSpacing: '0.3em', fontWeight: 700 }}
                  maxLength={6}
                  value={userOtp}
                  onChange={e => setUserOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                />

                {error && <div className="chip chip-rose mt-4" style={{ width: '100%', justifyContent: 'center' }}>{error}</div>}

                <button className="btn btn-primary w-full mt-5" onClick={verifyOtp} disabled={userOtp.length !== 6}>
                  <Icon name="check" size={16} /> Verify OTP & Enter Portal
                </button>

                <div className="flex items-center justify-between mt-4 text-xs">
                  <button className="btn btn-ghost btn-sm text-subtle" onClick={() => setStep('credentials')}>← Change Register #</button>
                  {timer > 0 ? (
                    <span className="text-subtle mono">Resend code in {timer}s</span>
                  ) : (
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--brand-primary)' }} onClick={() => sendOtp(pendingStudent)}>Resend OTP</button>
                  )}
                </div>
              </>
            )}

            <div className="hr mt-6 mb-4" />
            <div className="text-xs text-center text-subtle">
              Not a student? <a href="#/teacher-login" onClick={e => { e.preventDefault(); onNavigate('/teacher-login'); }} style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>Teacher login</a>
            </div>
          </GlassCard>

          <div className="text-center mt-4 text-xs text-subtle flex items-center justify-center gap-2">
            <Icon name="shield" size={12} /> Protected VSB Student Verification
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-illus { display: none; }
        }
      `}</style>
    </div>
  );
}

window.StudentLogin = StudentLogin;
