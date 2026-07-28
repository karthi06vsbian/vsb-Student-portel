import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TMP_FILE_PATH = path.join('/tmp', 'vsb_students_database.json');

// Helper to read persistent file fallback
function readBackupFile() {
  try {
    if (fs.existsSync(TMP_FILE_PATH)) {
      const content = fs.readFileSync(TMP_FILE_PATH, 'utf8');
      const data = JSON.parse(content);
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.warn('Backup file read note:', e.message);
  }
  return null;
}

// Helper to write persistent file fallback
function writeBackupFile(data) {
  try {
    fs.writeFileSync(TMP_FILE_PATH, JSON.stringify(data), 'utf8');
  } catch (e) {
    console.warn('Backup file write note:', e.message);
  }
}

export async function GET() {
  // 1. Try fetching from Supabase Cloud Database first
  if (supabase) {
    try {
      const { data, error } = await supabase.from('students').select('*');
      if (!error && data && data.length > 0) {
        writeBackupFile(data);
        return NextResponse.json({ success: true, students: data, count: data.length, source: 'supabase' });
      }
    } catch (err) {
      console.warn('Supabase read error:', err.message);
    }
  }

  // 2. Try reading from server persistent disk backup
  const diskData = readBackupFile();
  if (diskData && diskData.length > 0) {
    return NextResponse.json({ success: true, students: diskData, count: diskData.length, source: 'disk_backup' });
  }

  return NextResponse.json({
    success: true,
    students: [],
    count: 0,
    source: 'empty'
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { students, action } = body;

    if (!Array.isArray(students)) {
      return NextResponse.json({ success: false, error: 'Invalid students payload' }, { status: 400 });
    }

    const existingDiskData = readBackupFile() || [];

    // Protection: If incoming list is empty [] but backup has records, do NOT wipe unless explicit clear_all
    if (students.length === 0 && action !== 'clear_all' && existingDiskData.length > 0) {
      return NextResponse.json({
        success: true,
        count: existingDiskData.length,
        students: existingDiskData,
        source: 'protected_backup'
      });
    }

    // Save to persistent server disk backup
    writeBackupFile(students);

    // Save to Supabase Cloud Database
    if (supabase) {
      try {
        if (action === 'clear_all') {
          await supabase.from('students').delete().neq('id', '0');
        } else if (students.length > 0) {
          await supabase.from('students').upsert(students, { onConflict: 'id' });
        }
      } catch (err) {
        console.warn('Supabase sync warning:', err.message);
      }
    }

    return NextResponse.json({ success: true, count: students.length, students });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
