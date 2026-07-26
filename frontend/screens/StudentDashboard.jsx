// Student Dashboard — long-scroll with left sidebar anchors, all fields editable
function StudentDashboard({ onNavigate }) {
  const initialStudent = React.useMemo(() => {
    return window.VSB_DATA.students.find(st => st.registerNumber === window.VSB_DATA.currentStudentRegNum) || window.VSB_DATA.students[0];
  }, [window.VSB_DATA.currentStudentRegNum]);
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
            <div className="chip chip-brand mb-2"><Icon name="student" size={14} /> Student Portal</div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>My Profile</h1>
            <p className="mt-1">Keep every field up to date — your record is used for scholarships and NAAC audits.</p>
          </div>
          <div className="flex gap-2">
            <button className={`btn ${editMode ? 'btn-ghost' : 'btn-ghost'}`} onClick={() => setEditMode(!editMode)}>
              <Icon name="edit" size={16} /> {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </button>
            <button className="btn btn-primary" onClick={saveProfile}>
              {saved ? <><Icon name="check" size={16} /> Saved</> : <><Icon name="upload" size={16} /> Save to Firestore</>}
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
                {window.VSB_DATA.currentUserRole === 'teacher' && (
                  <button className="btn btn-accent btn-sm w-full mt-3" onClick={() => onNavigate('/teacher')}>
                    ← Back to Faculty
                  </button>
                )}
                {window.VSB_DATA.currentUserRole === 'admin' && (
                  <button className="btn btn-accent btn-sm w-full mt-3" onClick={() => onNavigate('/admin/dashboard')}>
                    ← Back to Admin Panel
                  </button>
                )}
                <button className="btn btn-ghost btn-sm w-full mt-2" onClick={() => {
                  window.VSB_DATA.currentUserRole = null;
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
                <Field label="Department" value={s.departmentName} locked={window.VSB_DATA.currentUserRole === 'student'} options={((window.VSB_DATA && window.VSB_DATA.DEPARTMENTS) || []).map(d => d.name)} edit={editMode} onChange={v => {
                  const deptObj = window.VSB_DATA.DEPARTMENTS.find(d => d.name === v);
                  if (deptObj) {
                    updateField('department', deptObj.code);
                    updateField('departmentName', deptObj.name);
                  }
                }} />
                <Field label="Batch" value={s.batch} locked={window.VSB_DATA.currentUserRole === 'student'} options={window.VSB_DATA.BATCHES} edit={editMode} onChange={v => updateField('batch', v)} />
                <Field label="Section" value={s.section} locked={window.VSB_DATA.currentUserRole === 'student'} options={window.VSB_DATA.SECTIONS} edit={editMode} onChange={v => updateField('section', v)} />
                <Field label="Year of Study" value={s.year} locked={window.VSB_DATA.currentUserRole === 'student'} type="number" edit={editMode} onChange={v => updateField('year', Number(v))} />
              </div>
              <div className="grid-3 mt-3">
                <Field label="Arrears" value={s.arrears} locked={window.VSB_DATA.currentUserRole === 'student'} type="number" edit={editMode} onChange={v => updateField('arrears', Number(v))} tone={s.arrears > 0 ? 'rose' : 'accent'} />
                <Field label="Backlogs Cleared" value="—" />
                <Field label="Attendance" value="92%" />
              </div>
            </Section>

            {/* Skills */}
            <Section id="skills" title="Skills" subtitle="Student coding and professional profile links">
              <div className="mb-4">
                <div className="field-label">Technical Skills</div>
                <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
                  {s.skills.map(sk => <span key={sk} className="chip chip-brand">{sk}</span>)}
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
                  const deptObj = window.VSB_DATA.DEPARTMENTS.find(d => d.code === s.department);
                  const deptTeachers = window.VSB_DATA.teachers.filter(t => t.department === s.department);
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
