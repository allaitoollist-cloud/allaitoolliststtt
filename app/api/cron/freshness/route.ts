import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendFreshnessReminder } from '@/lib/email';
import { DatabaseTool } from '@/types';

/**
 * CRON JOB ENDPOINT
 * This should be called purely by a scheduled task (e.g. Vercel Cron, GitHub Actions, or Supabase Edge Function).
 * Secure it with a secret in headers.
 */

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FRESHNESS_THRESHOLD_DAYS = 60;
const BATCH_SIZE = 20; // Process in small batches to avoid timeouts

export async function GET(req: NextRequest) {
    // 1. Security Check (Basic Bearer Token)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Find Stale Tools
        // Conditions: 
        // - Published
        // - Last Updated > 60 days ago
        // - Has submitter email
        // - Has NOT received a reminder in the last 60 days (to avoid spamming)

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - FRESHNESS_THRESHOLD_DAYS);
        const cutoffIso = cutoffDate.toISOString();

        const { data: staleTools, error } = await supabase
            .from('tools')
            .select('id, name, slug, submitter_email, last_updated, last_freshness_email_at')
            .eq('status', 'published')
            .not('submitter_email', 'is', null)
            .lt('last_updated', cutoffIso)
            .or(`last_freshness_email_at.is.null,last_freshness_email_at.lt.${cutoffIso}`) // Complex logic: either null OR older than cutoff
            .limit(BATCH_SIZE);

        if (error) throw error;
        if (!staleTools || staleTools.length === 0) {
            return NextResponse.json({ message: 'No stale tools found' });
        }

        // 3. Send Emails
        let sentCount = 0;
        for (const tool of staleTools) {
            // Double check safe casting
            const t = tool as unknown as DatabaseTool & { submitter_email: string };

            if (t.submitter_email) {
                await sendFreshnessReminder(t.name, t.submitter_email);

                // 4. Update Tracking
                await supabase
                    .from('tools')
                    .update({ last_freshness_email_at: new Date().toISOString() })
                    .eq('id', t.id);

                sentCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${sentCount} reminders`,
            processed_ids: staleTools.map(t => t.id)
        });

    } catch (err) {
        console.error('Freshness Cron Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
