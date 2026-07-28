import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_DEPARTMENTS,
  INITIAL_BATCHES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_ADMIN
} from './initialData';

const KEYS = {
  STUDENTS: 'vsb_students',
  TEACHERS: 'vsb_teachers',
  DEPARTMENTS: 'vsb_departments',
  BATCHES: 'vsb_batches',
  SECTIONS: 'vsb_sections',
  LOGS: 'vsb_activity_logs',
  SESSION: 'vsb_active_session'
};

export const getStorageData = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(fallback) && fallback.length > 0) {
      return fallback;
    }
    return parsed;
  } catch (e) {
    console.error('Storage error:', e);
    return fallback;
  }
};

let portalChannel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    portalChannel = new BroadcastChannel('vsb_portal_channel');
  } catch (e) {
    console.warn('BroadcastChannel not supported:', e);
  }
}

export const setStorageData = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Broadcast live event across components & windows for instant 2-way synchronization!
    window.dispatchEvent(new CustomEvent('vsb_storage_update', { detail: { key, value } }));
    if (portalChannel) {
      portalChannel.postMessage({ type: 'vsb_storage_update', key, value, timestamp: Date.now() });
    }

    // Automatically push all category updates to central cloud server API (/api/portal-data)
    fetch('/api/portal-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    }).catch(() => {});
  } catch (e) {
    console.error('Storage save error:', e);
  }
};


// Ensure all student records have unique IDs
const sanitizeStudentRecords = (list) => {
  const seenIds = new Set();
  return list.map((st, idx) => {
    let cleanId = st.id || `STU-${st.regNo || st.rollNo || idx}`;
    if (seenIds.has(cleanId)) {
      cleanId = `${cleanId}-${idx}`;
    }
    seenIds.add(cleanId);
    return {
      ...st,
      id: cleanId
    };
  });
};

// Initialize Storage
export const initializePortalStorage = () => {
  if (typeof window === 'undefined') return;

  const rawStudents = localStorage.getItem(KEYS.STUDENTS);
  let parsedStudents = [];
  try {
    parsedStudents = rawStudents ? JSON.parse(rawStudents) : [];
  } catch (e) {
    parsedStudents = [];
  }

  // If students storage is missing or empty [], re-seed with INITIAL_STUDENTS (17 records)!
  if (!rawStudents || !Array.isArray(parsedStudents) || parsedStudents.length === 0) {
    setStorageData(KEYS.STUDENTS, sanitizeStudentRecords(INITIAL_STUDENTS));
  }
  if (!localStorage.getItem(KEYS.TEACHERS)) {
    setStorageData(KEYS.TEACHERS, INITIAL_TEACHERS);
  }
  if (!localStorage.getItem(KEYS.DEPARTMENTS)) {
    setStorageData(KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  }
  if (!localStorage.getItem(KEYS.BATCHES)) {
    setStorageData(KEYS.BATCHES, INITIAL_BATCHES);
  }
  if (!localStorage.getItem(KEYS.SECTIONS)) {
    setStorageData(KEYS.SECTIONS, ["Sec A", "Sec B", "Sec C", "Sec D"]);
  }
  if (!localStorage.getItem(KEYS.LOGS)) {
    setStorageData(KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
  }
};


// Log Activity Action
export const addActivityLog = (actorName, role, action, details) => {
  const logs = getStorageData(KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
  const newLog = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    actor: actorName,
    role: role,
    action: action,
    details: details,
    timestamp: new Date().toISOString()
  };
  const updatedLogs = [newLog, ...logs];
  setStorageData(KEYS.LOGS, updatedLogs);
  return updatedLogs;
};

// Clear All Student Records
export const clearAllStudentRecords = () => {
  if (typeof window === 'undefined') return;
  setStorageData(KEYS.STUDENTS, []);
  window.dispatchEvent(new CustomEvent('vsb_storage_update', { detail: { key: KEYS.STUDENTS, value: [] } }));
};

// Reset Storage
export const resetToSampleData = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.STUDENTS, JSON.stringify([]));
  localStorage.setItem(KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
  localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(INITIAL_DEPARTMENTS));
  localStorage.setItem(KEYS.BATCHES, JSON.stringify(INITIAL_BATCHES));
  localStorage.setItem(KEYS.LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  localStorage.removeItem(KEYS.SESSION);
  window.dispatchEvent(new CustomEvent('vsb_storage_update', { detail: { key: 'ALL' } }));
  window.location.reload();
};

export { KEYS, INITIAL_ADMIN };


