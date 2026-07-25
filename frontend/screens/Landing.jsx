// First page — student and teacher login choices only
function Landing({ onNavigate }) {
  return (
    <div className="screen-enter" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '120px 20px 48px' }}>
      <div style={{ width: '100%', maxWidth: 920, textAlign: 'center' }}>
        <div className="chip chip-accent mb-6" style={{ margin: '0 auto 24px' }}>
          <Icon name="shield" size={14} /> VSB Student Information Portal
        </div>
        <h1 style={{ fontSize: 'clamp(2.1rem, 5vw, 4rem)', marginBottom: 16 }}>
          Choose your <span className="grad-text">login</span>
        </h1>
        <p style={{ fontSize: '1.08rem', maxWidth: 560, margin: '0 auto 36px' }}>
          Sign in as a student or teacher to continue to the VSB portal.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))', gap: 18, maxWidth: 700, margin: '0 auto' }} className="role-login-grid">
          <LoginTile
            title="Student Login"
            subtitle="Register number + Date of birth"
            icon="student"
            tone="#2563EB"
            onClick={() => onNavigate('/student-login')}
          />
          <LoginTile
            title="Teacher Login"
            subtitle="Username + Password"
            icon="teacher"
            tone="#10B981"
            onClick={() => onNavigate('/teacher-login')}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .role-login-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function LoginTile({ title, subtitle, icon, tone, onClick }) {
  return (
    <button className="login-tile" onClick={onClick}>
      <div className="icon-wrap" style={{ background: `linear-gradient(135deg, ${tone}, color-mix(in oklab, ${tone} 60%, white))`, boxShadow: `0 10px 24px -8px ${tone}88` }}>
        <Icon name={icon} size={22} stroke={2.2} />
      </div>
      <div style={{ marginTop: 4 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>{title}</div>
        <div className="text-sm text-subtle mt-1">{subtitle}</div>
      </div>
      <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: tone, fontWeight: 600 }}>
        Continue <Icon name="arrow" size={16} />
      </div>
    </button>
  );
}
