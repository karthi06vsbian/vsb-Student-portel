// Admin Panel — full CRUD, bulk import, settings, activity logs
function AdminPanel({ onNavigate }) {
  const [tab, setTab] = useState('overview');
  const [departments, setDepartments] = useState(window.VSB_DATA.DEPARTMENTS);
  const [teachers, setTeachers] = useState(window.VSB_DATA.teachers);

  const saveDepartments = (nextDepartments) => {
    window.VSB_DATA.DEPARTMENTS = nextDepartments;
    setDepartments(nextDepartments);
  };

  const saveTeachers = (nextTeachers) => {
    window.VSB_DATA.teachers = nextTeachers;
    setTeachers(nextTeachers);
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
            <button className="btn btn-ghost"><Icon name="bell" size={16} /> 3 pending</button>
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
            {tab === 'overview' && <AdminOverview departments={departments} />}
            {tab === 'departments' && <AdminDepartments departments={departments} setDepartments={saveDepartments} />}
            {tab === 'teachers' && <AdminTeachers teachers={teachers} setTeachers={saveTeachers} departments={departments} />}
            {tab === 'students' && <AdminStudentLogins departments={departments} />}
            {tab === 'import' && <AdminBulkImport departments={departments} />}
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

function AdminOverview({ departments }) {
  const chartValues = departments.map((_, index) => 360 + ((index * 83) % 420));

  return (
    <>
      <div className="grid-4">
        <StatCard label="Total Students" value="4,286" delta="+312 this year" icon="users" tone="brand" />
        <StatCard label="Departments" value={departments.length} delta="Active" icon="building" tone="accent" />
        <StatCard label="Faculty Accounts" value="182" delta="12 pending" icon="teacher" tone="amber" />
        <StatCard label="Storage Used" value="12.4 GB" delta="of 50 GB MySQL" icon="file" tone="brand" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }} className="chart-row">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-subtle font-semibold" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Department-wise Students</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginTop: 4 }}>Enrollment across streams</div>
            </div>
          </div>
          <BarChart
            data={chartValues}
            labels={departments.map(d => d.code)}
            colors={departments.map(d => d.color)}
            height={200}
          />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="text-xs text-subtle font-semibold mb-4" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Profile Completion</div>
          <div className="flex items-center gap-4">
            <DonutChart size={160} thickness={22} segments={[
              { value: 68, color: '#10B981' },
              { value: 22, color: '#F59E0B' },
              { value: 10, color: '#EF4444' },
            ]} centerValue="68%" centerLabel="complete" />
            <div style={{ display: 'grid', gap: 12 }}>
              <LegendRow color="#10B981" label="90-100%" value="2,914" />
              <LegendRow color="#F59E0B" label="60-90%"  value="944" />
              <LegendRow color="#EF4444" label="< 60%"   value="428" />
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
          <div className="text-xs text-subtle font-semibold mb-4" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>MySQL Queries (7d)</div>
          <LineChart data={[4200, 3800, 5100, 6400, 5900, 7200, 6800]} height={140} color="var(--accent)" />
          <div className="flex justify-between mt-2 text-xs text-subtle">
            <span className="text-muted">42.4k queries</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Within quota</span>
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
          <button className="btn btn-ghost"><Icon name="upload" size={16} /> Import CSV</button>
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

function AdminStudentLogins({ departments }) {
  const [studentsList, setStudentsList] = useState(window.VSB_DATA.students);
  
  useEffect(() => {
    let active = true;
    async function loadStudents() {
      try {
        const list = await window.VSB_API.getTeacherStudents('', '', '');
        if (active) setStudentsList(list);
      } catch (err) {
        console.error(err);
      }
    }
    loadStudents();
    return () => { active = false; };
  }, []);
  const defaultDepartment = departments[0]?.code || 'CSE';
  const [newStudent, setNewStudent] = useState({
    registerNumber: '',
    name: '',
    department: defaultDepartment,
    batch: window.VSB_DATA.BATCHES[0] || '2023-2027',
    section: window.VSB_DATA.SECTIONS[0] || 'A',
    phone: '',
    email: '',
    dob: '',
  });

  useEffect(() => {
    if (!departments.some(d => d.code === newStudent.department)) {
      setNewStudent(current => ({ ...current, department: defaultDepartment }));
    }
  }, [departments, defaultDepartment, newStudent.department]);

  const handleCreateAccount = () => {
    if (!newStudent.registerNumber.trim() || !newStudent.name.trim()) {
      alert('Please fill at least Register Number and Student Name');
      return;
    }
    const regNumUpper = newStudent.registerNumber.trim().toUpperCase();
    if (window.VSB_DATA.students.some(s => s.registerNumber.toUpperCase() === regNumUpper)) {
      alert('Student with this Register Number already exists!');
      return;
    }

    const deptObj = departments.find(d => d.code === newStudent.department) || departments[0];
    const startYear = parseInt(newStudent.batch.split('-')[0]) || 2024;
    const yearNum = Math.min(4, 2026 - startYear + 1);

    const createdStudent = {
      registerNumber: regNumUpper,
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
      linkedin: '', github: '', leetcode: null,
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
    setStudentsList(window.VSB_DATA.students);

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
      name: '',
      department: defaultDepartment,
      batch: window.VSB_DATA.BATCHES[0] || '2023-2027',
      section: window.VSB_DATA.SECTIONS[0] || 'A',
      phone: '',
      email: '',
      dob: '',
    });

    alert('Student account created successfully!');
  };

  const s = studentsList.slice(0, 6);
  return (
    <>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>Create Student Login</h2>
            <p className="text-sm mt-1">Provision a new student account. MySQL ID is generated automatically.</p>
          </div>
        </div>
        <div className="grid-3">
          <div>
            <label className="field-label">Register Number</label>
            <input className="input" placeholder="2024CS001" value={newStudent.registerNumber} onChange={e => setNewStudent({...newStudent, registerNumber: e.target.value})} />
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
            <label className="field-label">Phone</label>
            <input className="input" placeholder="+91 98765 43210" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Email</label>
            <input className="input" placeholder="name@vsb.edu.in" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
          </div>
          <div>
            <label className="field-label">Date of Birth</label>
            <input className="input" type="date" value={newStudent.dob} onChange={e => setNewStudent({...newStudent, dob: e.target.value})} />
          </div>
          <div>
            <label className="field-label">MySQL ID</label>
            <input className="input mono" value={newStudent.registerNumber ? `mysql_${newStudent.registerNumber.toLowerCase()}_xxxx` : "auto-generated"} disabled />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn btn-primary" onClick={handleCreateAccount}><Icon name="plus" size={16} /> Create Account</button>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3>Recently created</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => alert('Exported student login list!')}><Icon name="download" size={14} /> Export</button>
        </div>
        <table className="data-table">
          <thead><tr><th>Register #</th><th>Name</th><th>Dept</th><th>MySQL ID</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {s.map(x => (
              <tr key={x.registerNumber}>
                <td className="mono">{x.registerNumber}</td>
                <td>{x.name}</td>
                <td><span className="chip">{x.department}</span></td>
                <td className="mono text-xs text-muted">{x.mysqlId || `mysql_${x.registerNumber.toLowerCase()}_seed`}</td>
                <td className="text-sm text-muted">{x.createdTime || "Today, 10:32 AM"}</td>
                <td><button className="btn btn-ghost btn-icon" style={{ padding: 6 }} onClick={() => alert(`Details for ${x.name}:\nRegister: ${x.registerNumber}\nDepartment: ${x.department}\nBatch: ${x.batch}\nSection: ${x.section}\nDOB: ${x.dob || 'N/A'}`)}><Icon name="eye" size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </>
  );
}

function AdminBulkImport({ departments }) {
  const [step, setStep] = useState('upload');
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

    // Direct regex check for YYYY-MM-DD to avoid timezone shifting
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
    return raw || (sheetMatch ? sheetMatch[1].toUpperCase() : 'A');
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
  const buildStudentFromRow = (row, indexes, sheetName) => {
    const name = String(row[indexes.name] || '').trim();
    if (!name) return null;

    const rollNumber = String(row[indexes.roll] || '').trim();
    const registerNo = String(row[indexes.register] || '').trim();
    const registerNumber = (registerNo || rollNumber || `BULK${Date.now()}${Math.random().toString(36).slice(2, 6)}`).toUpperCase();
    const deptCode = String(row[indexes.department] || 'CSE').trim().toUpperCase() || 'CSE';
    const deptObj = departments.find(d => d.code === deptCode) || window.VSB_DATA.DEPARTMENTS.find(d => d.code === deptCode) || departments[0];
    const admittedYear = String(row[indexes.year] || '2024').trim().slice(0, 4);
    const batchStart = /^\d{4}$/.test(admittedYear) ? Number(admittedYear) : 2024;
    const genderCode = String(row[indexes.gender] || '').trim().toUpperCase();
    const dob = toExcelDate(row[indexes.dob]);

    // Fetch new details from sheet
    const admissionNumber = String(row[indexes.admissionNumber] || '').trim();
    const modeOfAdmission = String(row[indexes.modeOfAdmission] || '').trim();
    const admissionQuota = String(row[indexes.admissionQuota] || '').trim();
    const dateOfAdmission = toExcelDate(row[indexes.dateOfAdmission]);
    const regulation = String(row[indexes.regulation] || '').trim();
    const emisNo = String(row[indexes.emisNo] || '').trim();
    const tamilMedium = String(row[indexes.tamilMedium] || '').trim();
    const physicallyChallenged = String(row[indexes.physicallyChallenged] || '').trim();
    const religion = String(row[indexes.religion] || '').trim();
    const caste = String(row[indexes.caste] || '').trim();
    const nationality = String(row[indexes.nationality] || '').trim();

    // Board of study & marks
    const sslcBoard = String(row[indexes.sslcBoard] || '').trim();
    const sslcMarks = String(row[indexes.sslcMarks] || '').trim();
    const hscBoard = String(row[indexes.hscBoard] || '').trim();
    const hscMarks = String(row[indexes.hscMarks] || '').trim();
    const hscCutoff = String(row[indexes.hscCutoff] || '').trim();
    const hscYear = String(row[indexes.hscYear] || '').trim();
    const diplomaRaw = String(row[indexes.diploma] || '').trim();
    const diploma = (diplomaRaw && diplomaRaw.toLowerCase() !== 'null') ? `${diplomaRaw}%` : null;

    // Contact & Family
    const altEmail = String(row[indexes.altEmail] || '').trim();
    const phone = String(row[indexes.phone] || '').trim();
    const parentPhone = String(row[indexes.parentPhone] || '').trim();
    const parentName = String(row[indexes.parentName] || '').trim();
    const relation = String(row[indexes.relation] || '').trim();

    // Address
    const door = String(row[indexes.door] || '').trim();
    const town = String(row[indexes.town] || '').trim();
    const city = String(row[indexes.city] || '').trim();
    const state = String(row[indexes.state] || '').trim();
    const pincode = String(row[indexes.pincode] || '').trim();
    const addressParts = [door, town, city, state, pincode].filter(Boolean);
    const address = addressParts.join(', ');
    const hometown = city || town || '';

    const boardingStatus = String(row[indexes.boarding] || '').trim();
    const residence = boardingStatus === '1' ? 'Hosteller' : 'Day Scholar';
    const rawAadhaar = String(row[indexes.aadhaar] || '').trim();
    const aadhaar = rawAadhaar.length >= 4 ? `**** **** ${rawAadhaar.slice(-4)}` : rawAadhaar;

    return {
      registerNumber,
      name,
      gender: genderCode === 'F' ? 'Female' : genderCode === 'T' ? 'Transgender' : 'Male',
      photo: null,
      department: deptCode,
      departmentName: deptObj ? deptObj.name : deptCode,
      batch: `${batchStart}-${batchStart + 4}`,
      section: toSection(row[indexes.section], sheetName),
      year: Math.min(4, 2026 - batchStart + 1),
      email: String(row[indexes.email] || '').trim() || makeEmail(name, registerNumber),
      phone,
      dob,
      bloodGroup: String(row[indexes.bloodGroup] || '').trim(),
      community: String(row[indexes.community] || '').trim(),
      hometown,
      address,
      aadhaar,
      rawAadhaar,
      
      // Academic
      sslc: sslcMarks ? `${sslcMarks} Marks (${sslcBoard || 'State Board'})` : '',
      hsc: hscMarks ? `${hscMarks} Marks (Cutoff: ${hscCutoff || 'N/A'})` : '',
      diploma,
      cgpa: '8.50',
      arrears: 0,

      skills: ['React', 'Node.js'],
      languages: ['Tamil', 'English'],
      internships: 0, projects: 1, hackathons: 0, certificates: 1,
      linkedin: '', github: '', leetcode: null,
      placement: { status: 'Not Applied', company: null, package: null },
      transport: residence === 'Hosteller' ? 'None' : 'College Bus',
      residence,
      emergencyContact: parentPhone || phone || '',
      parentName,
      parentPhone,
      parentOccupation: 'Farmer',

      // New details
      admissionNumber,
      modeOfAdmission,
      admissionQuota,
      dateOfAdmission,
      regulation,
      emisNo,
      tamilMedium: tamilMedium === '1' ? 'Yes' : 'No',
      physicallyChallenged: physicallyChallenged === 'Y' ? 'Yes' : 'No',
      religion,
      caste,
      nationality,
      altEmail,
      relation,

      profileCompletion: dob ? 55 : 45,
      approved: true,
      lastUpdated: 'Today',
      rollNumber,
      mysqlId: `mysql_${registerNumber.toLowerCase()}_${Math.random().toString(36).slice(2, 10)}`,
      createdTime: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const parseWorkbookRows = (workbook) => {
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true, defval: '' });
    const headerRowIndex = rows.findIndex(row => row.some(cell => normalizeHeader(cell).includes('studentname')) && row.some(cell => normalizeHeader(cell).includes('dob')));
    if (headerRowIndex === -1) throw new Error('Could not find Student Name and DOB columns in this sheet.');

    const headers = rows[headerRowIndex];
    const indexes = {
      name: getHeaderIndex(headers, ['studentnamewithinitial', 'studentname', 'fullname']),
      dob: getHeaderIndex(headers, ['dob', 'dateofbirth']),
      roll: getHeaderIndex(headers, ['rollnumber']),
      register: getHeaderIndex(headers, ['registerno', 'registernumber']),
      department: getHeaderIndex(headers, ['programmecode', 'department']),
      year: getHeaderIndex(headers, ['yearofadmission']),
      section: getHeaderIndex(headers, ['section']),
      gender: getHeaderIndex(headers, ['gender']),
      admissionNumber: getHeaderIndex(headers, ['admnno', 'admissionno']),
      modeOfAdmission: getHeaderIndex(headers, ['modeofadmission']),
      admissionQuota: getHeaderIndex(headers, ['admissionquota']),
      dateOfAdmission: getHeaderIndex(headers, ['dateofadmission']),
      regulation: getHeaderIndex(headers, ['regulation']),
      emisNo: getHeaderIndex(headers, ['emisno']),
      tamilMedium: getHeaderIndex(headers, ['tamilmedium']),
      physicallyChallenged: getHeaderIndex(headers, ['physicallychalanged', 'physicallychallenged']),
      religion: getHeaderIndex(headers, ['religion']),
      caste: getHeaderIndex(headers, ['caste']),
      nationality: getHeaderIndex(headers, ['nationality']),
      sslcBoard: getHeaderIndex(headers, ['boardofstudyin10']),
      sslcMarks: getHeaderIndex(headers, ['10thmarks']),
      hscBoard: getHeaderIndex(headers, ['boardofstudyin2']),
      hscMarks: getHeaderIndex(headers, ['12thmarks']),
      hscCutoff: getHeaderIndex(headers, ['cutoff']),
      hscYear: getHeaderIndex(headers, ['yearofpassinghsc']),
      diploma: getHeaderIndex(headers, ['percentagediploma', 'diplomapercentage']),
      altEmail: getHeaderIndex(headers, ['alternateemail']),
      relation: getHeaderIndex(headers, ['relation']),
      door: getHeaderIndex(headers, ['doorno', 'street']),
      town: getHeaderIndex(headers, ['towntaluk', 'town', 'taluk']),
      city: getHeaderIndex(headers, ['citydistrict', 'city', 'district']),
      state: getHeaderIndex(headers, ['state']),
      pincode: getHeaderIndex(headers, ['pincode']),
      bloodGroup: getHeaderIndex(headers, ['bloodgroup']),
      community: getHeaderIndex(headers, ['community']),
      boarding: getHeaderIndex(headers, ['boardingstatus']),
      parentName: getHeaderIndex(headers, ['parentname', 'parenthusbandname']),
      parentPhone: getHeaderIndex(headers, ['parentmobileno', 'parentphone']),
      phone: getHeaderIndex(headers, ['studentmobileno', 'studentphone']),
      email: getHeaderIndex(headers, ['emailid', 'email']),
      aadhaar: getHeaderIndex(headers, ['aadhaarnumber', 'aadhaar']),
    };

    if (indexes.name === -1 || indexes.dob === -1) {
      throw new Error('Student Name and DOB columns are required.');
    }

    return rows.slice(headerRowIndex + 1)
      .map(row => buildStudentFromRow(row, indexes, sheetName))
      .filter(Boolean);
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!window.XLSX) {
      setErrorMessage('Excel parser is still loading. Please try again in a moment.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const workbook = XLSX.read(loadEvent.target.result, { type: 'array', cellDates: true });
        const students = parseWorkbookRows(workbook);
        if (!students.length) throw new Error('No valid student rows were found.');
        setParsedStudents(students);
        setFileName(file.name);
        setErrorMessage('');
        setStep('preview');
      } catch (error) {
        setParsedStudents([]);
        setFileName(file.name);
        setErrorMessage(error.message || 'Could not parse this Excel sheet.');
      }
    };
    reader.onerror = () => setErrorMessage('Could not read this file.');
    reader.readAsArrayBuffer(file);
  };

  const importStudents = async () => {
    try {
      const existing = new Set(window.VSB_DATA.students.map(s => s.registerNumber.toUpperCase()));
      const studentsToAdd = parsedStudents.filter(s => !existing.has(s.registerNumber.toUpperCase()));
      
      await window.VSB_API.bulkImportStudents(studentsToAdd);
      
      window.VSB_DATA.activityLogs = [{
        id: window.VSB_DATA.activityLogs.length + 1,
        actor: 'Super Admin',
        action: 'Imported',
        target: `${studentsToAdd.length} students from ${fileName}`,
        time: 'Just now',
        color: 'accent'
      }, ...window.VSB_DATA.activityLogs];
      setImportedCount(studentsToAdd.length);
      setStep('done');
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

  const duplicateCount = parsedStudents.filter(s => window.VSB_DATA.students.some(existing => existing.registerNumber.toUpperCase() === s.registerNumber.toUpperCase())).length;
  const previewRows = parsedStudents.slice(0, 8);

  return (
    <>
      <GlassCard className="p-6">
        <h2 style={{ fontSize: '1.3rem' }}>Bulk Student Import</h2>
        <p className="text-sm mt-1 mb-5">Upload the class Excel sheet. Student name and date of birth are read from the workbook and MySQL IDs are generated for every account.</p>

        {step === 'upload' && (
          <div style={{
            border: '2px dashed var(--border-strong)',
            borderRadius: 20,
            padding: 60,
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
            <h3 className="mb-2">Drop your Excel or CSV here or click to browse</h3>
            <p className="text-sm mb-4">Accepts .xlsx, .xls or .csv with columns like Roll Number, Student Name, Section, DOB, Gender and Programme Code.</p>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileSelected} />
            <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}><Icon name="upload" size={16} /> Select Excel / CSV File</button>
            {errorMessage && <div className="chip chip-rose mt-4"><Icon name="close" size={12} /> {errorMessage}</div>}
          </div>
        )}

        {step === 'preview' && (
          <>
            <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div className="chip chip-accent"><Icon name="check" size={12} stroke={3} /> Parsed <strong>{fileName}</strong> · {parsedStudents.length} rows detected · {duplicateCount} duplicates skipped on import</div>
              <button className="btn btn-ghost btn-sm" onClick={resetImport}><Icon name="close" size={14} /> Choose Another</button>
            </div>
            <table className="data-table">
              <thead><tr><th>Row</th><th>Register #</th><th>Name</th><th>DOB</th><th>Dept</th><th>Batch</th><th>Sec</th><th>Status</th></tr></thead>
              <tbody>
                {previewRows.map((s, i) => {
                  const duplicate = window.VSB_DATA.students.some(existing => existing.registerNumber.toUpperCase() === s.registerNumber.toUpperCase());
                  return (
                  <tr key={s.registerNumber}>
                    <td className="mono text-subtle">{i + 1}</td>
                    <td className="mono">{s.registerNumber}</td>
                    <td>{s.name}</td>
                    <td className="mono text-sm">{s.dob}</td>
                    <td><span className="chip">{s.department}</span></td>
                    <td>{s.batch}</td>
                    <td>{s.section}</td>
                    <td><span className={`chip ${duplicate ? 'chip-amber' : 'chip-accent'}`}>{duplicate ? 'Duplicate' : 'Ready'}</span></td>
                  </tr>
                  );
                })}
                {parsedStudents.length > previewRows.length && <tr><td colSpan="8" className="text-center text-subtle text-sm" style={{ padding: 16 }}>... {parsedStudents.length - previewRows.length} more rows ...</td></tr>}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button className="btn btn-ghost" onClick={resetImport}><Icon name="close" size={16} /> Cancel</button>
              <button className="btn btn-primary" onClick={importStudents} disabled={parsedStudents.length === duplicateCount}><Icon name="check" size={16} /> Import {parsedStudents.length - duplicateCount} Accounts</button>
            </div>
          </>
        )}

        {step === 'done' && (
          <div className="text-center" style={{ padding: 40 }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #34D399)', color: 'white', display: 'grid', placeItems: 'center', margin: '0 auto 16px', boxShadow: '0 20px 40px -12px #10B98180' }}>
              <Icon name="check" size={32} stroke={2.6} />
            </div>
            <h3 className="mb-2">Import complete</h3>
            <p className="text-sm mb-4">{importedCount} student accounts created from {fileName} · MySQL IDs provisioned · Names and DOBs added.</p>
            <button className="btn btn-primary" onClick={resetImport}><Icon name="upload" size={16} /> Import Another</button>
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
        <button className="btn btn-ghost"><Icon name="download" size={14} /> Export Logs</button>
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
  return (
    <>
      <GlassCard className="p-5">
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="chart-row">
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
