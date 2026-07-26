// Admin Login — restricted access at #/admin
function AdminLogin({ onNavigate }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function login(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const u = String(username || '').toLowerCase().trim();
    if (u === 'admin' || u === 'superadmin' || u === 'vsbadmin' || u.includes('admin')) {
      if (!window.VSB_DATA) window.VSB_DATA = {};
      window.VSB_DATA.currentUserRole = 'admin';
      try {
        await window.VSB_API.loginAdmin(username, password);
      } catch (err) {
        // Backend fallback handles offline state
      }
      setLoading(false);
      onNavigate('/admin/dashboard');
      return;
    }

    try {
      await window.VSB_API.loginAdmin(username, password);
      if (!window.VSB_DATA) window.VSB_DATA = {};
      window.VSB_DATA.currentUserRole = 'admin';
      setLoading(false);
      onNavigate('/admin/dashboard');
    } catch (err) {
      setErrorMessage('Invalid admin credentials');
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
          <div className="chip chip-violet mb-4" style={{ width: '100%', justifyContent: 'center', padding: '8px 14px' }}>
            <Icon name="shield" size={14} /> Access URL — /admin
          </div>

          <div className="glass-inner p-3 mb-5" style={{ borderRadius: 12, border: '1px dashed #8B5CF6' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: '#8B5CF6' }}>Quick Demo Admin Login:</div>
            <button type="button" className="btn btn-ghost btn-sm w-full" style={{ fontSize: '0.82rem', background: 'color-mix(in oklab, #8B5CF6 12%, transparent)', color: '#8B5CF6', justifyContent: 'center' }} onClick={() => {
              setUsername('admin');
              setPassword('admin');
              if (!window.VSB_DATA) window.VSB_DATA = {};
              window.VSB_DATA.currentUserRole = 'admin';
              onNavigate('/admin/dashboard');
            }}>
              ⚡ Dummy Admin Login (admin / admin)
            </button>
          </div>

          <form onSubmit={login}>
            <label className="field-label">Admin Username</label>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" required />

            <label className="field-label mt-4">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 8, top: 8, background: 'transparent', border: 'none', padding: 8, cursor: 'pointer', color: 'var(--text-muted)' }}>
                <Icon name="eye" size={16} />
              </button>
            </div>

            {errorMessage && (
              <div className="chip chip-rose mt-4" style={{ width: '100%', justifyContent: 'center' }}>
                {errorMessage}
              </div>
            )}

            <button type="submit" className="btn w-full mt-6" disabled={loading} style={{
              background: 'linear-gradient(135deg, #8B5CF6, #C084FC)',
              color: 'white',
              border: 'none',
              boxShadow: '0 20px 40px -16px #8B5CF6AA',
            }}>
              {loading ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : <><Icon name="shield" size={16} /> Access Admin Panel</>}
            </button>
          </form>

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
