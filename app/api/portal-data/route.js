import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_DEPARTMENTS,
  INITIAL_BATCHES,
  INITIAL_SECTIONS,
  INITIAL_ACTIVITY_LOGS
} from '@/lib/initialData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BACKUP_FILE = path.join('/tmp', 'vsb_portal_master_data.json');

function getMasterBackup() {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const content = fs.readFileSync(BACKUP_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {
    console.warn('Backup file read warning:', e.message);
  }
  return null;
}

function saveMasterBackup(data) {
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data), 'utf8');
  } catch (e) {
    console.warn('Backup file save warning:', e.message);
  }
}

let masterStore = getMasterBackup() || {
  students: INITIAL_STUDENTS,
  teachers: INITIAL_TEACHERS,
  departments: INITIAL_DEPARTMENTS,
  batches: INITIAL_BATCHES,
  sections: INITIAL_SECTIONS,
  activityLogs: INITIAL_ACTIVITY_LOGS,
  updatedAt: Date.now()
};

export async function GET() {
  if (supabase) {
    try {
      const { data: supaStudents } = await supabase.from('students').select('*');
      if (supaStudents && supaStudents.length > 0) {
        masterStore.students = supaStudents;
      }
    } catch (e) {}
  }

  const currentBackup = getMasterBackup();
  if (currentBackup && currentBackup.updatedAt > (masterStore.updatedAt || 0)) {
    masterStore = currentBackup;
  }

  return NextResponse.json({
    success: true,
    data: masterStore,
    timestamp: masterStore.updatedAt || Date.now()
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { students, teachers, departments, batches, sections, activityLogs, key, value } = body;

    const updatedStore = { ...masterStore, updatedAt: Date.now() };

    if (Array.isArray(students) && students.length > 0) updatedStore.students = students;
    if (Array.isArray(teachers) && teachers.length > 0) updatedStore.teachers = teachers;
    if (Array.isArray(departments) && departments.length > 0) updatedStore.departments = departments;
    if (Array.isArray(batches) && batches.length > 0) updatedStore.batches = batches;
    if (Array.isArray(sections) && sections.length > 0) updatedStore.sections = sections;
    if (Array.isArray(activityLogs) && activityLogs.length > 0) updatedStore.activityLogs = activityLogs;

    if (key && value !== undefined) {
      if (key === 'vsb_students' && Array.isArray(value)) updatedStore.students = value;
      if (key === 'vsb_teachers' && Array.isArray(value)) updatedStore.teachers = value;
      if (key === 'vsb_departments' && Array.isArray(value)) updatedStore.departments = value;
      if (key === 'vsb_batches' && Array.isArray(value)) updatedStore.batches = value;
      if (key === 'vsb_sections' && Array.isArray(value)) updatedStore.sections = value;
      if (key === 'vsb_activity_logs' && Array.isArray(value)) updatedStore.activityLogs = value;
    }

    masterStore = updatedStore;
    saveMasterBackup(masterStore);

    if (supabase && Array.isArray(updatedStore.students) && updatedStore.students.length > 0) {
      try {
        await supabase.from('students').upsert(updatedStore.students, { onConflict: 'id' });
      } catch (e) {}
    }

    return NextResponse.json({ success: true, timestamp: masterStore.updatedAt });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
