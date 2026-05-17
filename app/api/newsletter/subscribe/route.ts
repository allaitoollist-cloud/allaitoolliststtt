import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email, active: true }]);

        if (error && error.code !== '23505') {
            throw error;
        }

        // Send welcome email
        const unsubUrl = `https://allaitoollist.com/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
        await sendEmail({
            to: email,
            subject: '🤖 Welcome to All AI Tool List Newsletter!',
            html: `
<!DOCTYPE html><html><body style="font-family:sans-serif;background:#f5f5f5;padding:20px;">
<div style="background:#fff;border-radius:16px;padding:40px;max-width:520px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:24px;">
    <div style="background:linear-gradient(135deg,#1d4ed8,#4f46e5);border-radius:14px;display:inline-block;padding:16px 24px;">
      <span style="color:#fff;font-size:24px;font-weight:900;">🤖 All AI Tool List</span>
    </div>
  </div>
  <h2 style="color:#111;font-size:24px;margin-bottom:8px;">You're subscribed! 🎉</h2>
  <p style="color:#6b7280;font-size:15px;line-height:1.6;">
    Welcome! Every Monday morning you'll get our curated list of the top 5 new AI tools — reviewed and rated by our team.
  </p>
  <div style="background:#eff6ff;border-radius:12px;padding:20px;margin:24px 0;">
    <p style="color:#1d4ed8;font-weight:700;margin:0 0 8px;">What to expect:</p>
    <ul style="color:#374151;font-size:14px;margin:0;padding-left:20px;">
      <li>5 new AI tools every Monday</li>
      <li>Exclusive deals for subscribers</li>
      <li>No spam, ever — unsubscribe anytime</li>
    </ul>
  </div>
  <a href="https://allaitoollist.com" style="display:block;text-align:center;background:#2563eb;color:#fff;font-weight:700;padding:14px;border-radius:10px;text-decoration:none;font-size:16px;">
    Browse AI Tools Now →
  </a>
  <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:24px;">
    <a href="${unsubUrl}" style="color:#9ca3af;">Unsubscribe</a>
  </p>
</div></body></html>`,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
