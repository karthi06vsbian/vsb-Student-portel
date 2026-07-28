import { Pool } from 'pg';
import { supabase } from './supabase.js';
import fs from 'fs';
import path from 'path';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_DEPARTMENTS,
  INITIAL_BATCHES,
  INITIAL_SECTIONS,
  INITIAL_ACTIVITY_LOGS
} from './initialData.js';


const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.AIVEN_DATABASE_URL ||
  process.env.STORAGE_POSTGRES_URL ||
  '';

let pool = null;
if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
    });
  } catch (e) {
    console.warn('PostgreSQL pool init error:', e.message);
  }
}

const BACKUP_FILE = path.join('/tmp', 'vsb_portal_master_data.json');

export function readDiskBackup() {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const content = fs.readFileSync(BACKUP_FILE, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {}
  return null;
}

export function saveDiskBackup(data) {
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data), 'utf8');
  } catch (e) {}
}

// Auto-create database table portal_master on PostgreSQL if pool exists
let tableChecked = false;
async function ensurePostgresTables() {
  if (!pool || tableChecked) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS portal_master (
          id VARCHAR(50) PRIMARY KEY,
          data JSONB NOT NULL,
          updated_at BIGINT NOT NULL
        );
      `);
      tableChecked = true;
    } finally {
      client.release();
    }
  } catch (e) {
    console.warn('Postgres table creation note:', e.message);
  }
}

export async function getMasterPortalData() {
  // 1. Try PostgreSQL Database (Aiven / Neon / Supabase Postgres / Custom Postgres)
  if (pool) {
    try {
      await ensurePostgresTables();
      const res = await pool.query('SELECT data, updated_at FROM portal_master WHERE id = $1', ['master_v1']);
      if (res.rows.length > 0 && res.rows[0].data) {
        const data = res.rows[0].data;
        saveDiskBackup(data);
        return { data, timestamp: parseInt(res.rows[0].updated_at, 10), source: 'postgresql' };
      }
    } catch (e) {
      console.warn('Postgres read note:', e.message);
    }
  }

  // 2. Try Supabase REST Client
  if (supabase) {
    try {
      const { data: supaStudents } = await supabase.from('students').select('*');
      if (supaStudents && supaStudents.length > 0) {
        const disk = readDiskBackup() || {
          students: INITIAL_STUDENTS,
          teachers: INITIAL_TEACHERS,
          departments: INITIAL_DEPARTMENTS,
          batches: INITIAL_BATCHES,
          sections: INITIAL_SECTIONS,
          activityLogs: INITIAL_ACTIVITY_LOGS,
          updatedAt: Date.now()
        };
        disk.students = supaStudents;
        saveDiskBackup(disk);
        return { data: disk, timestamp: disk.updatedAt, source: 'supabase' };
      }
    } catch (e) {}
  }

  // 3. Try Disk Backup
  const disk = readDiskBackup();
  if (disk) {
    return { data: disk, timestamp: disk.updatedAt || Date.now(), source: 'disk' };
  }

  // 4. Default Seed Initial Data
  const defaultData = {
    students: INITIAL_STUDENTS,
    teachers: INITIAL_TEACHERS,
    departments: INITIAL_DEPARTMENTS,
    batches: INITIAL_BATCHES,
    sections: INITIAL_SECTIONS,
    activityLogs: INITIAL_ACTIVITY_LOGS,
    updatedAt: Date.now()
  };
  saveDiskBackup(defaultData);
  return { data: defaultData, timestamp: defaultData.updatedAt, source: 'seed' };
}

export async function saveMasterPortalData(newData) {
  const timestamp = Date.now();
  const fullData = { ...newData, updatedAt: timestamp };

  // Save to Disk Backup
  saveDiskBackup(fullData);

  // 1. Save to Direct PostgreSQL Database (Aiven / Neon / Supabase Postgres / Custom Postgres)
  if (pool) {
    try {
      await ensurePostgresTables();
      await pool.query(
        `INSERT INTO portal_master (id, data, updated_at) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (id) 
         DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at`,
        ['master_v1', JSON.stringify(fullData), timestamp]
      );
    } catch (e) {
      console.warn('Postgres save note:', e.message);
    }
  }

  // 2. Save to Supabase REST
  if (supabase && Array.isArray(fullData.students) && fullData.students.length > 0) {
    try {
      await supabase.from('students').upsert(fullData.students, { onConflict: 'id' });
    } catch (e) {}
  }

  return { success: true, timestamp };
}
