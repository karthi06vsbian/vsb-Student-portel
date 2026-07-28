import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({
      status: 'error',
      connected: false,
      message: 'Database environment variables (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are not set.',
      hint: 'Pull env variables using `npx vercel env pull .env.local` or set them on Vercel Dashboard.'
    }, { status: 400 });
  }

  if (!supabase) {
    return NextResponse.json({
      status: 'error',
      connected: false,
      message: 'Failed to initialize Supabase client.'
    }, { status: 500 });
  }

  try {
    // Ping query to Supabase instance
    const { error } = await supabase.from('_healthcheck').select('*').limit(1);

    // If connection reaches Supabase server, even a table-missing response indicates database URL & ANON Key are valid!
    const isConnected = !error || error.code === '42P01' || error.message?.includes('relation') || error.code === 'PGRST301';

    if (isConnected) {
      return NextResponse.json({
        status: 'success',
        connected: true,
        message: 'Supabase database is ACTIVE and CONNECTED!',
        supabaseUrl: `${url.substring(0, 18)}...`,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      status: 'warning',
      connected: false,
      message: 'Database reachable but returned error:',
      error: error.message
    }, { status: 500 });

  } catch (err) {
    return NextResponse.json({
      status: 'error',
      connected: false,
      message: err.message
    }, { status: 500 });
  }
}
