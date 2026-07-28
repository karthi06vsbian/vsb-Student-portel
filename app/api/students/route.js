import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    students: cloudStudentsCache || [],
    source: cloudStudentsCache ? 'server_cache' : 'empty'
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { students, action } = body;

    if (!Array.isArray(students)) {
      return NextResponse.json({ success: false, error: 'Invalid students payload' }, { status: 400 });
    }

    // Protection: If incoming list is empty [] but server cache already has records, do NOT wipe server cache unless explicit clear_all
    if (students.length === 0 && action !== 'clear_all' && Array.isArray(cloudStudentsCache) && cloudStudentsCache.length > 0) {
      return NextResponse.json({
        success: true,
        count: cloudStudentsCache.length,
        students: cloudStudentsCache,
        note: 'Protected server cache from empty wipeout'
      });
    }

    cloudStudentsCache = students;

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

