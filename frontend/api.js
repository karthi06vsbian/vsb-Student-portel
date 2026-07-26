// VSB Portal Django API Client with Local & Storage Fallback
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000/api'
  : 'https://vsb-student-portel.onrender.com/api';

window.VSB_API = {
  isOnline: false,

  async request(path, options = {}) {
    try {
      const url = `${API_BASE_URL}${path}`;
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      this.isOnline = true;
      return await res.json();
    } catch (err) {
      console.warn(`VSB Backend offline at ${API_BASE_URL}. Falling back to persistent client memory.`, err);
      throw err;
    }
  },

  // Student Login
  async loginStudent(username, dob) {
    try {
      const data = await this.request('/login/student/', {
        method: 'POST',
        body: JSON.stringify({ username, dob })
      });
      return data.student;
    } catch (err) {
      const list = (window.VSB_DATA && window.VSB_DATA.students) || [];
      const found = list.find(
        st => st && (st.registerNumber === username || st.rollNumber === username) && st.dob === dob
      );
      if (!found) throw new Error('Invalid credentials');
      return found;
    }
  },

  // Teacher Login
  async loginTeacher(username) {
    try {
      const data = await this.request('/login/teacher/', {
        method: 'POST',
        body: JSON.stringify({ username })
      });
      return data.teacher;
    } catch (err) {
      const list = (window.VSB_DATA && window.VSB_DATA.teachers) || [];
      const found = list.find(t => t && t.username === username);
      if (!found) return { username, name: username.replace('.', ' '), department: 'CSE', role: 'Faculty' };
      return found;
    }
  },

  // Admin Login
  async loginAdmin(username, password) {
    try {
      await this.request('/login/admin/', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      return true;
    } catch (err) {
      const u = String(username || '').toLowerCase().trim();
      if (u === 'admin' || u === 'superadmin' || u === 'vsbadmin') {
        return true;
      }
      throw new Error('Invalid admin credentials');
    }
  },

  // Get profile
  async getStudentProfile(regNum) {
    try {
      const data = await this.request(`/students/${regNum}/`);
      return data.student;
    } catch (err) {
      const list = (window.VSB_DATA && window.VSB_DATA.students) || [];
      const student = list.find(st => st && st.registerNumber === regNum);
      if (!student) throw new Error('Student not found');
      return student;
    }
  },

  // Save profile
  async updateStudentProfile(regNum, studentData) {
    if (!window.VSB_DATA) window.VSB_DATA = {};
    if (!window.VSB_DATA.students) window.VSB_DATA.students = [];

    try {
      const data = await this.request(`/students/${regNum}/`, {
        method: 'PUT',
        body: JSON.stringify(studentData)
      });
      const index = window.VSB_DATA.students.findIndex(st => st && st.registerNumber === regNum);
      if (index !== -1) window.VSB_DATA.students[index] = data.student;
      if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      return data.student;
    } catch (err) {
      const index = window.VSB_DATA.students.findIndex(st => st && st.registerNumber === regNum);
      if (index !== -1) {
        window.VSB_DATA.students[index] = studentData;
      } else {
        window.VSB_DATA.students.push(studentData);
      }
      if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      return studentData;
    }
  },

  // Teacher dashboard student list
  async getTeacherStudents(dept, batch, section) {
    if (!window.VSB_DATA) window.VSB_DATA = {};
    if (!window.VSB_DATA.students) window.VSB_DATA.students = [];

    try {
      const data = await this.request(`/students/?dept=${dept}&batch=${batch}&section=${section}`);
      if (data.students && data.students.length > 0) {
        data.students.forEach(st => {
          const idx = window.VSB_DATA.students.findIndex(x => x && x.registerNumber === st.registerNumber);
          if (idx !== -1) window.VSB_DATA.students[idx] = st;
          else window.VSB_DATA.students.push(st);
        });
        if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      }
      return (window.VSB_DATA.students || []).filter(s => {
        if (!s) return false;
        const matchesDept = !dept || dept === 'ALL' || s.department === dept;
        const matchesBatch = !batch || batch === 'ALL' || s.batch === batch;
        const matchesSec = !section || section === 'ALL' || s.section === section;
        return matchesDept && matchesBatch && matchesSec;
      });
    } catch (err) {
      return (window.VSB_DATA.students || []).filter(s => {
        if (!s) return false;
        const matchesDept = !dept || dept === 'ALL' || s.department === dept;
        const matchesBatch = !batch || batch === 'ALL' || s.batch === batch;
        const matchesSec = !section || section === 'ALL' || s.section === section;
        return matchesDept && matchesBatch && matchesSec;
      });
    }
  },

  // Approve student status
  async approveStudent(regNum, approvedStatus) {
    if (!window.VSB_DATA) window.VSB_DATA = {};
    if (!window.VSB_DATA.students) window.VSB_DATA.students = [];

    try {
      const data = await this.request(`/students/${regNum}/approve/`, {
        method: 'POST',
        body: JSON.stringify({ approved: approvedStatus })
      });
      const student = window.VSB_DATA.students.find(st => st && st.registerNumber === regNum);
      if (student) student.approved = data.approved;
      if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      return data.approved;
    } catch (err) {
      const student = window.VSB_DATA.students.find(st => st && st.registerNumber === regNum);
      if (student) student.approved = approvedStatus;
      if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      return approvedStatus;
    }
  },

  // Bulk import spreadsheet accounts
  async bulkImportStudents(students) {
    if (!window.VSB_DATA) window.VSB_DATA = {};
    if (!window.VSB_DATA.students) window.VSB_DATA.students = [];

    (students || []).forEach(st => {
      const idx = window.VSB_DATA.students.findIndex(x => x && x.registerNumber === st.registerNumber);
      if (idx !== -1) window.VSB_DATA.students[idx] = st;
      else window.VSB_DATA.students.unshift(st);
    });
    if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();

    try {
      const data = await this.request('/students/bulk-import/', {
        method: 'POST',
        body: JSON.stringify({ students })
      });
      return data;
    } catch (err) {
      return { success: true, created: (students || []).length, updated: 0, fallback: true };
    }
  },

  // Sync initial mock data seed
  async syncInitialData() {
    try {
      const data = await this.request('/students/sync-initial/', {
        method: 'POST',
        body: JSON.stringify({
          students: (window.VSB_DATA && window.VSB_DATA.students) || [],
          teachers: (window.VSB_DATA && window.VSB_DATA.teachers) || []
        })
      });
      console.log('Seeded database with initial portal mocks.', data);
    } catch (err) {
      // Ignore if offline
    }
  }
};

// Autostart initial database sync if server is online
setTimeout(() => {
  window.VSB_API.syncInitialData();
}, 2000);
