// Admin Login — restricted access at #/admin
function AdminLogin({ onNavigate }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    try {
      await window.VSB_API.loginAdmin(username, password);
      window.VSB_DATA.currentUserRole = 'admin';
      setLoading(false);
      onNavigate('/admin/dashboard');
    } catch (err) {
      alert('Invalid admin credentials');
      setLoading(false);
    }
  }

  return (
    <div className="screen-enter" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '120px 20px 40px' }}>
      <div style={{ maxWidth: 460, width: '100%' }}>
        <div className="text-center mb-6">
          <div style={{
            width: 68, height: 68, borderRadius: 20,
            background: 'linear-gradient(135deg, #8B5CF6, #C084FC)',
            color: 'white',
            display: 'grid', placeItems: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 20px 40px -12px #8B5CF680',
          }}>
            <Icon name="admin" size={30} stroke={2.2} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }} className="mb-2">Administrator Sign-in</h1>
          <p className="text-sm">Restricted portal. All login attempts are audited.</p>
        </div>

        <GlassCard strong className="p-8">
          <div className="chip chip-violet mb-6" style={{ width: '100%', justifyContent: 'center', padding: '8px 14px' }}>
            <Icon name="shield" size={14} /> Access URL — /admin
          </div>

          <label className="field-label">Admin Username</label>
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" />

          <label className="field-label mt-4">Password</label>
          <div style={{ position: 'relative' }}>
            <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 8, top: 8, background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Icon name="eye" size={16} />
            </button>
          </div>

          <button className="btn w-full mt-6" onClick={login} disabled={loading} style={{
            background: 'linear-gradient(135deg, #8B5CF6, #C084FC)',
            color: 'white',
            border: 'none',
            boxShadow: '0 20px 40px -16px #8B5CF6AA',
          }}>
            {loading ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : <><Icon name="shield" size={16} /> Access Admin Panel</>}
          </button>

          <div className="hr mt-6 mb-4" />
          <div className="text-xs text-center text-subtle">
            <Icon name="shield" size={12} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} />
            IP: 103.42.18.94 · Session logged
          </div>
        </GlassCard>

        <div className="text-center mt-6">
          <a href="#/" onClick={e => { e.preventDefault(); onNavigate('/'); }} className="text-sm text-subtle" style={{ textDecoration: 'none' }}>
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

window.AdminLogin = AdminLogin;
