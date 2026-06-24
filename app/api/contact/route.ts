import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

/* -------------------------------------------------------------------------- */
/*  Rate limiting: 3 messages per hour per IP                                  */
/* -------------------------------------------------------------------------- */
const contactRateStore = new Map<string, { count: number; resetAt: number }>();

function contactRateLimit(ip: string): boolean {
    const now = Date.now();
    const WINDOW = 60 * 60 * 1000; // 1 hour
    const MAX = 3;

    const entry = contactRateStore.get(ip);
    if (!entry || now > entry.resetAt) {
        contactRateStore.set(ip, { count: 1, resetAt: now + WINDOW });
        return true;
    }
    entry.count++;
    return entry.count <= MAX;
}

// Cleanup every hour
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        contactRateStore.forEach((v, k) => { if (now > v.resetAt) contactRateStore.delete(k); });
    }, 60 * 60 * 1000);
}

/* -------------------------------------------------------------------------- */
/*  HTML escaping — prevent XSS in email templates                             */
/* -------------------------------------------------------------------------- */
function esc(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/* -------------------------------------------------------------------------- */
/*  Validation                                                                  */
/* -------------------------------------------------------------------------- */
const MAX_LENGTHS = { name: 100, email: 200, subject: 200, message: 3000 };
const MIN_SUBMISSION_MS = 3000;

export async function POST(request: NextRequest) {
    try {
        /* ── Rate limit by IP ─────────────────────────────────────────────── */
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            ?? request.headers.get('x-real-ip')
            ?? 'unknown';

        if (!contactRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Too many messages. Please wait an hour before trying again.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { name, email, subject, message, website_honey, submission_start_time } = body;

        /* ── Bot traps ────────────────────────────────────────────────────── */
        if (website_honey) {
            // Honeypot filled — silently accept so bots don't know they're blocked
            return NextResponse.json({ success: true, message: 'Message sent successfully' });
        }

        const elapsed = Date.now() - parseInt(submission_start_time || '0');
        if (!submission_start_time || elapsed < MIN_SUBMISSION_MS) {
            return NextResponse.json(
                { error: 'Submission too fast. Please try again.' },
                { status: 429 }
            );
        }

        /* ── Required fields ──────────────────────────────────────────────── */
        if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        /* ── Email format ─────────────────────────────────────────────────── */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        /* ── Max lengths ──────────────────────────────────────────────────── */
        if (name.length > MAX_LENGTHS.name)
            return NextResponse.json({ error: `Name must be under ${MAX_LENGTHS.name} characters` }, { status: 400 });
        if (email.length > MAX_LENGTHS.email)
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        if (subject.length > MAX_LENGTHS.subject)
            return NextResponse.json({ error: `Subject must be under ${MAX_LENGTHS.subject} characters` }, { status: 400 });
        if (message.length > MAX_LENGTHS.message)
            return NextResponse.json({ error: `Message must be under ${MAX_LENGTHS.message} characters` }, { status: 400 });

        /* ── Save to DB ───────────────────────────────────────────────────── */
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error: dbError } = await supabase
            .from('contact_messages')
            .insert({ name: name.trim(), email: email.trim().toLowerCase(), subject: subject.trim(), message: message.trim() });

        if (dbError) {
            console.error('Contact DB insert failed:', dbError);
            return NextResponse.json({ error: 'Failed to save message. Please try again.' }, { status: 500 });
        }

        /* ── Send emails in parallel (escaped to prevent XSS) ────────────── */
        const safeName    = esc(name.trim());
        const safeEmail   = esc(email.trim());
        const safeSubject = esc(subject.trim());
        const safeMessage = esc(message.trim());

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@allaitoollist.com';

        const [adminResult, userResult] = await Promise.allSettled([
            sendEmail({
                to: adminEmail,
                subject: `New Contact: ${safeSubject}`,
                html: emailTemplates.contactFormReceived(safeName, safeEmail, safeSubject, safeMessage).html,
                replyTo: email.trim(),
            }),
            sendEmail({
                to: email.trim(),
                subject: emailTemplates.contactFormConfirmation(safeName).subject,
                html: emailTemplates.contactFormConfirmation(safeName).html,
            }),
        ]);

        if (adminResult.status === 'rejected') {
            console.error('Admin contact email failed:', adminResult.reason);
        }
        if (userResult.status === 'rejected') {
            console.error('User confirmation email failed:', userResult.reason);
        }

        return NextResponse.json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
    }
}
