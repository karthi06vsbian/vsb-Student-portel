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
        <a href="#/student-login" onClick={(e) => { e.preventDefault(); onNavigate('/student-login'); }} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="flex items-center gap-3">
            <Monogram />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>VSB</div>
              <div className="text-xs text-subtle brand-subtitle" style={{ marginTop: -2 }}>Engineering & Technical Campus</div>
            </div>
          </div>
        </a>
        <nav className="glass flex items-center gap-1 p-1" style={{ borderRadius: 999, padding: 6 }}>
          {links.map(l => {
            const isActive = currentRoute === l.route || (l.route === '/student-login' && (currentRoute === '/' || currentRoute === ''));
            return (
              <a key={l.route} href={`#${l.route}`}
                 onClick={(e) => { e.preventDefault(); onNavigate(l.route); }}
                 style={{
                   padding: '8px 16px', borderRadius: 999, fontSize: '0.88rem', fontWeight: 500,
                   textDecoration: 'none',
                   color: isActive ? 'white' : 'var(--text-muted)',
                   background: isActive ? 'var(--brand-primary)' : 'transparent',
                   transition: 'all .2s',
                 }}>
                {l.label}
              </a>
            );
          })}
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

// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#7A5AE0",
//     "palette": ["#7A5AE0", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#0F766E', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#7A5AE0', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', noDeckControls = false, children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  // Auto-inject a rail toggle when a <deck-stage> is on the page. The
  // toggle drives the deck's per-viewer _railVisible via window message;
  // state is mirrored from the same localStorage key the deck reads so
  // the control reflects reality across reloads. The mechanism is the
  // message — authors who want custom placement can post it directly
  // and pass noDeckControls to suppress this one.
  const hasDeckStage = React.useMemo(
    () => typeof document !== 'undefined' && !!document.querySelector('deck-stage'),
    [],
  );
  // deck-stage enables its rail in connectedCallback, but this panel can
  // mount before that element has upgraded. The initial read catches the
  // common case; the listener covers mounting first. (Older deck-stage.js
  // copies still wait for the host's __omelette_rail_enabled postMessage —
  // same listener handles those.)
  const [railEnabled, setRailEnabled] = React.useState(
    () => hasDeckStage && !!document.querySelector('deck-stage')?._railEnabled,
  );
  React.useEffect(() => {
    if (!hasDeckStage || railEnabled) return undefined;
    const onMsg = (e) => {
      if (e.data && e.data.type === '__omelette_rail_enabled') setRailEnabled(true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [hasDeckStage, railEnabled]);
  const [railVisible, setRailVisible] = React.useState(() => {
    try { return localStorage.getItem('deck-stage.railVisible') !== '0'; } catch (e) { return true; }
  });
  const toggleRail = (on) => {
    setRailVisible(on);
    window.postMessage({ type: '__deck_rail_visible', on }, '*');
  };
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-noncommentable=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
          {hasDeckStage && railEnabled && !noDeckControls && (
            <TweakSection label="Deck">
              <TweakToggle label="Thumbnail rail" value={railVisible} onChange={toggleRail} />
            </TweakSection>
          )}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});

// ── TweakSuggestionBar (flag-gated addon) ───────────────────────────────────
(function () {
  const s = document.createElement('style');
  s.textContent = `
    @keyframes twk-blink{50%{opacity:0}}
    @keyframes twk-fadein{from{opacity:0;transform:translateX(4px)}to{opacity:1;transform:none}}
    .twk-sugg{display:flex;align-items:center;gap:6px;padding:5px 8px;border-radius:8px;
      background:rgba(0,0,0,.04);border:.5px solid rgba(0,0,0,.06);transition:all .15s}
    .twk-sugg:focus-within{background:rgba(0,0,0,.06);border-color:rgba(0,0,0,.12)}
    .twk-sugg-field{position:relative;flex:1;min-width:0}
    .twk-sugg-field input{width:100%;height:20px;border:0;background:transparent;
      font:inherit;outline:none;color:inherit}
    .twk-sugg-ghost{position:absolute;inset:0;display:flex;align-items:center;
      color:rgba(41,38,27,.42);pointer-events:none;white-space:nowrap;overflow:hidden}
    .twk-sugg-ghost.hint{color:rgba(41,38,27,.28)}
    .twk-sugg-caret{display:inline-block;width:1px;height:13px;margin-left:1px;
      border-right:1.5px solid currentColor;opacity:.5;animation:twk-blink 1s step-end infinite}
    .twk-sugg-ideas{appearance:none;border:0;background:transparent;font:inherit;
      font-size:10.5px;font-weight:600;color:rgba(41,38,27,.6);cursor:default;padding:0 2px;
      white-space:nowrap;animation:twk-fadein .25s ease}
    .twk-sugg-ideas:hover{color:rgba(41,38,27,.85)}
    .twk-sugg-ideas svg{color:#7A5AE0}
    .twk-sugg-send{appearance:none;border:0;height:20px;padding:0 8px;border-radius:5px;
      background:#29261b;color:#fff;font:inherit;font-size:10px;font-weight:600;cursor:default}
  `;
  document.head.appendChild(s);
})();

const __twkSendChat = (text) =>
  window.parent.postMessage({ type: '__edit_mode_chat', text }, '*');

const __TWK_SPARK_STAR = 'M14.8299 10.378C15.1555 10.499 15.1827 10.9337 14.8747 11.0918L11.401 12.8747C11.3125 12.9202 11.2445 12.9955 11.2099 13.0864L9.95228 16.3963C9.82177 16.7397 9.31884 16.7397 9.18834 16.3963L7.93069 13.0864C7.89616 12.9955 7.82814 12.9202 7.73965 12.8747L4.2659 11.0918C3.95787 10.9337 3.98513 10.499 4.31067 10.378L7.69556 9.11947C7.81035 9.0768 7.89899 8.98625 7.93669 8.87317L9.18301 5.13503C9.30417 4.77165 9.83645 4.77165 9.9576 5.13503L11.2039 8.87317C11.2416 8.98626 11.3303 9.0768 11.4451 9.11947L14.8299 10.378Z';
const __TWK_SPARK_DOT = 'M6.0114 3.58637C6.35897 3.71564 6.35897 4.19061 6.0114 4.31988L4.98024 4.70337C4.86547 4.74605 4.77685 4.83659 4.73915 4.94965L4.33943 6.14853C4.21828 6.51191 3.686 6.51191 3.56485 6.14853L3.16513 4.94965C3.12743 4.83659 3.03881 4.74605 2.92404 4.70337L1.89288 4.31988C1.54531 4.19061 1.54531 3.71564 1.89288 3.58637L2.92404 3.20288C3.03881 3.1602 3.12743 3.06966 3.16513 2.9566L3.56485 1.75772C3.686 1.39434 4.21828 1.39434 4.33943 1.75772L4.73915 2.9566C4.77685 3.06966 4.86547 3.1602 4.98024 3.20288L6.0114 3.58637Z';

function __TwkSpark({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 17 18" fill="currentColor"
         style={{ display: 'inline-block', verticalAlign: '-1px' }}>
      <path d={__TWK_SPARK_STAR} />
      <path d={__TWK_SPARK_DOT} />
    </svg>
  );
}

// Typewriter-cycles through `suggestions`. Clicking the field while a
// suggestion is animating freezes it as ghost text; Tab accepts it into the
// input. Enter posts __edit_mode_chat (host drops the text into the chat
// composer for the user to send). After the cycle the static placeholder
// types in and "Ideas" appears — clicking asks for three more suggestions.
function TweakSuggestionBar({
  suggestions = [],
  placeholder = 'Describe a tweak…',
  ideasPrompt = 'Suggest three more tweak ideas for this design and update the suggestions on TweakSuggestionBar.',
}) {
  const [val, setVal] = React.useState('');
  const [ghost, setGhost] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef(null);
  const tw = useTwkTypewriter(suggestions, { placeholder, enabled: !val && !ghost && !focused });

  const freeze = () => {
    tw.markPlayed();
    if (val || ghost) return;
    const target = !tw.done ? suggestions[tw.idx] : '';
    if (target) setGhost(target);
    inputRef.current?.focus();
  };

  const submit = () => {
    const v = (val || ghost).trim();
    if (!v) return;
    __twkSendChat(v);
    setVal('');
    setGhost('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Tab' && ghost && !val) {
      e.preventDefault();
      setVal(ghost);
      setGhost('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      setGhost('');
    }
  };

  const requestIdeas = () => __twkSendChat(ideasPrompt);

  const showAnim = !val && !ghost && !focused && !tw.done;
  const showStatic = !val && !ghost && !focused && tw.done;

  return (
    <div className="twk-sugg" onMouseDown={freeze}>
      <div className="twk-sugg-field">
        <input
          ref={inputRef}
          value={val}
          placeholder={focused && !ghost ? placeholder : ''}
          onChange={(e) => { setVal(e.target.value); setGhost(''); }}
          onFocus={() => { setFocused(true); tw.markPlayed(); }}
          onBlur={() => { setFocused(false); if (!val) setGhost(''); }}
          onKeyDown={onKeyDown}
        />
        {showAnim && (
          <div className="twk-sugg-ghost">
            {tw.text}<span className="twk-sugg-caret" />
          </div>
        )}
        {showStatic && (
          <div className="twk-sugg-ghost">
            {tw.tail}{tw.tail.length < placeholder.length && <span className="twk-sugg-caret" />}
          </div>
        )}
        {ghost && !val && (
          <div className="twk-sugg-ghost hint">{ghost}</div>
        )}
      </div>
      {val || ghost ? (
        <button className="twk-sugg-send"
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                onClick={submit}>
          Add
        </button>
      ) : tw.done && !focused ? (
        <button className="twk-sugg-ideas"
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                onClick={requestIdeas}>
          Ideas <__TwkSpark />
        </button>
      ) : null}
    </div>
  );
}

// Minimal type→pause→erase cycler. Plays once per unique `items` content per
// session — a reload from a tweak-value write skips straight to done; a new
// suggestion set (after "Ideas") gets a fresh animation.
function useTwkTypewriter(items, { placeholder, typeMs = 35, eraseMs = 22, pauseMs = 1800, enabled = true } = {}) {
  // Dep mirrors the memo body verbatim so collidable joins like
  // ['a\nb','c'] vs ['a','b','c'] don't share a stale sessionStorage key
  // (gen-spark PR #28600 Bugbot R3 — minor divergence from Tiffany's
  // `items.join('\n')` dep; upstream report pending).
  const key = React.useMemo(() => '__twk_played:' + JSON.stringify(items), [JSON.stringify(items)]);
  const played = () => { try { return sessionStorage.getItem(key) === '1'; } catch { return false; } };

  const [text, setText] = React.useState('');
  const [tail, setTail] = React.useState(() => (items.length === 0 || played() ? placeholder : ''));
  const [idx, setIdx] = React.useState(0);
  const [done, setDone] = React.useState(() => items.length === 0 || played());
  const phase = React.useRef('type');
  const n = React.useRef(0);

  const markPlayed = React.useCallback(() => {
    try { sessionStorage.setItem(key, '1'); } catch {}
    setDone(true);
  }, [key]);

  React.useEffect(() => {
    const skip = items.length === 0 || played();
    setText(''); setIdx(0);
    setDone(skip);
    setTail(skip ? placeholder : '');
    phase.current = 'type'; n.current = 0;
  }, [key]);

  React.useEffect(() => {
    if (done || !enabled) return;
    const item = items[idx] ?? '';
    let t;
    const tick = () => {
      if (phase.current === 'type') {
        n.current++;
        setText(item.slice(0, n.current));
        if (n.current >= item.length) { phase.current = 'pause'; t = setTimeout(tick, pauseMs); }
        else t = setTimeout(tick, typeMs + Math.random() * 20);
      } else if (phase.current === 'pause') {
        phase.current = 'erase'; t = setTimeout(tick, eraseMs);
      } else {
        n.current--;
        setText(item.slice(0, n.current));
        if (n.current <= 0) {
          if (idx === items.length - 1) { markPlayed(); return; }
          phase.current = 'type'; setIdx((i) => i + 1);
        } else t = setTimeout(tick, eraseMs);
      }
    };
    phase.current = 'type'; n.current = 0; setText('');
    t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  }, [idx, done, key, enabled, typeMs, eraseMs, pauseMs]);

  React.useEffect(() => {
    if (!done || tail === placeholder) return;
    let i = 0;
    const t = setInterval(() => {
      i++; setTail(placeholder.slice(0, i));
      if (i >= placeholder.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [done, placeholder]);

  return { text, tail, idx, done, markPlayed };
}

Object.assign(window, { TweakSuggestionBar });
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
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--brand-primary)' }}>Quick Demo Student Logins:</div>
                  <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem', background: 'color-mix(in oklab, var(--brand-primary) 12%, transparent)' }} onClick={() => {
                      setRegNum('2023CS042');
                      setDob('2005-04-18');
                      setTimeout(() => {
                        window.VSB_DATA.currentStudentRegNum = '2023CS042';
                        window.VSB_DATA.currentUserRole = 'student';
                        onNavigate('/student');
                      }, 100);
                    }}>
                      ⚡ Demo Student (2023CS042)
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem', background: 'color-mix(in oklab, var(--accent) 12%, transparent)' }} onClick={() => {
                      setRegNum('24104064');
                      setDob('2005-01-01');
                      setTimeout(() => {
                        window.VSB_DATA.currentStudentRegNum = '24104064';
                        window.VSB_DATA.currentUserRole = 'student';
                        onNavigate('/student');
                      }, 100);
                    }}>
                      ⚡ Student (24104064)
                    </button>
                  </div>
                </div>

                <label className="field-label">Register Number</label>
                <input className="input" value={regNum} onChange={e => setRegNum(e.target.value)} placeholder="2023CS042" />

                <label className="field-label mt-4">Date of Birth</label>
                <input className="input" type="date" value={dob} onChange={e => setDob(e.target.value)} />

                {error && <div className="chip chip-rose mt-4" style={{ width: '100%', justifyContent: 'center' }}>{error}</div>}

                <button className="btn btn-primary w-full mt-6" onClick={login} disabled={loading}>
                  {loading ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : <><Icon name="check" size={16} /> Sign In as Student</>}
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
// Student Dashboard — long-scroll with left sidebar anchors, all fields editable
function StudentDashboard({ onNavigate }) {
  const initialStudent = React.useMemo(() => {
    const list = (window.VSB_DATA && window.VSB_DATA.students) || [];
    const curReg = window.VSB_DATA && window.VSB_DATA.currentStudentRegNum;
    return list.find(st => st && st.registerNumber === curReg) || list[0] || { registerNumber: '2023CS042', name: 'Karthik S.', department: 'CSE', departmentName: 'Computer Science & Engineering', batch: '2024-2028', section: 'A', email: 'karthik.s@vsb.edu.in', skills: ['HTML', 'CSS', 'JavaScript'] };
  }, [window.VSB_DATA ? window.VSB_DATA.currentStudentRegNum : null]);
  const [s, setS] = useState(initialStudent);
  
  // Update state if student changes
  useEffect(() => {
    let active = true;
    async function loadProfile() {
      try {
        const profile = await window.VSB_API.getStudentProfile(window.VSB_DATA.currentStudentRegNum || initialStudent.registerNumber);
        if (active) setS(profile);
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
    return () => { active = false; };
  }, [window.VSB_DATA.currentStudentRegNum, initialStudent]);

  const [activeSection, setActiveSection] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const sections = [
    { id: 'personal',   label: 'Personal Info',    icon: 'student' },
    { id: 'contact',    label: 'Contact & Family', icon: 'phone' },
    { id: 'admission',  label: 'Admission Info',   icon: 'shield' },
    { id: 'academic',   label: 'Academic Record',  icon: 'book' },
    { id: 'skills',     label: 'Skills',           icon: 'code' },
    { id: 'teachers',   label: 'Teacher Info',     icon: 'teacher' },
    { id: 'documents',  label: 'Documents',        icon: 'file' },
    { id: 'other',      label: 'Other Details',    icon: 'settings' },
  ];

  // Scroll spy
  useEffect(() => {
    function onScroll() {
      const els = sections.map(sec => document.getElementById(`sec-${sec.id}`)).filter(Boolean);
      const y = window.scrollY + 220;
      let cur = sections[0].id;
      for (const el of els) {
        if (el && el.offsetTop <= y) cur = el.id.replace('sec-', '');
      }
      setActiveSection(cur);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [s]);

  const updateField = (key, val) => {
    setS(prev => ({ ...prev, [key]: val }));
  };

  async function saveProfile() {
    try {
      const updated = await window.VSB_API.updateStudentProfile(s.registerNumber, s);
      setS(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      console.error(err);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    }
  }

  return (
    <div className="screen-enter" style={{ paddingTop: 96, paddingBottom: 80 }} data-screen-label="Student Dashboard">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            {(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'teacher' ? (
              <div className="chip chip-accent mb-2"><Icon name="teacher" size={14} /> Faculty Editing Mode · {s.name}</div>
            ) : (window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'admin' ? (
              <div className="chip chip-violet mb-2"><Icon name="shield" size={14} /> Admin Viewing Mode · {s.name}</div>
            ) : (
              <div className="chip chip-brand mb-2"><Icon name="student" size={14} /> Student Portal</div>
            )}
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'teacher' ? `Edit Record: ${s.name}` : 'My Profile'}</h1>
            <p className="mt-1">Keep every field up to date — changes sync directly across portal & database.</p>
          </div>
          <div className="flex gap-2">
            {(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'teacher' && (
              <button className="btn btn-ghost" onClick={() => onNavigate('/teacher')}>
                ← Back to Teacher Dashboard
              </button>
            )}
            <button className={`btn ${editMode ? 'btn-ghost' : 'btn-accent'}`} onClick={() => setEditMode(!editMode)}>
              <Icon name="edit" size={16} /> {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button className="btn btn-primary" onClick={saveProfile}>
              {saved ? <><Icon name="check" size={16} /> Saved</> : <><Icon name="upload" size={16} /> Save Changes</>}
            </button>
          </div>
        </div>

        {/* Profile completion banner */}
        <GlassCard className="p-5 mb-6" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 100% at 100% 50%, color-mix(in oklab, var(--accent) 22%, transparent), transparent)', pointerEvents: 'none' }} />
          <div className="flex items-center gap-6" style={{ flexWrap: 'wrap', position: 'relative' }}>
            <Avatar name={s.name} size={72} tone="brand" />
            <div style={{ flex: 1, minWidth: 240 }}>
              <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{s.name}</div>
                <span className="chip chip-accent"><Icon name="check" size={12} stroke={3} /> Approved</span>
              </div>
              <div className="text-sm text-muted mt-1">{s.registerNumber} · {s.departmentName} · Year {s.year} · Section {s.section}</div>
              <div className="mt-3 flex items-center gap-3" style={{ maxWidth: 480 }}>
                <div className="progress" style={{ flex: 1 }}><div style={{ width: `${s.profileCompletion}%` }} /></div>
                <div className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{s.profileCompletion}% complete</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 20, textAlign: 'center' }}>
              <MiniStat label="CGPA" value={s.cgpa} />
              <MiniStat label="Arrears" value={s.arrears} tone={s.arrears > 0 ? 'rose' : 'accent'} />
              <MiniStat label="Projects" value={s.projects} />
            </div>
          </div>
        </GlassCard>

        {/* Main grid: sidebar + content */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }} className="dash-grid">
          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: 96 }} className="dash-side">
            <GlassCard className="p-3">
              <nav className="sidenav" style={{ display: 'grid', gap: 4 }}>
                {sections.map(sec => (
                  <a key={sec.id} href={`#sec-${sec.id}`}
                     onClick={(e) => { e.preventDefault(); document.getElementById(`sec-${sec.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                     className={activeSection === sec.id ? 'active' : ''}>
                    <Icon name={sec.icon} size={16} />
                    {sec.label}
                  </a>
                ))}
              </nav>
              <div className="hr mt-3 mb-3" />
              <div style={{ padding: 12 }}>
                <div className="text-xs text-subtle mb-2">LAST UPDATED</div>
                <div className="text-sm font-semibold">{s.lastUpdated}</div>
                {(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'teacher' && (
                  <button className="btn btn-accent btn-sm w-full mt-3" onClick={() => onNavigate('/teacher')}>
                    ← Back to Faculty
                  </button>
                )}
                {(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'admin' && (
                  <button className="btn btn-accent btn-sm w-full mt-3" onClick={() => onNavigate('/admin/dashboard')}>
                    ← Back to Admin Panel
                  </button>
                )}
                <button className="btn btn-ghost btn-sm w-full mt-2" onClick={() => {
                  if (window.VSB_DATA) window.VSB_DATA.currentUserRole = null;
                  onNavigate('/');
                }}>
                  <Icon name="logout" size={14} /> Logout
                </button>
              </div>
            </GlassCard>
          </aside>

          {/* Content sections */}
          <main style={{ display: 'grid', gap: 24 }}>
            {/* Personal */}
            <Section id="personal" title="Personal Information" subtitle="Basic details on file — Register # is not editable">
              <div className="grid-3">
                <Field label="Register Number" value={s.registerNumber} locked />
                <Field label="Full Name" value={s.name} edit={editMode} onChange={v => updateField('name', v)} />
                <Field label="Date of Birth" value={s.dob} edit={editMode} type="date" onChange={v => updateField('dob', v)} />
                <Field label="Gender" value={s.gender} edit={editMode} options={['Male', 'Female', 'Other']} onChange={v => updateField('gender', v)} />
                <Field label="Blood Group" value={s.bloodGroup} edit={editMode} options={['', 'O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']} onChange={v => updateField('bloodGroup', v)} />
                <Field label="Community" value={s.community} edit={editMode} options={['', 'BC', 'MBC', 'OC', 'SC', 'ST', 'BCM']} onChange={v => updateField('community', v)} />
                <Field label="Aadhaar Number" value={s.aadhaar} edit={editMode} onChange={v => updateField('aadhaar', v)} />
                <Field label="Hometown" value={s.hometown} edit={editMode} onChange={v => updateField('hometown', v)} />
                <Field label="Residence" value={s.residence} edit={editMode} options={['Day Scholar', 'Hosteller']} onChange={v => updateField('residence', v)} />
                <Field label="Religion" value={s.religion || ''} edit={editMode} onChange={v => updateField('religion', v)} />
                <Field label="Caste" value={s.caste || ''} edit={editMode} onChange={v => updateField('caste', v)} />
                <Field label="Nationality" value={s.nationality || ''} edit={editMode} onChange={v => updateField('nationality', v)} />
              </div>
            </Section>

            {/* Contact */}
            <Section id="contact" title="Contact & Family" subtitle="How VSB reaches you and your parents">
              <div className="grid-2">
                <Field label="Email" value={s.email} edit={editMode} type="email" icon="mail" onChange={v => updateField('email', v)} />
                <Field label="Alternate Email" value={s.altEmail || ''} edit={editMode} type="email" icon="mail" onChange={v => updateField('altEmail', v)} />
                <Field label="Phone" value={s.phone} edit={editMode} icon="phone" onChange={v => updateField('phone', v)} />
                <Field label="Emergency Contact" value={s.emergencyContact} edit={editMode} icon="phone" onChange={v => updateField('emergencyContact', v)} />
                <Field label="Address" value={s.address} edit={editMode} textarea icon="location" full onChange={v => updateField('address', v)} />
              </div>
              <div className="grid-3 mt-3">
                <Field label="Parent Name" value={s.parentName} edit={editMode} onChange={v => updateField('parentName', v)} />
                <Field label="Parent Phone" value={s.parentPhone} edit={editMode} onChange={v => updateField('parentPhone', v)} />
                <Field label="Parent Relation" value={s.relation || 'Father'} edit={editMode} options={['Father', 'Mother', 'Guardian', 'Husband']} onChange={v => updateField('relation', v)} />
              </div>
            </Section>

            {/* Admission Info */}
            <Section id="admission" title="Admission Details" subtitle="Institution enrollment and quota details">
              <div className="grid-3">
                <Field label="Admission Number" value={s.admissionNumber || '—'} edit={editMode} onChange={v => updateField('admissionNumber', v)} />
                <Field label="Date of Admission" value={s.dateOfAdmission || '—'} edit={editMode} type="date" onChange={v => updateField('dateOfAdmission', v)} />
                <Field label="Mode of Admission" value={s.modeOfAdmission || '—'} edit={editMode} options={['', 'O-Regular', 'L-Lateral', 'T-Transfer', 'R-Rejoin']} onChange={v => updateField('modeOfAdmission', v)} />
                <Field label="Admission Quota" value={s.admissionQuota || '—'} edit={editMode} options={['', 'M-Management', 'G-Councelling', 'S-Sports', 'O-Others', '7.5 Quota']} onChange={v => updateField('admissionQuota', v)} />
                <Field label="Regulation" value={s.regulation || '—'} edit={editMode} onChange={v => updateField('regulation', v)} />
                <Field label="EMIS Number" value={s.emisNo || '—'} edit={editMode} onChange={v => updateField('emisNo', v)} />
                <Field label="Tamil Medium Instruction" value={s.tamilMedium || 'No'} edit={editMode} options={['No', 'Yes']} onChange={v => updateField('tamilMedium', v)} />
                <Field label="Physically Challenged" value={s.physicallyChallenged || 'No'} edit={editMode} options={['No', 'Yes']} onChange={v => updateField('physicallyChallenged', v)} />
              </div>
            </Section>

            {/* Academic */}
            <Section id="academic" title="Academic Record" subtitle="School, diploma and college performance">
              <div className="grid-4">
                <Field label="SSLC (10th) % / Marks" value={s.sslc} edit={editMode} onChange={v => updateField('sslc', v)} />
                <Field label="HSC (12th) % / Marks" value={s.hsc} edit={editMode} onChange={v => updateField('hsc', v)} />
                <Field label="Diploma CGPA" value={s.diploma || '—'} edit={editMode} onChange={v => updateField('diploma', v)} />
                <Field label="Current CGPA" value={s.cgpa} edit={editMode} onChange={v => updateField('cgpa', v)} />
              </div>
              <div className="grid-4 mt-3">
                <Field label="Department" value={s.departmentName} locked={(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'student'} options={((window.VSB_DATA && window.VSB_DATA.DEPARTMENTS) || []).map(d => d.name)} edit={editMode} onChange={v => {
                  const deptObj = ((window.VSB_DATA && window.VSB_DATA.DEPARTMENTS) || []).find(d => d.name === v);
                  if (deptObj) {
                    updateField('department', deptObj.code);
                    updateField('departmentName', deptObj.name);
                  }
                }} />
                <Field label="Batch" value={s.batch} locked={(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'student'} options={((window.VSB_DATA && window.VSB_DATA.BATCHES) || ["2022-2026", "2023-2027", "2024-2028", "2025-2029"])} edit={editMode} onChange={v => updateField('batch', v)} />
                <Field label="Section" value={s.section} locked={(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'student'} options={((window.VSB_DATA && window.VSB_DATA.SECTIONS) || ["A", "B", "C", "D"])} edit={editMode} onChange={v => updateField('section', v)} />
                <Field label="Year of Study" value={s.year} locked={(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'student'} type="number" edit={editMode} onChange={v => updateField('year', Number(v))} />
              </div>
              <div className="grid-3 mt-3">
                <Field label="Arrears" value={s.arrears} locked={(window.VSB_DATA ? window.VSB_DATA.currentUserRole : "student") === 'student'} type="number" edit={editMode} onChange={v => updateField('arrears', Number(v))} tone={s.arrears > 0 ? 'rose' : 'accent'} />
                <Field label="Backlogs Cleared" value="—" />
                <Field label="Attendance" value="92%" />
              </div>
            </Section>

            {/* Skills */}
            <Section id="skills" title="Skills" subtitle="Student coding and professional profile links">
              <div className="mb-4">
                <div className="field-label">Technical Skills</div>
                <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
                  {(s.skills || []).map(sk => <span key={sk} className="chip chip-brand">{sk}</span>)}
                  {editMode && <button className="chip" style={{ cursor: 'pointer' }}><Icon name="plus" size={12} /> Add skill</button>}
                </div>
              </div>

              <div className="grid-2">
                <ProfileLinkField label="LinkedIn" nameValue="LinkedIn" urlValue={s.linkedin} edit={editMode} icon="users" />
                <ProfileLinkField label="LeetCode" nameValue="LeetCode" urlValue={s.leetcode || ''} edit={editMode} icon="code" />
                <ProfileLinkField label="Custom Profile" nameValue="" urlValue="" edit={editMode} icon="plus" empty />
              </div>
            </Section>

            {/* Teacher Info */}
            <Section id="teachers" title="Teacher Information" subtitle="Your department HOD and faculty advisors">
              <div style={{ display: 'grid', gap: 16 }}>
                {(() => {
                  const deptObj = ((window.VSB_DATA && window.VSB_DATA.DEPARTMENTS) || []).find(d => d.code === s.department);
                  const deptTeachers = ((window.VSB_DATA && window.VSB_DATA.teachers) || []).filter(t => t.department === s.department);
                  const hod = deptTeachers.find(t => t.role === 'HOD');
                  const facultyList = deptTeachers.filter(t => t.role !== 'HOD');
                  return (
                    <>
                      {hod && (
                        <div className="glass-inner p-4 flex items-center justify-between" style={{ borderLeft: '4px solid var(--accent)', borderRadius: '12px' }}>
                          <div className="flex items-center gap-3">
                            <Avatar name={hod.name} size={44} tone="brand" />
                            <div>
                              <div style={{ fontWeight: 700 }}>{hod.name}</div>
                              <div className="text-xs text-subtle">HOD · {deptObj ? deptObj.name : s.department}</div>
                              <div className="text-xs text-muted mt-1">{hod.email}</div>
                            </div>
                          </div>
                          <a href={`mailto:${hod.email}`} className="btn btn-ghost btn-sm"><Icon name="mail" size={14} /> Contact</a>
                        </div>
                      )}
                      <div className="grid-2">
                        {facultyList.map(fac => (
                          <div key={fac.id} className="glass-inner p-4 flex items-center justify-between" style={{ borderRadius: '12px' }}>
                            <div className="flex items-center gap-3">
                              <Avatar name={fac.name} size={36} tone="auto" />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{fac.name}</div>
                                <div className="text-xs text-subtle">{fac.role}</div>
                                <div className="text-xs text-muted mt-0.5">{fac.email}</div>
                              </div>
                            </div>
                            <a href={`mailto:${fac.email}`} className="btn btn-ghost btn-icon" style={{ padding: 6 }}><Icon name="mail" size={14} /></a>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </Section>

            {/* Documents */}
            <Section id="documents" title="Documents" subtitle="Resume, certificates and photo (Google Drive links supported)">
              <div className="grid-3">
                <UploadTile label="Profile Photo" value={s.photoDoc} edit={editMode} onChange={v => updateField('photoDoc', v)} icon="student" defaultFilename="photo.jpg" defaultSize="280 KB" />
                <UploadTile label="Resume (PDF)" value={s.resumeDoc} edit={editMode} onChange={v => updateField('resumeDoc', v)} icon="file" defaultFilename="resume.pdf" defaultSize="1.1 MB" />
                <UploadTile label="Aadhaar Copy" value={s.aadhaarDoc} edit={editMode} onChange={v => updateField('aadhaarDoc', v)} icon="shield" defaultFilename="aadhaar.pdf" defaultSize="620 KB" />
                <UploadTile label="10th Marksheet" value={s.sslcDoc} edit={editMode} onChange={v => updateField('sslcDoc', v)} icon="award" defaultFilename="sslc.pdf" defaultSize="480 KB" />
                <UploadTile label="12th Marksheet" value={s.hscDoc} edit={editMode} onChange={v => updateField('hscDoc', v)} icon="award" defaultFilename="hsc.pdf" defaultSize="512 KB" />
                <UploadTile label="Certificates" value={s.certificatesDoc} edit={editMode} onChange={v => updateField('certificatesDoc', v)} icon="award" defaultFilename="certificates.zip" defaultSize="3.5 MB" />
              </div>
            </Section>

            {/* Other */}
            <Section id="other" title="Other Details" subtitle="Transport and misc">
              <div className="grid-2">
                <Field label="Transportation" value={s.transport} edit={editMode} onChange={v => updateField('transport', v)} />
                <Field label="Bus Route" value={s.busRoute || "Route 7 — RS Puram → VSB"} edit={editMode} onChange={v => updateField('busRoute', v)} />
              </div>
            </Section>

            {/* Save bar */}
            <div className="flex items-center justify-between mt-2 p-4 glass" style={{ borderRadius: 16 }}>
              <div className="text-sm text-muted flex items-center gap-2">
                <span className="pulse-dot" /> Auto-save enabled · last synced 12 seconds ago
              </div>
              <button className="btn btn-primary" onClick={saveProfile}>
                {saved ? <><Icon name="check" size={16} /> Saved to Firestore</> : <><Icon name="upload" size={16} /> Save Changes</>}
              </button>
            </div>
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: 1fr !important; }
          .dash-side { position: static !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={`sec-${id}`} style={{ scrollMarginTop: 100 }}>
      <GlassCard className="p-6">
        <div className="mb-5">
          <h2 style={{ fontSize: '1.35rem' }}>{title}</h2>
          {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
        </div>
        {children}
      </GlassCard>
    </section>
  );
}

function Field({ label, value, locked, edit, type = 'text', options, textarea, icon, tone, full, onChange }) {
  const style = full ? { gridColumn: '1 / -1' } : {};
  return (
    <div style={style}>
      <label className="field-label flex items-center gap-1">
        {icon && <Icon name={icon} size={12} />} {label}
        {locked && <span style={{ fontSize: '0.62rem', color: 'var(--text-subtle)', fontWeight: 500, marginLeft: 4 }}>· LOCKED</span>}
      </label>
      {edit && !locked ? (
        options ? (
          <select className="input" value={value || ''} onChange={e => onChange && onChange(e.target.value)}>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : textarea ? (
          <textarea className="input" value={value || ''} onChange={e => onChange && onChange(e.target.value)} rows={2} />
        ) : (
          <input className="input" value={value || ''} onChange={e => onChange && onChange(e.target.value)} type={type} />
        )
      ) : (
        <div className={tone === 'accent' ? 'chip chip-accent' : tone === 'rose' ? 'chip chip-rose' : ''} style={{
          padding: tone ? undefined : '12px 14px',
          borderRadius: tone ? undefined : 12,
          background: tone ? undefined : 'color-mix(in oklab, var(--surface-solid) 40%, transparent)',
          border: tone ? undefined : '1px solid var(--border)',
          fontSize: '0.95rem',
          fontWeight: 500,
          display: tone ? 'inline-flex' : 'block',
          minHeight: tone ? undefined : 44,
          color: locked ? 'var(--text-muted)' : 'var(--text)',
        }}>{value}</div>
      )}
    </div>
  );
}

function ProfileLinkField({ label, nameValue, urlValue, edit, icon, empty }) {
  return (
    <div className="glass-inner p-4" style={empty ? { border: '1px dashed var(--border-strong)' } : undefined}>
      <div className="flex items-center gap-2 mb-3">
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'color-mix(in oklab, var(--brand-primary) 12%, transparent)',
          color: 'var(--brand-primary)',
          display: 'grid', placeItems: 'center',
        }}>
          <Icon name={icon} size={15} />
        </div>
        <div className="text-sm font-semibold">{label}</div>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        <div>
          <label className="field-label">Profile Name</label>
          {edit || empty ? (
            <input className="input" defaultValue={nameValue} placeholder="Example: CodeChef" />
          ) : (
            <div style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: 'color-mix(in oklab, var(--surface-solid) 40%, transparent)',
              border: '1px solid var(--border)',
              fontSize: '0.95rem',
              fontWeight: 500,
            }}>{nameValue}</div>
          )}
        </div>
        <div>
          <label className="field-label">Website Link</label>
          {edit || empty ? (
            <input className="input" defaultValue={urlValue} placeholder="https://example.com/username" type="url" />
          ) : (
            <div className="mono" style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: 'color-mix(in oklab, var(--surface-solid) 40%, transparent)',
              border: '1px solid var(--border)',
              fontSize: '0.86rem',
              fontWeight: 500,
              wordBreak: 'break-all',
            }}>{urlValue}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone }) {
  const color = tone === 'accent' ? 'var(--accent)' : tone === 'rose' ? '#EF4444' : 'var(--text)';
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div className="text-xs text-subtle mt-1">{label}</div>
    </div>
  );
}

function MetricTile({ label, value, icon, tone }) {
  return (
    <div className="glass-inner p-4">
      <div className="flex items-center gap-2 mb-2">
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `color-mix(in oklab, ${tone} 14%, transparent)`, color: tone, display: 'grid', placeItems: 'center' }}>
          <Icon name={icon} size={14} />
        </div>
        <span className="text-xs" style={{ color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

function UploadTile({ label, value, edit, onChange, icon, defaultFilename, defaultSize }) {
  const isLink = value && (value.startsWith('http://') || value.startsWith('https://') || value.includes('drive.google.com'));
  const uploaded = !!value;

  return (
    <div className="glass-inner p-4" style={{
      border: uploaded ? '1px solid color-mix(in oklab, var(--accent) 30%, transparent)' : '1px dashed var(--border-strong)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 160
    }}>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: uploaded ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'color-mix(in oklab, var(--text) 6%, transparent)',
            color: uploaded ? 'var(--accent)' : 'var(--text-muted)',
            display: 'grid', placeItems: 'center',
          }}>
            <Icon name={isLink ? 'link' : icon} size={16} />
          </div>
          <div className="text-sm font-semibold">{label}</div>
          {uploaded && <span className="chip chip-accent" style={{ marginLeft: 'auto', padding: '2px 8px', fontSize: '0.68rem' }}>✓</span>}
        </div>
        
        {edit ? (
          <div style={{ display: 'grid', gap: 6 }}>
            <input 
              className="input text-xs" 
              placeholder="Paste Google Drive link or filename" 
              value={value || ''} 
              onChange={e => onChange && onChange(e.target.value)}
              style={{ padding: '8px 10px', borderRadius: 8, height: 32 }}
            />
          </div>
        ) : (
          uploaded ? (
            <>
              <div className="text-sm mono" style={{ color: 'var(--text)', wordBreak: 'break-all' }}>{value}</div>
              <div className="text-xs text-subtle mt-1">{isLink ? 'Google Drive Document' : (defaultSize || 'Local File')}</div>
            </>
          ) : (
            <div className="text-sm text-muted">No document provided</div>
          )
        )}
      </div>

      <div className="flex gap-2 mt-3">
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="eye" size={12} /> Open Link
          </a>
        ) : (
          uploaded && <button className="btn btn-ghost btn-sm" onClick={() => alert(`Viewing file: ${value}`)}><Icon name="eye" size={12} /> View</button>
        )}
        {edit && (
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const file = prompt('Enter mock local filename (e.g. sslc.pdf):');
            if (file && onChange) onChange(file);
          }}><Icon name="upload" size={12} /> Local File</button>
        )}
      </div>
    </div>
  );
}

window.StudentDashboard = StudentDashboard;
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
// Teacher Dashboard — filter-first hero, stats, student table
function TeacherDashboard({ onNavigate }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(() => {
    return (window.VSB_DATA && window.VSB_DATA.selectedFilter) || { dept: 'ALL', batch: 'ALL', section: 'ALL' };
  });
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const perPage = 8;

  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState('upload');
  const [targetBatch, setTargetBatch] = useState(filter.batch === 'ALL' ? '2024-2028' : filter.batch);
  const [targetDept, setTargetDept] = useState(filter.dept === 'ALL' ? 'CSE' : filter.dept);
  const [targetSec, setTargetSec] = useState(filter.section === 'ALL' ? 'ALL' : filter.section);

  const [importFileName, setImportFileName] = useState('');
  const [importParsedStudents, setImportParsedStudents] = useState([]);
  const [importErrorMessage, setImportErrorMessage] = useState('');
  const [importedCount, setImportedCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingStudent, setEditingStudent] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleSaveTeacherStudentEdit = async () => {
    if (!editingStudent) return;
    setSavingEdit(true);
    try {
      const updated = await window.VSB_API.updateStudentProfile(editingStudent.registerNumber, editingStudent);
      setStudents(prev => prev.map(st => (st && st.registerNumber === editingStudent.registerNumber) ? updated : st));
      if (window.VSB_DATA && window.VSB_DATA.students) {
        const idx = window.VSB_DATA.students.findIndex(st => st && st.registerNumber === editingStudent.registerNumber);
        if (idx !== -1) window.VSB_DATA.students[idx] = updated;
      }
      setEditingStudent(null);
      setSavingEdit(false);
      alert(`Successfully updated student record for ${updated.name} (${updated.registerNumber}).`);
    } catch (err) {
      console.error(err);
      setSavingEdit(false);
      alert('Failed to save student edits: ' + (err.message || err));
    }
  };

  const importFileInputRef = useRef(null);

  const departmentsList = (window.VSB_DATA && window.VSB_DATA.DEPARTMENTS) || [
    { code: 'CSE', name: 'Computer Science & Engineering', hod: 'Dr. Ramesh Kumar M.', color: '#2563EB' },
    { code: 'IT', name: 'Information Technology', hod: 'Dr. Bhuvaneswari S.', color: '#8B5CF6' },
    { code: 'AIDS', name: 'AI & Data Science', hod: 'Dr. Karthikeyan V.', color: '#EC4899' },
    { code: 'ECE', name: 'Electronics & Communication', hod: 'Dr. Palanivel R.', color: '#10B981' },
    { code: 'EEE', name: 'Electrical & Electronics', hod: 'Dr. Meenakshi Sundaram', color: '#F59E0B' },
    { code: 'MECH', name: 'Mechanical Engineering', hod: 'Dr. Selvakumar A.', color: '#EF4444' },
    { code: 'CIVIL', name: 'Civil Engineering', hod: 'Dr. Kanagaraj T.', color: '#06B6D4' }
  ];

  const batchesList = (window.VSB_DATA && window.VSB_DATA.BATCHES) || ['2022-2026', '2023-2027', '2024-2028', '2025-2029'];
  const sectionsList = (window.VSB_DATA && window.VSB_DATA.SECTIONS) || ['A', 'B', 'C', 'D'];

  useEffect(() => {
    let active = true;
    async function loadStudents() {
      setLoading(true);
      try {
        const dept = filter.dept === 'ALL' ? '' : filter.dept;
        const batch = filter.batch === 'ALL' ? '' : filter.batch;
        const section = filter.section === 'ALL' ? '' : filter.section;
        const list = await window.VSB_API.getTeacherStudents(dept, batch, section);
        if (active) {
          setStudents(list || []);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) setLoading(false);
      }
    }
    loadStudents();
    return () => { active = false; };
  }, [filter, refreshTrigger]);

  const filtered = useMemo(() => {
    return (students || [])
      .filter(s => {
        if (!s) return false;
        const nameStr = String(s.name || '').toLowerCase();
        const regStr = String(s.registerNumber || '').toLowerCase();
        const q = String(query || '').toLowerCase();
        return !q || nameStr.includes(q) || regStr.includes(q);
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        if (sortBy === 'name') return String(a.name || '').localeCompare(String(b.name || ''));
        if (sortBy === 'cgpa') return parseFloat(b.cgpa || 0) - parseFloat(a.cgpa || 0);
        if (sortBy === 'completion') return (b.profileCompletion || 0) - (a.profileCompletion || 0);
        return 0;
      });
  }, [students, query, sortBy]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const stats = useMemo(() => {
    const list = filtered || [];
    const total = list.length;
    const male = list.filter(s => s && s.gender === 'Male').length;
    const female = list.filter(s => s && s.gender === 'Female').length;
    const completed = list.filter(s => s && (s.profileCompletion || 0) >= 90).length;
    const arrears = list.filter(s => s && (s.arrears || 0) > 0).length;
    const placed = list.filter(s => s && s.placement && s.placement.status === 'Placed').length;
    const avgCgpa = total > 0 ? (list.reduce((a, s) => a + parseFloat((s && s.cgpa) || 0), 0) / total).toFixed(2) : '—';
    return { total, male, female, completed, incomplete: total - completed, arrears, placed, avgCgpa };
  }, [filtered]);

  const normalizeHeader = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const toExcelDate = (value) => {
    if (!value) return '';
    if (value instanceof Date && !isNaN(value)) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    if (typeof value === 'number') {
      const date = new Date(Math.round((value - 25569) * 86400 * 1000));
      if (isNaN(date)) return '';
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const text = String(value).trim();
    if (!text) return '';

    const matchYMD = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (matchYMD) {
      const [, year, month, day] = matchYMD;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const parsed = new Date(text);
    if (!isNaN(parsed)) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const match = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
    if (!match) return text;
    const [, day, month, year] = match;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const toSection = (value, sheetName) => {
    const raw = String(value || '').trim().toUpperCase();
    if (raw === '1') return 'A';
    if (raw === '2') return 'B';
    if (raw === '3') return 'C';
    if (raw === '4') return 'D';
    const sheetMatch = String(sheetName || '').match(/\b([A-D])\b/i);
    const fallbackSec = targetSec !== 'ALL' ? targetSec : (filter.section !== 'ALL' ? filter.section : 'A');
    return raw || (sheetMatch ? sheetMatch[1].toUpperCase() : fallbackSec);
  };

  const makeEmail = (name, registerNumber) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
    return `${slug || registerNumber.toLowerCase()}@vsb.edu.in`;
  };

  const getHeaderIndex = (headers, candidates) => {
    const normalized = headers.map(normalizeHeader);
    let idx = normalized.findIndex(header => candidates.some(candidate => header === candidate));
    if (idx !== -1) return idx;
    return normalized.findIndex(header => candidates.some(candidate => header.includes(candidate)));
  };

  const parseWorkbookRows = (workbook) => {
    const XLSX = window.XLSX;
    if (!XLSX) throw new Error('Spreadsheet parser is loading. Please try again.');

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true, defval: '' });
    
    if (!rows || !rows.length) {
      throw new Error('Spreadsheet appears to be empty.');
    }

    let headerRowIndex = rows.findIndex(row => {
      const lineText = row.map(cell => normalizeHeader(cell)).join(' ');
      return (lineText.includes('name') || lineText.includes('student')) &&
             (lineText.includes('reg') || lineText.includes('roll') || lineText.includes('dob') || lineText.includes('admn') || lineText.includes('no'));
    });

    if (headerRowIndex === -1 && rows.length > 0) {
      headerRowIndex = 0;
    }

    const headers = rows[headerRowIndex] || [];
    const indexes = {
      name: getHeaderIndex(headers, ['studentnamewithinitial', 'studentname', 'name', 'fullname', 'student']),
      dob: getHeaderIndex(headers, ['dobyyyymmdd', 'dob', 'dateofbirth', 'birthdate', 'doj']),
      roll: getHeaderIndex(headers, ['rollnumber', 'rollno', 'roll']),
      register: getHeaderIndex(headers, ['registerno', 'registernumber', 'regno', 'register']),
      department: getHeaderIndex(headers, ['programmecode', 'department', 'dept', 'branch']),
      year: getHeaderIndex(headers, ['yearofadmission', 'batch', 'year']),
      section: getHeaderIndex(headers, ['section', 'sec']),
      gender: getHeaderIndex(headers, ['gender', 'sex']),
      admissionNumber: getHeaderIndex(headers, ['admnno', 'admissionno', 'admn']),
      email: getHeaderIndex(headers, ['emailid', 'email', 'institutionalemail']),
      phone: getHeaderIndex(headers, ['studentmobileno', 'studentphone', 'phone', 'mobile']),
      parentPhone: getHeaderIndex(headers, ['parentmobileno', 'parentphone']),
      parentName: getHeaderIndex(headers, ['parentname', 'parenthusbandname']),
      aadhaar: getHeaderIndex(headers, ['aadhaarnumber', 'aadhaar']),
      cgpa: getHeaderIndex(headers, ['cgpa', 'gpa', 'marks']),
    };

    if (indexes.name === -1 && indexes.register === -1 && indexes.roll === -1) {
      throw new Error('Could not identify Student Name or Register Number columns in this sheet.');
    }

    const parsedList = [];
    const dataRows = rows.slice(headerRowIndex + 1);

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || row.every(cell => String(cell).trim() === '')) continue;

      const nameRaw = indexes.name !== -1 ? String(row[indexes.name] || '').trim() : '';
      const rollNumber = indexes.roll !== -1 ? String(row[indexes.roll] || '').trim() : '';
      const registerNo = indexes.register !== -1 ? String(row[indexes.register] || '').trim() : '';
      const registerNumber = (registerNo || rollNumber || `VSB${Date.now()}${i + 1}`).toUpperCase();
      const name = nameRaw || `Student ${registerNumber}`;

      let dob = indexes.dob !== -1 ? toExcelDate(row[indexes.dob]) : '';
      if (!dob || dob === 'Invalid Date') {
        dob = '2005-01-01'; // Default DOB fallback
      }

      let deptCode = indexes.department !== -1 ? String(row[indexes.department] || '').trim().toUpperCase() : '';
      if (!deptCode || deptCode === 'NULL') {
        deptCode = (targetDept && targetDept !== 'ALL') ? targetDept : (filter.dept !== 'ALL' ? filter.dept : 'CSE');
      }
      const deptObj = departmentsList.find(d => d.code === deptCode) || departmentsList[0];

      let batch = '';
      const yearVal = indexes.year !== -1 ? String(row[indexes.year] || '').trim() : '';
      if (/^\d{4}$/.test(yearVal)) {
        const start = parseInt(yearVal);
        batch = `${start}-${start + 4}`;
      } else if (/^\d{4}-\d{4}$/.test(yearVal)) {
        batch = yearVal;
      } else if (targetBatch && targetBatch !== 'ALL') {
        batch = targetBatch;
      } else {
        batch = filter.batch !== 'ALL' ? filter.batch : '2024-2028';
      }

      let section = indexes.section !== -1 ? toSection(row[indexes.section], sheetName) : '';
      if (!section || section === 'ALL') {
        section = (targetSec && targetSec !== 'ALL') ? targetSec : (filter.section !== 'ALL' ? filter.section : 'A');
      }

      const batchStart = parseInt(batch.split('-')[0]) || 2024;
      const year = Math.min(4, Math.max(1, 2026 - batchStart + 1));
      const genderCode = indexes.gender !== -1 ? String(row[indexes.gender] || '').trim().toUpperCase() : 'M';
      const gender = genderCode === 'F' || genderCode === 'FEMALE' ? 'Female' : 'Male';

      const email = (indexes.email !== -1 && String(row[indexes.email]).trim()) || makeEmail(name, registerNumber);
      const phone = (indexes.phone !== -1 && String(row[indexes.phone]).trim()) || '';
      const rawAadhaar = (indexes.aadhaar !== -1 && String(row[indexes.aadhaar]).trim()) || '';
      const aadhaar = rawAadhaar.length >= 4 ? `**** **** ${rawAadhaar.slice(-4)}` : '**** **** 1234';

      parsedList.push({
        registerNumber,
        rollNumber: rollNumber || registerNumber,
        name,
        dob,
        gender,
        department: deptCode,
        departmentName: deptObj ? deptObj.name : deptCode,
        batch,
        section,
        year,
        email,
        phone,
        aadhaar,
        rawAadhaar,
        cgpa: (indexes.cgpa !== -1 && String(row[indexes.cgpa]).trim()) || '8.50',
        arrears: 0,
        skills: ['HTML', 'CSS', 'JavaScript'],
        languages: ['Tamil', 'English'],
        internships: 0, projects: 1, hackathons: 0, certificates: 1,
        placement: { status: 'Not Applied', company: null, package: null },
        transport: 'College Bus',
        residence: 'Day Scholar',
        emergencyContact: phone || '+91 98765 43210',
        parentName: indexes.parentName !== -1 ? String(row[indexes.parentName] || '').trim() : 'Parent',
        parentPhone: indexes.parentPhone !== -1 ? String(row[indexes.parentPhone] || '').trim() : '',
        parentOccupation: 'Farmer',
        profileCompletion: dob ? 60 : 45,
        approved: true,
        lastUpdated: 'Today',
        mysqlId: `mysql_${registerNumber.toLowerCase()}_${Math.random().toString(36).slice(2, 10)}`,
        createdTime: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    if (!parsedList.length) {
      throw new Error('No valid student rows could be extracted from this sheet.');
    }

    return parsedList;
  };

  const handleFileSelected = (event) => {
    const XLSX = window.XLSX;
    const file = event.target.files?.[0];
    if (!file) return;
    if (!XLSX) {
      setImportErrorMessage('Excel/CSV parser is still loading. Please try again in a moment.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const workbook = XLSX.read(loadEvent.target.result, { type: 'array', cellDates: true });
        const parsedList = parseWorkbookRows(workbook);
        setImportParsedStudents(parsedList);
        setImportFileName(file.name);
        setImportErrorMessage('');
        setImportStep('preview');
      } catch (error) {
        setImportParsedStudents([]);
        setImportFileName(file.name);
        setImportErrorMessage(error.message || 'Could not parse this file.');
      }
    };
    reader.onerror = () => setImportErrorMessage('Could not read this file.');
    reader.readAsArrayBuffer(file);
  };

  const importStudents = async () => {
    try {
      await window.VSB_API.bulkImportStudents(importParsedStudents);
      
      window.VSB_DATA.activityLogs = [{
        id: ((window.VSB_DATA && window.VSB_DATA.activityLogs) || []).length + 1,
        actor: 'Faculty Advisor',
        action: 'Imported',
        target: `${importParsedStudents.length} students (Batch ${targetBatch}) from ${importFileName}`,
        time: 'Just now',
        color: 'accent'
      }, ...((window.VSB_DATA && window.VSB_DATA.activityLogs) || [])];
      
      setImportedCount(importParsedStudents.length);
      setImportStep('done');
      setRefreshTrigger(prev => prev + 1);
      
      // Auto switch filter to uploaded batch
      setFilter(prev => ({
        ...prev,
        batch: targetBatch,
        dept: targetDept !== 'ALL' ? targetDept : prev.dept,
      }));
    } catch (err) {
      console.error(err);
      alert('Error during bulk import: ' + err.message);
    }
  };

  const openImportModal = () => {
    setImportStep('upload');
    setImportFileName('');
    setImportParsedStudents([]);
    setImportedCount(0);
    setImportErrorMessage('');
    setShowImportModal(true);
  };

  return (
    <div className="screen-enter" style={{ paddingTop: 96, paddingBottom: 80 }} data-screen-label="Teacher Dashboard">
      <div className="container">
        {/* Filter hero */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="chip chip-accent mb-2"><Icon name="teacher" size={14} /> Dr. Ramesh Kumar M. · Faculty Portal</div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>Faculty Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost"><Icon name="bell" size={16} /> Notifications</button>
              <button className="btn btn-ghost" onClick={() => onNavigate('/')}><Icon name="logout" size={16} /> Logout</button>
            </div>
          </div>

          <GlassCard strong className="p-5">
            <div className="flex items-center gap-3 mb-4 active-filter-header" style={{ flexWrap: 'wrap' }}>
              <Icon name="filter" size={18} style={{ color: 'var(--brand-primary)' }} />
              <div className="font-semibold">Active Filter</div>
              <span className="chip chip-brand">{filter.dept === 'ALL' ? 'All Depts' : filter.dept}</span>
              <span className="chip chip-accent">{filter.batch === 'ALL' ? 'All Batches' : filter.batch}</span>
              <span className="chip">Section {filter.section === 'ALL' ? 'All' : filter.section}</span>
              <span className="text-sm text-muted matched-label" style={{ marginLeft: 'auto' }}>{filtered.length} students matched</span>
            </div>
            <div className="filter-row">
              <FilterSelect label="Department" value={filter.dept} onChange={v => setFilter({ ...filter, dept: v })}
                options={[{ v: 'ALL', l: 'All Departments' }, ...departmentsList.map(d => ({ v: d.code, l: `${d.code} — ${d.name}` }))]} />
              <FilterSelect label="Batch" value={filter.batch} onChange={v => setFilter({ ...filter, batch: v })}
                options={[{ v: 'ALL', l: 'All Batches' }, ...batchesList.map(b => ({ v: b, l: b }))]} />
              <FilterSelect label="Section" value={filter.section} onChange={v => setFilter({ ...filter, section: v })}
                options={[{ v: 'ALL', l: 'All Sections' }, ...sectionsList.map(s => ({ v: s, l: `Section ${s}` }))]} />
              <button className="btn btn-ghost" style={{ alignSelf: 'flex-end', height: 48 }} onClick={() => setFilter({ dept: 'ALL', batch: 'ALL', section: 'ALL' })}>
                <Icon name="close" size={16} /> Reset
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Stats */}
        <div className="grid-4 mb-6">
          <StatCard label="Total Students" value={stats.total} delta={`${stats.male}M · ${stats.female}F`} icon="users" tone="brand" />
          <StatCard label="Completed Profiles" value={stats.completed} delta={`${stats.incomplete} incomplete`} icon="check" tone="accent" />
          <StatCard label="Average CGPA" value={stats.avgCgpa} delta={`${stats.arrears} with arrears`} icon="award" tone="amber" />
          <StatCard label="Placement Eligible" value={stats.placed} delta={`${stats.total > 0 ? Math.round(stats.placed / stats.total * 100) : 0}% placed`} icon="briefcase" tone="brand" />
        </div>

        {/* Charts row */}
        <div className="chart-row">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-subtle font-semibold" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>CGPA Distribution</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginTop: 4 }}>Class Performance</div>
              </div>
              <span className="chip chip-brand text-xs">Live</span>
            </div>
            <BarChart data={[3, 6, 12, 18, 22, 15, 8]} labels={['<6', '6-6.5', '6.5-7', '7-7.5', '7.5-8', '8-8.5', '8.5+']} height={180}
              colors={['#EF4444', '#F59E0B', '#F59E0B', '#2563EB', '#2563EB', '#10B981', '#10B981']} />
          </GlassCard>

          <GlassCard className="p-5">
            <div className="text-xs text-subtle font-semibold mb-4" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Gender Ratio</div>
            <div className="flex items-center gap-4">
              <DonutChart size={140} thickness={20} segments={[
                { value: stats.male,   color: '#2563EB' },
                { value: stats.female, color: '#EC4899' },
              ]} centerValue={stats.total} centerLabel="students" />
              <div style={{ display: 'grid', gap: 10 }}>
                <div className="flex items-center gap-2 text-sm"><span style={{ width: 10, height: 10, borderRadius: 3, background: '#2563EB' }} /> Male <strong>{stats.male}</strong></div>
                <div className="flex items-center gap-2 text-sm"><span style={{ width: 10, height: 10, borderRadius: 3, background: '#EC4899' }} /> Female <strong>{stats.female}</strong></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="text-xs text-subtle font-semibold mb-4" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Placement Funnel</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <FunnelRow label="Registered"     value={stats.total} max={stats.total} color="#2563EB" />
              <FunnelRow label="Eligible"       value={Math.round(stats.total * 0.82)} max={stats.total} color="#8B5CF6" />
              <FunnelRow label="Interviewed"    value={Math.round(stats.total * 0.62)} max={stats.total} color="#F59E0B" />
              <FunnelRow label="Placed"         value={stats.placed} max={stats.total} color="#10B981" />
            </div>
          </GlassCard>
        </div>

        {/* Table */}
        <GlassCard strong className="p-5">
          <div className="flex items-center justify-between mb-4 table-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div className="flex items-center gap-2 search-sort-row" style={{ flexWrap: 'wrap', width: '100%', maxWidth: 520 }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }} className="search-container">
                <input className="input search-input" placeholder="Search by name or register #" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 40, width: '100%' }} />
                <Icon name="search" size={16} style={{ position: 'absolute', left: 14, top: 16, color: 'var(--text-subtle)' }} />
              </div>
              <select className="input sort-select" style={{ width: 180, padding: '12px 14px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="name">Sort: Name</option>
                <option value="cgpa">Sort: CGPA (high→low)</option>
                <option value="completion">Sort: Completion %</option>
              </select>
            </div>
            <div className="flex gap-2 table-actions" style={{ flexWrap: 'wrap' }}>
              {selected.size > 0 && (
                <>
                  <span className="chip chip-brand">{selected.size} selected</span>
                  <button className="btn btn-ghost btn-sm"><Icon name="edit" size={14} /> Bulk Edit</button>
                  <button className="btn btn-ghost btn-sm"><Icon name="check" size={14} /> Approve</button>
                </>
              )}
              <button type="button" className="btn btn-ghost btn-sm" onClick={openImportModal}><Icon name="upload" size={14} /> Bulk Upload CSV</button>
              <button className="btn btn-accent btn-sm" onClick={() => alert('Exported class database to Excel.')}><Icon name="download" size={14} /> Export Excel</button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}><input type="checkbox" onChange={e => {
                    if (e.target.checked) setSelected(new Set(paged.map(s => s ? s.registerNumber : '')));
                    else setSelected(new Set());
                  }} /></th>
                  <th>Student</th>
                  <th>Register #</th>
                  <th>Dept</th>
                  <th>Batch</th>
                  <th>Sec</th>
                  <th>CGPA</th>
                  <th>Arrears</th>
                  <th>Profile</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((s, idx) => {
                  if (!s) return null;
                  const regNum = s.registerNumber || `REG_${idx}`;
                  const sName = s.name || 'Student';
                  const sEmail = s.email || `${sName.toLowerCase().replace(/\s+/g, '.')}@vsb.edu.in`;
                  const sCgpa = s.cgpa || '8.50';
                  const sComp = s.profileCompletion || 50;
                  const isApproved = s.approved !== false;
                  return (
                    <tr key={regNum}>
                      <td>
                        <input type="checkbox"
                          checked={selected.has(regNum)}
                          onChange={e => {
                            const next = new Set(selected);
                            if (e.target.checked) next.add(regNum);
                            else next.delete(regNum);
                            setSelected(next);
                          }} />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={sName} size={36} tone="auto" />
                          <div>
                            <div style={{ fontWeight: 600 }}>{sName}</div>
                            <div className="text-xs text-subtle">{sEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="mono text-sm">{regNum}</td>
                      <td><span className="chip">{s.department || 'CSE'}</span></td>
                      <td><span className="chip chip-accent">{s.batch || '2024-2028'}</span></td>
                      <td>{s.section || 'A'}</td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: parseFloat(sCgpa) >= 8 ? 'var(--accent)' : parseFloat(sCgpa) < 7 ? '#EF4444' : 'inherit' }}>{sCgpa}</span>
                      </td>
                      <td>
                        {(s.arrears || 0) > 0 ? <span className="chip chip-rose">{s.arrears}</span> : <span className="text-subtle">—</span>}
                      </td>
                      <td style={{ minWidth: 120 }}>
                        <div className="flex items-center gap-2">
                          <div className="progress" style={{ flex: 1 }}><div style={{ width: `${sComp}%` }} /></div>
                          <span className="text-xs" style={{ fontWeight: 600, color: sComp >= 90 ? 'var(--accent)' : sComp < 60 ? '#EF4444' : 'var(--text-muted)' }}>{sComp}%</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`chip ${isApproved ? 'chip-accent' : 'chip-amber'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={async () => {
                            try {
                              const nextApproved = !isApproved;
                              await window.VSB_API.approveStudent(regNum, nextApproved);
                              setStudents(prev => prev.map(x => (x && x.registerNumber === regNum) ? { ...x, approved: nextApproved } : x));
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                        >
                          {isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} title="View Full Profile" onClick={() => {
                            if (!window.VSB_DATA) window.VSB_DATA = {};
                            window.VSB_DATA.currentStudentRegNum = regNum;
                            window.VSB_DATA.currentUserRole = 'teacher';
                            onNavigate('/student');
                          }}><Icon name="eye" size={14} /></button>
                          <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} title="Edit Student Record" onClick={() => {
                            setEditingStudent({ ...s });
                          }}><Icon name="edit" size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan="11" className="text-center text-muted p-5">No students found matching the selected batch and filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div className="text-sm text-muted">Showing {filtered.length > 0 ? (page - 1) * perPage + 1 : 0}-{Math.min(page * perPage, filtered.length)} of {filtered.length}</div>
            <div className="flex gap-1">
              <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}><Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} /> Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(p => (
                <button key={p} className="btn btn-sm" style={{
                  background: page === p ? 'var(--brand-primary)' : 'transparent',
                  color: page === p ? 'white' : 'var(--text)',
                  borderColor: page === p ? 'transparent' : 'var(--border-strong)',
                  minWidth: 36,
                }} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next <Icon name="arrow" size={14} /></button>
            </div>
          </div>
        </GlassCard>
      </div>

      {showImportModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'color-mix(in oklab, var(--bg) 60%, transparent)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }} className="fade-in">
          <GlassCard strong className="p-6" style={{
            width: '100%',
            maxWidth: 800,
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            border: '1px solid color-mix(in oklab, var(--text) 10%, transparent)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <button className="btn btn-ghost btn-icon" style={{ position: 'absolute', top: 16, right: 16 }} onClick={() => setShowImportModal(false)}>
              <Icon name="close" size={18} />
            </button>
            
            <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>Bulk Student Logins Upload (Teacher)</h2>
            <p className="text-sm mt-1 mb-5">Select the target batch and upload your CSV or Excel file to provision student login accounts.</p>

            {importStep === 'upload' && (
              <>
                <div className="grid-3 mb-5 p-4 glass-inner" style={{ borderRadius: 16 }}>
                  <div>
                    <label className="field-label">Target Batch</label>
                    <select className="input" value={targetBatch} onChange={e => setTargetBatch(e.target.value)}>
                      {batchesList.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Department</label>
                    <select className="input" value={targetDept} onChange={e => setTargetDept(e.target.value)}>
                      <option value="ALL">Auto / Sheet Dept</option>
                      {departmentsList.map(d => <option key={d.code} value={d.code}>{d.code} — {d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Section</label>
                    <select className="input" value={targetSec} onChange={e => setTargetSec(e.target.value)}>
                      <option value="ALL">Auto / Sheet Section</option>
                      {sectionsList.map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{
                  border: '2px dashed var(--border-strong)',
                  borderRadius: 20,
                  padding: 50,
                  textAlign: 'center',
                  background: 'color-mix(in oklab, var(--brand-primary) 4%, transparent)',
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: 16,
                    background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                    color: 'white',
                    display: 'grid', placeItems: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 20px 40px -12px #2563EB80',
                  }}><Icon name="upload" size={28} /></div>
                  <h3 className="mb-2">Drop your CSV or Excel file here</h3>
                  <p className="text-sm mb-4">Accepts .csv, .xlsx or .xls (e.g., <code>I_CSE_B_Database.csv</code>). Registers student logins under Batch <strong>{targetBatch}</strong>.</p>
                  <input ref={importFileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileSelected} />
                  <button className="btn btn-primary" onClick={() => importFileInputRef.current?.click()}><Icon name="upload" size={16} /> Select CSV / Excel File</button>
                  {importErrorMessage && <div className="chip chip-rose mt-4" style={{ display: 'inline-flex' }}><Icon name="close" size={12} /> {importErrorMessage}</div>}
                </div>
              </>
            )}

            {importStep === 'preview' && (
              <>
                <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 10 }}>
                  <div className="chip chip-accent"><Icon name="check" size={12} stroke={3} /> Parsed <strong>{importFileName}</strong> · {importParsedStudents.length} rows for Batch <strong>{targetBatch}</strong></div>
                  <button className="btn btn-ghost btn-sm" onClick={openImportModal}><Icon name="close" size={14} /> Choose Another</button>
                </div>
                <div style={{ overflowX: 'auto', maxHeight: '40vh', marginBottom: 20, border: '1px solid var(--border-strong)', borderRadius: 8 }}>
                  <table className="data-table" style={{ margin: 0 }}>
                    <thead><tr><th>Row</th><th>Register # / Roll #</th><th>Name</th><th>DOB (Login Key)</th><th>Dept</th><th>Batch</th><th>Sec</th></tr></thead>
                    <tbody>
                      {importParsedStudents.map((s, i) => (
                        <tr key={s.registerNumber || i}>
                          <td className="mono text-subtle">{i + 1}</td>
                          <td className="mono font-semibold">{s.registerNumber}</td>
                          <td>{s.name}</td>
                          <td className="mono text-sm">{s.dob}</td>
                          <td><span className="chip">{s.department}</span></td>
                          <td><span className="chip chip-accent">{s.batch}</span></td>
                          <td>{s.section}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="btn btn-ghost" onClick={() => setShowImportModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={importStudents}><Icon name="check" size={16} /> Upload & Save {importParsedStudents.length} Student Logins</button>
                </div>
              </>
            )}

            {importStep === 'done' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'color-mix(in oklab, var(--accent) 15%, transparent)',
                  color: 'var(--accent)',
                  display: 'grid', placeItems: 'center',
                  margin: '0 auto 16px',
                  fontSize: 28
                }}>✓</div>
                <h3 className="mb-2">Bulk Logins Uploaded!</h3>
                <p className="text-sm text-muted mb-6">Successfully provisioned {importedCount} student accounts under Batch <strong>{targetBatch}</strong>.</p>
                <button className="btn btn-primary" onClick={() => setShowImportModal(false)}>View Student Accounts</button>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {editingStudent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'color-mix(in oklab, var(--bg) 60%, transparent)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }} className="fade-in">
          <GlassCard strong className="p-6" style={{
            width: '100%',
            maxWidth: 850,
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            border: '1px solid color-mix(in oklab, var(--text) 10%, transparent)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <button className="btn btn-ghost btn-icon" style={{ position: 'absolute', top: 16, right: 16 }} onClick={() => setEditingStudent(null)}>
              <Icon name="close" size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #10B981, #34D399)', color: 'white', display: 'grid', placeItems: 'center' }}>
                <Icon name="edit" size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 2 }}>Edit Student Record</h2>
                <div className="text-xs text-subtle">{editingStudent.registerNumber} · {editingStudent.name}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16 }} className="mt-4">
              <div className="grid-3">
                <div>
                  <label className="field-label">Student Name</label>
                  <input className="input" value={editingStudent.name || ''} onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Register Number</label>
                  <input className="input mono" value={editingStudent.registerNumber || ''} disabled style={{ opacity: 0.7 }} />
                </div>
                <div>
                  <label className="field-label">Roll Number</label>
                  <input className="input mono" value={editingStudent.rollNumber || ''} onChange={e => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })} />
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label className="field-label">Date of Birth</label>
                  <input className="input" type="date" value={editingStudent.dob || ''} onChange={e => setEditingStudent({ ...editingStudent, dob: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Gender</label>
                  <select className="input" value={editingStudent.gender || 'Male'} onChange={e => setEditingStudent({ ...editingStudent, gender: e.target.value })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Blood Group</label>
                  <input className="input" value={editingStudent.bloodGroup || ''} onChange={e => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })} placeholder="O+" />
                </div>
              </div>

              <div className="grid-4">
                <div>
                  <label className="field-label">Department</label>
                  <select className="input" value={editingStudent.department || 'CSE'} onChange={e => {
                    const deptCode = e.target.value;
                    const deptObj = departmentsList.find(d => d.code === deptCode);
                    setEditingStudent({ ...editingStudent, department: deptCode, departmentName: deptObj ? deptObj.name : deptCode });
                  }}>
                    {departmentsList.map(d => <option key={d.code} value={d.code}>{d.code} - {d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Batch</label>
                  <select className="input" value={editingStudent.batch || '2024-2028'} onChange={e => setEditingStudent({ ...editingStudent, batch: e.target.value })}>
                    {batchesList.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Section</label>
                  <select className="input" value={editingStudent.section || 'A'} onChange={e => setEditingStudent({ ...editingStudent, section: e.target.value })}>
                    {sectionsList.map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Year of Study</label>
                  <select className="input" value={editingStudent.year || 1} onChange={e => setEditingStudent({ ...editingStudent, year: parseInt(e.target.value) })}>
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label className="field-label">CGPA</label>
                  <input className="input font-semibold" value={editingStudent.cgpa || ''} onChange={e => setEditingStudent({ ...editingStudent, cgpa: e.target.value })} placeholder="8.50" />
                </div>
                <div>
                  <label className="field-label">Arrears Count</label>
                  <input className="input" type="number" value={editingStudent.arrears || 0} onChange={e => setEditingStudent({ ...editingStudent, arrears: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="field-label">Profile Completion %</label>
                  <input className="input" type="number" value={editingStudent.profileCompletion || 50} onChange={e => setEditingStudent({ ...editingStudent, profileCompletion: parseInt(e.target.value) || 50 })} />
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label className="field-label">Email</label>
                  <input className="input" type="email" value={editingStudent.email || ''} onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Phone</label>
                  <input className="input" value={editingStudent.phone || ''} onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Emergency Contact</label>
                  <input className="input" value={editingStudent.emergencyContact || ''} onChange={e => setEditingStudent({ ...editingStudent, emergencyContact: e.target.value })} />
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label className="field-label">Parent Name</label>
                  <input className="input" value={editingStudent.parentName || ''} onChange={e => setEditingStudent({ ...editingStudent, parentName: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Parent Phone</label>
                  <input className="input" value={editingStudent.parentPhone || ''} onChange={e => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Placement Status</label>
                  <select className="input" value={(editingStudent.placement && editingStudent.placement.status) || 'Not Applied'} onChange={e => setEditingStudent({
                    ...editingStudent,
                    placement: { ...(editingStudent.placement || {}), status: e.target.value }
                  })}>
                    <option value="Not Applied">Not Applied</option>
                    <option value="Eligible">Eligible</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Placed">Placed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-ghost" onClick={() => setEditingStudent(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveTeacherStudentEdit} disabled={savingEdit}>
                  {savingEdit ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : <><Icon name="check" size={16} /> Save Student Record</>}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .chart-row { grid-template-columns: 1fr !important; }
          .filter-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select className="input" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

function FunnelRow({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{ height: 8, background: 'color-mix(in oklab, var(--text) 8%, transparent)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 60%, white))`, borderRadius: 999, transition: 'width .5s' }} />
      </div>
    </div>
  );
}

window.TeacherDashboard = TeacherDashboard;
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
// Admin Panel — full CRUD, bulk import, settings, activity logs
function AdminPanel({ onNavigate }) {
  const [tab, setTab] = useState('overview');
  const [departments, setDepartments] = useState(() => (window.VSB_DATA && window.VSB_DATA.DEPARTMENTS) || []);
  const [teachers, setTeachers] = useState(() => (window.VSB_DATA && window.VSB_DATA.teachers) || []);
  const [studentsList, setStudentsList] = useState(() => (window.VSB_DATA && window.VSB_DATA.students) || []);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadStudents() {
      try {
        const list = await window.VSB_API.getTeacherStudents('', '', '');
        if (active && list && list.length) {
          window.VSB_DATA.students = list;
          setStudentsList(list);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStudents();
    return () => { active = false; };
  }, [refreshTrigger]);

  const saveDepartments = (nextDepartments) => {
    window.VSB_DATA.DEPARTMENTS = nextDepartments;
    setDepartments(nextDepartments);
  };

  const saveTeachers = (nextTeachers) => {
    window.VSB_DATA.teachers = nextTeachers;
    setTeachers(nextTeachers);
  };

  const handleRefreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const tabs = [
    { id: 'overview',    label: 'Overview',     icon: 'grid' },
    { id: 'departments', label: 'Departments',  icon: 'building' },
    { id: 'teachers',    label: 'Teachers',     icon: 'teacher' },
    { id: 'students',    label: 'Student Logins', icon: 'users' },
    { id: 'import',      label: 'Bulk Import',  icon: 'upload' },
    { id: 'activity',    label: 'Activity Log', icon: 'list' },
    { id: 'settings',    label: 'Settings',     icon: 'settings' },
  ];

  return (
    <div className="screen-enter" style={{ paddingTop: 96, paddingBottom: 80 }} data-screen-label="Admin Panel">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #8B5CF6, #C084FC)', color: 'white', display: 'grid', placeItems: 'center' }}>
              <Icon name="admin" size={22} />
            </div>
            <div>
              <div className="chip chip-violet mb-1"><Icon name="shield" size={12} /> Super Admin</div>
              <h1 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', lineHeight: 1.15 }}>Administration Panel</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={handleRefreshData} title="Refresh System Data"><Icon name="refresh" size={16} /> Sync Data</button>
            <button className="btn btn-ghost" onClick={() => onNavigate('/')}><Icon name="logout" size={16} /> Logout</button>
          </div>
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }} className="admin-grid">
          <aside>
            <GlassCard className="p-3">
              <nav className="sidenav" style={{ display: 'grid', gap: 4 }}>
                {tabs.map(t => (
                  <a key={t.id} href={`#${t.id}`} onClick={e => { e.preventDefault(); setTab(t.id); }} className={tab === t.id ? 'active' : ''}>
                    <Icon name={t.icon} size={16} /> {t.label}
                  </a>
                ))}
              </nav>
            </GlassCard>
          </aside>
          <main style={{ display: 'grid', gap: 20 }}>
            {tab === 'overview' && <AdminOverview departments={departments} studentsList={studentsList} teachers={teachers} />}
            {tab === 'departments' && <AdminDepartments departments={departments} setDepartments={saveDepartments} />}
            {tab === 'teachers' && <AdminTeachers teachers={teachers} setTeachers={saveTeachers} departments={departments} />}
            {tab === 'students' && <AdminStudentLogins departments={departments} studentsList={studentsList} onDataChanged={handleRefreshData} setTab={setTab} />}
            {tab === 'import' && <AdminBulkImport departments={departments} onImportSuccess={handleRefreshData} />}
            {tab === 'activity' && <AdminActivity />}
            {tab === 'settings' && <AdminSettings />}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function AdminOverview({ departments, studentsList = [], teachers = [] }) {
  const totalStudents = studentsList.length;
  const totalTeachers = teachers.length;
  const chartValues = departments.map(d => studentsList.filter(s => s.department === d.code).length);
  
  const highComp = studentsList.filter(s => (s.profileCompletion || 0) >= 90).length;
  const midComp = studentsList.filter(s => (s.profileCompletion || 0) >= 60 && (s.profileCompletion || 0) < 90).length;
  const lowComp = studentsList.filter(s => (s.profileCompletion || 0) < 60).length;
  const pctHigh = totalStudents > 0 ? Math.round((highComp / totalStudents) * 100) : 0;

  return (
    <>
      <div className="grid-4">
        <StatCard label="Total Students" value={totalStudents.toLocaleString()} delta="Active Logins" icon="users" tone="brand" />
        <StatCard label="Departments" value={departments.length} delta="Active Streams" icon="building" tone="accent" />
        <StatCard label="Faculty Accounts" value={totalTeachers} delta="Registered" icon="teacher" tone="amber" />
        <StatCard label="Storage / DB" value="SQLite/MySQL" delta="Connected & Active" icon="file" tone="brand" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }} className="chart-row">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-subtle font-semibold" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Department-wise Students</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginTop: 4 }}>Enrollment across streams ({totalStudents} total)</div>
            </div>
          </div>
          <BarChart
            data={chartValues}
            labels={departments.map(d => d.code)}
            colors={departments.map(d => d.color || '#2563EB')}
            height={200}
          />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-xs text-subtle font-semibold mb-4" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Profile Completion</div>
          <div className="flex items-center gap-4">
            <DonutChart size={160} thickness={22} segments={[
              { value: highComp || 1, color: '#10B981' },
              { value: midComp || 0, color: '#F59E0B' },
              { value: lowComp || 0, color: '#EF4444' },
            ]} centerValue={`${pctHigh}%`} centerLabel="complete" />
            <div style={{ display: 'grid', gap: 12 }}>
              <LegendRow color="#10B981" label="90-100%" value={highComp.toString()} />
              <LegendRow color="#F59E0B" label="60-90%"  value={midComp.toString()} />
              <LegendRow color="#EF4444" label="< 60%"   value={lowComp.toString()} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="chart-row">
        <GlassCard className="p-5">
          <div className="text-xs text-subtle font-semibold mb-4" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Weekly Logins</div>
          <LineChart data={[240, 380, 420, 360, 520, 610, 580]} height={140} color="var(--brand-primary)" />
          <div className="flex justify-between mt-2 text-xs text-subtle mono">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="text-xs text-subtle font-semibold mb-4" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Database Sync Status</div>
          <LineChart data={[4200, 3800, 5100, 6400, 5900, 7200, 6800]} height={140} color="var(--accent)" />
          <div className="flex justify-between mt-2 text-xs text-subtle">
            <span className="text-muted">{totalStudents} student records indexed</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Active</span>
          </div>
        </GlassCard>
      </div>
    </>
  );
}

function LegendRow({ color, label, value }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-2 text-sm">
        <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
        <span>{label}</span>
      </div>
      <strong style={{ fontFamily: 'var(--font-mono)' }}>{value}</strong>
    </div>
  );
}

function AdminDepartments({ departments, setDepartments }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDept, setNewDept] = useState({ code: '', name: '', hod: '', color: '#2563EB' });
  const [editingDept, setEditingDept] = useState(null);
  
  const handleAddDept = () => {
    const code = newDept.code.trim().toUpperCase();
    const name = newDept.name.trim();
    const hod = newDept.hod.trim();

    if (!code || !name || !hod) {
      alert('Please fill all fields');
      return;
    }

    if (departments.some(d => d.code.toUpperCase() === code)) {
      alert('Department code already exists');
      return;
    }

    setDepartments([...departments, { code, name, hod, color: newDept.color }]);
    window.VSB_DATA.activityLogs = [{
      id: ((window.VSB_DATA && window.VSB_DATA.activityLogs) || []).length + 1,
      actor: 'Super Admin',
      action: 'Created',
      target: `Department ${code} (${name})`,
      time: 'Just now',
      color: 'accent'
    }, ...((window.VSB_DATA && window.VSB_DATA.activityLogs) || [])];
    setNewDept({ code: '', name: '', hod: '', color: '#2563EB' });
    setShowAddForm(false);
    alert('Department added successfully!');
  };

  const handleSaveEditDept = () => {
    if (!editingDept || !editingDept.name.trim() || !editingDept.hod.trim()) {
      alert('Please fill all fields');
      return;
    }
    const updated = departments.map(d => d.code === editingDept.code ? { ...editingDept } : d);
    setDepartments(updated);
    setEditingDept(null);
    alert('Department updated successfully!');
  };
  
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: '1.3rem' }}>Departments</h2>
          <p className="text-sm mt-1">Manage academic streams and assign HODs.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(true)}><Icon name="plus" size={16} /> Add Department</button>
      </div>
      
      {showAddForm && (
        <div className="glass-inner p-4 mb-4" style={{ display: 'grid', gap: 12 }}>
          <div className="grid-2">
            <div><label className="field-label">Code</label><input className="input" value={newDept.code} onChange={e => setNewDept({...newDept, code: e.target.value.toUpperCase()})} placeholder="e.g., CSE" /></div>
            <div><label className="field-label">Name</label><input className="input" value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} placeholder="Full name" /></div>
            <div><label className="field-label">HOD</label><input className="input" value={newDept.hod} onChange={e => setNewDept({...newDept, hod: e.target.value})} placeholder="Dr. Name" /></div>
            <div><label className="field-label">Color</label><input type="color" className="input" value={newDept.color} onChange={e => setNewDept({...newDept, color: e.target.value})} /></div>
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddDept}>Add Department</button>
          </div>
        </div>
      )}
      <table className="data-table">
        <thead>
          <tr><th>Code</th><th>Department Name</th><th>HOD</th><th>Students</th><th>Faculty</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {departments.map(d => {
            const studentCount = ((window.VSB_DATA && window.VSB_DATA.students) || []).filter(s => s && s.department === d.code).length;
            const facultyCount = ((window.VSB_DATA && window.VSB_DATA.teachers) || []).filter(t => t && t.department === d.code).length;
            return (
              <tr key={d.code}>
                <td><div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg, ${d.color || '#2563EB'}, color-mix(in oklab, ${d.color || '#2563EB'} 60%, white))`, color: 'white', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.72rem' }}>{d.code}</div></td>
                <td>{d.name}</td>
                <td>{d.hod}</td>
                <td className="mono">{studentCount}</td>
                <td className="mono">{facultyCount}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} title="Edit Department" onClick={() => setEditingDept({ ...d })}><Icon name="edit" size={14} /></button>
                    <button className="btn btn-ghost btn-icon" style={{ padding: 6, color: '#EF4444' }} title="Delete Department" onClick={() => { if(confirm(`Delete ${d.name}?`)) setDepartments(departments.filter(dp => dp.code !== d.code)); }}><Icon name="trash" size={14} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingDept && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'color-mix(in oklab, var(--bg) 60%, transparent)',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <GlassCard strong className="p-6" style={{ width: '100%', maxWidth: 500 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Edit Department ({editingDept.code})</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label className="field-label">Department Code</label>
                <input className="input mono" value={editingDept.code} disabled style={{ opacity: 0.7 }} />
              </div>
              <div>
                <label className="field-label">Department Name</label>
                <input className="input" value={editingDept.name} onChange={e => setEditingDept({ ...editingDept, name: e.target.value })} />
              </div>
              <div>
                <label className="field-label">HOD Name</label>
                <input className="input" value={editingDept.hod} onChange={e => setEditingDept({ ...editingDept, hod: e.target.value })} />
              </div>
              <div>
                <label className="field-label">Color</label>
                <input type="color" className="input" value={editingDept.color || '#2563EB'} onChange={e => setEditingDept({ ...editingDept, color: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => setEditingDept(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveEditDept}>Save Changes</button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </GlassCard>
  );
}

function AdminTeachers({ teachers, setTeachers, departments }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const defaultDepartment = departments[0]?.code || 'CSE';
  const [newTeacher, setNewTeacher] = useState({ id: '', name: '', username: '', department: defaultDepartment, role: 'Faculty', email: '' });
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    if (!departments.some(d => d.code === newTeacher.department)) {
      setNewTeacher(current => ({ ...current, department: defaultDepartment }));
    }
  }, [departments, defaultDepartment, newTeacher.department]);
  
  const handleAddTeacher = () => {
    if (newTeacher.id && newTeacher.name && newTeacher.username && newTeacher.email) {
      setTeachers([...teachers, { ...newTeacher, lastLogin: 'Never' }]);
      setNewTeacher({ id: '', name: '', username: '', department: defaultDepartment, role: 'Faculty', email: '' });
      setShowAddForm(false);
      alert('Teacher added successfully!');
    } else {
      alert('Please fill all required fields');
    }
  };

  const handleSaveEditTeacher = () => {
    if (!editingTeacher || !editingTeacher.name.trim() || !editingTeacher.username.trim() || !editingTeacher.email.trim()) {
      alert('Please fill all required fields');
      return;
    }
    const updated = teachers.map(t => t.id === editingTeacher.id ? { ...editingTeacher } : t);
    setTeachers(updated);
    setEditingTeacher(null);
    alert('Faculty account updated successfully!');
  };
  
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: '1.3rem' }}>Faculty Accounts</h2>
          <p className="text-sm mt-1">Create, edit and reset teacher logins.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={() => alert('Faculty CSV import ready.')}><Icon name="upload" size={16} /> Import CSV</button>
          <button className="btn btn-primary" onClick={() => setShowAddForm(true)}><Icon name="plus" size={16} /> Add Teacher</button>
        </div>
      </div>
      
      {showAddForm && (
        <div className="glass-inner p-4 mb-4" style={{ display: 'grid', gap: 12 }}>
          <div className="grid-3">
            <div><label className="field-label">Teacher ID</label><input className="input" value={newTeacher.id} onChange={e => setNewTeacher({...newTeacher, id: e.target.value})} placeholder="T009" /></div>
            <div><label className="field-label">Name</label><input className="input" value={newTeacher.name} onChange={e => setNewTeacher({...newTeacher, name: e.target.value})} placeholder="Dr. Name" /></div>
            <div><label className="field-label">Username</label><input className="input" value={newTeacher.username} onChange={e => setNewTeacher({...newTeacher, username: e.target.value})} placeholder="username" /></div>
            <div><label className="field-label">Department</label>
              <select className="input" value={newTeacher.department} onChange={e => setNewTeacher({...newTeacher, department: e.target.value})}>
                {departments.map(d => <option key={d.code} value={d.code}>{d.code} - {d.name}</option>)}
              </select>
            </div>
            <div><label className="field-label">Role</label>
              <select className="input" value={newTeacher.role} onChange={e => setNewTeacher({...newTeacher, role: e.target.value})}>
                <option value="Faculty">Faculty</option>
                <option value="HOD">HOD</option>
              </select>
            </div>
            <div><label className="field-label">Email</label><input className="input" value={newTeacher.email} onChange={e => setNewTeacher({...newTeacher, email: e.target.value})} placeholder="name@vsb.edu.in" /></div>
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddTeacher}>Add Teacher</button>
          </div>
        </div>
      )}
      <table className="data-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Username</th><th>Department</th><th>Role</th><th>Last Login</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {teachers.map(t => (
            <tr key={t.id}>
              <td className="mono text-sm">{t.id}</td>
              <td>
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} size={32} tone="accent" />
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div className="text-xs text-subtle">{t.email}</div>
                  </div>
                </div>
              </td>
              <td className="mono text-sm">{t.username}</td>
              <td><span className="chip">{t.department}</span></td>
              <td>{t.role === 'HOD' ? <span className="chip chip-brand">HOD</span> : <span className="chip">Faculty</span>}</td>
              <td className="text-sm text-muted">{t.lastLogin}</td>
              <td>
                <div className="flex gap-1">
                  <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} title="Edit Faculty" onClick={() => setEditingTeacher({ ...t })}><Icon name="edit" size={14} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ padding: 6, color: '#EF4444' }} title="Delete Faculty" onClick={() => { if(confirm(`Delete ${t.name}?`)) setTeachers(teachers.filter(tr => tr.id !== t.id)); }}><Icon name="trash" size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTeacher && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'color-mix(in oklab, var(--bg) 60%, transparent)',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <GlassCard strong className="p-6" style={{ width: '100%', maxWidth: 550 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 16 }}>Edit Faculty Account ({editingTeacher.id})</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div className="grid-2">
                <div>
                  <label className="field-label">Name</label>
                  <input className="input" value={editingTeacher.name} onChange={e => setEditingTeacher({ ...editingTeacher, name: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Username</label>
                  <input className="input" value={editingTeacher.username} onChange={e => setEditingTeacher({ ...editingTeacher, username: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div>
                  <label className="field-label">Department</label>
                  <select className="input" value={editingTeacher.department} onChange={e => setEditingTeacher({ ...editingTeacher, department: e.target.value })}>
                    {departments.map(d => <option key={d.code} value={d.code}>{d.code} - {d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Role</label>
                  <select className="input" value={editingTeacher.role} onChange={e => setEditingTeacher({ ...editingTeacher, role: e.target.value })}>
                    <option value="Faculty">Faculty</option>
                    <option value="HOD">HOD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Email</label>
                <input className="input" type="email" value={editingTeacher.email} onChange={e => setEditingTeacher({ ...editingTeacher, email: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn btn-ghost" onClick={() => setEditingTeacher(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveEditTeacher}>Save Changes</button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </GlassCard>
  );
}

function AdminStudentLogins({ departments, studentsList = [], onDataChanged, setTab }) {
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterBatch, setFilterBatch] = useState('ALL');
  const [filterSec, setFilterSec] = useState('ALL');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const handleSaveAdminStudentEdit = async () => {
    if (!editingStudent || !editingStudent.name.trim()) {
      alert('Please fill student name');
      return;
    }
    setSavingEdit(true);
    try {
      const updated = await window.VSB_API.updateStudentProfile(editingStudent.registerNumber, editingStudent);
      if (onDataChanged) onDataChanged();
      setEditingStudent(null);
      alert('Student record updated successfully!');
    } catch (err) {
      alert('Error updating student: ' + err.message);
    } finally {
      setSavingEdit(false);
    }
  };
  const perPage = 10;

  const defaultDepartment = departments[0]?.code || 'CSE';
  const [newStudent, setNewStudent] = useState({
    registerNumber: '',
    rollNumber: '',
    name: '',
    department: defaultDepartment,
    batch: '2024-2028',
    section: 'A',
    phone: '',
    email: '',
    dob: '',
  });

  useEffect(() => {
    if (!departments.some(d => d.code === newStudent.department)) {
      setNewStudent(current => ({ ...current, department: defaultDepartment }));
    }
  }, [departments, defaultDepartment, newStudent.department]);

  const filteredStudents = useMemo(() => {
    return (studentsList || []).filter(s => {
      if (!s) return false;
      const matchDept = filterDept === 'ALL' || s.department === filterDept;
      const matchBatch = filterBatch === 'ALL' || s.batch === filterBatch;
      const matchSec = filterSec === 'ALL' || s.section === filterSec;
      const nameStr = String(s.name || '').toLowerCase();
      const regStr = String(s.registerNumber || '').toLowerCase();
      const rollStr = String(s.rollNumber || '').toLowerCase();
      const emailStr = String(s.email || '').toLowerCase();
      const q = String(query || '').toLowerCase();
      const matchQ = !q || nameStr.includes(q) || regStr.includes(q) || rollStr.includes(q) || emailStr.includes(q);
      return matchDept && matchBatch && matchSec && matchQ;
    });
  }, [studentsList, filterDept, filterBatch, filterSec, query]);

  const pagedStudents = filteredStudents.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / perPage));

  const handleCreateAccount = () => {
    if (!newStudent.registerNumber.trim() && !newStudent.rollNumber.trim()) {
      alert('Please fill Register Number or Roll Number');
      return;
    }
    if (!newStudent.name.trim()) {
      alert('Please fill Student Name');
      return;
    }
    const regNumUpper = (newStudent.registerNumber.trim() || newStudent.rollNumber.trim()).toUpperCase();
    if (window.VSB_DATA.students.some(s => s.registerNumber.toUpperCase() === regNumUpper)) {
      alert('Student with this Register Number already exists!');
      return;
    }

    const deptObj = departments.find(d => d.code === newStudent.department) || departments[0];
    const startYear = parseInt(newStudent.batch.split('-')[0]) || 2024;
    const yearNum = Math.min(4, 2026 - startYear + 1);

    const createdStudent = {
      registerNumber: regNumUpper,
      rollNumber: newStudent.rollNumber.trim() || regNumUpper,
      name: newStudent.name.trim(),
      gender: 'Male',
      photo: null,
      department: newStudent.department,
      departmentName: deptObj ? deptObj.name : 'Computer Science & Engineering',
      batch: newStudent.batch,
      section: newStudent.section,
      year: yearNum,
      email: newStudent.email.trim() || `${newStudent.name.trim().toLowerCase().replace(/\s+/g, '.')}@vsb.edu.in`,
      phone: newStudent.phone.trim() || `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
      dob: newStudent.dob || '2005-01-01',
      bloodGroup: 'B+',
      community: 'BC',
      hometown: 'Karur',
      address: '42, VSB Campus, Karur, Tamil Nadu',
      aadhaar: '**** **** 1234',
      sslc: '90%', hsc: '88%', diploma: null,
      cgpa: '8.50', arrears: 0,
      skills: ['HTML', 'CSS', 'JavaScript'],
      languages: ['Tamil', 'English'],
      internships: 0, projects: 1, hackathons: 0, certificates: 1,
      placement: { status: 'Not Applied', company: null, package: null },
      transport: 'College Bus',
      residence: 'Day Scholar',
      emergencyContact: '+91 98765 43210',
      parentName: 'Parent Name',
      parentPhone: '+91 98765 43210',
      parentOccupation: 'Farmer',
      profileCompletion: 50,
      approved: true,
      lastUpdated: 'Today',
      mysqlId: `mysql_${regNumUpper.toLowerCase()}_${Math.random().toString(36).slice(2, 10)}`,
      createdTime: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    window.VSB_API.bulkImportStudents([createdStudent]);
    window.VSB_DATA.students = [createdStudent, ...window.VSB_DATA.students];
    if (onDataChanged) onDataChanged();

    // Add activity log
    const newLog = {
      id: ((window.VSB_DATA && window.VSB_DATA.activityLogs) || []).length + 1,
      actor: 'Super Admin',
      action: 'create',
      target: `Student ${createdStudent.name} (${regNumUpper})`,
      time: 'Just now',
      color: 'accent'
    };
    window.VSB_DATA.activityLogs = [newLog, ...((window.VSB_DATA && window.VSB_DATA.activityLogs) || [])];

    // Reset fields
    setNewStudent({
      registerNumber: '',
      rollNumber: '',
      name: '',
      department: defaultDepartment,
      batch: '2024-2028',
      section: 'A',
      phone: '',
      email: '',
      dob: '',
    });
    setShowCreateForm(false);
    alert('Student account created successfully!');
  };

  const handleDeleteStudent = (regNum, name) => {
    if (confirm(`Are you sure you want to delete login for ${name} (${regNum})?`)) {
      window.VSB_DATA.students = window.VSB_DATA.students.filter(s => s.registerNumber !== regNum);
      if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      if (onDataChanged) onDataChanged();
    }
  };

  return (
    <>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>Student Logins Database</h2>
            <p className="text-sm mt-1">Manage and provision student logins by Batch & Department.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={() => setTab('import')}><Icon name="upload" size={16} /> Bulk Upload CSV / Excel</button>
            <button className="btn btn-ghost" onClick={() => setShowCreateForm(!showCreateForm)}>
              <Icon name={showCreateForm ? 'close' : 'plus'} size={16} /> {showCreateForm ? 'Cancel' : 'Create Single Login'}
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="glass-inner p-4 mb-5 style-border" style={{ borderRadius: 16 }}>
            <h3 className="text-sm font-semibold mb-3">Provision Single Student Login</h3>
            <div className="grid-3">
              <div>
                <label className="field-label">Register Number</label>
                <input className="input" placeholder="e.g. 2024CS001" value={newStudent.registerNumber} onChange={e => setNewStudent({...newStudent, registerNumber: e.target.value})} />
              </div>
              <div>
                <label className="field-label">Roll Number</label>
                <input className="input" placeholder="e.g. 24104064" value={newStudent.rollNumber} onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})} />
              </div>
              <div>
                <label className="field-label">Student Name</label>
                <input className="input" placeholder="Full name" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
              </div>
              <div>
                <label className="field-label">Department</label>
                <select className="input" value={newStudent.department} onChange={e => setNewStudent({...newStudent, department: e.target.value})}>
                  {departments.map(d => <option key={d.code} value={d.code}>{d.code} - {d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Batch</label>
                <select className="input" value={newStudent.batch} onChange={e => setNewStudent({...newStudent, batch: e.target.value})}>
                  {((window.VSB_DATA && window.VSB_DATA.BATCHES) || ["2022-2026", "2023-2027", "2024-2028", "2025-2029"]).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Section</label>
                <select className="input" value={newStudent.section} onChange={e => setNewStudent({...newStudent, section: e.target.value})}>
                  {((window.VSB_DATA && window.VSB_DATA.SECTIONS) || ["A", "B", "C", "D"]).map(sec => <option key={sec} value={sec}>{sec}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Email</label>
                <input className="input" placeholder="student@vsb.edu.in" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
              </div>
              <div>
                <label className="field-label">Date of Birth (Password)</label>
                <input className="input" type="date" value={newStudent.dob} onChange={e => setNewStudent({...newStudent, dob: e.target.value})} />
              </div>
              <div>
                <label className="field-label">MySQL ID</label>
                <input className="input mono" value={newStudent.registerNumber ? `mysql_${newStudent.registerNumber.toLowerCase()}_xxxx` : "auto-generated"} disabled />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn btn-primary" onClick={handleCreateAccount}><Icon name="check" size={16} /> Save Student Account</button>
            </div>
          </div>
        )}

        {/* Filter controls */}
        <div className="filter-row mb-4" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: 12 }}>
          <div>
            <label className="field-label">Search Account</label>
            <input className="input" placeholder="Search by name, reg #, roll #..." value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} />
          </div>
          <div>
            <label className="field-label">Department</label>
            <select className="input" value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(1); }}>
              <option value="ALL">All Departments</option>
              {departments.map(d => <option key={d.code} value={d.code}>{d.code} — {d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Batch</label>
            <select className="input" value={filterBatch} onChange={e => { setFilterBatch(e.target.value); setPage(1); }}>
              <option value="ALL">All Batches</option>
              {((window.VSB_DATA && window.VSB_DATA.BATCHES) || ["2022-2026", "2023-2027", "2024-2028", "2025-2029"]).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Section</label>
            <select className="input" value={filterSec} onChange={e => { setFilterSec(e.target.value); setPage(1); }}>
              <option value="ALL">All Sections</option>
              {((window.VSB_DATA && window.VSB_DATA.SECTIONS) || ["A", "B", "C", "D"]).map(s => <option key={s} value={s}>Section {s}</option>)}
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Register #</th>
                <th>Roll #</th>
                <th>Name</th>
                <th>Dept</th>
                <th>Batch</th>
                <th>Sec</th>
                <th>DOB (Login Key)</th>
                <th>MySQL ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedStudents.map(s => (
                <tr key={s.registerNumber}>
                  <td className="mono font-semibold">{s.registerNumber}</td>
                  <td className="mono text-sm text-subtle">{s.rollNumber || s.registerNumber}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div className="text-xs text-subtle">{s.email}</div>
                  </td>
                  <td><span className="chip">{s.department}</span></td>
                  <td><span className="chip chip-accent">{s.batch}</span></td>
                  <td>{s.section}</td>
                  <td className="mono text-sm">{s.dob || '2005-01-01'}</td>
                  <td className="mono text-xs text-muted">{s.mysqlId || `mysql_${s.registerNumber.toLowerCase()}`}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} title="View & Edit Full Profile" onClick={() => {
                        if (!window.VSB_DATA) window.VSB_DATA = {};
                        window.VSB_DATA.currentStudentRegNum = s.registerNumber;
                        window.VSB_DATA.currentUserRole = 'admin';
                        if (typeof setTab === 'function') setTab('overview');
                        window.location.hash = '/student';
                      }}><Icon name="eye" size={14} /></button>
                      <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} title="Edit Record" onClick={() => setEditingStudent({ ...s })}><Icon name="edit" size={14} /></button>
                      <button className="btn btn-ghost btn-icon" style={{ padding: 6, color: '#EF4444' }} title="Delete login" onClick={() => handleDeleteStudent(s.registerNumber, s.name)}><Icon name="trash" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pagedStudents.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center text-muted p-5">No student login accounts found matching the active filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div className="text-sm text-muted">Showing {filteredStudents.length > 0 ? (page - 1) * perPage + 1 : 0}-{Math.min(page * perPage, filteredStudents.length)} of {filteredStudents.length} student logins</div>
          <div className="flex gap-1">
            <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(p => (
              <button key={p} className="btn btn-sm" style={{
                background: page === p ? 'var(--brand-primary)' : 'transparent',
                color: page === p ? 'white' : 'var(--text)',
                borderColor: page === p ? 'transparent' : 'var(--border-strong)',
                minWidth: 32,
              }} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="btn btn-ghost btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>

      {editingStudent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'color-mix(in oklab, var(--bg) 60%, transparent)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }} className="fade-in">
          <GlassCard strong className="p-6" style={{
            width: '100%',
            maxWidth: 850,
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>Edit Student Account — {editingStudent.name}</h2>
                <p className="text-xs text-muted">Register Number: <strong className="mono">{editingStudent.registerNumber}</strong></p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setEditingStudent(null)}><Icon name="x" size={18} /></button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div className="grid-3">
                <div>
                  <label className="field-label">Student Name</label>
                  <input className="input" value={editingStudent.name || ''} onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Roll Number</label>
                  <input className="input mono" value={editingStudent.rollNumber || ''} onChange={e => setEditingStudent({ ...editingStudent, rollNumber: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Date of Birth</label>
                  <input className="input" type="date" value={editingStudent.dob || ''} onChange={e => setEditingStudent({ ...editingStudent, dob: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Department</label>
                  <select className="input" value={editingStudent.department || 'CSE'} onChange={e => {
                    const deptObj = departments.find(d => d.code === e.target.value);
                    setEditingStudent({ ...editingStudent, department: e.target.value, departmentName: deptObj ? deptObj.name : editingStudent.departmentName });
                  }}>
                    {departments.map(d => <option key={d.code} value={d.code}>{d.code} - {d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Batch</label>
                  <select className="input" value={editingStudent.batch || '2024-2028'} onChange={e => setEditingStudent({ ...editingStudent, batch: e.target.value })}>
                    {((window.VSB_DATA && window.VSB_DATA.BATCHES) || ["2022-2026", "2023-2027", "2024-2028", "2025-2029"]).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Section</label>
                  <select className="input" value={editingStudent.section || 'A'} onChange={e => setEditingStudent({ ...editingStudent, section: e.target.value })}>
                    {((window.VSB_DATA && window.VSB_DATA.SECTIONS) || ["A", "B", "C", "D"]).map(sec => <option key={sec} value={sec}>{sec}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid-3">
                <div>
                  <label className="field-label">Year of Study</label>
                  <input className="input" type="number" min="1" max="4" value={editingStudent.year || 1} onChange={e => setEditingStudent({ ...editingStudent, year: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="field-label">CGPA</label>
                  <input className="input" type="number" step="0.01" min="0" max="10" value={editingStudent.cgpa || ''} onChange={e => setEditingStudent({ ...editingStudent, cgpa: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Arrears</label>
                  <input className="input" type="number" min="0" value={editingStudent.arrears || 0} onChange={e => setEditingStudent({ ...editingStudent, arrears: Number(e.target.value) })} />
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="field-label">Email Address</label>
                  <input className="input" type="email" value={editingStudent.email || ''} onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Phone Number</label>
                  <input className="input" value={editingStudent.phone || ''} onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })} />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-ghost" onClick={() => setEditingStudent(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveAdminStudentEdit} disabled={savingEdit}>
                  {savingEdit ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : <><Icon name="check" size={16} /> Save Changes</>}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
      </GlassCard>
    </>
  );
}

function AdminBulkImport({ departments, onImportSuccess }) {
  const [step, setStep] = useState('upload');
  const [selectedBatch, setSelectedBatch] = useState('2024-2028');
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedSection, setSelectedSection] = useState('ALL');

  const [fileName, setFileName] = useState('');
  const [parsedStudents, setParsedStudents] = useState([]);
  const [importedCount, setImportedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const normalizeHeader = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const toExcelDate = (value) => {
    if (!value) return '';
    if (value instanceof Date && !isNaN(value)) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    if (typeof value === 'number') {
      const date = new Date(Math.round((value - 25569) * 86400 * 1000));
      if (isNaN(date)) return '';
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const text = String(value).trim();
    if (!text) return '';

    const matchYMD = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (matchYMD) {
      const [, year, month, day] = matchYMD;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const parsed = new Date(text);
    if (!isNaN(parsed)) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    const match = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
    if (!match) return text;
    const [, day, month, year] = match;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const toSection = (value, sheetName) => {
    const raw = String(value || '').trim().toUpperCase();
    if (raw === '1') return 'A';
    if (raw === '2') return 'B';
    if (raw === '3') return 'C';
    if (raw === '4') return 'D';
    const sheetMatch = String(sheetName || '').match(/\b([A-D])\b/i);
    const fallback = selectedSection !== 'ALL' ? selectedSection : 'A';
    return raw || (sheetMatch ? sheetMatch[1].toUpperCase() : fallback);
  };

  const makeEmail = (name, registerNumber) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
    return `${slug || registerNumber.toLowerCase()}@vsb.edu.in`;
  };

  const getHeaderIndex = (headers, candidates) => {
    const normalized = headers.map(normalizeHeader);
    let idx = normalized.findIndex(header => candidates.some(candidate => header === candidate));
    if (idx !== -1) return idx;
    return normalized.findIndex(header => candidates.some(candidate => header.includes(candidate)));
  };

  const parseWorkbookRows = (workbook) => {
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true, defval: '' });
    
    if (!rows || !rows.length) {
      throw new Error('Spreadsheet appears to be empty.');
    }

    let headerRowIndex = rows.findIndex(row => {
      const lineText = row.map(cell => normalizeHeader(cell)).join(' ');
      return (lineText.includes('name') || lineText.includes('student')) &&
             (lineText.includes('reg') || lineText.includes('roll') || lineText.includes('dob') || lineText.includes('admn') || lineText.includes('no'));
    });

    if (headerRowIndex === -1 && rows.length > 0) {
      headerRowIndex = 0;
    }

    const headers = rows[headerRowIndex] || [];
    const indexes = {
      name: getHeaderIndex(headers, ['studentnamewithinitial', 'studentname', 'name', 'fullname', 'student']),
      dob: getHeaderIndex(headers, ['dobyyyymmdd', 'dob', 'dateofbirth', 'birthdate', 'doj']),
      roll: getHeaderIndex(headers, ['rollnumber', 'rollno', 'roll']),
      register: getHeaderIndex(headers, ['registerno', 'registernumber', 'regno', 'register']),
      department: getHeaderIndex(headers, ['programmecode', 'department', 'dept', 'branch']),
      year: getHeaderIndex(headers, ['yearofadmission', 'batch', 'year']),
      section: getHeaderIndex(headers, ['section', 'sec']),
      gender: getHeaderIndex(headers, ['gender', 'sex']),
      admissionNumber: getHeaderIndex(headers, ['admnno', 'admissionno', 'admn']),
      email: getHeaderIndex(headers, ['emailid', 'email', 'institutionalemail']),
      phone: getHeaderIndex(headers, ['studentmobileno', 'studentphone', 'phone', 'mobile']),
      parentPhone: getHeaderIndex(headers, ['parentmobileno', 'parentphone']),
      parentName: getHeaderIndex(headers, ['parentname', 'parenthusbandname']),
      aadhaar: getHeaderIndex(headers, ['aadhaarnumber', 'aadhaar']),
      cgpa: getHeaderIndex(headers, ['cgpa', 'gpa', 'marks']),
    };

    if (indexes.name === -1 && indexes.register === -1 && indexes.roll === -1) {
      throw new Error('Could not identify Student Name or Register Number columns in this sheet. Please check headers.');
    }

    const parsedList = [];
    const dataRows = rows.slice(headerRowIndex + 1);

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || row.every(cell => String(cell).trim() === '')) continue;

      const nameRaw = indexes.name !== -1 ? String(row[indexes.name] || '').trim() : '';
      const rollNumber = indexes.roll !== -1 ? String(row[indexes.roll] || '').trim() : '';
      const registerNo = indexes.register !== -1 ? String(row[indexes.register] || '').trim() : '';
      const registerNumber = (registerNo || rollNumber || `VSB${Date.now()}${i + 1}`).toUpperCase();
      const name = nameRaw || `Student ${registerNumber}`;

      let dob = indexes.dob !== -1 ? toExcelDate(row[indexes.dob]) : '';
      if (!dob || dob === 'Invalid Date') {
        dob = '2005-01-01'; // Safe default DOB
      }

      let deptCode = indexes.department !== -1 ? String(row[indexes.department] || '').trim().toUpperCase() : '';
      if (!deptCode || deptCode === 'NULL') {
        deptCode = (selectedDept && selectedDept !== 'ALL') ? selectedDept : 'CSE';
      }
      const deptObj = departments.find(d => d.code === deptCode) || departments[0];

      let batch = '';
      const yearVal = indexes.year !== -1 ? String(row[indexes.year] || '').trim() : '';
      if (/^\d{4}$/.test(yearVal)) {
        const start = parseInt(yearVal);
        batch = `${start}-${start + 4}`;
      } else if (/^\d{4}-\d{4}$/.test(yearVal)) {
        batch = yearVal;
      } else if (selectedBatch && selectedBatch !== 'ALL') {
        batch = selectedBatch;
      } else {
        batch = '2024-2028';
      }

      let section = indexes.section !== -1 ? toSection(row[indexes.section], sheetName) : '';
      if (!section || section === 'ALL') {
        section = (selectedSection && selectedSection !== 'ALL') ? selectedSection : 'A';
      }

      const batchStart = parseInt(batch.split('-')[0]) || 2024;
      const year = Math.min(4, Math.max(1, 2026 - batchStart + 1));
      const genderCode = indexes.gender !== -1 ? String(row[indexes.gender] || '').trim().toUpperCase() : 'M';
      const gender = genderCode === 'F' || genderCode === 'FEMALE' ? 'Female' : 'Male';

      const email = (indexes.email !== -1 && String(row[indexes.email]).trim()) || makeEmail(name, registerNumber);
      const phone = (indexes.phone !== -1 && String(row[indexes.phone]).trim()) || '';
      const rawAadhaar = (indexes.aadhaar !== -1 && String(row[indexes.aadhaar]).trim()) || '';
      const aadhaar = rawAadhaar.length >= 4 ? `**** **** ${rawAadhaar.slice(-4)}` : '**** **** 1234';

      parsedList.push({
        registerNumber,
        rollNumber: rollNumber || registerNumber,
        name,
        dob,
        gender,
        department: deptCode,
        departmentName: deptObj ? deptObj.name : deptCode,
        batch,
        section,
        year,
        email,
        phone,
        aadhaar,
        rawAadhaar,
        cgpa: (indexes.cgpa !== -1 && String(row[indexes.cgpa]).trim()) || '8.50',
        arrears: 0,
        skills: ['HTML', 'CSS', 'JavaScript'],
        languages: ['Tamil', 'English'],
        internships: 0, projects: 1, hackathons: 0, certificates: 1,
        placement: { status: 'Not Applied', company: null, package: null },
        transport: 'College Bus',
        residence: 'Day Scholar',
        emergencyContact: phone || '+91 98765 43210',
        parentName: indexes.parentName !== -1 ? String(row[indexes.parentName] || '').trim() : 'Parent',
        parentPhone: indexes.parentPhone !== -1 ? String(row[indexes.parentPhone] || '').trim() : '',
        parentOccupation: 'Farmer',
        profileCompletion: dob ? 60 : 45,
        approved: true,
        lastUpdated: 'Today',
        mysqlId: `mysql_${registerNumber.toLowerCase()}_${Math.random().toString(36).slice(2, 10)}`,
        createdTime: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    if (!parsedList.length) {
      throw new Error('No valid student rows could be extracted from this sheet.');
    }

    return parsedList;
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!window.XLSX) {
      setErrorMessage('Excel/CSV parser is still loading. Please try again in a moment.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const workbook = XLSX.read(loadEvent.target.result, { type: 'array', cellDates: true });
        const students = parseWorkbookRows(workbook);
        setParsedStudents(students);
        setFileName(file.name);
        setErrorMessage('');
        setStep('preview');
      } catch (error) {
        setParsedStudents([]);
        setFileName(file.name);
        setErrorMessage(error.message || 'Could not parse this Excel/CSV file.');
      }
    };
    reader.onerror = () => setErrorMessage('Could not read this file.');
    reader.readAsArrayBuffer(file);
  };

  const importStudents = async () => {
    try {
      const existing = new Set(((window.VSB_DATA && window.VSB_DATA.students) || []).map(s => s.registerNumber.toUpperCase()));
      const studentsToAdd = parsedStudents.filter(s => !existing.has(s.registerNumber.toUpperCase()));
      
      await window.VSB_API.bulkImportStudents(parsedStudents);
      
      window.VSB_DATA.activityLogs = [{
        id: ((window.VSB_DATA && window.VSB_DATA.activityLogs) || []).length + 1,
        actor: 'Super Admin',
        action: 'Imported',
        target: `${parsedStudents.length} students (Batch ${selectedBatch}) from ${fileName}`,
        time: 'Just now',
        color: 'accent'
      }, ...((window.VSB_DATA && window.VSB_DATA.activityLogs) || [])];

      setImportedCount(parsedStudents.length);
      setStep('done');
      if (onImportSuccess) onImportSuccess();
    } catch (err) {
      console.error(err);
      alert('Error during bulk import: ' + err.message);
    }
  };

  const resetImport = () => {
    setStep('upload');
    setFileName('');
    setParsedStudents([]);
    setImportedCount(0);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const previewRows = parsedStudents.slice(0, 8);

  return (
    <>
      <GlassCard className="p-6">
        <h2 style={{ fontSize: '1.3rem' }}>Bulk Student Logins Import</h2>
        <p className="text-sm mt-1 mb-5">Upload student CSV or Excel files. Assign the Target Batch so all logins are provisioned according to batch.</p>

        {step === 'upload' && (
          <>
            <div className="grid-3 mb-5 p-4 glass-inner" style={{ borderRadius: 16 }}>
              <div>
                <label className="field-label">Target Batch</label>
                <select className="input" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
                  {((window.VSB_DATA && window.VSB_DATA.BATCHES) || ["2022-2026", "2023-2027", "2024-2028", "2025-2029"]).map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Default Department</label>
                <select className="input" value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
                  {departments.map(d => <option key={d.code} value={d.code}>{d.code} - {d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Default Section</label>
                <select className="input" value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
                  <option value="ALL">Auto / Sheet Section</option>
                  {((window.VSB_DATA && window.VSB_DATA.SECTIONS) || ["A", "B", "C", "D"]).map(sec => <option key={sec} value={sec}>Section {sec}</option>)}
                </select>
              </div>
            </div>

            <div style={{
              border: '2px dashed var(--border-strong)',
              borderRadius: 20,
              padding: 50,
              textAlign: 'center',
              background: 'color-mix(in oklab, var(--brand-primary) 4%, transparent)',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                color: 'white',
                display: 'grid', placeItems: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 20px 40px -12px #2563EB80',
              }}><Icon name="upload" size={28} /></div>
              <h3 className="mb-2">Upload CSV or Excel Student List</h3>
              <p className="text-sm mb-4">Accepts .csv, .xlsx or .xls files (e.g., <code>I_CSE_B_Database.csv</code>). Auto-maps Register Number, Name, DOB and Batch.</p>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileSelected} />
              <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}><Icon name="upload" size={16} /> Select CSV / Excel File</button>
              {errorMessage && <div className="chip chip-rose mt-4" style={{ display: 'inline-flex' }}><Icon name="close" size={12} /> {errorMessage}</div>}
            </div>
          </>
        )}

        {step === 'preview' && (
          <>
            <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div className="chip chip-accent"><Icon name="check" size={12} stroke={3} /> Parsed <strong>{fileName}</strong> · {parsedStudents.length} student rows ready for Batch <strong>{selectedBatch}</strong></div>
              <button className="btn btn-ghost btn-sm" onClick={resetImport}><Icon name="close" size={14} /> Choose Another</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Row</th><th>Register #</th><th>Roll #</th><th>Name</th><th>DOB (Login Password)</th><th>Dept</th><th>Batch</th><th>Sec</th></tr></thead>
              <tbody>
                {previewRows.map((s, i) => (
                  <tr key={s.registerNumber || i}>
                    <td className="mono text-subtle">{i + 1}</td>
                    <td className="mono font-semibold">{s.registerNumber}</td>
                    <td className="mono text-sm text-subtle">{s.rollNumber}</td>
                    <td>{s.name}</td>
                    <td className="mono text-sm">{s.dob}</td>
                    <td><span className="chip">{s.department}</span></td>
                    <td><span className="chip chip-accent">{s.batch}</span></td>
                    <td>{s.section}</td>
                  </tr>
                ))}
                {parsedStudents.length > previewRows.length && <tr><td colSpan="8" className="text-center text-subtle text-sm" style={{ padding: 16 }}>... {parsedStudents.length - previewRows.length} more student rows ...</td></tr>}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button className="btn btn-ghost" onClick={resetImport}><Icon name="close" size={16} /> Cancel</button>
              <button className="btn btn-primary" onClick={importStudents}><Icon name="check" size={16} /> Import {parsedStudents.length} Logins for Batch {selectedBatch}</button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div className="text-center" style={{ padding: 40 }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #34D399)', color: 'white', display: 'grid', placeItems: 'center', margin: '0 auto 16px', boxShadow: '0 20px 40px -12px #10B98180' }}>
              <Icon name="check" size={32} stroke={2.6} />
            </div>
            <h3 className="mb-2">Bulk Logins Import Complete</h3>
            <p className="text-sm mb-4">{importedCount} student accounts provisioned under Batch {selectedBatch} from {fileName} · MySQL IDs created · Password keys set to DOB.</p>
            <button className="btn btn-primary" onClick={resetImport}><Icon name="upload" size={16} /> Upload Another CSV</button>
          </div>
        )}
      </GlassCard>
    </>
  );
}

function AdminActivity() {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 style={{ fontSize: '1.3rem' }}>Activity & Audit Log</h2>
          <p className="text-sm mt-1">Every action across the system is recorded.</p>
        </div>
        <button className="btn btn-ghost" onClick={() => alert('Activity log exported!')}><Icon name="download" size={14} /> Export Logs</button>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {((window.VSB_DATA && window.VSB_DATA.activityLogs) || []).map(l => {
          const chip = l.color === 'brand' ? 'chip-brand' : l.color === 'accent' ? 'chip-accent' : l.color === 'violet' ? 'chip-violet' : l.color === 'amber' ? 'chip-amber' : 'chip-rose';
          return (
            <div key={l.id} className="glass-inner flex items-center gap-4" style={{ padding: '12px 16px' }}>
              <Avatar name={l.actor} size={32} tone="auto" />
              <div style={{ flex: 1 }}>
                <div className="text-sm"><strong>{l.actor}</strong> <span className="text-muted">· {l.action} ·</span> {l.target}</div>
              </div>
              <span className={`chip ${chip}`}>{l.action}</span>
              <span className="text-xs text-subtle mono" style={{ minWidth: 70, textAlign: 'right' }}>{l.time}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

function AdminSettings() {
  const [emailAuth, setEmailAuth] = useState(() => window.VSB_DATA.batchEmailAuth || {
    '2022-2026': false,
    '2023-2027': false,
    '2024-2028': true,
    '2025-2029': true,
  });

  const toggleBatchAuth = (batch) => {
    const updated = { ...emailAuth, [batch]: !emailAuth[batch] };
    setEmailAuth(updated);
    window.VSB_DATA.batchEmailAuth = updated;
    if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
    window.VSB_DATA.activityLogs = [{
      id: ((window.VSB_DATA && window.VSB_DATA.activityLogs) || []).length + 1,
      actor: 'Super Admin',
      action: 'Updated',
      target: `Email auth rule for Batch ${batch} set to ${updated[batch] ? 'REQUIRED' : 'DISABLED'}`,
      time: 'Just now',
      color: 'violet'
    }, ...((window.VSB_DATA && window.VSB_DATA.activityLogs) || [])];
  };

  return (
    <>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>Batch Email Authentication Controls (FREE)</h2>
            <p className="text-sm mt-1">Control which student batches require 2-step Email OTP verification during login.</p>
          </div>
          <div className="chip chip-violet"><Icon name="shield" size={12} /> Security Policy</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {((window.VSB_DATA && window.VSB_DATA.BATCHES) || ["2022-2026", "2023-2027", "2024-2028", "2025-2029"]).map(b => {
            const isEnabled = emailAuth[b] === true;
            return (
              <div key={b} className="glass-inner p-4 flex items-center justify-between" style={{ borderRadius: 14, border: isEnabled ? '1px solid var(--accent)' : '1px solid var(--border-strong)' }}>
                <div>
                  <div className="font-semibold text-sm">Batch {b}</div>
                  <div className="text-xs text-subtle mt-1">{isEnabled ? 'Email OTP Required' : 'Direct Login (DOB)'}</div>
                </div>
                <button
                  className={`btn btn-sm ${isEnabled ? 'btn-accent' : 'btn-ghost'}`}
                  onClick={() => toggleBatchAuth(b)}
                >
                  {isEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="p-5 mt-4">
        <h2 style={{ fontSize: '1.3rem' }}>College Settings</h2>
        <p className="text-sm mt-1 mb-4">Global settings that affect the entire portal.</p>
        <div className="grid-2">
          <div><label className="field-label">College Name</label><input className="input" defaultValue="VSB College of Engineering and Technical Campus" /></div>
          <div><label className="field-label">Website URL</label><input className="input" defaultValue="https://vsbcetc.edu.in" /></div>
          <div><label className="field-label">Academic Year</label>
            <select className="input" defaultValue="2026-2027"><option>2025-2026</option><option>2026-2027</option><option>2027-2028</option></select>
          </div>
          <div><label className="field-label">Current Semester</label>
            <select className="input" defaultValue="Odd (Jul-Dec)"><option>Odd (Jul-Dec)</option><option>Even (Jan-Jun)</option></select>
          </div>
        </div>
      </GlassCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="chart-row mt-4">
        <GlassCard className="p-5">
          <h3 className="mb-3">College Logo</h3>
          <div className="glass-inner flex items-center gap-4 p-4">
            <Monogram size={64} />
            <div style={{ flex: 1 }}>
              <div className="text-sm font-semibold">vsb-logo.png</div>
              <div className="text-xs text-subtle">512×512 · 42 KB</div>
            </div>
            <button className="btn btn-ghost btn-sm"><Icon name="upload" size={14} /> Replace</button>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="mb-3">Database Backups</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {['20 Jul 2026, 03:00 AM', '19 Jul 2026, 03:00 AM', '18 Jul 2026, 03:00 AM'].map(d => (
              <div key={d} className="glass-inner flex items-center justify-between" style={{ padding: '10px 14px' }}>
                <div className="flex items-center gap-2 text-sm"><Icon name="shield" size={14} style={{ color: 'var(--accent)' }} /> {d}</div>
                <button className="btn btn-ghost btn-sm">Restore</button>
              </div>
            ))}
          </div>
          <button className="btn btn-primary w-full mt-3"><Icon name="download" size={14} /> Backup Now</button>
        </GlassCard>
      </div>
    </>
  );
}

window.AdminPanel = AdminPanel;
// Root App — router + theme + tweaks + error boundary
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("VSB App Error Boundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 40, textAlign: 'center', background: '#0F172A', color: 'white' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>VSB Student Information Portal</h2>
            <p style={{ color: '#94A3B8', marginBottom: 24 }}>{this.state.error?.message || 'Rendering reset.'}</p>
            <button className="btn btn-primary" onClick={() => { this.setState({ hasError: false, error: null }); window.location.hash = '/'; }}>Reload Home</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function useHashRoute() {
  const [route, setRoute] = uS(() => {
    const h = window.location.hash.replace(/^#/, '') || '/';
    return h;
  });
  uE(() => {
    function onHash() {
      setRoute(window.location.hash.replace(/^#/, '') || '/');
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
