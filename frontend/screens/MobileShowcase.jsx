// Mobile Showcase — phone frames showing responsive layouts
function MobileShowcase({ onNavigate }) {
  return (
    <div className="screen-enter" style={{ paddingTop: 120, paddingBottom: 80 }}>
      <div className="container">
        <div className="text-center mb-8" style={{ maxWidth: 720, margin: '0 auto 60px' }}>
          <div className="chip chip-brand mb-4"><Icon name="phone" size={14} /> Mobile-First Design</div>
          <h1 className="mb-3">Every screen adapts to <span className="grad-text">every device.</span></h1>
          <p style={{ fontSize: '1.05rem' }}>Faculty on the go, students on their phones, admins on the desk — the portal responds. Below are actual mockups of key flows on a phone.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, justifyContent: 'center', placeItems: 'center' }}>
          <PhoneFrame label="Landing">
            <MobileLanding />
          </PhoneFrame>
          <PhoneFrame label="Student Login">
            <MobileStudentLogin />
          </PhoneFrame>
          <PhoneFrame label="Student Dashboard">
            <MobileDashboard />
          </PhoneFrame>
          <PhoneFrame label="Teacher Table">
            <MobileTeacher />
          </PhoneFrame>
        </div>

        <div className="text-center mt-12">
          <button className="btn btn-primary" onClick={() => onNavigate('/')}>
            <Icon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

function PhoneFrame({ label, children }) {
  return (
    <div>
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          {children}
        </div>
      </div>
      <div className="text-center mt-4 text-sm font-semibold text-muted">{label}</div>
    </div>
  );
}

// Mobile mini screens
function MobileLanding() {
  return (
    <div style={{ padding: '48px 16px 16px', height: '100%', overflow: 'hidden', background: 'linear-gradient(180deg, color-mix(in oklab, var(--brand-primary) 12%, var(--bg)), var(--bg))' }}>
      <div className="flex items-center gap-2 mb-4">
        <Monogram size={30} />
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>VSB Portal</div>
      </div>
      <div className="chip chip-accent" style={{ fontSize: '0.62rem', padding: '3px 8px' }}>VSB Portal</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', lineHeight: 1.1, marginTop: 12, letterSpacing: '-0.02em' }}>
        Choose your<br />login.
      </div>
      <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Student or teacher access.</div>

      <div style={{ display: 'grid', gap: 8, marginTop: 20 }}>
        <MiniLoginBtn icon="student" tone="#2563EB" title="Student Login" />
        <MiniLoginBtn icon="teacher" tone="#10B981" title="Teacher Login" />
      </div>
    </div>
  );
}

function MiniLoginBtn({ icon, tone, title }) {
  return (
    <div className="glass" style={{ padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${tone}, color-mix(in oklab, ${tone} 60%, white))`, color: 'white', display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={16} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{title}</div>
      </div>
      <Icon name="arrow" size={14} style={{ color: 'var(--text-subtle)' }} />
    </div>
  );
}

function MobileStudentLogin() {
  return (
    <div style={{ padding: '48px 16px 16px', height: '100%' }}>
      <button className="btn btn-ghost btn-icon" style={{ padding: 6 }}><Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} /></button>
      <div style={{ marginTop: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>Student Login</div>
        <div className="text-xs" style={{ color: 'var(--text-subtle)', marginTop: 4 }}>Register number + DOB</div>
      </div>
      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        <div>
          <div className="field-label">Register Number</div>
          <div className="input" style={{ fontSize: '0.86rem' }}>2023CS042</div>
        </div>
        <div>
          <div className="field-label">Date of Birth</div>
          <div className="input" style={{ fontSize: '0.86rem' }}>14/08/2003</div>
        </div>
      </div>
      <button className="btn btn-primary w-full" style={{ marginTop: 20 }}><Icon name="check" size={14} /> Login</button>

      <div className="glass p-3 mt-5" style={{ borderRadius: 12 }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Icon name="shield" size={12} /> DOB verification
        </div>
      </div>
    </div>
  );
}

function MobileDashboard() {
  const s = window.VSB_DATA.students[0];
  return (
    <div style={{ padding: '48px 14px 14px', height: '100%', overflow: 'hidden' }}>
      <div className="flex items-center gap-2 mb-3">
        <Avatar name={s.name} size={40} tone="brand" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>{s.name}</div>
          <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>{s.registerNumber} · CSE Y3</div>
        </div>
        <button className="btn btn-ghost btn-icon" style={{ padding: 6 }}><Icon name="bell" size={14} /></button>
      </div>

      <div className="glass p-3" style={{ borderRadius: 12 }}>
        <div className="text-xs mb-1" style={{ color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Profile</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="progress" style={{ flex: 1 }}><div style={{ width: '92%' }} /></div>
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>92%</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
        <div className="glass p-3" style={{ borderRadius: 12 }}>
          <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>CGPA</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem' }}>8.72</div>
        </div>
        <div className="glass p-3" style={{ borderRadius: 12 }}>
          <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>Attendance</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--accent)' }}>92%</div>
        </div>
      </div>

      <div className="text-xs font-semibold mt-4 mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-subtle)' }}>Sections</div>
      <div style={{ display: 'grid', gap: 6 }}>
        {[
          { icon: 'student', label: 'Personal Info', ok: true },
          { icon: 'phone',   label: 'Contact & Family', ok: true },
          { icon: 'book',    label: 'Academic Record',  ok: true },
          { icon: 'code',    label: 'Skills',           ok: true },
          { icon: 'file',    label: 'Documents',        ok: true },
          { icon: 'settings', label: 'Other Details',   ok: true },
        ].map((r, i) => (
          <div key={i} className="glass flex items-center gap-2" style={{ padding: '8px 10px', borderRadius: 10 }}>
            <Icon name={r.icon} size={14} style={{ color: 'var(--brand-primary)' }} />
            <span style={{ fontSize: '0.78rem', flex: 1 }}>{r.label}</span>
            {r.ok ? <Icon name="check" size={12} stroke={3} style={{ color: 'var(--accent)' }} /> : <span style={{ fontSize: '0.62rem', color: '#F59E0B' }}>Update</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileTeacher() {
  return (
    <div style={{ padding: '48px 12px 12px', height: '100%', overflow: 'hidden' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem' }}>CSE · 2023-27</div>
          <div className="text-xs" style={{ color: 'var(--text-subtle)' }}>Section A · 42 students</div>
        </div>
        <button className="btn btn-ghost btn-icon" style={{ padding: 6 }}><Icon name="filter" size={14} /></button>
      </div>

      <div style={{ position: 'relative', marginBottom: 10 }}>
        <input className="input" placeholder="Search…" style={{ paddingLeft: 32, fontSize: '0.8rem', padding: '10px 10px 10px 32px' }} />
        <Icon name="search" size={12} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-subtle)' }} />
      </div>

      <div style={{ display: 'grid', gap: 6, maxHeight: 380, overflow: 'hidden' }}>
        {window.VSB_DATA.students.slice(0, 6).map((s, i) => (
          <div key={i} className="glass flex items-center gap-2" style={{ padding: 8, borderRadius: 10 }}>
            <Avatar name={s.name} size={30} tone="auto" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
              <div className="mono" style={{ fontSize: '0.62rem', color: 'var(--text-subtle)' }}>{s.registerNumber}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: parseFloat(s.cgpa) >= 8 ? 'var(--accent)' : 'inherit' }}>{s.cgpa}</div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary w-full" style={{ marginTop: 10, fontSize: '0.8rem', padding: '10px 14px' }}>
        <Icon name="download" size={12} /> Export Excel
      </button>
    </div>
  );
}

window.MobileShowcase = MobileShowcase;
