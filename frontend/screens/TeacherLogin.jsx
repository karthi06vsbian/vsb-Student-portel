// Teacher Login — simple single login form (Username + Password)
function TeacherLogin({ onNavigate }) {
  const [username, setUsername] = useState('ramesh.m');
  const [password, setPassword] = useState('teacher123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login(e) {
    if (e) e.preventDefault();
    setLoading(true);
    if (!window.VSB_DATA) window.VSB_DATA = {};
    window.VSB_DATA.selectedFilter = { dept: 'ALL', batch: 'ALL', section: 'ALL' };
    try {
      const teacher = await window.VSB_API.loginTeacher(username);
      if (teacher && teacher.id) window.VSB_DATA.currentTeacherId = teacher.id;
      window.VSB_DATA.currentUserRole = 'teacher';
      setLoading(false);
      onNavigate('/teacher');
    } catch (err) {
      window.VSB_DATA.currentUserRole = 'teacher';
      setLoading(false);
      onNavigate('/teacher');
    }
  }

  return (
    <div className="screen-enter" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '100px 20px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, maxWidth: 1100, width: '100%', alignItems: 'center' }} className="login-grid">
        <div className="login-illus">
          <div className="chip chip-accent mb-4"><Icon name="teacher" size={14} /> Faculty Portal</div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }} className="mb-4">
            Manage your <span className="grad-text">department roster</span> in one place.
          </h1>
          <p style={{ fontSize: '1.05rem' }} className="mb-6">
            Log in with your VSB faculty credentials to view student rosters, choose departments, upload CSV files, approve profile updates, and export reports.
          </p>
          <div className="grid-2">
            <GlassCard className="p-4">
              <Icon name="filter" size={20} style={{ color: 'var(--brand-primary)', marginBottom: 8 }} />
              <div className="text-sm font-semibold mb-1">Filter-first workflow</div>
              <div className="text-xs text-muted">Select department, batch & section anytime from your dashboard.</div>
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

            <div className="glass-inner p-3 mb-5" style={{ borderRadius: 12, border: '1px dashed var(--accent)' }}>
              <div className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>Quick Demo Faculty Login:</div>
              <button type="button" className="btn btn-ghost btn-sm w-full" style={{ fontSize: '0.82rem', background: 'color-mix(in oklab, var(--accent) 12%, transparent)', justifyContent: 'center' }} onClick={() => {
                setUsername('ramesh.m');
                setPassword('teacher123');
                if (!window.VSB_DATA) window.VSB_DATA = {};
                window.VSB_DATA.selectedFilter = { dept: 'ALL', batch: 'ALL', section: 'ALL' };
                window.VSB_DATA.currentUserRole = 'teacher';
                onNavigate('/teacher');
              }}>
                ⚡ Dummy Faculty Login (Dr. Ramesh Kumar M. - ramesh.m)
              </button>
            </div>

            <form onSubmit={login}>
              <label className="field-label">Faculty Username</label>
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
