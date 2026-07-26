// VSB Portal Django API Client with Local & Storage Fallback
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000/api'
  : 'https://vsb-portal-backend.onrender.com/api';

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
      // Persistent Fallback
      const found = (window.VSB_DATA.students || []).find(
        st => (st.registerNumber === username || st.rollNumber === username) && st.dob === dob
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
      // Persistent Fallback
      const found = (window.VSB_DATA.teachers || []).find(t => t.username === username);
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
      // Fallback
      if (username === 'admin' && password === 'admin') return true;
      throw new Error('Invalid credentials');
    }
  },

  // Get profile
  async getStudentProfile(regNum) {
    try {
      const data = await this.request(`/students/${regNum}/`);
      return data.student;
    } catch (err) {
      // Persistent Fallback
      const student = (window.VSB_DATA.students || []).find(st => st.registerNumber === regNum);
      if (!student) throw new Error('Student not found');
      return student;
    }
  },

  // Save profile
  async updateStudentProfile(regNum, studentData) {
    try {
      const data = await this.request(`/students/${regNum}/`, {
        method: 'PUT',
        body: JSON.stringify(studentData)
      });
      const index = window.VSB_DATA.students.findIndex(st => st.registerNumber === regNum);
      if (index !== -1) window.VSB_DATA.students[index] = data.student;
      if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      return data.student;
    } catch (err) {
      // Persistent Fallback
      const index = window.VSB_DATA.students.findIndex(st => st.registerNumber === regNum);
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
    try {
      const data = await this.request(`/students/?dept=${dept}&batch=${batch}&section=${section}`);
      if (data.students && data.students.length > 0) {
        // Sync API students into local state and storage
        data.students.forEach(st => {
          const idx = window.VSB_DATA.students.findIndex(x => x.registerNumber === st.registerNumber);
          if (idx !== -1) window.VSB_DATA.students[idx] = st;
          else window.VSB_DATA.students.push(st);
        });
        if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      }
      return (window.VSB_DATA.students || []).filter(s => {
        const matchesDept = !dept || dept === 'ALL' || s.department === dept;
        const matchesBatch = !batch || batch === 'ALL' || s.batch === batch;
        const matchesSec = !section || section === 'ALL' || s.section === section;
        return matchesDept && matchesBatch && matchesSec;
      });
    } catch (err) {
      // Persistent Fallback
      return (window.VSB_DATA.students || []).filter(s => {
        const matchesDept = !dept || dept === 'ALL' || s.department === dept;
        const matchesBatch = !batch || batch === 'ALL' || s.batch === batch;
        const matchesSec = !section || section === 'ALL' || s.section === section;
        return matchesDept && matchesBatch && matchesSec;
      });
    }
  },

  // Approve student status
  async approveStudent(regNum, approvedStatus) {
    try {
      const data = await this.request(`/students/${regNum}/approve/`, {
        method: 'POST',
        body: JSON.stringify({ approved: approvedStatus })
      });
      const student = window.VSB_DATA.students.find(st => st.registerNumber === regNum);
      if (student) student.approved = data.approved;
      if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      return data.approved;
    } catch (err) {
      // Persistent Fallback
      const student = window.VSB_DATA.students.find(st => st.registerNumber === regNum);
      if (student) student.approved = approvedStatus;
      if (window.VSB_DATA.saveToStorage) window.VSB_DATA.saveToStorage();
      return approvedStatus;
    }
  },

  // Bulk import spreadsheet accounts
  async bulkImportStudents(students) {
    // Write immediately to persistent storage
    students.forEach(st => {
      const idx = window.VSB_DATA.students.findIndex(x => x.registerNumber === st.registerNumber);
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
      return { success: true, created: students.length, updated: 0, fallback: true };
    }
  },

  // Sync initial mock data seed
  async syncInitialData() {
    try {
      const data = await this.request('/students/sync-initial/', {
        method: 'POST',
        body: JSON.stringify({
          students: window.VSB_DATA.students,
          teachers: window.VSB_DATA.teachers
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
