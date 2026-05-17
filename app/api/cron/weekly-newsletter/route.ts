import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function buildNewsletterHTML(tools: any[], date: string): string {
    const toolCards = tools.slice(0, 5).map(t => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="44">
              <div style="width:40px;height:40px;background:#eff6ff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;">🤖</div>
            </td>
            <td style="padding-left:12px;">
              <a href="https://allaitoollist.com/tool/${t.slug}" style="color:#1d4ed8;font-weight:700;text-decoration:none;font-size:15px;">${t.name}</a>
              <div style="color:#6b7280;font-size:13px;margin-top:2px;">${t.category} · ${t.pricing}</div>
              <div style="color:#374151;font-size:13px;margin-top:4px;">${(t.short_description || '').slice(0, 100)}...</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join('');

    return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;max-width:600px;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1d4ed8,#4f46e5);padding:32px 40px;text-align:center;">
          <div style="color:#fff;font-size:22px;font-weight:900;">🤖 All AI Tool List</div>
          <div style="color:#bfdbfe;font-size:13px;margin-top:4px;">Weekly AI Tools Digest · ${date}</div>
        </td></tr>

        <!-- Intro -->
        <tr><td style="padding:32px 40px 16px;">
          <h1 style="font-size:22px;font-weight:900;color:#111;margin:0 0 8px;">This Week in AI Tools 🔥</h1>
          <p style="color:#6b7280;font-size:14px;margin:0;">Here are the top new AI tools added this week — reviewed by our team.</p>
        </td></tr>

        <!-- Tools -->
        <tr><td style="padding:0 40px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${toolCards}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:0 40px 32px;text-align:center;">
          <a href="https://allaitoollist.com" style="display:inline-block;background:#1d4ed8;color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:10px;text-decoration:none;">
            Browse All ${tools.length}+ New Tools →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            You're receiving this because you subscribed at allaitoollist.com<br>
            <a href="https://allaitoollist.com/newsletter" style="color:#6b7280;">Unsubscribe</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get top new tools from last 7 days
        const since = new Date();
        since.setDate(since.getDate() - 7);

        const { data: tools } = await supabase
            .from('tools')
            .select('id, name, slug, category, pricing, short_description')
            .eq('status', 'published')
            .gte('created_at', since.toISOString())
            .order('created_at', { ascending: false })
            .limit(5);

        if (!tools || tools.length === 0) {
            return NextResponse.json({ message: 'No new tools this week, skipping newsletter' });
        }

        // Get all subscribers
        const { data: subscribers } = await supabase
            .from('newsletter_subscribers')
            .select('email')
            .eq('active', true);

        if (!subscribers || subscribers.length === 0) {
            return NextResponse.json({ message: 'No active subscribers' });
        }

        const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const html = buildNewsletterHTML(tools, date);
        const subject = `🤖 This Week's Top AI Tools — ${date}`;

        // Send in batches of 50 to avoid rate limits
        let sent = 0;
        const BATCH = 50;
        for (let i = 0; i < subscribers.length; i += BATCH) {
            const batch = subscribers.slice(i, i + BATCH);
            await Promise.allSettled(
                batch.map(sub => sendEmail({ to: sub.email, subject, html }))
            );
            sent += batch.length;
        }

        return NextResponse.json({ success: true, sent, tools_count: tools.length });
    } catch (err) {
        console.error('Weekly newsletter cron error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
