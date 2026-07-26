// Teacher Login — username/password, then department/batch/section picker
function TeacherLogin({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('ramesh.m');
  const [password, setPassword] = useState('teacher123');
  const [showPw, setShowPw] = useState(false);
  const [dept, setDept] = useState('CSE');
  const [batch, setBatch] = useState('2024-2028');
  const [section, setSection] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const departments = (window.VSB_DATA && window.VSB_DATA.DEPARTMENTS) || [
    { code: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. Ramesh Kumar M.', color: '#2563EB' },
    { code: 'IT', name: 'Information Technology', hod: 'Dr. Bhuvaneswari S.', color: '#8B5CF6' },
    { code: 'AIDS', name: 'AI & Data Science', hod: 'Dr. Karthikeyan V.', color: '#EC4899' },
    { code: 'ECE', name: 'Electronics & Communication', hod: 'Dr. Palanivel R.', color: '#10B981' }
  ];

  const batches = (window.VSB_DATA && window.VSB_DATA.BATCHES) || ['2022-2026', '2023-2027', '2024-2028', '2025-2029'];
  const sections = (window.VSB_DATA && window.VSB_DATA.SECTIONS) || ['A', 'B', 'C', 'D'];

  function login(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 400);
  }

  async function proceed() {
    if (!window.VSB_DATA) window.VSB_DATA = {};
    window.VSB_DATA.selectedFilter = { dept: dept || 'CSE', batch: batch || '2024-2028', section: section || 'ALL' };
    try {
      const teacher = await window.VSB_API.loginTeacher(username);
      if (teacher && teacher.id) window.VSB_DATA.currentTeacherId = teacher.id;
      window.VSB_DATA.currentUserRole = 'teacher';
      onNavigate('/teacher');
    } catch (err) {
      window.VSB_DATA.currentUserRole = 'teacher';
      onNavigate('/teacher');
    }
  }

  return (
    <div className="screen-enter" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '100px 20px 40px' }}>
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1100, width: '100%', alignItems: 'center' }} className="login-grid">
          <div className="login-illus">
            <div className="chip chip-accent mb-4"><Icon name="teacher" size={14} /> Faculty Portal</div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }} className="mb-4">
              Manage your <span className="grad-text">department roster</span> in one place.
            </h1>
            <p style={{ fontSize: '1.05rem' }} className="mb-6">
              Log in with your VSB faculty credentials to manage student login accounts, upload batch CSV files, approve profile updates, and export analytics.
            </p>
            <div className="grid-2">
              <GlassCard className="p-4">
                <Icon name="filter" size={20} style={{ color: 'var(--brand-primary)', marginBottom: 8 }} />
                <div className="text-sm font-semibold mb-1">Filter-first workflow</div>
                <div className="text-xs text-muted">Pick your dept, batch & section on entry — everything after that is scoped.</div>
              </GlassCard>
              <GlassCard className="p-4">
                <Icon name="download" size={20} style={{ color: 'var(--accent)', marginBottom: 8 }} />
                <div className="text-sm font-semibold mb-1">Export in one click</div>
                <div className="text-xs text-muted">Excel, CSV or PDF for any dept, batch, section or single student.</div>
              </GlassCard>
            </div>
          </div>

          <div style={{ maxWidth: 460, width: '100%', margin: '0 auto' }}>
            <GlassCard strong className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #10B981, #34D399)', color: 'white', display: 'grid', placeItems: 'center' }}>
                  <Icon name="teacher" size={22} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', letterSpacing: '-0.01em' }}>Teacher Login</div>
                  <div className="text-xs text-subtle">VSB Faculty Authentication</div>
                </div>
              </div>

              <form onSubmit={login}>
                <label className="field-label">Username</label>
                <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="ramesh.m" required />

                <label className="field-label mt-4">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 8, top: 8, background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Icon name="eye" size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                    <input type="checkbox" defaultChecked /> Remember me
                  </label>
                  <a href="#/teacher-login" onClick={e => { e.preventDefault(); alert('Demo password is: teacher123'); }} className="text-sm" style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</a>
                </div>

                {errorMessage && <div className="chip chip-rose mt-4" style={{ width: '100%', justifyContent: 'center' }}>{errorMessage}</div>}

                <button type="submit" className="btn btn-primary w-full mt-6" disabled={loading}>
                  {loading ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : <><Icon name="check" size={16} /> Sign In to Faculty Portal</>}
                </button>
              </form>

              <div className="hr mt-6 mb-4" />
              <div className="text-xs text-center text-subtle">
                Not a teacher? <a href="#/student-login" onClick={e => { e.preventDefault(); onNavigate('/student-login'); }} style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>Student login</a>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ maxWidth: 900, width: '100%' }} className="screen-enter">
          <div className="text-center mb-8">
            <div className="chip chip-accent mb-4"><Icon name="filter" size={14} /> Filter Setup · Step 2 of 2</div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)' }} className="mb-3">
              Welcome back, <span className="grad-text">Faculty Advisor</span>
            </h1>
            <p>Select department, batch and section to view. You can change these anytime from your dashboard.</p>
          </div>

          <GlassCard strong className="p-6">
            {/* Department */}
            <div className="mb-6">
              <div className="field-label mb-3">1. Select Department</div>
              <div className="grid-4">
                {departments.map(d => (
                  <button key={d.code} onClick={() => setDept(d.code)}
                    style={{
                      padding: 16, borderRadius: 14,
                      border: '1px solid',
                      borderColor: dept === d.code ? d.color : 'var(--border-strong)',
                      background: dept === d.code ? `color-mix(in oklab, ${d.color} 14%, transparent)` : 'color-mix(in oklab, var(--surface-solid) 40%, transparent)',
                      color: 'var(--text)',
                      textAlign: 'left', cursor: 'pointer',
                      transition: 'all .2s',
                    }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${d.color}, color-mix(in oklab, ${d.color} 60%, white))`, color: 'white', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', marginBottom: 10 }}>{d.code}</div>
                    <div className="text-sm font-semibold" style={{ lineHeight: 1.2 }}>{d.name}</div>
                    <div className="text-xs text-subtle mt-1">{d.hod}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Batch */}
            <div className="mb-6">
              <div className="field-label mb-3">2. Select Batch</div>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {batches.map(b => (
                  <button key={b} onClick={() => setBatch(b)} className="btn"
                    style={{
                      background: batch === b ? 'var(--brand-primary)' : 'var(--surface-strong)',
                      color: batch === b ? 'white' : 'var(--text)',
                      borderColor: batch === b ? 'transparent' : 'var(--border-strong)',
                    }}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Section */}
            <div className="mb-6">
              <div className="field-label mb-3">3. Select Section</div>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {[...sections, 'ALL'].map(sec => (
                  <button key={sec} onClick={() => setSection(sec)} className="btn"
                    style={{
                      background: section === sec ? 'var(--accent)' : 'var(--surface-strong)',
                      color: section === sec ? 'white' : 'var(--text)',
                      borderColor: section === sec ? 'transparent' : 'var(--border-strong)',
                      minWidth: 64,
                    }}>
                    {sec === 'ALL' ? 'All Sections' : `Section ${sec}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="hr mb-4" />

            <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
              <div className="text-sm text-muted">
                Viewing <strong style={{ color: 'var(--text)' }}>{dept} · {batch} · {section === 'ALL' ? 'All Sections' : `Section ${section}`}</strong>
              </div>
              <button className="btn btn-primary" onClick={proceed}>
                Enter Dashboard <Icon name="arrow" size={16} />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .login-grid { grid-template-columns: 1fr !important; display: block !important; }
          .login-illus { display: none !important; }
        }
      `}</style>
    </div>
  );
}

window.TeacherLogin = TeacherLogin;
