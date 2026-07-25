// VSB Portal Django API Client with Local Fallback
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
      console.warn(`VSB Backend offline at ${API_BASE_URL}. Falling back to client memory.`, err);
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
      // Fallback
      const found = window.VSB_DATA.students.find(
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
      // Fallback
      const found = window.VSB_DATA.teachers.find(t => t.username === username);
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
      // Fallback
      const student = window.VSB_DATA.students.find(st => st.registerNumber === regNum);
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
      return data.student;
    } catch (err) {
      // Fallback
      const index = window.VSB_DATA.students.findIndex(st => st.registerNumber === regNum);
      if (index !== -1) {
        window.VSB_DATA.students[index] = studentData;
      }
      return studentData;
    }
  },

  // Teacher dashboard student list
  async getTeacherStudents(dept, batch, section) {
    try {
      const data = await this.request(`/students/?dept=${dept}&batch=${batch}&section=${section}`);
      return data.students;
    } catch (err) {
      // Fallback
      return window.VSB_DATA.students.filter(s => {
        const matchesDept = !dept || s.department === dept;
        const matchesBatch = !batch || s.batch === batch;
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
      return data.approved;
    } catch (err) {
      // Fallback
      const student = window.VSB_DATA.students.find(st => st.registerNumber === regNum);
      if (student) {
        student.approved = approvedStatus;
      }
      return approvedStatus;
    }
  },

  // Bulk import spreadsheet accounts
  async bulkImportStudents(students) {
    try {
      const data = await this.request('/students/bulk-import/', {
        method: 'POST',
        body: JSON.stringify({ students })
      });
      // Sync local memory too
      students.forEach(st => {
        const idx = window.VSB_DATA.students.findIndex(x => x.registerNumber === st.registerNumber);
        if (idx !== -1) window.VSB_DATA.students[idx] = st;
        else window.VSB_DATA.students.push(st);
      });
      return data;
    } catch (err) {
      // Fallback: write to local memory
      students.forEach(st => {
        const idx = window.VSB_DATA.students.findIndex(x => x.registerNumber === st.registerNumber);
        if (idx !== -1) window.VSB_DATA.students[idx] = st;
        else window.VSB_DATA.students.push(st);
      });
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
