// Teacher Dashboard — filter-first hero, stats, student table
function TeacherDashboard({ onNavigate }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(() => {
    return window.VSB_DATA.selectedFilter || { dept: 'CSE', batch: '2023-2027', section: 'ALL' };
  });
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const perPage = 8;

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
          setStudents(list);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) setLoading(false);
      }
    }
    loadStudents();
    return () => { active = false; };
  }, [filter]);

  const filtered = useMemo(() => {
    return students
      .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.registerNumber.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'cgpa') return parseFloat(b.cgpa || 0) - parseFloat(a.cgpa || 0);
        if (sortBy === 'completion') return (b.profileCompletion || 0) - (a.profileCompletion || 0);
        return 0;
      });
  }, [students, query, sortBy]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const stats = useMemo(() => {
    const total = filtered.length;
    const male = filtered.filter(s => s.gender === 'Male').length;
    const female = filtered.filter(s => s.gender === 'Female').length;
    const completed = filtered.filter(s => s.profileCompletion >= 90).length;
    const arrears = filtered.filter(s => s.arrears > 0).length;
    const placed = filtered.filter(s => s.placement.status === 'Placed').length;
    const avgCgpa = total > 0 ? (filtered.reduce((a, s) => a + parseFloat(s.cgpa), 0) / total).toFixed(2) : '—';
    return { total, male, female, completed, incomplete: total - completed, arrears, placed, avgCgpa };
  }, [filtered]);

  return (
    <div className="screen-enter" style={{ paddingTop: 96, paddingBottom: 80 }} data-screen-label="Teacher Dashboard">
      <div className="container">
        {/* Filter hero */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="chip chip-accent mb-2"><Icon name="teacher" size={14} /> Dr. Ramesh Kumar M. · CSE HOD</div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>Faculty Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost"><Icon name="bell" size={16} /> Notifications</button>
              <button className="btn btn-ghost" onClick={() => onNavigate('/')}><Icon name="logout" size={16} /> Logout</button>
            </div>
          </div>

          <GlassCard strong className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="filter" size={18} style={{ color: 'var(--brand-primary)' }} />
              <div className="font-semibold">Active Filter</div>
              <span className="chip chip-brand">{filter.dept}</span>
              <span className="chip chip-accent">{filter.batch}</span>
              <span className="chip">Section {filter.section === 'ALL' ? 'All' : filter.section}</span>
              <span className="text-sm text-muted" style={{ marginLeft: 'auto' }}>{filtered.length} students matched</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr auto', gap: 12 }} className="filter-row">
              <FilterSelect label="Department" value={filter.dept} onChange={v => setFilter({ ...filter, dept: v })}
                options={[{ v: 'ALL', l: 'All Departments' }, ...window.VSB_DATA.DEPARTMENTS.map(d => ({ v: d.code, l: `${d.code} — ${d.name}` }))]} />
              <FilterSelect label="Batch" value={filter.batch} onChange={v => setFilter({ ...filter, batch: v })}
                options={[{ v: 'ALL', l: 'All Batches' }, ...window.VSB_DATA.BATCHES.map(b => ({ v: b, l: b }))]} />
              <FilterSelect label="Section" value={filter.section} onChange={v => setFilter({ ...filter, section: v })}
                options={[{ v: 'ALL', l: 'All Sections' }, ...window.VSB_DATA.SECTIONS.map(s => ({ v: s, l: `Section ${s}` }))]} />
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16, marginBottom: 24 }} className="chart-row">
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
          <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div className="flex items-center gap-2">
              <div style={{ position: 'relative' }}>
                <input className="input" placeholder="Search by name or register #" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 40, width: 320 }} />
                <Icon name="search" size={16} style={{ position: 'absolute', left: 14, top: 16, color: 'var(--text-subtle)' }} />
              </div>
              <select className="input" style={{ width: 180, padding: '12px 14px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="name">Sort: Name</option>
                <option value="cgpa">Sort: CGPA (high→low)</option>
                <option value="completion">Sort: Completion %</option>
              </select>
            </div>
            <div className="flex gap-2">
              {selected.size > 0 && (
                <>
                  <span className="chip chip-brand">{selected.size} selected</span>
                  <button className="btn btn-ghost btn-sm"><Icon name="edit" size={14} /> Bulk Edit</button>
                  <button className="btn btn-ghost btn-sm"><Icon name="check" size={14} /> Approve</button>
                </>
              )}
              <button className="btn btn-ghost btn-sm"><Icon name="upload" size={14} /> Bulk Upload</button>
              <button className="btn btn-accent btn-sm"><Icon name="download" size={14} /> Export Excel</button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}><input type="checkbox" onChange={e => {
                    if (e.target.checked) setSelected(new Set(paged.map(s => s.registerNumber)));
                    else setSelected(new Set());
                  }} /></th>
                  <th>Student</th>
                  <th>Register #</th>
                  <th>Dept</th>
                  <th>Sec</th>
                  <th>CGPA</th>
                  <th>Arrears</th>
                  <th>Profile</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(s => (
                  <tr key={s.registerNumber}>
                    <td>
                      <input type="checkbox"
                        checked={selected.has(s.registerNumber)}
                        onChange={e => {
                          const next = new Set(selected);
                          if (e.target.checked) next.add(s.registerNumber);
                          else next.delete(s.registerNumber);
                          setSelected(next);
                        }} />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} size={36} tone="auto" />
                        <div>
                          <div style={{ fontWeight: 600 }}>{s.name}</div>
                          <div className="text-xs text-subtle">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono text-sm">{s.registerNumber}</td>
                    <td><span className="chip">{s.department}</span></td>
                    <td>{s.section}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: parseFloat(s.cgpa) >= 8 ? 'var(--accent)' : parseFloat(s.cgpa) < 7 ? '#EF4444' : 'inherit' }}>{s.cgpa}</span>
                    </td>
                    <td>
                      {s.arrears > 0 ? <span className="chip chip-rose">{s.arrears}</span> : <span className="text-subtle">—</span>}
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <div className="flex items-center gap-2">
                        <div className="progress" style={{ flex: 1 }}><div style={{ width: `${s.profileCompletion}%` }} /></div>
                        <span className="text-xs" style={{ fontWeight: 600, color: s.profileCompletion >= 90 ? 'var(--accent)' : s.profileCompletion < 60 ? '#EF4444' : 'var(--text-muted)' }}>{s.profileCompletion}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`chip ${s.approved ? 'chip-accent' : 'chip-amber'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={async () => {
                          try {
                            const nextApproved = !s.approved;
                            await window.VSB_API.approveStudent(s.registerNumber, nextApproved);
                            setStudents(prev => prev.map(x => x.registerNumber === s.registerNumber ? { ...x, approved: nextApproved } : x));
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        {s.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} onClick={() => {
                          window.VSB_DATA.currentStudentRegNum = s.registerNumber;
                          onNavigate('/student');
                        }}><Icon name="eye" size={14} /></button>
                        <button className="btn btn-ghost btn-icon" style={{ padding: 6 }}><Icon name="edit" size={14} /></button>
                        <button className="btn btn-ghost btn-icon" style={{ padding: 6 }}><Icon name="download" size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div className="text-sm text-muted">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}</div>
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
  const pct = (value / max) * 100;
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
