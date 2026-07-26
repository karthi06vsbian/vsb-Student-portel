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
