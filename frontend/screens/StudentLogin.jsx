// Student Login — Register number + date of birth
function StudentLogin({ onNavigate }) {
  const [regNum, setRegNum] = useState('2023CS042');
  const [dob, setDob] = useState('2005-04-18');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      window.VSB_DATA.currentStudentRegNum = student.registerNumber;
      window.VSB_DATA.currentUserRole = 'student';
      setLoading(false);
      onNavigate('/student');
    } catch (err) {
      setError('Invalid register/roll number or date of birth');
      setLoading(false);
    }
  }

  return (
    <div className="screen-enter" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '120px 20px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1100, width: '100%', alignItems: 'center' }} className="login-grid">
        <div style={{ position: 'relative' }} className="login-illus">
          <div className="chip chip-brand mb-4"><Icon name="student" size={14} /> Student Portal</div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }} className="mb-4">
            Welcome back,<br /><span className="grad-text">VSB student.</span>
          </h1>
          <p className="mb-6" style={{ fontSize: '1.05rem' }}>
            Log in with your student register number and date of birth to access your profile, academic details and placement records.
          </p>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'color-mix(in oklab, var(--brand-primary) 14%, transparent)', color: 'var(--brand-primary)', display: 'grid', placeItems: 'center' }}>
                <Icon name="shield" size={16} />
              </div>
              <div className="text-sm font-semibold">Student verification</div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <li className="flex items-center gap-2"><Icon name="check" size={14} style={{ color: 'var(--accent)' }} /> Use the register number issued by VSB.</li>
              <li className="flex items-center gap-2"><Icon name="check" size={14} style={{ color: 'var(--accent)' }} /> Enter your date of birth as recorded by the department.</li>
              <li className="flex items-center gap-2"><Icon name="check" size={14} style={{ color: 'var(--accent)' }} /> Continue directly to your student dashboard after verification.</li>
            </ul>
          </GlassCard>
        </div>

        <div style={{ maxWidth: 460, width: '100%', margin: '0 auto' }}>
          <GlassCard strong className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #2563EB, #60A5FA)', color: 'white', display: 'grid', placeItems: 'center' }}>
                <Icon name="student" size={22} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem' }}>Student Login</div>
                <div className="text-xs text-subtle">Register number + Date of birth</div>
              </div>
            </div>

            <label className="field-label">Register Number</label>
            <input className="input" value={regNum} onChange={e => setRegNum(e.target.value)} placeholder="2023CS042" />

            <label className="field-label mt-4">Date of Birth</label>
            <input className="input" type="date" value={dob} onChange={e => setDob(e.target.value)} />

            {error && <div className="chip chip-rose mt-4" style={{ width: '100%', justifyContent: 'center' }}>{error}</div>}

            <button className="btn btn-primary w-full mt-6" onClick={login} disabled={loading}>
              {loading ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : <><Icon name="check" size={16} /> Login</>}
            </button>

            <div className="hr mt-6 mb-4" />
            <div className="text-xs text-center text-subtle">
              Not a student? <a href="#/teacher-login" onClick={e => { e.preventDefault(); onNavigate('/teacher-login'); }} style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>Teacher login</a>
            </div>
          </GlassCard>

          <div className="text-center mt-4 text-xs text-subtle flex items-center justify-center gap-2">
            <Icon name="shield" size={12} /> Protected student access
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
