import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getMasterPortalData } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const pgUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.AIVEN_DATABASE_URL;
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.STORAGE_SUPABASE_URL || process.env.SUPABASE_URL;

  try {
    const { source, timestamp, data } = await getMasterPortalData();

    return NextResponse.json({
      status: 'success',
      connected: true,
      activeDatabaseSource: source,
      postgresConnectionStringSet: !!pgUrl,
      supabaseConfigured: !!supaUrl,
      totalStudentsCount: data?.students?.length || 0,
      timestamp: new Date(timestamp).toISOString()
    });
  } catch (err) {
    return NextResponse.json({
      status: 'error',
      connected: false,
      error: err.message
    }, { status: 500 });
  }
}
