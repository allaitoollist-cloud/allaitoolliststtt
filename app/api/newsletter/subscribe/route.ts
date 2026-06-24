import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, emailTemplates } from '@/lib/email';

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

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ message: 'Already subscribed' }, { status: 409 });
            }
            throw error;
        }

        const template = emailTemplates.newsletterWelcome(email);
        await sendEmail({ to: email, subject: template.subject, html: template.html });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Newsletter subscribe error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
