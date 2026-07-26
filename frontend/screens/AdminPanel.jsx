// Admin Panel — full CRUD, bulk import, settings, activity logs
function AdminPanel({ onNavigate }) {
  const [tab, setTab] = useState('overview');
  const [departments, setDepartments] = useState(window.VSB_DATA.DEPARTMENTS);
  const [teachers, setTeachers] = useState(window.VSB_DATA.teachers);
  const [studentsList, setStudentsList] = useState(window.VSB_DATA.students);
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
      id: window.VSB_DATA.activityLogs.length + 1,
      actor: 'Super Admin',
      action: 'Created',
      target: `Department ${code} (${name})`,
      time: 'Just now',
      color: 'accent'
    }, ...window.VSB_DATA.activityLogs];
    setNewDept({ code: '', name: '', hod: '', color: '#2563EB' });
    setShowAddForm(false);
    alert('Department added successfully!');
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
            const studentCount = window.VSB_DATA.students.filter(s => s.department === d.code).length;
            const facultyCount = window.VSB_DATA.teachers.filter(t => t.department === d.code).length;
            return (
              <tr key={d.code}>
                <td><div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(135deg, ${d.color}, color-mix(in oklab, ${d.color} 60%, white))`, color: 'white', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.72rem' }}>{d.code}</div></td>
                <td>{d.name}</td>
                <td>{d.hod}</td>
                <td className="mono">{studentCount}</td>
                <td className="mono">{facultyCount}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} onClick={() => alert(`Edit: ${d.name} (HOD: ${d.hod})`)}><Icon name="edit" size={14} /></button>
                    <button className="btn btn-ghost btn-icon" style={{ padding: 6, color: '#EF4444' }} onClick={() => { if(confirm(`Delete ${d.name}?`)) setDepartments(departments.filter(dp => dp.code !== d.code)); }}><Icon name="trash" size={14} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </GlassCard>
  );
}

function AdminTeachers({ teachers, setTeachers, departments }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const defaultDepartment = departments[0]?.code || 'CSE';
  const [newTeacher, setNewTeacher] = useState({ id: '', name: '', username: '', department: defaultDepartment, role: 'Faculty', email: '' });

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
                  <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} onClick={() => alert(`Edit teacher: ${t.name} (${t.username})`)}><Icon name="edit" size={14} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ padding: 6 }}><Icon name="settings" size={14} /></button>
                  <button className="btn btn-ghost btn-icon" style={{ padding: 6, color: '#EF4444' }} onClick={() => { if(confirm(`Delete ${t.name}?`)) setTeachers(teachers.filter(tr => tr.id !== t.id)); }}><Icon name="trash" size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    return studentsList.filter(s => {
      const matchDept = filterDept === 'ALL' || s.department === filterDept;
      const matchBatch = filterBatch === 'ALL' || s.batch === filterBatch;
      const matchSec = filterSec === 'ALL' || s.section === filterSec;
      const matchQ = !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.registerNumber.toLowerCase().includes(query.toLowerCase()) ||
        (s.rollNumber && s.rollNumber.toLowerCase().includes(query.toLowerCase())) ||
        (s.email && s.email.toLowerCase().includes(query.toLowerCase()));
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
      id: window.VSB_DATA.activityLogs.length + 1,
      actor: 'Super Admin',
      action: 'create',
      target: `Student ${createdStudent.name} (${regNumUpper})`,
      time: 'Just now',
      color: 'accent'
    };
    window.VSB_DATA.activityLogs = [newLog, ...window.VSB_DATA.activityLogs];

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
                  {window.VSB_DATA.BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Section</label>
                <select className="input" value={newStudent.section} onChange={e => setNewStudent({...newStudent, section: e.target.value})}>
                  {window.VSB_DATA.SECTIONS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
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
              {window.VSB_DATA.BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Section</label>
            <select className="input" value={filterSec} onChange={e => { setFilterSec(e.target.value); setPage(1); }}>
              <option value="ALL">All Sections</option>
              {window.VSB_DATA.SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
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
                      <button className="btn btn-ghost btn-icon" style={{ padding: 6 }} title="View details" onClick={() => alert(`Student: ${s.name}\nReg #: ${s.registerNumber}\nRoll #: ${s.rollNumber}\nDept: ${s.department}\nBatch: ${s.batch}\nSection: ${s.section}\nDOB: ${s.dob}\nPhone: ${s.phone}`)}><Icon name="eye" size={14} /></button>
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
      const existing = new Set(window.VSB_DATA.students.map(s => s.registerNumber.toUpperCase()));
      const studentsToAdd = parsedStudents.filter(s => !existing.has(s.registerNumber.toUpperCase()));
      
      await window.VSB_API.bulkImportStudents(parsedStudents);
      
      window.VSB_DATA.activityLogs = [{
        id: window.VSB_DATA.activityLogs.length + 1,
        actor: 'Super Admin',
        action: 'Imported',
        target: `${parsedStudents.length} students (Batch ${selectedBatch}) from ${fileName}`,
        time: 'Just now',
        color: 'accent'
      }, ...window.VSB_DATA.activityLogs];

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
                  {window.VSB_DATA.BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
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
                  {window.VSB_DATA.SECTIONS.map(sec => <option key={sec} value={sec}>Section {sec}</option>)}
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
        {window.VSB_DATA.activityLogs.map(l => {
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
    window.VSB_DATA.activityLogs = [{
      id: window.VSB_DATA.activityLogs.length + 1,
      actor: 'Super Admin',
      action: 'Updated',
      target: `Email auth rule for Batch ${batch} set to ${updated[batch] ? 'REQUIRED' : 'DISABLED'}`,
      time: 'Just now',
      color: 'violet'
    }, ...window.VSB_DATA.activityLogs];
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
          {window.VSB_DATA.BATCHES.map(b => {
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
