// Root App — router + theme + tweaks
const { useEffect: uE, useState: uS } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "emerald",
  "theme": "light"
}/*EDITMODE-END*/;

const ACCENTS = {
  emerald: { base: '#10B981', c600: '#059669', c400: '#34D399', label: 'Emerald' },
  teal:    { base: '#14B8A6', c600: '#0D9488', c400: '#5EEAD4', label: 'Teal' },
  cyan:    { base: '#06B6D4', c600: '#0891B2', c400: '#67E8F9', label: 'Cyan' },
  violet:  { base: '#8B5CF6', c600: '#7C3AED', c400: '#C4B5FD', label: 'Violet' },
  amber:   { base: '#F59E0B', c600: '#D97706', c400: '#FCD34D', label: 'Amber' },
  rose:    { base: '#F43F5E', c600: '#E11D48', c400: '#FDA4AF', label: 'Rose' },
};

function useHashRoute() {
  const [route, setRoute] = uS(() => {
    const h = window.location.hash.replace(/^#/, '') || '/admin/dashboard';
    return h;
  });
  uE(() => {
    function onHash() {
      setRoute(window.location.hash.replace(/^#/, '') || '/admin/dashboard');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  function navigate(r) {
    window.location.hash = r;
  }
  return [route, navigate];
}

function App() {
  const [route, navigate] = useHashRoute();
  const t = useTweaks(DEFAULTS);

  // Apply accent to CSS vars
  uE(() => {
    const a = ACCENTS[t.accent] || ACCENTS.emerald;
    document.documentElement.style.setProperty('--accent', a.base);
    document.documentElement.style.setProperty('--accent-600', a.c600);
    document.documentElement.style.setProperty('--accent-400', a.c400);
  }, [t.accent]);

  // Theme
  uE(() => {
    document.documentElement.setAttribute('data-theme', t.theme || 'light');
  }, [t.theme]);

  function toggleTheme() {
    t.setTweak('theme', (t.theme || 'light') === 'light' ? 'dark' : 'light');
  }

  // Pick screen
  let screen = null;
  if (route === '/' || route === '' || route === '/student-login') screen = <StudentLogin onNavigate={navigate} />;
  else if (route === '/student') screen = <StudentDashboard onNavigate={navigate} />;
  else if (route === '/teacher-login') screen = <TeacherLogin onNavigate={navigate} />;
  else if (route === '/teacher') screen = <TeacherDashboard onNavigate={navigate} />;
  else if (route === '/admin') screen = <AdminLogin onNavigate={navigate} />;
  else if (route === '/admin/dashboard') screen = <AdminPanel onNavigate={navigate} />;
  else screen = <NotFound onNavigate={navigate} />;

  return (
    <>
      <TopBar
        onNavigate={navigate}
        currentRoute={route}
        theme={t.theme}
        onToggleTheme={toggleTheme}
      />
      <div key={route}>{screen}</div>

      <TweaksPanel title="Tweaks" defaultOpen={false}>
        <TweakSection title="Accent Color">
          <TweakColor
            label="Accent"
            value={ACCENTS[t.accent]?.base || '#10B981'}
            options={Object.values(ACCENTS).map(a => a.base)}
            onChange={(hex) => {
              const key = Object.keys(ACCENTS).find(k => ACCENTS[k].base === hex);
              if (key) t.setTweak('accent', key);
            }}
          />
          <div className="text-xs text-subtle mt-2" style={{ padding: '0 4px' }}>
            Currently: <strong style={{ color: 'var(--accent)' }}>{ACCENTS[t.accent]?.label || 'Emerald'}</strong>
          </div>
        </TweakSection>
        <TweakSection title="Appearance">
          <TweakRadio
            label="Theme"
            value={t.theme}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark',  label: 'Dark' },
            ]}
            onChange={v => t.setTweak('theme', v)}
          />
        </TweakSection>
        <TweakSection title="Jump to screen">
          <div style={{ display: 'grid', gap: 6 }}>
            {[
              ['/', 'Student Login'],
              ['/student-login', 'Student Login'],
              ['/student', 'Student Dashboard'],
              ['/teacher-login', 'Teacher Login'],
              ['/teacher', 'Teacher Dashboard'],
              ['/admin', 'Admin Login'],
              ['/admin/dashboard', 'Admin Panel'],
            ].map(([r, label]) => (
              <button key={r} className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start' }} onClick={() => navigate(r)}>
                {label}
              </button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function NotFound({ onNavigate }) {
  return (
    <div className="screen-enter" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 40 }}>
      <div className="text-center">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 700, background: 'linear-gradient(120deg, var(--brand-primary), var(--accent))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', letterSpacing: '-0.03em' }}>404</div>
        <h2 className="mb-2">Route not found</h2>
        <p className="mb-6">This page doesn't exist in the VSB portal.</p>
        <button className="btn btn-primary" onClick={() => onNavigate('/')}>Return to login</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
