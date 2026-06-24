import { NextResponse } from 'next/server';

// Admin login is handled client-side via Supabase Auth (supabase.auth.signInWithPassword).
// This endpoint is not used and kept only for backwards compatibility.
export async function POST() {
    return NextResponse.json({ error: 'Use Supabase Auth directly' }, { status: 410 });
}
