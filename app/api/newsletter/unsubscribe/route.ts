import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
        return new NextResponse('<h2>Invalid unsubscribe link.</h2>', { headers: { 'Content-Type': 'text/html' } });
    }

    await supabase
        .from('newsletter_subscribers')
        .update({ active: false })
        .eq('email', email);

    return new NextResponse(
        `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#f5f5f5;">
        <div style="background:#fff;border-radius:16px;padding:48px;max-width:480px;margin:0 auto;border:1px solid #e5e7eb;">
          <div style="font-size:48px;margin-bottom:16px;">✅</div>
          <h2 style="color:#111;margin-bottom:8px;">Unsubscribed</h2>
          <p style="color:#6b7280;">You've been removed from the All AI Tool List newsletter.</p>
          <a href="https://allaitoollist.com" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#2563eb;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;">
            Back to All AI Tool List
          </a>
        </div>
        </body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
    );
}
