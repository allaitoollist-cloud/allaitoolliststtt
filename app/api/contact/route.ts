import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { error: 'Missing Supabase credentials' },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Save to database
        const { error: dbError } = await supabase
            .from('contact_messages')
            .insert([
                {
                    name,
                    email,
                    subject,
                    message,
                },
            ]);

        if (dbError) {
            console.error('Error saving contact message:', dbError);
            // Continue even if DB save fails, we still want to send emails
        }

        // Send email to admin (you can update this email)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@aitoollist.com';
        const adminEmailTemplate = emailTemplates.contactFormReceived(name, email, subject, message);
        
        await sendEmail({
            to: adminEmail,
            subject: adminEmailTemplate.subject,
            html: adminEmailTemplate.html,
        });

        // Send confirmation email to user
        const userEmailTemplate = emailTemplates.contactFormConfirmation(name);
        
        await sendEmail({
            to: email,
            subject: userEmailTemplate.subject,
            html: userEmailTemplate.html,
        });

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

