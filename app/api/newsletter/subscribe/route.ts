import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, emailTemplates } from '@/lib/email';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email = (body.email ?? '').trim().toLowerCase();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
        }

        // Save subscriber
        const { error: dbError } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email, active: true }]);

        if (dbError) {
            if (dbError.code === '23505') {
                // Already subscribed — reactivate in case they were inactive
                await supabase
                    .from('newsletter_subscribers')
                    .update({ active: true })
                    .eq('email', email);
                return NextResponse.json({ message: 'Already subscribed' }, { status: 409 });
            }
            console.error('[Newsletter] DB insert error:', dbError);
            return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
        }

        // Send welcome email
        const template = emailTemplates.newsletterWelcome(email);
        const emailResult = await sendEmail({
            to: email,
            subject: template.subject,
            html: template.html,
        });

        if (!emailResult.success) {
            console.error('[Newsletter] Welcome email failed for', email, ':', emailResult.error);
            // Subscriber is saved — don't block the success response
        } else {
            console.log('[Newsletter] Welcome email sent to', email);
        }

        return NextResponse.json({ success: true, emailSent: emailResult.success });

    } catch (err: any) {
        console.error('[Newsletter] Subscribe error:', err?.message || err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
