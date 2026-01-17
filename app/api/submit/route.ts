import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendSubmissionConfirmation, sendAdminNewSubmissionEmail } from '@/lib/email';

/* -------------------------------------------------------------------------- */
/*                        SECURE SUBMISSION ENDPOINT                          */
/* -------------------------------------------------------------------------- */
/**
 * Handles new tool submissions with Multi-Layer Spam Protection.
 * Layer 1: Honeypot & Timer (Frontend->Backend check)
 * Layer 2: Rate Limiting & Duplication Check
 * Layer 3: Content Heuristics (Spam patterns)
 */

const getAdminSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url) {
        console.error("FATAL: NEXT_PUBLIC_SUPABASE_URL is not defined.");
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
    }
    if (!key) {
        console.error("FATAL: SUPABASE_SERVICE_ROLE_KEY is not defined.");
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }
    return createClient(url, key);
};

// Heuristics
const MAX_SUBMISSIONS_PER_HOUR = 5;
const MIN_SUBMISSION_TIME_MS = 3000; // 3 seconds
const SPAM_DOMAINS = ['test.com', 'example.com', 'spam.com'];

export async function POST(req: NextRequest) {
    try {
        // Init Supabase safely inside handler
        let supabase;
        try {
            supabase = getAdminSupabase();
        } catch (e: any) {
            console.error('SERVER SETUP ERROR: Supabase Init Failed.', e.message);
            // Return 503 Service Unavailable if config is missing
            return NextResponse.json({ error: 'Server Configuration Error. Please contact admin.' }, { status: 503 });
        }

        const body = await req.json();
        const {
            tool_name,
            tool_url,
            description,
            full_description,
            category,
            pricing,
            submitter_name,
            submitter_email,
            // Security Fields
            website_honey,
            submission_start_time
        } = body;

        /* -------------------------------------------------------------------------- */
        /*                           LAYER 1: BOT TRAPS                               */
        /* -------------------------------------------------------------------------- */
        // 1. Honeypot Check
        if (website_honey) {
            console.warn(`[SPAM BLOCKED] Honeypot filled by ${submitter_email}`);
            return NextResponse.json({ success: true, message: 'Submission received' });
        }

        // 2. Time-on-Form Check
        const now = Date.now();
        const startTime = parseInt(submission_start_time || '0');
        // If startTime is missing or suspiciously close to 'now'
        if (!submission_start_time || (now - startTime < MIN_SUBMISSION_TIME_MS)) {
            console.warn(`[SPAM BLOCKED] Too fast submission (${now - startTime}ms) by ${submitter_email}`);
            return NextResponse.json({ error: 'Submission too fast. Are you human?' }, { status: 429 });
        }

        /* -------------------------------------------------------------------------- */
        /*                         LAYER 2: VALIDATION                                */
        /* -------------------------------------------------------------------------- */

        // 3. Email/Domain Validation
        if (!submitter_email || !submitter_email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }
        const domain = submitter_email.split('@')[1];
        if (SPAM_DOMAINS.includes(domain)) {
            return NextResponse.json({ error: 'Email domain not allowed' }, { status: 400 });
        }

        // 4. Rate Limiting (By Email)
        const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count: recentCount, error: rateError } = await supabase
            .from('tool_submissions')
            .select('id', { count: 'exact', head: true })
            .eq('submitter_email', submitter_email)
            .gte('created_at', ONE_HOUR_AGO);

        if (rateError) {
            console.error('Rate limit check failed', rateError);
            return NextResponse.json({ error: 'System busy. Try again later.' }, { status: 500 });
        }

        if ((recentCount || 0) >= MAX_SUBMISSIONS_PER_HOUR) {
            console.warn(`[RATE LIMIT] ${submitter_email} hit max submissions.`);
            return NextResponse.json({ error: 'Too many submissions. Please wait an hour.' }, { status: 429 });
        }

        // 5. Duplicate URL Check (Normalize URL for comparison)
        // Normalize URL: remove trailing slash, convert to lowercase, handle http/https
        const normalizeUrl = (url: string): string => {
            try {
                const urlObj = new URL(url);
                urlObj.protocol = urlObj.protocol.toLowerCase();
                urlObj.hostname = urlObj.hostname.toLowerCase();
                let path = urlObj.pathname.toLowerCase();
                // Remove trailing slash except for root
                if (path.length > 1 && path.endsWith('/')) {
                    path = path.slice(0, -1);
                }
                urlObj.pathname = path;
                urlObj.search = ''; // Ignore query params
                urlObj.hash = ''; // Ignore hash
                return urlObj.toString();
            } catch {
                // Fallback for invalid URLs
                return url.toLowerCase().replace(/\/$/, '');
            }
        };

        const normalizedUrl = normalizeUrl(tool_url);

        // Check if tool already exists in published tools
        // Fetch tools with similar URLs and normalize them for comparison
        const { data: allTools } = await supabase
            .from('tools')
            .select('id, url');
        
        if (allTools) {
            const matchingTool = allTools.find(tool => {
                if (!tool.url) return false;
                const normalizedExisting = normalizeUrl(tool.url);
                return normalizedExisting === normalizedUrl;
            });
            
            if (matchingTool) {
                return NextResponse.json({ error: 'This tool is already listed on our directory.' }, { status: 409 });
            }
        }

        // Only check for pending/flagged submissions (not rejected or approved)
        // This allows users to resubmit if their previous submission was rejected
        const { data: allSubmissions } = await supabase
            .from('tool_submissions')
            .select('id, status, tool_url')
            .in('status', ['pending', 'flagged']);
        
        if (allSubmissions) {
            const matchingSub = allSubmissions.find(sub => {
                if (!sub.tool_url) return false;
                const normalizedExisting = normalizeUrl(sub.tool_url);
                return normalizedExisting === normalizedUrl;
            });
            
            if (matchingSub) {
                return NextResponse.json({ 
                    error: 'This tool is already pending review. Please wait for our team to review your previous submission.' 
                }, { status: 409 });
            }
        }

        /* -------------------------------------------------------------------------- */
        /*                          LAYER 3: CONTENT ANALYSIS                         */
        /* -------------------------------------------------------------------------- */

        let status = 'pending';
        let flagReason = null;

        const linkCount = (full_description?.match(/http/g) || []).length;
        if (linkCount > 3) {
            status = 'flagged';
            flagReason = 'Excessive links in description';
        }
        if (description.length < 10) {
            return NextResponse.json({ error: 'Description too short.' }, { status: 400 });
        }

        /* -------------------------------------------------------------------------- */
        /*                              EXECUTION                                     */
        /* -------------------------------------------------------------------------- */

        const { data: submission, error: insertError } = await supabase
            .from('tool_submissions')
            .insert({
                tool_name,
                tool_url,
                description,
                category,
                pricing,
                submitter_name,
                submitter_email,
                status: status
                // confirmation_email_sent removed (missing in DB)
            })
            .select()
            .single();

        if (insertError) {
            console.error('Database insertion error:', insertError);
            return NextResponse.json({
                error: 'Failed to save submission',
                details: insertError.message || insertError,
                code: insertError.code
            }, { status: 500 });
        }

        // Send Emails (Only if NOT flagged) e.g.
        if (status !== 'flagged') {
            try {
                if (submitter_email) {
                    console.log(`[EMAIL] Attempting to send confirmation to ${submitter_email} for tool: ${tool_name}`);
                    const confirmationResult = await sendSubmissionConfirmation(submitter_email, tool_name);
                    if (confirmationResult.success) {
                        console.log(`[EMAIL] ✅ Confirmation email sent successfully to ${submitter_email}`);
                    } else {
                        console.error(`[EMAIL] ❌ Failed to send confirmation email:`, confirmationResult.error);
                    }
                } else {
                    console.warn(`[EMAIL] ⚠️ No submitter_email provided, skipping confirmation email`);
                }

                // Send admin notification
                console.log(`[EMAIL] Attempting to send admin notification for tool: ${tool_name}`);
                const adminResult = await sendAdminNewSubmissionEmail(tool_name, submitter_email || 'No email');
                if (adminResult.success) {
                    console.log(`[EMAIL] ✅ Admin notification sent successfully`);
                } else {
                    console.error(`[EMAIL] ❌ Failed to send admin notification:`, adminResult.error);
                }
            } catch (emailErr) {
                console.error('[EMAIL] ❌ Email trigger failed:', emailErr);
                // Do not block response
            }
        } else {
            console.warn(`[FLAGGED] Submission ${submission.id} flagged: ${flagReason} - Skipping emails`);
        }

        return NextResponse.json({ success: true, message: 'Submission received' });

    } catch (err: any) {
        console.error('Submission API Fatal Error:', err);
        return NextResponse.json({ error: 'Internal Server Error: ' + (err.message || 'Unknown') }, { status: 500 });
    }
}
