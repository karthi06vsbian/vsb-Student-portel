// Shared UI primitives
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Icon (Material Symbols outlined via unicode-ish SVG paths) ----------
// Minimal inline SVG icon set — no external icon lib
const ICONS = {
  student: 'M12 3l10 6-10 6L2 9l10-6zm0 8.2l7.4-4.4M12 13v8m-5-4a5 5 0 0010 0v-2.5',
  teacher: 'M4 6h16v12H4zM8 10h8M8 14h5',
  admin:   'M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z',
  arrow:   'M5 12h14M13 6l6 6-6 6',
  check:   'M5 12l5 5L20 7',
  close:   'M6 6l12 12M18 6L6 18',
  search:  'M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-5-5',
  bell:    'M6 8a6 6 0 1112 0v5l2 3H4l2-3V8zM10 21a2 2 0 004 0',
  sun:     'M12 4V2M12 22v-2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4M12 7a5 5 0 100 10 5 5 0 000-10z',
  moon:    'M20 14A8 8 0 019 3a8 8 0 1011 11z',
  edit:    'M4 20h4l10-10-4-4L4 16v4z',
  download:'M12 3v12m0 0l-5-5m5 5l5-5M4 21h16',
  upload:  'M12 21V9m0 0l-5 5m5-5l5 5M4 3h16',
  filter:  'M4 5h16l-6 8v6l-4-2v-4L4 5z',
  chart:   'M4 20V10m6 10V4m6 16v-8m6 8V8',
  users:   'M9 11a4 4 0 100-8 4 4 0 000 8zm-7 10a7 7 0 0114 0M17 11a3 3 0 100-6M22 21a5 5 0 00-3-4.6',
  book:    'M4 5v14a2 2 0 002 2h14V3H6a2 2 0 00-2 2zm4 0h10v14H8V5z',
  briefcase:'M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 7h18v13H3zM3 13h18',
  code:    'M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16',
  award:   'M12 3l2.5 5 5.5.8-4 4 1 5.5L12 15.8 7 18.3l1-5.5-4-4 5.5-.8L12 3z',
  phone:   'M22 16.9v3a2 2 0 01-2.2 2A20 20 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L8 9.6a16 16 0 006.4 6.4l1.2-1.2a2 2 0 012.1-.4c.9.3 1.7.5 2.6.6a2 2 0 011.7 2z',
  mail:    'M4 6h16v12H4zM4 6l8 7 8-7',
  location:'M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12zM12 11a2 2 0 100-4 2 2 0 000 4z',
  logout:  'M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l-5-5 5-5M5 12h11',
  plus:    'M12 5v14M5 12h14',
  trash:   'M4 7h16M9 7V4h6v3m1 0v13a2 2 0 01-2 2H10a2 2 0 01-2-2V7h8z',
  eye:     'M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zm11 3a3 3 0 100-6 3 3 0 000 6z',
  building:'M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16M4 21h12M8 7h4M8 11h4M8 15h4M16 21h4V11h-4',
  settings:'M12 15a3 3 0 100-6 3 3 0 000 6zm7-3a7 7 0 00-.2-1.6l2-1.6-2-3.4-2.4.8a7 7 0 00-2.8-1.6L13 2h-4l-.6 2.6a7 7 0 00-2.8 1.6l-2.4-.8-2 3.4 2 1.6A7 7 0 003 12c0 .6.1 1.1.2 1.6L1.2 15.2l2 3.4 2.4-.8a7 7 0 002.8 1.6L9 22h4l.6-2.6a7 7 0 002.8-1.6l2.4.8 2-3.4-2-1.6c.1-.5.2-1 .2-1.6z',
  file:    'M6 3h8l4 4v14H6zM14 3v4h4',
  shield:  'M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z',
  heart:   'M12 21s-7-4.5-7-11a4 4 0 017-2.6A4 4 0 0119 10c0 6.5-7 11-7 11z',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z',
  grid:    'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  list:    'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  wifi:    'M5 12a10 10 0 0114 0M8.5 15.5a5 5 0 017 0M12 19h.01',
  link:    'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
};
function Icon({ name, size = 20, stroke = 2, style, className }) {
  const d = ICONS[name] || ICONS.check;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
      <path d={d} />
    </svg>
  );
}

// ---------- App shell / TopBar ----------
function TopBar({ onNavigate, currentRoute, theme, onToggleTheme }) {
  const links = [
    { label: 'Student', route: '/student-login' },
    { label: 'Teacher', route: '/teacher-login' },
  ];
  return (
    <div style={{ position: 'fixed', top: 20, left: 0, right: 0, zIndex: 40, pointerEvents: 'none' }}>
      <div className="container flex items-center justify-between" style={{ pointerEvents: 'auto' }}>
        <a href="#/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex items-center gap-3">
            <Monogram />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>VSB</div>
              <div className="text-xs text-subtle brand-subtitle" style={{ marginTop: -2 }}>Engineering & Technical Campus</div>
            </div>
          </div>
        </a>
        <nav className="glass flex items-center gap-1 p-1" style={{ borderRadius: 999, padding: 6 }}>
          {links.map(l => (
            <a key={l.route} href={`#${l.route}`}
               onClick={(e) => { e.preventDefault(); onNavigate(l.route); }}
               style={{
                 padding: '8px 16px', borderRadius: 999, fontSize: '0.88rem', fontWeight: 500,
                 textDecoration: 'none',
                 color: currentRoute === l.route ? 'white' : 'var(--text-muted)',
                 background: currentRoute === l.route ? 'var(--brand-primary)' : 'transparent',
                 transition: 'all .2s',
               }}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-icon" onClick={onToggleTheme} aria-label="Toggle theme">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Monogram({ size = 44 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: 12,
      background: 'linear-gradient(135deg, var(--brand-primary), color-mix(in oklab, var(--brand-primary) 55%, var(--accent)))',
      display: 'grid', placeItems: 'center',
      color: 'white',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: size * 0.44,
      letterSpacing: '-0.02em',
      boxShadow: '0 8px 20px -8px color-mix(in oklab, var(--brand-primary) 60%, transparent)',
    }}>
      VSB
    </div>
  );
}

// ---------- Reusable ----------
function GlassCard({ children, className = '', style, strong = false, ...rest }) {
  return (
    <div className={`${strong ? 'glass-strong' : 'glass'} ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}

function StatCard({ label, value, delta, icon, tone = 'brand' }) {
  const toneColor = tone === 'brand' ? 'var(--brand-primary)' : tone === 'accent' ? 'var(--accent)' : tone === 'amber' ? '#F59E0B' : tone === 'rose' ? '#EF4444' : 'var(--brand-primary)';
  return (
    <GlassCard className="p-5 lift">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `color-mix(in oklab, ${toneColor} 14%, transparent)`,
          color: toneColor,
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name={icon} size={18} />
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </div>
      {delta && (
        <div className="text-xs mt-2" style={{ color: delta.startsWith('+') ? 'var(--accent)' : 'var(--text-muted)' }}>
          {delta}
        </div>
      )}
    </GlassCard>
  );
}

// ---------- Placeholder avatar with initials ----------
function Avatar({ name = 'S', size = 40, tone = 'brand' }) {
  const initials = name.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase();
  const colors = {
    brand:  ['#2563EB', '#60A5FA'],
    accent: ['#059669', '#34D399'],
    violet: ['#7C3AED', '#C4B5FD'],
    rose:   ['#DB2777', '#F9A8D4'],
    amber:  ['#D97706', '#FCD34D'],
  };
  // Pick tone from name hash for variety when unspecified
  const keys = Object.keys(colors);
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const c = colors[tone === 'auto' ? keys[hash % keys.length] : tone] || colors.brand;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${c[0]}, ${c[1]})`,
      color: 'white',
      fontFamily: 'var(--font-display)', fontWeight: 700,
      fontSize: size * 0.38,
      display: 'grid', placeItems: 'center',
      flexShrink: 0,
      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)',
    }}>{initials}</div>
  );
}

// ---------- Illustration / Hero decoration ----------
function HeroOrbit() {
  const items = [
    { x: 12, y: 18, size: 46, icon: 'code',      tone: '#2563EB' },
    { x: 82, y: 12, size: 52, icon: 'award',     tone: '#EC4899' },
    { x: 6,  y: 68, size: 44, icon: 'book',      tone: '#8B5CF6' },
    { x: 86, y: 60, size: 48, icon: 'briefcase', tone: '#10B981' },
    { x: 72, y: 84, size: 40, icon: 'sparkle',   tone: '#F59E0B' },
    { x: 20, y: 88, size: 42, icon: 'chart',     tone: '#06B6D4' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((it, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${it.x}%`, top: `${it.y}%`,
          width: it.size, height: it.size,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${it.tone}, color-mix(in oklab, ${it.tone} 60%, white))`,
          color: 'white',
          display: 'grid', placeItems: 'center',
          boxShadow: `0 20px 40px -12px ${it.tone}55`,
          animation: `float${i} ${6 + i}s ease-in-out infinite`,
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          <Icon name={it.icon} size={it.size * 0.44} stroke={2.2} />
          <style>{`
            @keyframes float${i} {
              0%, 100% { transform: translateY(0) rotate(-4deg); }
              50%      { transform: translateY(-14px) rotate(4deg); }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}

// ---------- Simple line/bar charts (minimal) ----------
function LineChart({ data, height = 120, color = 'var(--brand-primary)', fill = true }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / range) * 90 - 5;
    return [x, y];
  });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const area = `${path} L 100 100 L 0 100 Z`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height={height}>
      <defs>
        <linearGradient id={`lg-${color.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#lg-${color.replace(/[^a-z0-9]/gi, '')})`} />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="0.9" fill={color} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

function BarChart({ data, labels, height = 160, colors }) {
  const max = Math.max(...data);
  const palette = colors || ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{
              width: '100%',
              height: `${(v / max) * 100}%`,
              background: `linear-gradient(180deg, ${palette[i % palette.length]}, color-mix(in oklab, ${palette[i % palette.length]} 60%, transparent))`,
              borderRadius: '8px 8px 4px 4px',
              minHeight: 6,
              boxShadow: `0 6px 14px -6px ${palette[i % palette.length]}66`,
              transition: 'height .5s cubic-bezier(.2,.7,.2,1)',
            }} />
          </div>
          <div className="text-xs" style={{ color: 'var(--text-subtle)', fontWeight: 500 }}>{labels[i]}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size = 180, thickness = 26, centerLabel, centerValue }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  let acc = 0;
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="color-mix(in oklab, var(--text) 8%, transparent)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const dash = (s.value / total) * 2 * Math.PI * r;
          const offset = -(acc / total) * 2 * Math.PI * r;
          acc += s.value;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={thickness}
              strokeDasharray={`${dash} ${2 * Math.PI * r}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt" />
          );
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{centerValue}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-subtle)' }}>{centerLabel}</div>
        </div>
      </div>
    </div>
  );
}

// Expose to window for other babel scripts
Object.assign(window, {
  Icon, TopBar, Monogram, GlassCard, StatCard, Avatar, HeroOrbit,
  LineChart, BarChart, DonutChart,
});
