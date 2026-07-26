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

  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState('upload');
  const [importFileName, setImportFileName] = useState('');
  const [importParsedStudents, setImportParsedStudents] = useState([]);
  const [importErrorMessage, setImportErrorMessage] = useState('');
  const [importedCount, setImportedCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const importFileInputRef = useRef(null);

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
  }, [filter, refreshTrigger]);

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
    const fallbackSec = filter.section && filter.section !== 'ALL' ? filter.section : 'A';
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

  const buildStudentFromRow = (row, indexes, sheetName) => {
    const name = String(row[indexes.name] || '').trim();
    if (!name) return null;

    const rollNumber = String(row[indexes.roll] || '').trim();
    const registerNo = String(row[indexes.register] || '').trim();
    const registerNumber = (registerNo || rollNumber || `BULK${Date.now()}${Math.random().toString(36).slice(2, 6)}`).toUpperCase();
    
    const filterDept = filter.dept && filter.dept !== 'ALL' ? filter.dept : 'CSE';
    const filterBatch = filter.batch && filter.batch !== 'ALL' ? filter.batch : '2024-2028';

    const deptCode = String(row[indexes.department] || filterDept).trim().toUpperCase() || filterDept;
    const deptObj = window.VSB_DATA.DEPARTMENTS.find(d => d.code === deptCode) || window.VSB_DATA.DEPARTMENTS[0];
    const admittedYear = String(row[indexes.year] || filterBatch.split('-')[0]).trim().slice(0, 4);
    const batchStart = /^\d{4}$/.test(admittedYear) ? Number(admittedYear) : parseInt(filterBatch.split('-')[0]);
    
    const genderCode = String(row[indexes.gender] || '').trim().toUpperCase();
    const dob = toExcelDate(row[indexes.dob]);

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
      setImportErrorMessage('Excel/CSV parser is still loading. Please try again in a moment.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const workbook = XLSX.read(loadEvent.target.result, { type: 'array', cellDates: true });
        const studentsList = parseWorkbookRows(workbook);
        if (!studentsList.length) throw new Error('No valid student rows were found.');
        setImportParsedStudents(studentsList);
        setImportFileName(file.name);
        setImportErrorMessage('');
        setImportStep('preview');
      } catch (error) {
        setImportParsedStudents([]);
        setImportFileName(file.name);
        setImportErrorMessage(error.message || 'Could not parse this sheet.');
      }
    };
    reader.onerror = () => setImportErrorMessage('Could not read this file.');
    reader.readAsArrayBuffer(file);
  };

  const importStudents = async () => {
    try {
      const existing = new Set((students || []).map(s => s.registerNumber.toUpperCase()));
      const studentsToAdd = importParsedStudents.filter(s => !existing.has(s.registerNumber.toUpperCase()));
      
      await window.VSB_API.bulkImportStudents(studentsToAdd);
      
      window.VSB_DATA.activityLogs = [{
        id: (window.VSB_DATA.activityLogs || []).length + 1,
        actor: 'Faculty Advisor',
        action: 'Imported',
        target: `${studentsToAdd.length} students from ${importFileName}`,
        time: 'Just now',
        color: 'accent'
      }, ...(window.VSB_DATA.activityLogs || [])];
      
      setImportedCount(studentsToAdd.length);
      setImportStep('done');
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      alert('Error during bulk import: ' + err.message);
    }
  };

  const resetImport = () => {
    setImportStep('upload');
    setImportFileName('');
    setImportParsedStudents([]);
    setImportedCount(0);
    setImportErrorMessage('');
    if (importFileInputRef.current) importFileInputRef.current.value = '';
  };

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
            <div className="flex items-center gap-3 mb-4 active-filter-header" style={{ flexWrap: 'wrap' }}>
              <Icon name="filter" size={18} style={{ color: 'var(--brand-primary)' }} />
              <div className="font-semibold">Active Filter</div>
              <span className="chip chip-brand">{filter.dept}</span>
              <span className="chip chip-accent">{filter.batch}</span>
              <span className="chip">Section {filter.section === 'ALL' ? 'All' : filter.section}</span>
              <span className="text-sm text-muted matched-label" style={{ marginLeft: 'auto' }}>{filtered.length} students matched</span>
            </div>
            <div className="filter-row">
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
              <button className="btn btn-ghost btn-sm" onClick={() => { setShowImportModal(true); resetImport(); }}><Icon name="upload" size={14} /> Bulk Upload</button>
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
            
            <h2 style={{ fontSize: '1.3rem', marginBottom: 6 }}>Bulk Student Import (Teacher)</h2>
            <p className="text-sm mt-1 mb-5">Upload the class Excel or CSV sheet. Student name and date of birth are read from the workbook and MySQL logins are generated.</p>

            {importStep === 'upload' && (
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
                <input ref={importFileInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileSelected} />
                <button className="btn btn-primary" onClick={() => importFileInputRef.current?.click()}><Icon name="upload" size={16} /> Select Excel / CSV File</button>
                {importErrorMessage && <div className="chip chip-rose mt-4"><Icon name="close" size={12} /> {importErrorMessage}</div>}
              </div>
            )}

            {importStep === 'preview' && (
              <>
                <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: 10 }}>
                  <div className="chip chip-accent"><Icon name="check" size={12} stroke={3} /> Parsed <strong>{importFileName}</strong> · {importParsedStudents.length} rows detected</div>
                  <button className="btn btn-ghost btn-sm" onClick={resetImport}><Icon name="close" size={14} /> Choose Another</button>
                </div>
                <div style={{ overflowX: 'auto', maxHeight: '40vh', marginBottom: 20, border: '1px solid var(--border-strong)', borderRadius: 8 }}>
                  <table className="data-table" style={{ margin: 0 }}>
                    <thead><tr><th>Row</th><th>Register # / Roll #</th><th>Name</th><th>DOB</th><th>Dept</th><th>Batch</th><th>Sec</th></tr></thead>
                    <tbody>
                      {importParsedStudents.map((s, i) => (
                        <tr key={s.registerNumber || i}>
                          <td className="mono text-subtle">{i + 1}</td>
                          <td className="mono">{s.registerNumber}</td>
                          <td>{s.name}</td>
                          <td className="mono text-sm">{s.dob}</td>
                          <td><span className="chip">{s.department}</span></td>
                          <td>{s.batch}</td>
                          <td>{s.section}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="btn btn-ghost" onClick={() => setShowImportModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={importStudents}><Icon name="check" size={16} /> Import {importParsedStudents.length} Students</button>
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
                <h3 className="mb-2">Import Complete!</h3>
                <p className="text-sm text-muted mb-6">Successfully imported {importedCount} new student records to the database.</p>
                <button className="btn btn-primary" onClick={() => setShowImportModal(false)}>Close Window</button>
              </div>
            )}
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
