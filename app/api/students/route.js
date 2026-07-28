import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Server-side in-memory cache so all browsers & windows share the exact same student list instantly
let cloudStudentsCache = null;

export async function GET() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('students').select('*');
      if (!error && data && data.length > 0) {
        cloudStudentsCache = data;
        return NextResponse.json({ success: true, students: data, source: 'supabase' });
      }
    } catch (err) {
      console.warn('Supabase read warning:', err.message);
    }
  }

  return NextResponse.json({
    success: true,
    students: cloudStudentsCache || null,
    source: cloudStudentsCache ? 'server_cache' : 'local'
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { students } = body;

    if (!Array.isArray(students)) {
      return NextResponse.json({ success: false, error: 'Invalid students payload' }, { status: 400 });
    }

    cloudStudentsCache = students;

    if (supabase) {
      try {
        // Upsert into Supabase students table
        const { error } = await supabase.from('students').upsert(students, { onConflict: 'id' });
        if (error && error.code === '42P01') {
          // Table doesn't exist yet, message noted
          console.warn('Supabase table "students" not created yet in SQL editor.');
        }
      } catch (err) {
        console.warn('Supabase sync warning:', err.message);
      }
    }

    return NextResponse.json({ success: true, count: students.length });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
